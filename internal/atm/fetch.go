// Package atm fetches the ATM homepage and the giromilano JSON API.
package atm

import (
	"context"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

const (
	Website = "https://www.atm.it/it/Pagine/default.aspx"
	API     = "https://giromilano.atm.it/proxy.tpportal/api/tpPortal/tpl/atm"

	// UserAgent is sent on every upstream request: www.atm.it answers HTTP 500 to Go's default
	// "Go-http-client/1.1".
	UserAgent = "atmmi-info-ui (+https://github.com/moebiusmania/atmmi-info-ui)"
)

// tlsClient skips certificate verification because of legacy ATM / giromilano certificates (see
// README). Use it only for these hosts.
var tlsClient = func() *http.Client {
	transport := http.DefaultTransport.(*http.Transport).Clone()
	transport.TLSClientConfig = &tls.Config{InsecureSkipVerify: true}
	return &http.Client{Transport: transport, Timeout: 20 * time.Second}
}()

func get(ctx context.Context, url, label string) ([]byte, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", UserAgent)
	res, err := tlsClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	if res.StatusCode < 200 || res.StatusCode > 299 {
		return nil, fmt.Errorf("%s: HTTP %d", label, res.StatusCode)
	}
	return io.ReadAll(res.Body)
}

// GetPage fetches the ATM homepage HTML.
func GetPage(ctx context.Context) (string, error) {
	body, err := get(ctx, Website, "getPage")
	return string(body), err
}

// GetAPI fetches a giromilano API resource and decodes its JSON into v.
func GetAPI(ctx context.Context, resource string, v any) error {
	body, err := get(ctx, API+"/"+resource, fmt.Sprintf("getApi(%s)", resource))
	if err != nil {
		return err
	}
	return json.Unmarshal(body, v)
}
