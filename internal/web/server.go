// Package web serves the dashboard page, the JSON API and the static files.
package web

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"html/template"
	"io/fs"
	"log"
	"mime"
	"net/http"
	"path"
	"time"

	"github.com/evanw/esbuild/pkg/api"

	"github.com/moebiusmania/atmmi-info-ui/internal/data"
)

var milan = func() *time.Location {
	loc, err := time.LoadLocation("Europe/Rome")
	if err != nil {
		panic(err)
	}
	return loc
}()

func init() {
	if err := mime.AddExtensionType(".webmanifest", "application/manifest+json; charset=utf-8"); err != nil {
		panic(err)
	}
}

type Options struct {
	// Templates holds index.html, Assets holds styles.css; Static is served at the site root.
	Templates, Assets, Static fs.FS
	// Dev reloads templates and styles on every request and skips the service worker, whose cache
	// would otherwise serve stale pages while editing.
	Dev bool
}

type build struct {
	tmpl *template.Template
	css  stylesheet
	logo string
}

type stylesheet struct {
	path string
	body []byte
}

type server struct {
	opts  Options
	build *build
}

// New returns the handler for the whole app.
func New(opts Options) (http.Handler, error) {
	s := &server{opts: opts}
	b, err := s.load()
	if err != nil {
		return nil, err
	}
	if !opts.Dev {
		s.build = b
	}

	mux := http.NewServeMux()
	mux.HandleFunc("GET /{$}", s.index)
	mux.HandleFunc("GET /assets/{file}", s.asset)
	mux.Handle("GET /api/air", jsonHandler(data.GetAirQuality))
	mux.Handle("GET /api/news", jsonHandler(data.GetAtmNews))
	mux.Handle("GET /api/status", jsonHandler(data.GetV2Statuses))
	mux.Handle("GET /api/surface", jsonHandler(data.GetSurfaceAlerts))
	mux.Handle("GET /api/traffic", jsonHandler(data.GetTrafficNews))
	mux.Handle("GET /api/weather", jsonHandler(data.GetWeather))
	mux.Handle("GET /api/v1/status", jsonHandler(data.GetV1Statuses))
	mux.HandleFunc("GET /api/service", service)
	mux.HandleFunc("GET /", s.static)
	return mux, nil
}

// load parses the templates and builds the stylesheet.
func (s *server) load() (*build, error) {
	if s.build != nil {
		return s.build, nil
	}
	tmpl, err := parseTemplates(s.opts.Templates)
	if err != nil {
		return nil, err
	}
	css, err := buildCSS(s.opts.Assets)
	if err != nil {
		return nil, err
	}
	logo, err := fs.ReadFile(s.opts.Static, "logo.svg")
	if err != nil {
		return nil, err
	}
	return &build{tmpl: tmpl, css: css, logo: "/logo.svg?v=" + hash(logo)[:16]}, nil
}

// buildCSS minifies styles.css and lowers modern syntax (e.g. nesting) for the same browser
// targets as Vite's default build ("baseline-widely-available").
func buildCSS(fsys fs.FS) (stylesheet, error) {
	src, err := fs.ReadFile(fsys, "styles.css")
	if err != nil {
		return stylesheet{}, err
	}
	result := api.Transform(string(src), api.TransformOptions{
		Loader:            api.LoaderCSS,
		MinifyWhitespace:  true,
		MinifySyntax:      true,
		MinifyIdentifiers: true,
		Engines: []api.Engine{
			{Name: api.EngineChrome, Version: "107"},
			{Name: api.EngineEdge, Version: "107"},
			{Name: api.EngineFirefox, Version: "104"},
			{Name: api.EngineSafari, Version: "16"},
		},
	})
	if len(result.Errors) > 0 {
		msg := result.Errors[0]
		return stylesheet{}, fmt.Errorf("styles.css:%d: %s", msg.Location.Line, msg.Text)
	}
	return stylesheet{path: "/assets/styles-" + hash(result.Code)[:8] + ".css", body: result.Code}, nil
}

func hash(b []byte) string {
	sum := sha256.Sum256(b)
	return hex.EncodeToString(sum[:])
}

func (s *server) index(w http.ResponseWriter, r *http.Request) {
	b, err := s.load()
	if err != nil {
		internalError(w, err)
		return
	}
	p := newPageData(data.LoadDashboardData(r.Context()), time.Now())
	p.Stylesheet = b.css.path
	p.LogoSrc = b.logo
	p.RegisterSW = !s.opts.Dev

	var buf bytes.Buffer
	if err := b.tmpl.Execute(&buf, p); err != nil {
		internalError(w, err)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Write(buf.Bytes())
}

func (s *server) asset(w http.ResponseWriter, r *http.Request) {
	b, err := s.load()
	if err != nil {
		internalError(w, err)
		return
	}
	if r.URL.Path != b.css.path {
		notFound(w)
		return
	}
	serveContent(w, r, "styles.css", b.css.body, "public, max-age=31536000, immutable")
}

// static serves the files in Options.Static. Versioned URLs (?v=...) are cached forever.
func (s *server) static(w http.ResponseWriter, r *http.Request) {
	name := path.Clean(r.URL.Path)[1:]
	body, err := fs.ReadFile(s.opts.Static, name)
	if err != nil || name == "" {
		notFound(w)
		return
	}
	cache := "no-cache, no-store, max-age=0, must-revalidate"
	if r.URL.Query().Has("v") {
		cache = "public, max-age=31536000, immutable"
	}
	serveContent(w, r, name, body, cache)
}

func serveContent(w http.ResponseWriter, r *http.Request, name string, body []byte, cache string) {
	w.Header().Set("Cache-Control", cache)
	w.Header().Set("ETag", `W/"`+hash(body)+`"`)
	w.Header().Set("Vary", "If-None-Match")
	http.ServeContent(w, r, name, time.Time{}, bytes.NewReader(body))
}

func notFound(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "text/plain;charset=UTF-8")
	w.WriteHeader(http.StatusNotFound)
	w.Write([]byte("Not Found"))
}

func internalError(w http.ResponseWriter, err error) {
	log.Printf("Error: %v", err)
	w.Header().Set("Content-Type", "text/plain;charset=UTF-8")
	w.WriteHeader(http.StatusInternalServerError)
	w.Write([]byte("Internal server error"))
}

func writeJSON(w http.ResponseWriter, v any) {
	var buf bytes.Buffer
	enc := json.NewEncoder(&buf)
	enc.SetEscapeHTML(false)
	if err := enc.Encode(v); err != nil {
		internalError(w, err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(bytes.TrimSuffix(buf.Bytes(), []byte("\n")))
}

// jsonHandler serves the result of a data getter as JSON.
func jsonHandler[T any](get func(context.Context) (T, error)) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		v, err := get(r.Context())
		if err != nil {
			if !errors.Is(err, context.Canceled) {
				internalError(w, err)
			}
			return
		}
		writeJSON(w, v)
	})
}

func service(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, struct {
		Status string   `json:"status"`
		Now    string   `json:"now"`
		Routes []string `json:"routes"`
	}{
		Status: "Up & running",
		Now:    time.Now().UTC().Format("2006-01-02T15:04:05.000Z"),
		Routes: []string{"/traffic", "/v1/status", "/news", "/surface"},
	})
}
