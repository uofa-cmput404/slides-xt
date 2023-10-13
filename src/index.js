console.log("Hello World!");
import Reveal from "reveal.js";
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/white.css';
import '@fontsource-variable/lexend-deca';

import './.nojekyll';
import './1.json';
import './2.json';
import './3.json';
import './4.json';
import './custom.css';

import RevealMarkdown from 'reveal.js/plugin/markdown/markdown.js';

Reveal.initialize({
    hash: true,
    respondToHashChanges: true,
    history: false,
    plugins: [
        RevealMarkdown
    ]
});
