package data

import (
	"context"
	"net/url"
	"strconv"
)

const weatherAPI = "https://api.open-meteo.com/v1/forecast"

// Milano, Piazza del Duomo
const (
	latitude  = 45.4642
	longitude = 9.19
)

const hoursAhead = 6

type WeatherCondition struct {
	Label string `json:"label"`
	Icon  string `json:"icon"`
}

type HourlyForecast struct {
	// Local time (Europe/Rome), ISO 8601 without offset
	Time                     string           `json:"time"`
	Temperature              float64          `json:"temperature"`
	PrecipitationProbability *float64         `json:"precipitationProbability"`
	Condition                WeatherCondition `json:"condition"`
}

type Weather struct {
	// Local time (Europe/Rome), ISO 8601 without offset
	Time                string           `json:"time"`
	Temperature         float64          `json:"temperature"`
	ApparentTemperature float64          `json:"apparentTemperature"`
	Humidity            float64          `json:"humidity"`
	WindSpeed           float64          `json:"windSpeed"`
	Condition           WeatherCondition `json:"condition"`
	Min                 float64          `json:"min"`
	Max                 float64          `json:"max"`
	Hourly              []HourlyForecast `json:"hourly"`
}

type OpenMeteoResponse struct {
	Current struct {
		Time                string  `json:"time"`
		Temperature2m       float64 `json:"temperature_2m"`
		ApparentTemperature float64 `json:"apparent_temperature"`
		RelativeHumidity2m  float64 `json:"relative_humidity_2m"`
		WeatherCode         int     `json:"weather_code"`
		WindSpeed10m        float64 `json:"wind_speed_10m"`
		IsDay               int     `json:"is_day"`
	} `json:"current"`
	Hourly struct {
		Time                     []string   `json:"time"`
		Temperature2m            []float64  `json:"temperature_2m"`
		PrecipitationProbability []*float64 `json:"precipitation_probability"`
		WeatherCode              []int      `json:"weather_code"`
		IsDay                    []int      `json:"is_day"`
	} `json:"hourly"`
	Daily struct {
		Temperature2mMax []float64 `json:"temperature_2m_max"`
		Temperature2mMin []float64 `json:"temperature_2m_min"`
	} `json:"daily"`
}

// at returns s[i], or the zero value when i is out of range.
func at[T any](s []T, i int) T {
	var zero T
	if i < 0 || i >= len(s) {
		return zero
	}
	return s[i]
}

// DescribeWeatherCode maps a WMO weather interpretation code (as returned by Open-Meteo) to an
// Italian label and icon.
func DescribeWeatherCode(code int, isDay bool) WeatherCondition {
	switch code {
	case 0:
		if isDay {
			return WeatherCondition{"Sereno", "☀️"}
		}
		return WeatherCondition{"Sereno", "🌙"}
	case 1:
		if isDay {
			return WeatherCondition{"Prevalentemente sereno", "🌤️"}
		}
		return WeatherCondition{"Prevalentemente sereno", "🌙"}
	case 2:
		return WeatherCondition{"Parzialmente nuvoloso", "⛅"}
	case 3:
		return WeatherCondition{"Coperto", "☁️"}
	case 45, 48:
		return WeatherCondition{"Nebbia", "🌫️"}
	case 51, 53, 55:
		return WeatherCondition{"Pioviggine", "🌦️"}
	case 56, 57:
		return WeatherCondition{"Pioviggine gelata", "🌧️"}
	case 61:
		return WeatherCondition{"Pioggia debole", "🌧️"}
	case 63:
		return WeatherCondition{"Pioggia", "🌧️"}
	case 65:
		return WeatherCondition{"Pioggia forte", "🌧️"}
	case 66, 67:
		return WeatherCondition{"Pioggia gelata", "🌧️"}
	case 71, 73, 75, 77:
		return WeatherCondition{"Neve", "❄️"}
	case 80, 81, 82:
		return WeatherCondition{"Rovesci", "🌦️"}
	case 85, 86:
		return WeatherCondition{"Rovesci di neve", "🌨️"}
	case 95:
		return WeatherCondition{"Temporale", "⛈️"}
	case 96, 99:
		return WeatherCondition{"Temporale con grandine", "⛈️"}
	default:
		return WeatherCondition{"N/D", "🌡️"}
	}
}

func ToWeather(data OpenMeteoResponse) Weather {
	current, hourly, daily := data.Current, data.Hourly, data.Daily

	next := []HourlyForecast{}
	for i, time := range hourly.Time {
		// Hourly data starts at the current (already begun) hour: keep only future hours.
		if time <= current.Time || len(next) >= hoursAhead {
			continue
		}
		next = append(next, HourlyForecast{
			Time:                     time,
			Temperature:              at(hourly.Temperature2m, i),
			PrecipitationProbability: at(hourly.PrecipitationProbability, i),
			Condition:                DescribeWeatherCode(at(hourly.WeatherCode, i), at(hourly.IsDay, i) == 1),
		})
	}

	return Weather{
		Time:                current.Time,
		Temperature:         current.Temperature2m,
		ApparentTemperature: current.ApparentTemperature,
		Humidity:            current.RelativeHumidity2m,
		WindSpeed:           current.WindSpeed10m,
		Condition:           DescribeWeatherCode(current.WeatherCode, current.IsDay == 1),
		Min:                 at(daily.Temperature2mMin, 0),
		Max:                 at(daily.Temperature2mMax, 0),
		Hourly:              next,
	}
}

// GetWeather fetches the current weather and the next hours forecast for Milan from Open-Meteo.
func GetWeather(ctx context.Context) (Weather, error) {
	params := url.Values{
		"latitude":       {strconv.FormatFloat(latitude, 'f', -1, 64)},
		"longitude":      {strconv.FormatFloat(longitude, 'f', -1, 64)},
		"current":        {"temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day"},
		"hourly":         {"temperature_2m,precipitation_probability,weather_code,is_day"},
		"forecast_hours": {strconv.Itoa(hoursAhead + 1)},
		"daily":          {"temperature_2m_max,temperature_2m_min"},
		"forecast_days":  {"1"},
		"timezone":       {"Europe/Rome"},
	}
	var data OpenMeteoResponse
	if err := getJSON(ctx, weatherAPI+"?"+params.Encode(), "weather", &data); err != nil {
		return Weather{}, err
	}
	return ToWeather(data), nil
}
