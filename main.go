// Command atmmi-info-ui serves the unofficial ATM Milano dashboard.
package main

import (
	"embed"
	"flag"
	"io/fs"
	"log"
	"net/http"
	"os"
	"time"
	_ "time/tzdata" // the dashboard shows Europe/Rome times on any host

	"github.com/moebiusmania/atmmi-info-ui/internal/web"
)

//go:embed assets static templates
var files embed.FS

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	addr := flag.String("addr", ":"+port, "listen address (default from $PORT)")
	dev := flag.Bool("dev", false, "read templates and styles from disk on every request, skip the service worker")
	flag.Parse()

	var root fs.FS = files
	if *dev {
		root = os.DirFS(".")
	}
	sub := func(dir string) fs.FS {
		f, err := fs.Sub(root, dir)
		if err != nil {
			log.Fatal(err)
		}
		return f
	}

	handler, err := web.New(web.Options{
		Templates: sub("templates"),
		Assets:    sub("assets"),
		Static:    sub("static"),
		Dev:       *dev,
	})
	if err != nil {
		log.Fatal(err)
	}

	srv := &http.Server{Addr: *addr, Handler: handler, ReadHeaderTimeout: 10 * time.Second}
	log.Printf("Listening on %s", *addr)
	log.Fatal(srv.ListenAndServe())
}
