package data

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/moebiusmania/atmmi-info-ui/internal/atm"
)

var client = &http.Client{Timeout: 20 * time.Second}

// getJSON fetches url and decodes its JSON body into v; label prefixes HTTP errors.
func getJSON(ctx context.Context, url, label string, v any) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return err
	}
	req.Header.Set("User-Agent", atm.UserAgent)
	res, err := client.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()
	if res.StatusCode < 200 || res.StatusCode > 299 {
		return fmt.Errorf("%s: HTTP %d", label, res.StatusCode)
	}
	return json.NewDecoder(res.Body).Decode(v)
}
