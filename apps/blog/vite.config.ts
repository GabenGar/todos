import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 8003,
  },
  plugins: [
    tanstackStart({
      prerender: {
        // Switch to true to enable prerendering
        enabled: true,
        // Disable if you need pages to be at `/page.html` instead of `/page/index.html`
        autoSubfolderIndex: true,
        // If disabled, only the root path or the paths defined in the pages config will be prerendered
        autoStaticPathsDiscovery: true,
        // How many prerender jobs to run at once
        concurrency: 1,
        // Whether to extract links from the HTML and prerender them also
        crawlLinks: true,
        // Filter function takes the page object and returns whether it should prerender
        // filter: ({ path }) => !path.startsWith("/do-not-render-me"),
        // Number of times to retry a failed prerender job
        retryCount: 2,
        // Delay between retries in milliseconds
        retryDelay: 1000,
        // Maximum number of redirects to follow during prerendering
        maxRedirects: 1,
        // Fail if an error occurs during prerendering
        failOnError: true,
        // Callback when page is successfully rendered
        // onSuccess: ({ page }) => {
        //   console.log(`Rendered ${page.path}!`);
        // },
      },
      // Optional configuration for specific pages
      // Note: When autoStaticPathsDiscovery is enabled (default), discovered static
      // routes will be merged with the pages specified below
      // pages: [
      //   {
      //     path: "/my-page",
      //     prerender: { enabled: true, outputPath: "/my-page/index.html" },
      //   },
      // ],
    }),
    // react's vite plugin must come after start's vite plugin
    viteReact(),
  ],
  build: {
    // fixes style ordering for prod-only
    cssCodeSplit: false,
  },
});
