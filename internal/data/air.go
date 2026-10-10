package data

import (
	"context"
	"fmt"
	"net/url"
	"slices"
	"strings"
	"time"

	"github.com/moebiusmania/atmmi-info-ui/internal/jsutil"
)

// ARPA Lombardia "Dati sensori aria" dataset (Socrata API, dati.lombardia.it).
const airAPI = "https://www.dati.lombardia.it/resource/nicp-bhqi.json"

type Pollutant string

const (
	PM10 Pollutant = "pm10"
	PM25 Pollutant = "pm25"
	NO2  Pollutant = "no2"
	O3   Pollutant = "o3"
)

// AirQualityLevel is a European Air Quality Index band.
type AirQualityLevel string

// AirQualityLevels lists the EAQI bands from best to worst.
var AirQualityLevels = []AirQualityLevel{
	"good",
	"fair",
	"moderate",
	"poor",
	"very-poor",
	"extremely-poor",
}

type PollutantReading struct {
	Pollutant Pollutant `json:"pollutant"`
	// Average across Milan stations, µg/m³
	Value int `json:"value"`
	// Local time (Europe/Rome) of the measurement, ISO 8601 without offset
	Time string `json:"time"`
	// NO2/O3 are hourly values ("hourly"), PM10/PM2.5 daily averages ("daily")
	Period   string          `json:"period"`
	Level    AirQualityLevel `json:"level"`
	Stations int             `json:"stations"`
}

// Active ARPA sensors in the Comune di Milano, from the "Stazioni qualità dell'aria" dataset
// (dati.lombardia.it/resource/ib47-atvt.json?comune=Milano). Stations: v.Senato, Verziere,
// Pascal Città Studi, v.Liguria, v.Marche.
var sensors = map[Pollutant][]string{
	NO2:  {"5551", "5531", "10279", "5542", "5504"},
	O3:   {"5725", "10282"},
	PM10: {"10320", "6956", "10273", "20429"},
	PM25: {"17122", "10283", "20529"},
}

// sensorOrder is the order of the sensor IDs in the upstream query.
var sensorOrder = []Pollutant{NO2, O3, PM10, PM25}

var order = []Pollutant{PM10, PM25, NO2, O3}

// European Air Quality Index upper bounds (µg/m³) for good → very poor; anything above the last
// bound is "extremely poor". See https://airindex.eea.europa.eu/AQI/index.html
var eaqiBands = map[Pollutant][5]float64{
	PM25: {5, 15, 50, 90, 140},
	PM10: {15, 45, 120, 195, 270},
	NO2:  {10, 25, 60, 100, 150},
	O3:   {60, 100, 120, 160, 180},
}

type ArpaRow struct {
	IDSensore string `json:"idsensore"`
	Data      string `json:"data"`
	Valore    string `json:"valore"`
	Stato     string `json:"stato"`
}

func AQILevel(pollutant Pollutant, value float64) AirQualityLevel {
	for i, max := range eaqiBands[pollutant] {
		if value <= max {
			return AirQualityLevels[i]
		}
	}
	return AirQualityLevels[len(AirQualityLevels)-1]
}

// SummarizeReadings averages, for each pollutant, the valid readings of all its sensors at the
// most recent timestamp available. Pollutants with no valid readings are omitted.
func SummarizeReadings(rows []ArpaRow) []PollutantReading {
	readings := []PollutantReading{}

	for _, pollutant := range order {
		// ARPA marks missing/invalid values with stato "NA" and valore -9999.
		var valid []ArpaRow
		for _, row := range rows {
			if slices.Contains(sensors[pollutant], row.IDSensore) && row.Stato == "VA" &&
				jsutil.Number(row.Valore) >= 0 {
				valid = append(valid, row)
			}
		}
		if len(valid) == 0 {
			continue
		}

		latest := valid[0].Data
		for _, row := range valid {
			if row.Data > latest {
				latest = row.Data
			}
		}
		sum, count := 0.0, 0
		for _, row := range valid {
			if row.Data == latest {
				sum += jsutil.Number(row.Valore)
				count++
			}
		}
		value := jsutil.Round(sum / float64(count))

		period := "hourly"
		if pollutant == PM10 || pollutant == PM25 {
			period = "daily"
		}
		readings = append(readings, PollutantReading{
			Pollutant: pollutant,
			Value:     value,
			Time:      latest,
			Period:    period,
			Level:     AQILevel(pollutant, float64(value)),
			Stations:  count,
		})
	}

	return readings
}

// GetAirQuality fetches the latest ARPA readings for the Milan stations.
func GetAirQuality(ctx context.Context) ([]PollutantReading, error) {
	// PM values are published once a day for the previous day: look back a few days.
	since := time.Now().UTC().Add(-3 * 24 * time.Hour).Format("2006-01-02T15:04:05")
	var ids []string
	for _, pollutant := range sensorOrder {
		for _, id := range sensors[pollutant] {
			ids = append(ids, "'"+id+"'")
		}
	}
	params := url.Values{
		"$select": {"idsensore,data,valore,stato"},
		"$where":  {fmt.Sprintf("idsensore in (%s) AND data >= '%s'", strings.Join(ids, ","), since)},
		"$order":  {"data DESC"},
		"$limit":  {"2000"},
	}
	var rows []ArpaRow
	if err := getJSON(ctx, airAPI+"?"+params.Encode(), "air", &rows); err != nil {
		return nil, err
	}
	return SummarizeReadings(rows), nil
}
