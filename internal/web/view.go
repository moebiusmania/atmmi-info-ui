package web

import (
	"fmt"
	"log"
	"regexp"
	"slices"
	"strconv"
	"strings"
	"time"
	"unicode"
	"unicode/utf8"

	"github.com/moebiusmania/atmmi-info-ui/internal/data"
	"github.com/moebiusmania/atmmi-info-ui/internal/jsutil"
)

// card is the frame shared by every dashboard section.
type card struct {
	Title string
	Icon  string
	// Anchor id, also used for the grid area (`card--<id>`)
	ID string
	// Position in the page, drives the staggered load animation
	Index int
	// Badge is shown in the header when not empty; Live shows the pulsing "live" badge instead.
	Badge string
	Live  bool
}

type tile struct {
	Href, Icon, Value, Label string
	Tone                     string // ok | warn | alert | neutral
}

type metroRow struct {
	Line, Status, Tone string
}

type alert struct {
	Icon, Title, Rest string
}

type link struct {
	URL, Text, Date string
}

type linkList struct {
	Err                        bool
	EmptyMessage, ErrorMessage string
	Items                      []link
}

type airItem struct {
	Name, Level, LevelLabel string
	Value                   int
	Meter                   []meterSegment
}

type meterSegment struct {
	Level       data.AirQualityLevel
	On, Current bool
}

type pageData struct {
	Stylesheet string
	LogoSrc    string
	RegisterSW bool
	Year       int

	Date, Time string
	Tiles      []tile

	MetroCard card
	MetroErr  bool
	Metro     []metroRow

	SurfaceCard card
	SurfaceErr  bool
	Alerts      []alert

	WeatherCard card
	Weather     *data.Weather

	AirCard card
	AirErr  bool
	Air     []airItem
	AirNote string

	TrafficCard card
	Traffic     linkList

	NewsCard card
	News     linkList

	MapCard card
}

const alertStatuses = "tratta sospesa|rallentata"

func lineTone(status string) string {
	s := strings.ToLower(jsutil.Trim(status))
	if s == "regolare" {
		return "ok"
	}
	for _, alert := range strings.Split(alertStatuses, "|") {
		if strings.Contains(s, alert) {
			return "alert"
		}
	}
	return "warn"
}

// splitAlert splits an alert into icon, headline (first sentence, if short) and remaining text.
// Alerts start with an emoji describing their kind, e.g. "🚧 Cantieri: ...", "🅿️ Parcheggio ...".
func splitAlert(text string) alert {
	icon, body := "ℹ️", text
	if r, size := utf8.DecodeRuneInString(text); unicode.Is(extendedPictographic, r) {
		icon = text[:size]
		if strings.HasPrefix(text[size:], "️") {
			icon = text[:size+len("️")]
		}
		body = strings.TrimLeftFunc(text[len(icon):], jsutil.IsSpace)
	}
	end := strings.Index(body, ". ")
	if end > 0 && jsutil.UTF16Len(body[:end]) < 80 {
		return alert{Icon: icon, Title: body[:end+1], Rest: body[end+2:]}
	}
	return alert{Icon: icon, Title: body}
}

// Traffic items end with their publication date, e.g. "La 70 arriva in via ... - 09/09".
var dateSuffix = regexp.MustCompile(
	`[\s\x0B\x{A0}\x{1680}\x{2000}-\x{200A}\x{2028}\x{2029}\x{202F}\x{205F}\x{3000}\x{FEFF}]+-` +
		`[\s\x0B\x{A0}\x{1680}\x{2000}-\x{200A}\x{2028}\x{2029}\x{202F}\x{205F}\x{3000}\x{FEFF}]+` +
		`([0-9]{2}/[0-9]{2})$`)

func splitDate(text string) (string, string) {
	// Leftmost match, like String.prototype.match.
	if m := dateSuffix.FindStringSubmatchIndex(text); m != nil {
		return text[:m[0]], text[m[2]:m[3]]
	}
	return text, ""
}

