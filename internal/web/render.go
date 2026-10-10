package web

import (
	"html/template"
	"io/fs"
	"strconv"
	"strings"

	"github.com/moebiusmania/atmmi-info-ui/internal/jsutil"
)

var funcs = template.FuncMap{
	"degrees": degrees,
	"hour":    hour,
	"lower":   strings.ToLower,
	"round":   jsutil.Round,
	"num":     num,
	"rain": func(p *float64) string {
		if p == nil || *p == 0 || *p != *p {
			return ""
		}
		return "💧" + num(*p) + "%"
	},
}

// num formats a number like JavaScript's String(number) does for everyday values.
func num(v float64) string {
	return strconv.FormatFloat(v, 'f', -1, 64)
}

// jsxWhitespace applies JSX whitespace rules to a template source, so templates can be indented
// freely: each line is trimmed, blank lines are dropped, and consecutive lines are joined with a
// space only when both sides are text (not a tag or a template action).
func jsxWhitespace(src string) string {
	var b strings.Builder
	prev := ""
	for line := range strings.Lines(src) {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}
		if prev != "" &&
			!strings.HasSuffix(prev, ">") && !strings.HasSuffix(prev, "}}") &&
			!strings.HasPrefix(line, "<") && !strings.HasPrefix(line, "{{") {
			b.WriteByte(' ')
		}
		b.WriteString(line)
		prev = line
	}
	return b.String()
}

func parseTemplates(fsys fs.FS) (*template.Template, error) {
	src, err := fs.ReadFile(fsys, "index.html")
	if err != nil {
		return nil, err
	}
	return template.New("index.html").Funcs(funcs).Parse(jsxWhitespace(string(src)))
}
