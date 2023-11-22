import Reveal from "reveal.js";
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/white.css';

import './src/styles/custom.css';

import RevealMarkdown from 'reveal.js/plugin/markdown/markdown.js';

Reveal.initialize({
    hash: true,
    respondToHashChanges: true,
    history: false,
    plugins: [
        RevealMarkdown
    ]
});

// Stuff that came with Vite
import './src/styles/style.css'
import javascriptLogo from './src/assets/javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './src/scripts/counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))
