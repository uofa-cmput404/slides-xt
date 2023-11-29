const assets = []||ASSET_LIST;
const assets_version = ''&&ASSET_LIST_VERSION;

const messageQueue = [];

const scopeBase = new URL(self.registration.scope);

const sendAll = async (cloneable) => {
    let clients = await self.clients.matchAll();
    for (const client of clients) {
        client.postMessage(cloneable);
    }
}

const swConsoleLog = async (...someArguments) => {
    console.log("!sw!", ...someArguments);
    const clients = await self.clients.matchAll();
    if (clients.length > 0) {
        for (const client of clients) {
            console.log(client.type, client.url);
            for (const message of messageQueue) {
                client.postMessage({
                    consoleLog: message
                });
            }
            client.postMessage({
                consoleLog: someArguments,
            });
        }
        messageQueue.length = 0;
    } else {
        messageQueue.push(someArguments);
        console.log(...someArguments);
    }
}

const fillCache = async () => {
    const cache = await caches.open(assets_version);
    await cache.addAll(['./', ...assets]);
}

self.addEventListener('install', (event) => {
    event.waitUntil(swConsoleLog("Service worker installed"));
    const doneWaiting = self.skipWaiting();
    event.waitUntil(doneWaiting);
    doneWaiting.then(() => {
        swConsoleLog("Done waiting....");
    });
    event.waitUntil(fillCache());
});

const claimer = async () => {
    await self.clients.claim();
    await swConsoleLog("Claimed!");
    const cacheKeys = await caches.keys();
    for (const cacheKey of cacheKeys) {
        if (cacheKey !== assets_version) {
            await caches.delete(cacheKey);
        }
    }
    await sendAll({
        reloadWindow: true
    });
}

self.addEventListener('activate', (event) => {
    event.waitUntil(swConsoleLog("Service worker activated"));
    event.waitUntil(self.registration?.navigationPreload.enable());
    event.waitUntil(claimer());
});

self.addEventListener('message', (event) => {
    if ('data' in event && 'wakeup' in event.data) {
        swConsoleLog("Service worker woken up!");
        swConsoleLog(JSON.stringify(assets_version));
        swConsoleLog("scopeBase", scopeBase.origin);
    } else {
        console.log("wat");
    }
})

const cachedFetch = async (request) => {
    const cached = await caches.match(request);
    if (cached) {
        await swConsoleLog("CACHED!", request.method, request.url, request.destination);
        return cached;
    } else {
        await swConsoleLog("not cached", request.method, request.url, request.destination, self.registration.scope);
        const response = await fetch(request);
        return response;
    }
}

self.addEventListener("fetch", (event) => {
    const reqURL = new URL(event.request.url);
    // swConsoleLog(event.request.cache, event.request.url);
    if (event.request.cache === 'no-store') {
        swConsoleLog("no-store", event.request.method, event.request.url);
        return;
    } else if (event.request.method !== "GET") {
        swConsoleLog("not GET:", event.request.method, event.request.url);
        return;
    } else if (reqURL.origin !== scopeBase.origin) {
        swConsoleLog("other origin: ", event.request.method, event.request.url, reqURL.origin, scopeBase.origin);
        return;
    } else if (! reqURL.pathname.startsWith(scopeBase.pathname)) {
        swConsoleLog("out of scope: ", event.request.method, event.request.url, scopeBase.pathname);
        return;
    }
    event.respondWith(cachedFetch(event.request));
});

swConsoleLog("Service Worker loaded");