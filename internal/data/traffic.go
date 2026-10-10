package data

import "context"

const trafficSelector = "#cbqwp_ctl00_SPWebPartManager1_g_c8e995f5_72a5_4f90_88dd_ae34a9352dfa div.news-item a"

// GetTrafficNews scrapes the planned service changes from the ATM homepage.
func GetTrafficNews(ctx context.Context) ([]News, error) {
	return scrapeLinks(ctx, trafficSelector)
}
