package data

import (
	"context"

	"github.com/moebiusmania/atmmi-info-ui/internal/atm"
)

type statusDirezione struct {
	DescrizioneField string `json:"descrizioneField"`
	StatoField       string `json:"statoField"`
}

type status struct {
	DescrizioneField string            `json:"descrizioneField"`
	DirezioniField   []statusDirezione `json:"direzioniField"`
}

// GetV2Statuses fetches the metro lines status from the giromilano JSON API.
func GetV2Statuses(ctx context.Context) ([]MetroLineStatusV2, error) {
	var data []status
	if err := atm.GetAPI(ctx, "sm", &data); err != nil {
		return nil, err
	}

	items := []MetroLineStatusV2{}
	for _, item := range data {
		directions := []Direction{}
		for _, direction := range item.DirezioniField {
			directions = append(directions, Direction{
				Status: direction.StatoField,
				Label:  direction.DescrizioneField,
			})
		}
		items = append(items, MetroLineStatusV2{Line: item.DescrizioneField, Directions: directions})
	}
	return items, nil
}
