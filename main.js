import Reveal from "reveal.js";
import RevealMarkdown from 'reveal.js/plugin/markdown/markdown.esm.js';

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((workers) => {
    for (worker of workers) {
      worker.unregister();
    }
  });
}

Reveal.initialize({
    hash: true,
    respondToHashChanges: true,
    history: false,
    plugins: [
        RevealMarkdown
    ]
});
