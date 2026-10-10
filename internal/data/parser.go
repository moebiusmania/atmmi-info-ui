package data

import (
	"strings"

	"github.com/PuerkitoBio/goquery"

	"github.com/moebiusmania/atmmi-info-ui/internal/jsutil"
)

// ParseNews extracts the links matching selector from an HTML page.
func ParseNews(selector, html string) ([]News, error) {
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(html))
	if err != nil {
		return nil, err
	}
	items := []News{}
	doc.Find(selector).Each(func(_ int, item *goquery.Selection) {
		items = append(items, News{
			URL:  item.AttrOr("href", ""),
			Text: jsutil.Trim(item.Text()),
		})
	})
	return items, nil
}

// GetLine extracts the metro line label (M1, M2, etc..) from the title of the row's image.
func GetLine(row *goquery.Selection, selector string) string {
	return row.Find(selector).First().AttrOr("title", "")
}

// GetContent extracts the trimmed text of the first element matching selector in the row.
func GetContent(row *goquery.Selection, selector string) string {
	return jsutil.Trim(row.Find(selector).First().Text())
}

// GetRows finds the table rows of the metro lines status, keeping only the rows with actual data.
func GetRows(doc *goquery.Document) []*goquery.Selection {
	rows := []*goquery.Selection{}
	doc.Find("#StatusLinee tr").Each(func(_ int, row *goquery.Selection) {
		if jsutil.Trim(row.Text()) != "" &&
			row.Find(".StatusLinee_mex").Length() == 0 &&
			row.AttrOr("id", "") == "" {
			rows = append(rows, row)
		}
	})
	return rows
}
