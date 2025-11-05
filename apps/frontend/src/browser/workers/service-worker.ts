import { HTTP_STATUS_CODE } from "@repo/ui/http";
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
    try {
      if (!staticPaths) {
        throw new Error(
          `Static paths weren't generated for service worker ahead of time.`,
        );
      }
      await addResourcesToCache(staticPaths);
      console.info("Successfully installed service worker.");
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  async function activate() {
    try {
      await deleteOldCaches();
      await enableNavigationPreload();
      console.info("Successfully activated service worker.");
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  async function addResourcesToCache(resources: RequestInfo[]) {
    console.debug(`Adding ${resources.length} resources to cache...`);
    const cache = await caches.open(cacheName);
    await cache.addAll(resources);
    console.debug(`Added ${resources.length} resources to cache.`);
  }

  async function cacheFirst(
    request: Request,
    event: FetchEvent,
    preloadResponsePromise: Promise<Response>,
  ) {
    const pathname = new URL(request.url, self.location.origin).pathname;

    console.debug(
      `Intercepting request "${request.url}" whose cache key will be "${pathname}".`,
    );

    // First try to get the resource from the cache
    const responseFromCache = await caches.match(pathname);

    if (responseFromCache) {
      return responseFromCache;
    }

    // Next try to use (and cache) the preloaded response, if it's there
    const preloadResponse = await preloadResponsePromise;

    if (preloadResponse) {
      await putInCache(pathname, preloadResponse.clone());

      return preloadResponse;
    }

    // Next try to get the resource from the network
    try {
      const responseFromNetwork = await fetch(request);
      // response may be used only once
      // we need to save clone to put one copy in cache
      // and serve second one
      await putInCache(pathname, responseFromNetwork.clone());

      return responseFromNetwork;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // when even the fallback response is not available,
      // there is nothing we can do, but we must always
      // return a Response object
      return new Response("Request Timeout", {
        status: HTTP_STATUS_CODE.REQUEST_TIMEOUT,
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
}
