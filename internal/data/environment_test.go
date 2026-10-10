package data

import (
	"reflect"
	"testing"
)

func ptr(v float64) *float64 { return &v }

func TestDescribeWeatherCode(t *testing.T) {
	if got, want := DescribeWeatherCode(0, true), (WeatherCondition{"Sereno", "☀️"}); got != want {
		t.Errorf("DescribeWeatherCode(0, true) = %v, want %v", got, want)
	}
	if got, want := DescribeWeatherCode(0, false), (WeatherCondition{"Sereno", "🌙"}); got != want {
		t.Errorf("DescribeWeatherCode(0, false) = %v, want %v", got, want)
	}
	if got := DescribeWeatherCode(95, true).Label; got != "Temporale" {
		t.Errorf("DescribeWeatherCode(95) label = %q", got)
	}
	if got := DescribeWeatherCode(12345, true).Label; got != "N/D" {
		t.Errorf("DescribeWeatherCode(12345) label = %q", got)
	}
}

func TestToWeatherKeepsOnlyFutureHours(t *testing.T) {
	var data OpenMeteoResponse
	data.Current.Time = "2026-09-25T17:45"
	data.Current.Temperature2m = 22.7
	data.Current.ApparentTemperature = 22.8
	data.Current.RelativeHumidity2m = 52
	data.Current.WeatherCode = 2
	data.Current.WindSpeed10m = 4.5
	data.Current.IsDay = 1
	data.Hourly.Time = []string{"2026-09-25T17:00", "2026-09-25T18:00", "2026-09-25T19:00"}
	data.Hourly.Temperature2m = []float64{22.8, 22.6, 21.9}
	data.Hourly.PrecipitationProbability = []*float64{ptr(0), ptr(10), nil}
	data.Hourly.WeatherCode = []int{2, 2, 0}
	data.Hourly.IsDay = []int{1, 1, 0}
	data.Daily.Temperature2mMax = []float64{22.9}
	data.Daily.Temperature2mMin = []float64{16.9}

	weather := ToWeather(data)
	if weather.Condition.Label != "Parzialmente nuvoloso" {
		t.Errorf("condition = %q", weather.Condition.Label)
	}
	if weather.Min != 16.9 {
		t.Errorf("min = %v", weather.Min)
	}
	if len(weather.Hourly) != 2 {
		t.Fatalf("hourly = %+v, want 2 items", weather.Hourly)
	}
	if weather.Hourly[0].Time != "2026-09-25T18:00" || weather.Hourly[1].Time != "2026-09-25T19:00" {
		t.Errorf("hourly times = %q, %q", weather.Hourly[0].Time, weather.Hourly[1].Time)
	}
	if p := weather.Hourly[0].PrecipitationProbability; p == nil || *p != 10 {
		t.Errorf("hourly[0] precipitation = %v, want 10", p)
	}
	if p := weather.Hourly[1].PrecipitationProbability; p != nil {
		t.Errorf("hourly[1] precipitation = %v, want nil", *p)
	}
	if weather.Hourly[1].Condition.Icon != "🌙" {
		t.Errorf("hourly[1] icon = %q", weather.Hourly[1].Condition.Icon)
	}
}

func TestAQILevelUsesInclusiveUpperBounds(t *testing.T) {
	tests := []struct {
		pollutant Pollutant
		value     float64
		want      AirQualityLevel
	}{
		{PM10, 15, "good"},
		{PM10, 16, "fair"},
		{PM25, 50, "moderate"},
		{NO2, 101, "very-poor"},
		{O3, 181, "extremely-poor"},
	}
	for _, tt := range tests {
		if got := AQILevel(tt.pollutant, tt.value); got != tt.want {
			t.Errorf("AQILevel(%s, %v) = %s, want %s", tt.pollutant, tt.value, got, tt.want)
		}
	}
}

func TestSummarizeReadings(t *testing.T) {
	row := func(id, data, valore string, stato ...string) ArpaRow {
		s := "VA"
		if len(stato) > 0 {
			s = stato[0]
		}
		return ArpaRow{IDSensore: id, Data: data, Valore: valore, Stato: s}
	}
	rows := []ArpaRow{
		// NO2: latest hour has two valid sensors and one missing value
		row("5551", "2026-09-25T16:00:00.000", "12"),
		row("5531", "2026-09-25T16:00:00.000", "13"),
		row("10279", "2026-09-25T16:00:00.000", "-9999", "NA"),
		row("5551", "2026-09-25T15:00:00.000", "40"),
		// PM10: daily value
		row("10320", "2026-09-24T00:00:00.000", "27"),
		// unknown sensor is ignored
		row("99999", "2026-09-25T16:00:00.000", "500"),
	}

	want := []PollutantReading{
		{Pollutant: PM10, Value: 27, Time: "2026-09-24T00:00:00.000", Period: "daily", Level: "fair", Stations: 1},
		// (12 + 13) / 2 = 12.5 rounds up, like Math.round
		{Pollutant: NO2, Value: 13, Time: "2026-09-25T16:00:00.000", Period: "hourly", Level: "fair", Stations: 2},
	}
	if got := SummarizeReadings(rows); !reflect.DeepEqual(got, want) {
		t.Errorf("SummarizeReadings() =\n%+v\nwant\n%+v", got, want)
	}
}
