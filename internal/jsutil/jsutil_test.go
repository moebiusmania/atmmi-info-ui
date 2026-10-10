package jsutil

import (
	"math"
	"testing"
)

func TestRound(t *testing.T) {
	tests := map[float64]int{2.5: 3, -2.5: -2, -0.4: 0, 14.4: 14, 20.7: 21}
	for in, want := range tests {
		if got := Round(in); got != want {
			t.Errorf("Round(%v) = %d, want %d", in, got, want)
		}
	}
}

func TestNumber(t *testing.T) {
	if got := Number(" 12.5 "); got != 12.5 {
		t.Errorf("Number(12.5) = %v", got)
	}
	if got := Number(""); got != 0 {
		t.Errorf("Number(\"\") = %v, want 0", got)
	}
	if got := Number("abc"); !math.IsNaN(got) {
		t.Errorf("Number(abc) = %v, want NaN", got)
	}
}

func TestTrim(t *testing.T) {
	if got := Trim("\u00a0\ufeff text \n"); got != "text" {
		t.Errorf("Trim() = %q", got)
	}
}

func TestResolveURL(t *testing.T) {
	const base = "https://www.atm.it/it/Pagine/default.aspx"
	tests := map[string]string{
		"/it/AtmNews/Pagine/a.aspx":    "https://www.atm.it/it/AtmNews/Pagine/a.aspx",
		" https://example.com/x.pdf\n": "https://example.com/x.pdf",
		"/it/covid/Pagine/a%20b.aspx":  "https://www.atm.it/it/covid/Pagine/a%20b.aspx",
	}
	for in, want := range tests {
		got, err := ResolveURL(in, base)
		if err != nil || got != want {
			t.Errorf("ResolveURL(%q) = %q, %v; want %q", in, got, err, want)
		}
	}
}
