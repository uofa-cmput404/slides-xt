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

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", (event) => {
    if ("data" in event && "consoleLog" in event.data) {
      console.log("(sw)", ...(event.data.consoleLog));
    } else {
      console.log("(sw)", event);
    }
  })
  navigator.serviceWorker.startMessages();
}

const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    let workers = await navigator.serviceWorker.getRegistrations();
    let found = false;
    for (let workerRegistration of workers) {
      const worker = workerRegistration.active;
      let unregister = null;
      if (worker) {
        const otherURL = new URL(worker.scriptURL, import.meta.url);
        if (otherURL.pathname.split('/').pop() === swName) {
          console.log("Already registered " + otherURL);
          const request = new Request(swRelURL, {
            method: 'HEAD',
          });
          let response;
          try {
            response = await fetch(request);
            if (response.status === 200) {
              console.log("SeviceWoker JS: HTTP " + response.status);
              unregister = false;
            } else {
              console.log("SeviceWoker JS: HTTP " + response.status);
              unregister = true;
            }
          } catch (error) {
            console.log("Couldn't fetch ", error);
            response = false;
            unregister = false;
          }
        } else {
          unregister = true;
        }
        if (unregister === true) {
          console.log("Unregistering worker " + otherURL);
          await worker.unregister();
        } else if (unregister === false) {
          found = true;
          console.log("Keeping this worker.");
        } else { // null
          throw new Error("Didn't determine if the service worker is old or not!");
        }
      }
    }
    console.log("Registering " + swRelURL);
    let registration = false;
    try {
      registration = await navigator.serviceWorker.register(swRelURL, {
        scope: base,
      });
    } catch (error) {
      console.error("Registration failed", error);
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
      console.log("No registration?")
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