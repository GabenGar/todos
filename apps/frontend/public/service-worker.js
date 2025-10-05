self.addEventListener("install", (event) => {
  console.log("service worker installed");
});

self.addEventListener("activate", () => {
  console.log("service worker activated");
});