func newLinkList(r data.Result[[]data.News], emptyMessage, errorMessage string) linkList {
	list := linkList{Err: r.Err != nil, EmptyMessage: emptyMessage, ErrorMessage: errorMessage}
	for _, item := range r.Value {
		text, date := splitDate(item.Text)
		list.Items = append(list.Items, link{URL: item.URL, Text: text, Date: date})
	}
	return list
}

var pollutantLabels = map[data.Pollutant]string{
	data.PM10: "PM10",
	data.PM25: "PM2.5",
	data.NO2:  "NO₂",
	data.O3:   "O₃",
}

var levelLabels = map[data.AirQualityLevel]string{
	"good":           "Buona",
	"fair":           "Discreta",
	"moderate":       "Moderata",
	"poor":           "Scarsa",
	"very-poor":      "Molto scarsa",
	"extremely-poor": "Estremamente scarsa",
}

var airTones = map[data.AirQualityLevel]string{
	"good":           "ok",
	"fair":           "ok",
	"moderate":       "warn",
	"poor":           "alert",
	"very-poor":      "alert",
	"extremely-poor": "alert",
}

// worstLevel returns the worst level among the readings, or "" when there are none.
func worstLevel(items []data.PollutantReading) data.AirQualityLevel {
	var worst data.AirQualityLevel
	for _, item := range items {
		if worst == "" ||
			slices.Index(data.AirQualityLevels, item.Level) > slices.Index(data.AirQualityLevels, worst) {
			worst = item.Level
		}
	}
	return worst
}

// slice is String.prototype.slice for ASCII strings.
func slice(s string, start, end int) string {
	start, end = min(start, len(s)), min(end, len(s))
	if start >= end {
		return ""
	}
	return s[start:end]
}

// day formats "2026-09-24T00:00:00.000" as "24/09".
func day(time string) string {
	return slice(time, 8, 10) + "/" + slice(time, 5, 7)
}

// hour formats "2026-09-25T16:00:00.000" as "16:00" (times are already local to Milan).
func hour(time string) string {
	return slice(time, 11, 16)
}

func periodNote(items []data.PollutantReading) string {
	var parts []string
	for _, item := range items {
		if item.Period == "daily" {
			parts = append(parts, "PM: media giornaliera del "+day(item.Time))
			break
		}
	}
	for _, item := range items {
		if item.Period == "hourly" {
			parts = append(parts, "NO₂/O₃: media oraria delle "+hour(item.Time))
			break
		}
	}
	return strings.Join(parts, " · ")
}

func meter(level data.AirQualityLevel) []meterSegment {
	current := slices.Index(data.AirQualityLevels, level)
	segments := make([]meterSegment, len(data.AirQualityLevels))
	for i, l := range data.AirQualityLevels {
		segments[i] = meterSegment{Level: l, On: i <= current, Current: i == current}
	}
	return segments
}

func degrees(value float64) string {
	return strconv.Itoa(jsutil.Round(value)) + "°"
}

var (
	weekdays = [...]string{"domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"}
	months   = [...]string{"gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio",
		"agosto", "settembre", "ottobre", "novembre", "dicembre"}
)

func metroTile(r data.Result[[]data.ScrapedLineStatus]) tile {
	t := tile{Href: "#metro", Icon: "🚇"}
	if r.Err != nil || len(r.Value) == 0 {
		t.Value, t.Label, t.Tone = "N/D", "Status metro", "neutral"
		return t
	}
	issues, alert := 0, false
	for _, line := range r.Value {
		switch lineTone(line.Status) {
		case "ok":
			continue
		case "alert":
			alert = true
		}
		issues++
	}
	switch {
	case issues == 0:
		n := len(r.Value)
		t.Value, t.Label, t.Tone = fmt.Sprintf("%d/%d", n, n), "Linee metro regolari", "ok"
	default:
		t.Value, t.Label, t.Tone = strconv.Itoa(issues), "Linee con disservizi", "warn"
		if issues == 1 {
			t.Label = "Linea con disservizi"
		}
		if alert {
			t.Tone = "alert"
		}
	}
	return t
}

