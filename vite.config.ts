import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugIn = {
  registerType: "autoUpdate",
  includeAssests: ["favicon.ico"],
  workbox: {
    navigateFallback: "/index.html",
    devOptions: {
      enabled: true
    },
    globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/finnhub\.io\/api/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'finnhub-api-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 30,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
  manifest: {
    name: "Finnhub Stock Tracker",
    short_name: "Stock Tracker",
    description: "Stock Tracker using Finnhub API",
    icons: [],
    theme_color: "#171717",
    background_color: "#f0e7db",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugIn as any)],
});
