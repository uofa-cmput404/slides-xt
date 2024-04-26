import Reveal from "reveal.js";
import RevealMarkdown from 'reveal.js/plugin/markdown/markdown.esm.js';

import swRelURL from './sw.js?url';

console.log("ServiceWorker URL according to Vite: " + swRelURL);
const swURL = new URL(swRelURL, import.meta.url);
console.log("ServiceWorker URL: " + swURL);
const swName = swURL.pathname.split('/').pop();
console.log("ServiceWorker name: " + swName);
const base = import.meta.env.BASE_URL; // this is injected with text replacement
console.log("Vite base: " + base);
const baseURL = new URL(base, import.meta.url);

const NO_NET = "NO_NET";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", (event) => {
    if ("data" in event) {
      const data = event.data;
      if ("consoleLog" in data) {
        console.log("(sw)", ...(data.consoleLog))
      } else if ("reloadWindow" in data) {
        console.log("Reloading!");
        location.reload();
      } else {
        console.log("(sw)", data);
      }
    } else {
      console.log("(sw)", event);
    }
  })
  navigator.serviceWorker.startMessages();
}

const onlineCheckScript = async (url) => {
  const request = new Request(url, {
    method: 'HEAD',
    cache: 'no-store',
  });
  return await fetch(request).then((response) => {
    const contentType = response.headers.get('Content-Type');
    console.log("Check JS:", url, response.status, contentType);
    if (response.status === 404 || contentType === 'text/html') {
      return false;
    } else {
      return response.status;
    }
  }, (reason) => {
    console.log("Check JS fail: ", reason, url);
    return NO_NET;
  });
}

const onlineCheckMain = async () => {
  if (! await onlineCheckScript(import.meta.url)) {
    console.log("I changed. old: ", import.meta.url)
    if ("serviceWorker" in navigator) {
      let workers = await navigator.serviceWorker.getRegistrations();
      for (const workerRegistration of workers) {
        await workerRegistration.unregister();
      }
    }
    location.reload();
  }
}

const registerServiceWorker = async () => {
  await onlineCheckMain();
  if ("serviceWorker" in navigator) {
    let workers = await navigator.serviceWorker.getRegistrations();
    let stale = false;
    for (const workerRegistration of workers) {
      const worker = workerRegistration.active;
      let unregister = null;
      if (worker) {
        const otherURL = worker.scriptURL;
        if (new URL(otherURL).pathname.split('/').pop() === swName) {
          const fresh = await onlineCheckScript(otherURL);
          if (fresh === 200) {
            console.log("Cache not busted, keep SW", otherURL);
            workerRegistration.update(); // dont wait on this
          } else if (fresh) {
            console.log("Status", fresh, "keep SW", otherURL);
          } else {
            console.log("Stale SW", otherURL);
            await workerRegistration.unregister();
            stale = true;
          }
        } else {
          console.log("Wrong SW (cache busted), unregistering", otherURL);
          await workerRegistration.unregister();
        }
      }
    }

    let registration = false;
    if (!stale) {
      console.log("Registering " + swRelURL);
      try {
        registration = await navigator.serviceWorker.register(swRelURL, {
          scope: base,
          updateViaCache: "imports",
        });
      } catch (error) {
        console.error("Registration failed", error);
      }
    }

    const wakeup = (worker) => {
      worker.addEventListener("error", (event) => {
        console.log("An error occurred in the service worker!");
      })

      worker.postMessage({ wakeup: true });
    }

    if (registration) {
      if (registration.installing) {
        console.log("Service worker installing");
        wakeup(registration.installing);
      } else if (registration.waiting) {
        console.log("Service worker installed");
        wakeup(registration.waiting);
      } else if (registration.active) {
        console.log("Service worker active");
        wakeup(registration.active);
      }
    } else {
      console.log("No registration")
    }
  } else {
    console.log("ServiceWorkers are not supported.");
  }
}

Reveal.initialize({
  hash: true,
  respondToHashChanges: true,
  history: false,
  plugins: [
    RevealMarkdown
  ]
});

registerServiceWorker();

// Index button
const indexButton = document.createElement("a");
indexButton.classList.add("index-button");
indexButton.href = base;
indexButton.textContent = "Index";
document.body.appendChild(indexButton);