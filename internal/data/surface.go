package data

import (
	"context"
	"fmt"
	"math/rand/v2"
	"regexp"
	"strings"

	"github.com/PuerkitoBio/goquery"

	"github.com/moebiusmania/atmmi-info-ui/internal/jsutil"
)

type alertAPIResponse struct {
	AlertText string `json:"alert_text"`
}

// The alert HTML uses "---" paragraphs as visual separators.
var separator = regexp.MustCompile(`^-+$`)

// GetSurfaceAlerts fetches the surface lines alerts, one string per paragraph.
func GetSurfaceAlerts(ctx context.Context) ([]string, error) {
	var data alertAPIResponse
	url := fmt.Sprintf("https://alert.atm.it/it?%d", rand.IntN(1000))
	if err := getJSON(ctx, url, "surface", &data); err != nil {
		return nil, err
	}
	return ParseAlerts(data.AlertText)
}

// ParseAlerts extracts the non-empty paragraphs of the alert HTML.
func ParseAlerts(html string) ([]string, error) {
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(html))
	if err != nil {
		return nil, err
	}
	items := []string{}
	doc.Find("p").Each(func(_ int, p *goquery.Selection) {
		text := jsutil.Trim(p.Text())
		if text != "" && !separator.MatchString(text) {
			items = append(items, text)
		}
	})
	return items, nil
}
