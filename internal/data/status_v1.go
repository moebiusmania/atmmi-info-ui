package data

import (
	"context"
	"strings"

	"github.com/PuerkitoBio/goquery"

	"github.com/moebiusmania/atmmi-info-ui/internal/atm"
)

// GetV1Statuses scrapes the metro lines status from the ATM homepage.
func GetV1Statuses(ctx context.Context) ([]ScrapedLineStatus, error) {
	page, err := atm.GetPage(ctx)
	if err != nil {
		return nil, err
	}
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(page))
	if err != nil {
		return nil, err
	}

	items := []ScrapedLineStatus{}
	for _, row := range GetRows(doc) {
		status := GetContent(row, ".StatusLinee_StatoScritta")
		items = append(items, ScrapedLineStatus{Line: GetLine(row, "img"), Text: status, Status: status})
	}
	return items, nil
}
