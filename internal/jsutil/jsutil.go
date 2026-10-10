// Package jsutil reproduces the few JavaScript semantics the dashboard depends on (string
// trimming, rounding, number parsing, URL resolution), so the Go port behaves like the original
// Deno/Fresh implementation on the same upstream data.
package jsutil

import (
	"math"
	"net/url"
	"strconv"
	"strings"
	"unicode/utf16"
)

// IsSpace reports whether r is whitespace for JavaScript's String.prototype.trim and the regexp
// \s class (WhiteSpace + LineTerminator). Unlike unicode.IsSpace it includes U+FEFF and excludes
// U+0085.
func IsSpace(r rune) bool {
	switch r {
	case '\t', '\n', '\v', '\f', '\r', ' ', 0x00A0, 0x1680, 0x2028, 0x2029, 0x202F, 0x205F,
		0x3000, 0xFEFF:
		return true
	}
	return r >= 0x2000 && r <= 0x200A
}

// Trim is String.prototype.trim.
func Trim(s string) string {
	return strings.TrimFunc(s, IsSpace)
}

// Round is Math.round: halves round towards +∞, and -0 becomes 0.
func Round(x float64) int {
	return int(math.Floor(x + 0.5))
}

// Number is the Number() conversion of a string: surrounding whitespace is ignored, an empty
// string is 0 and anything unparsable is NaN.
func Number(s string) float64 {
	s = Trim(s)
	if s == "" {
		return 0
	}
	v, err := strconv.ParseFloat(s, 64)
	if err != nil {
		return math.NaN()
	}
	return v
}

// UTF16Len is the JavaScript length of s (UTF-16 code units).
func UTF16Len(s string) int {
	n := 0
	for _, r := range s {
		n += utf16.RuneLen(r)
	}
	return n
}

// ResolveURL is new URL(ref, base).href: leading/trailing C0 controls and spaces are stripped and
// tabs/newlines removed before resolving, as the WHATWG URL parser does.
func ResolveURL(ref, base string) (string, error) {
	ref = strings.TrimFunc(ref, func(r rune) bool { return r <= ' ' })
	ref = strings.NewReplacer("\t", "", "\n", "", "\r", "").Replace(ref)
	b, err := url.Parse(base)
	if err != nil {
		return "", err
	}
	r, err := url.Parse(ref)
	if err != nil {
		return "", err
	}
	return b.ResolveReference(r).String(), nil
}
