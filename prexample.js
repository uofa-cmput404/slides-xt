const nunjucks = require('nunjucks');
const env = new nunjucks.Environment();
const escape = env.getFilter('escape');

module.exports = function prexample(val) {
    const lines = val.split('\n');
    while (lines.length > 0) {
        const line = lines[0];
        if (line.match(/^\s*$/)) {
            lines.shift();
        } else {
            break;
        }
    }
    while (lines.length > 0) {
        const line = lines[lines.length-1];
        if (line.match(/^\s*$/)) {
            lines.pop();
        } else {
            break;
        }
    }
    let prefixed = Infinity;
    for (line of lines) {
        const ws = line.match(/^\s*/);
        if (ws) {
            wsLength = ws[0].length;
            if (wsLength < line.length && wsLength < prefixed) {
                prefixed = wsLength;
            }
        }
    }
    if (prefixed === Infinity) {
        prefixed = 0;
    }
    const pattern = RegExp(`^\\s{0,${prefixed}}`);
    for (i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replace(pattern, '');
    }
    const unfixed = lines.join('\n');
    return unfixed;
};