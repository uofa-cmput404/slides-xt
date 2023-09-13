console.log("Hello World!");
import Reveal from "reveal.js";
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/white.css';
import fitty from 'fitty/dist/fitty.module';
import '@fontsource-variable/lexend-deca';

import './.nojekyll';
import './custom.css';

Reveal.initialize({
    hash: true,
    respondToHashChanges: true,
    history: false,
});

// fitty('.columns');
// fitty('.column');
// fitty('section>ul');