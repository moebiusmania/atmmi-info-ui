package data

// News is a link scraped from the ATM homepage (news or traffic changes).
type News struct {
	URL  string `json:"url"`
	Text string `json:"text"`
}

// ScrapedLineStatus is a metro line row from the ATM homepage (`/api/v1/status`).
type ScrapedLineStatus struct {
	Line   string `json:"line"`
	Text   string `json:"text"`
	Status string `json:"status"`
}

// Direction is the status of one direction of a metro line.
type Direction struct {
	Status string `json:"status"`
	Label  string `json:"label"`
}

// MetroLineStatusV2 is the metro status from the giromilano JSON API (`/api/status`).
type MetroLineStatusV2 struct {
	Line       string      `json:"line"`
	Directions []Direction `json:"directions"`
}
