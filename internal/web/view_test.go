package web

import (
	"bytes"
	"errors"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/moebiusmania/atmmi-info-ui/internal/data"
)

func TestLineTone(t *testing.T) {
	tests := map[string]string{
		" Regolare ":               "ok",
		"Tratta sospesa tra A e B": "alert",
		"Circolazione rallentata":  "alert",
		"Chiusa":                   "warn",
	}
	for in, want := range tests {
		if got := lineTone(in); got != want {
			t.Errorf("lineTone(%q) = %q, want %q", in, got, want)
		}
	}
}

func TestSplitAlert(t *testing.T) {
	tests := []struct {
		in   string
		want alert
	}{
		{"🚧 Cantieri: queste linee sono deviate.", alert{"🚧", "Cantieri: queste linee sono deviate.", ""}},
		{"🅿️ Parcheggio chiuso. Usate gli altri.", alert{"🅿️", "Parcheggio chiuso.", "Usate gli altri."}},
		{"Senza icona. Testo", alert{"ℹ️", "Senza icona.", "Testo"}},
		{strings.Repeat("a", 90) + ". b", alert{"ℹ️", strings.Repeat("a", 90) + ". b", ""}},
	}
	for _, tt := range tests {
		if got := splitAlert(tt.in); got != tt.want {
			t.Errorf("splitAlert(%q) = %+v, want %+v", tt.in, got, tt.want)
		}
	}
}

func TestSplitDate(t *testing.T) {
	text, date := splitDate("Bus 44: deviazione - 06/10")
	if text != "Bus 44: deviazione" || date != "06/10" {
		t.Errorf("splitDate() = %q, %q", text, date)
	}
	text, date = splitDate("Senza data")
	if text != "Senza data" || date != "" {
		t.Errorf("splitDate() = %q, %q", text, date)
	}
}

func TestJSXWhitespace(t *testing.T) {
	src := "<p>\n\t<span>a</span> b\n\tc\n\t{{.X}}\n</p>\n"
	if got, want := jsxWhitespace(src), "<p><span>a</span> b c{{.X}}</p>"; got != want {
		t.Errorf("jsxWhitespace() = %q, want %q", got, want)
	}
}

func render(t *testing.T, d data.DashboardData) string {
	t.Helper()
	tmpl, err := parseTemplates(os.DirFS("../../templates"))
	if err != nil {
		t.Fatal(err)
	}
	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, newPageData(d, time.Date(2026, 10, 11, 0, 52, 0, 0, time.UTC))); err != nil {
		t.Fatal(err)
	}
	return buf.String()
}

func TestRenderErrors(t *testing.T) {
	err := errors.New("boom")
	html := render(t, data.DashboardData{
		StatusV1: data.Result[[]data.ScrapedLineStatus]{Err: err},
		Surface:  data.Result[[]string]{Err: err},
		Traffic:  data.Result[[]data.News]{Err: err},
		News:     data.Result[[]data.News]{Err: err},
		Weather:  data.Result[data.Weather]{Err: err},
		Air:      data.Result[[]data.PollutantReading]{Err: err},
	})
	for _, want := range []string{
		"domenica 11 ottobre", "Aggiornato alle 02:52",
		"Impossibile caricare lo status.", "Impossibile caricare gli avvisi.",
		"Impossibile caricare il meteo.", "Impossibile caricare i dati.",
		"Impossibile caricare i cambiamenti.", "Impossibile caricare le news.",
	} {
		if !strings.Contains(html, want) {
			t.Errorf("page does not contain %q", want)
		}
	}
}

func TestRenderData(t *testing.T) {
	html := render(t, data.DashboardData{
		StatusV1: data.Result[[]data.ScrapedLineStatus]{Value: []data.ScrapedLineStatus{
			{Line: "M1", Text: "Regolare", Status: "Regolare"},
			{Line: "M2", Text: "Rallentata", Status: "Rallentata"},
		}},
		Surface: data.Result[[]string]{Value: []string{"🚧 Cantieri: deviate. Altro testo"}},
		Traffic: data.Result[[]data.News]{Value: []data.News{{URL: "https://a", Text: "Bus 44 - 06/10"}}},
		News:    data.Result[[]data.News]{Value: []data.News{}},
		Weather: data.Result[data.Weather]{Value: data.Weather{Time: "2026-10-11T00:45", Temperature: -0.4,
			Condition: data.WeatherCondition{Label: "Sereno", Icon: "🌙"}}},
		Air: data.Result[[]data.PollutantReading]{Value: []data.PollutantReading{
			{Pollutant: data.NO2, Value: 42, Time: "2026-10-10T22:00:00.000", Period: "hourly", Level: "moderate", Stations: 5},
		}},
	})
	for _, want := range []string{
		`<span class="tile__value">1</span><span class="tile__label">Linea con disservizi</span>`,
		`style="--j: 0; --line: var(--color-line-m1, var(--color-primary))"`,
		`<strong>Cantieri: deviate.</strong> Altro testo`,
		`<span class="link-list__text">Bus 44</span><span class="chip">06/10</span>`,
		`<p class="text-muted">Nessuna news.</p>`,
		`<p class="weather__temp">0°</p>`,
		`<span class="card__badge">Moderata</span>`,
		`class="aqi-meter__seg is-on is-current" style="--seg: var(--color-aqi-moderate); --k: 2"`,
		`NO₂/O₃: media oraria delle 22:00. Media delle stazioni`,
		`<span>2026</span> - Sviluppato da <a`,
	} {
		if !strings.Contains(html, want) {
			t.Errorf("page does not contain %q", want)
		}
	}
}
