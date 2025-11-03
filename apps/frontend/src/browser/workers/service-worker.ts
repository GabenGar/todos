import {
  IS_DEVELOPMENT,
  SERVICE_WORKER_STATIC_ASSETS_PATHS,
} from "#environment";

initServiceWorker(globalThis.self as unknown as ServiceWorkerGlobalScope);

async function initServiceWorker(self: ServiceWorkerGlobalScope) {
  const cacheSpace = "service_worker";
  const currentVersion = "v0.0.1";
  const cacheName = `${cacheSpace}_${currentVersion}`;

  // do not do anything in develpment
  if (IS_DEVELOPMENT) {
    await initNoOpWorker();

    return;
  }

  self.addEventListener("install", (event) => {
    event.waitUntil(install(SERVICE_WORKER_STATIC_ASSETS_PATHS));
  });

  self.addEventListener("activate", (event) => {
    event.waitUntil(activate());
  });

  self.addEventListener("fetch", async (event) => {
    event.respondWith(cacheFirst(event.request, event, event.preloadResponse));
  });

  async function install(staticPaths?: string[]) {
    const clients = await getWindowClients();

    try {
      if (!staticPaths) {
        throw new Error(
          `Static paths weren't generated for service worker ahead of time.`,
        );
      }
      await addResourcesToCache(staticPaths);
      sendMessageToClients("Successfully installed service worker.", clients);
    } catch (error) {
      sendMessageToClients(String(error), clients);

      throw error;
    }
  }

  async function activate() {
    const clients = await getWindowClients();
    try {
      await deleteOldCaches();
      await enableNavigationPreload();
      sendMessageToClients("Successfully activated service worker.", clients);
    } catch (error) {
      sendMessageToClients(String(error), clients);

      throw error;
    }
  }

  async function addResourcesToCache(resources: RequestInfo[]) {
    const cache = await caches.open(cacheName);
    await cache.addAll(resources);
  }

  async function cacheFirst(
    request: Request,
    event: FetchEvent,
    preloadResponsePromise: Promise<Response>,
  ) {
    const pathname = new URL(request.url, self.location.origin).pathname;

    const client = await self.clients.get(event.clientId);

    if (client) {
      client.postMessage(
        `ServiceWorker: intercepting request "${request.url}" whose cache key will be "${pathname}".`,
      );
    }

    // First try to get the resource from the cache
    const responseFromCache = await caches.match(pathname);

    if (responseFromCache) {
      return responseFromCache;
    }

    // Next try to use (and cache) the preloaded response, if it's there
    const preloadResponse = await preloadResponsePromise;

    if (preloadResponse) {
      event.waitUntil(putInCache(pathname, preloadResponse.clone()));

      return preloadResponse;
    }

    // Next try to get the resource from the network
    try {
      const responseFromNetwork = await fetch(request);
      // response may be used only once
      // we need to save clone to put one copy in cache
      // and serve second one
      event.waitUntil(putInCache(pathname, responseFromNetwork.clone()));
      return responseFromNetwork;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // when even the fallback response is not available,
      // there is nothing we can do, but we must always
      // return a Response object
      return new Response("Request Timeout", {
        status: 408,
        headers: { "Content-Type": "text/plain" },
      });
    }
  }

  async function putInCache(
    request: Parameters<Cache["put"]>[0],
    response: Response,
  ) {
    const cache = await caches.open(cacheName);
    await cache.put(request, response);
  }

  // Enable navigation preload
  async function enableNavigationPreload() {
    if (self.registration.navigationPreload) {
      await self.registration.navigationPreload.enable();
    }
  }

  async function deleteOldCaches() {
    const cacheKeepList = [cacheName];
    const keyList = await caches.keys();
    const cachesToDelete = keyList.filter(
      (key) => !cacheKeepList.includes(key),
    );
    await Promise.all(cachesToDelete.map(deleteCache));
  }

  async function deleteCache(key: string) {
    await caches.delete(key);
  }

  /**
   * A quick worker to nuke older ones.
   */
  async function initNoOpWorker() {
    self.addEventListener("install", (event) => {
      self.skipWaiting();
    });
    self.addEventListener("activate", (event) => {
      event.waitUntil(self.clients.claim());
    });
  }

  async function getWindowClients() {
    const clients = await self.clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    });

    return clients;
  }

  function sendMessageToClients(message: string, clients: readonly Client[]) {
    for (const client of clients) {
      client.postMessage(message);
    }
  }
}