func overviewTiles(d data.DashboardData) []tile {
	surface := tile{Href: "#surface", Icon: "🚌", Value: "N/D", Label: "Avvisi superficie", Tone: "neutral"}
	if d.Surface.Err == nil {
		surface.Value = strconv.Itoa(len(d.Surface.Value))
	}

	weather := tile{Href: "#weather", Icon: "🌡️", Value: "N/D", Label: "Meteo", Tone: "neutral"}
	if d.Weather.Err == nil {
		w := d.Weather.Value
		weather.Icon, weather.Value, weather.Label = w.Condition.Icon, degrees(w.Temperature), w.Condition.Label
	}

	air := tile{Href: "#air", Icon: "🍃", Value: "N/D", Label: "Qualità dell'aria", Tone: "neutral"}
	if level := worstLevel(d.Air.Value); level != "" {
		air.Value, air.Tone = levelLabels[level], airTones[level]
	}

	return []tile{metroTile(d.StatusV1), surface, weather, air}
}

func logError(section string, err error) {
	if err != nil {
		log.Printf("%s: %v", section, err)
	}
}

func newPageData(d data.DashboardData, now time.Time) pageData {
	logError("StatusV1", d.StatusV1.Err)
	logError("Surface", d.Surface.Err)
	logError("Weather", d.Weather.Err)
	logError("Air", d.Air.Err)
	logError("Traffic", d.Traffic.Err)
	logError("News", d.News.Err)

	rome := now.In(milan)
	p := pageData{
		Year:  now.Year(),
		Date:  fmt.Sprintf("%s %d %s", weekdays[rome.Weekday()], rome.Day(), months[rome.Month()-1]),
		Time:  rome.Format("15:04"),
		Tiles: overviewTiles(d),

		MetroCard: card{ID: "metro", Title: "Linee metropolitana", Icon: "🚇", Index: 0, Live: true},
		MetroErr:  d.StatusV1.Err != nil,

		SurfaceCard: card{ID: "surface", Title: "Linee di superficie", Icon: "🚌", Index: 1},
		SurfaceErr:  d.Surface.Err != nil,

		WeatherCard: card{ID: "weather", Title: "Meteo Milano", Icon: "🌤️", Index: 2},

		AirCard: card{ID: "air", Title: "Qualità dell'aria", Icon: "🍃", Index: 3},
		AirErr:  d.Air.Err != nil,
		AirNote: periodNote(d.Air.Value),

		TrafficCard: card{ID: "traffic", Title: "Cambiamenti", Icon: "🚧", Index: 4},
		Traffic: newLinkList(d.Traffic, "Nessun cambiamento in programma.",
			"Impossibile caricare i cambiamenti."),

		NewsCard: card{ID: "news", Title: "ATM informa", Icon: "📰", Index: 5},

		MapCard: card{ID: "map", Title: "Mappa metropolitana", Icon: "🗺️", Index: 6},
	}

	for _, item := range d.StatusV1.Value {
		p.Metro = append(p.Metro, metroRow{Line: item.Line, Status: item.Status, Tone: lineTone(item.Status)})
	}

	for _, item := range d.Surface.Value {
		p.Alerts = append(p.Alerts, splitAlert(item))
	}
	if n := len(p.Alerts); n > 0 {
		p.SurfaceCard.Badge = strconv.Itoa(n)
	}

	if d.Weather.Err == nil {
		p.Weather = &d.Weather.Value
		p.WeatherCard.Badge = hour(p.Weather.Time)
	}

	if level := worstLevel(d.Air.Value); level != "" {
		p.AirCard.Badge = levelLabels[level]
	}
	for _, item := range d.Air.Value {
		p.Air = append(p.Air, airItem{
			Name:       pollutantLabels[item.Pollutant],
			Value:      item.Value,
			Level:      string(item.Level),
			LevelLabel: levelLabels[item.Level],
			Meter:      meter(item.Level),
		})
	}

	if n := len(d.Traffic.Value); n > 0 {
		p.TrafficCard.Badge = strconv.Itoa(n)
	}

	news := d.News
	if len(news.Value) > 7 {
		news.Value = news.Value[:7]
	}
	p.News = newLinkList(news, "Nessuna news.", "Impossibile caricare le news.")

	return p
}
