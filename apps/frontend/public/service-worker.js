// @ts-check
/// <reference no-default-lib="true"/>
/// <reference lib="ES2015" />
/// <reference lib="webworker" />

(async () => {
  const self = /** @type {ServiceWorkerGlobalScope} */ (
    /** @type {unknown} */ (globalThis.self)
  );
  const cacheSpace = "service_worker";
  const currentVersion = "v0.0.1";
  const cacheName = `${cacheSpace}_${currentVersion}`;
  // need to accomodate deployment base path,
  // aka build pipeline
  /**
   * @type {string[]}
   */
  const resources = [
    // "/",
    // "/404",
    // "/500",
    // "/en/account",
    // "/en/place",
    // "/en/places",
    // "/en/planned-event",
    // "/en/planned-event/edit",
    // "/en/planned-events",
    // "/en/qr-code-reader",
    // "/en/stats/places",
    // "/en/stats/tasks",
    // "/en/task",
    // "/en/task/edit",
    // "/en/tasks",
    // "/en/url-viewer",
    // "/en/yt-dlp-configs",
    // "/ru/account",
    // "/ru/place",
    // "/ru/places",
    // "/ru/planned-event",
    // "/ru/planned-event/edit",
    // "/ru/planned-events",
    // "/ru/qr-code-reader",
    // "/ru/stats/places",
    // "/ru/stats/tasks",
    // "/ru/task",
    // "/ru/task/edit",
    // "/ru/tasks",
    // "/ru/url-viewer",
    // "/ru/yt-dlp-configs",
  ];

  self.addEventListener("install", (event) => {
    // event.waitUntil(install());
    console.log("service worker installed");
  });

  self.addEventListener("activate", (event) => {
    // event.waitUntil(activate());
    console.log("service worker activated");
  });

  self.addEventListener("fetch", (event) => {
    event.respondWith(cacheFirst(event.request, event, event.preloadResponse));
  });

  async function install() {
    await addResourcesToCache(resources);
  }

  async function activate() {
    await deleteOldCaches();
    await enableNavigationPreload();
  }

  /**
   *
   * @param {RequestInfo[]} resources
   */
  async function addResourcesToCache(resources) {
    const cache = await caches.open(cacheName);
    await cache.addAll(resources);
  }

  /**
   * @param {Request} request
   * @param {FetchEvent} event
   * @param {Promise<Response>} preloadResponsePromise
   */
  async function cacheFirst(request, event, preloadResponsePromise) {
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

  /**
   * @param {Request} request
   * @param {Response} response
   */
  async function putInCache(request, response) {
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

  /**
   * @param {string} key
   */
  async function deleteCache(key) {
    await caches.delete(key);
  }
})();
