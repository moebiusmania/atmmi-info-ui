package data

import (
	"reflect"
	"strings"
	"testing"

	"github.com/PuerkitoBio/goquery"
)

func parse(t *testing.T, html string) *goquery.Document {
	t.Helper()
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(html))
	if err != nil {
		t.Fatal(err)
	}
	return doc
}

func TestParseNews(t *testing.T) {
	html := `
    <div class="news-item">
      <a href="https://example.com">Example</a>
    </div>
    <div class="news-item">
      <a href="https://example.com"> Example </a>
    </div>
  `
	got, err := ParseNews(".news-item a", html)
	if err != nil {
		t.Fatal(err)
	}
	want := []News{
		{URL: "https://example.com", Text: "Example"},
		{URL: "https://example.com", Text: "Example"},
	}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("ParseNews() = %+v, want %+v", got, want)
	}
}

func TestGetLine(t *testing.T) {
	row := parse(t, `<div><img title="M1" /></div>`).Find("div")
	if got := GetLine(row, "img"); got != "M1" {
		t.Errorf("GetLine() = %q, want M1", got)
	}
}

func TestGetContent(t *testing.T) {
	row := parse(t, `<div><p class="StatusLinee_StatoScritta"> text </p></div>`).Find("div")
	if got := GetContent(row, ".StatusLinee_StatoScritta"); got != "text" {
		t.Errorf("GetContent() = %q, want text", got)
	}
}

func TestGetRows(t *testing.T) {
	doc := parse(t, `
    <table id="StatusLinee">
      <tr><td class="StatusLinee_StatoScritta">OK</td></tr>
      <tr><td class="StatusLinee_StatoScritta">KO</td></tr>
      <tr><td>   </td></tr>
      <tr><td class="StatusLinee_mex">message</td></tr>
      <tr id="header"><td>Linea</td></tr>
    </table>
  `)
	rows := GetRows(doc)
	if len(rows) != 2 {
		t.Fatalf("GetRows() returned %d rows, want 2", len(rows))
	}
	if got := strings.TrimSpace(rows[0].Text()); got != "OK" {
		t.Errorf("rows[0] = %q, want OK", got)
	}
	if got := strings.TrimSpace(rows[1].Text()); got != "KO" {
		t.Errorf("rows[1] = %q, want KO", got)
	}
}

func TestParseAlerts(t *testing.T) {
	got, err := ParseAlerts(`<p>🚧 Cantieri: queste linee sono deviate.</p><p>---</p><p> </p><p>Bus 44</p>`)
	if err != nil {
		t.Fatal(err)
	}
	want := []string{"🚧 Cantieri: queste linee sono deviate.", "Bus 44"}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("ParseAlerts() = %q, want %q", got, want)
	}
}
