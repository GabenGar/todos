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
  } else {
    self.addEventListener("install", (event) => {
      if (!SERVICE_WORKER_STATIC_ASSETS_PATHS) {
        throw new Error(
          `Static paths weren't generated for service worker ahead of time.`,
        );
      }

      event.waitUntil(install(SERVICE_WORKER_STATIC_ASSETS_PATHS));
      console.log("service worker installed");
    });

    self.addEventListener("activate", (event) => {
      event.waitUntil(activate());
      console.log("service worker activated");
    });

    self.addEventListener("fetch", (event) => {
      event.respondWith(
        cacheFirst(event.request, event, event.preloadResponse),
      );
    });
  }

  async function install(staticPaths: string[]) {
    await addResourcesToCache(staticPaths);
  }

  async function activate() {
    await deleteOldCaches();
    await enableNavigationPreload();
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
    // First try to get the resource from the cache
    const responseFromCache = await caches.match(request);

    if (responseFromCache) {
      return responseFromCache;
    }

    // Next try to use (and cache) the preloaded response, if it's there
    const preloadResponse = await preloadResponsePromise;

    if (preloadResponse) {
      event.waitUntil(putInCache(request, preloadResponse.clone()));

      return preloadResponse;
    }

    // Next try to get the resource from the network
    try {
      const responseFromNetwork = await fetch(request);
      // response may be used only once
      // we need to save clone to put one copy in cache
      // and serve second one
      event.waitUntil(putInCache(request, responseFromNetwork.clone()));
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

  async function putInCache(request: Request, response: Response) {
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
}
