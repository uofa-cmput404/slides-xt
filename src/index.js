console.log("Hello World!");
import Reveal from "reveal.js";
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/white.css';
import fitty from 'fitty/dist/fitty.module';
import '@fontsource-variable/lexend-deca';

import './.nojekyll';
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

// fitty('.columns');
// fitty('.column');
// fitty('section>ul');