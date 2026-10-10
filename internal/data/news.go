package data

import (
	"context"

	"github.com/moebiusmania/atmmi-info-ui/internal/atm"
	"github.com/moebiusmania/atmmi-info-ui/internal/jsutil"
)

const newsSelector = "#slwp_ctl00_PlaceHolderMain_SummaryLinkFieldControl2_SummaryLinkFieldControl2 > tbody > tr td div.item > div.link-item > a"

// GetAtmNews scrapes the "ATM informa" news from the ATM homepage.
func GetAtmNews(ctx context.Context) ([]News, error) {
	return scrapeLinks(ctx, newsSelector)
}

// scrapeLinks parses the links matching selector on the ATM homepage, resolving relative URLs.
func scrapeLinks(ctx context.Context, selector string) ([]News, error) {
	page, err := atm.GetPage(ctx)
	if err != nil {
		return nil, err
	}
	items, err := ParseNews(selector, page)
	if err != nil {
		return nil, err
	}
	// Some links on the ATM homepage are relative (e.g. "/it/AtmNews/...").
	for i := range items {
		if items[i].URL, err = jsutil.ResolveURL(items[i].URL, atm.Website); err != nil {
			return nil, err
		}
	}
	return items, nil
}
