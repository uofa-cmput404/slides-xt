const assets = import.meta.asset_list;
console.log(assets);

let messageQueue = [];

const swConsoleLog = async (...someArguments) => {
    let clients = await self.clients.matchAll();
    if (clients.length > 0) {
        let promises = clients.map((client) => {
            console.log(client.type, client.url);
            for (let message of messageQueue) {
                client.postMessage({
                    consoleLog: message
                });
            }
            client.postMessage({
                consoleLog: someArguments,
            });
        });
        messageQueue.length = 0;
        return await Promise.all(promises);
    } else {
        messageQueue.push(someArguments);
        console.log(...someArguments);
    }
}

self.addEventListener('install', (event) => {
    swConsoleLog("Service worker installed");
    const doneWaiting = self.skipWaiting();
    event.waitUntil(doneWaiting);
    doneWaiting.then(() => {
        swConsoleLog("Done waiting....");
    })
});

self.addEventListener('activate', (event) => {
    swConsoleLog("Service worker activated");
    const claimed = self.clients.claim();
    event.waitUntil(claimed);
    claimed.then(() => {
        swConsoleLog("Claimed!");
    })
});

self.addEventListener('message', (event) => {
    if ('data' in event && 'wakeup' in event.data) {
        swConsoleLog("Service worker woken up!");
    } else {
        console.log("wat");
    }
})

swConsoleLog("Service Worker loaded");