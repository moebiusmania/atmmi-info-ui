package data

import (
	"context"
	"fmt"
	"sync"
)

// Result holds the outcome of one dashboard section: Err is set when its upstream failed.
type Result[T any] struct {
	Value T
	Err   error
}

type DashboardData struct {
	StatusV1 Result[[]ScrapedLineStatus]
	Surface  Result[[]string]
	Traffic  Result[[]News]
	News     Result[[]News]
	Weather  Result[Weather]
	Air      Result[[]PollutantReading]
}

// settle runs fn in its own goroutine and stores its outcome in out. A panic becomes an error,
// so one failing upstream never breaks the whole page.
func settle[T any](ctx context.Context, wg *sync.WaitGroup, out *Result[T], fn func(context.Context) (T, error)) {
	wg.Go(func() {
		defer func() {
			if r := recover(); r != nil {
				out.Err = fmt.Errorf("%v", r)
			}
		}()
		out.Value, out.Err = fn(ctx)
	})
}

// LoadDashboardData fetches all the dashboard sections concurrently.
func LoadDashboardData(ctx context.Context) DashboardData {
	var d DashboardData
	var wg sync.WaitGroup
	settle(ctx, &wg, &d.StatusV1, GetV1Statuses)
	settle(ctx, &wg, &d.Surface, GetSurfaceAlerts)
	settle(ctx, &wg, &d.Traffic, GetTrafficNews)
	settle(ctx, &wg, &d.News, GetAtmNews)
	settle(ctx, &wg, &d.Weather, GetWeather)
	settle(ctx, &wg, &d.Air, GetAirQuality)
	wg.Wait()
	return d
}
