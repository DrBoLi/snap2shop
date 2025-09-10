/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  serverBuildPath: "build/index.js",
  publicPath: "/build/",
  future: {
    v3_fetcherPersist: false,
    v3_lazyRouteDiscovery: false,
    v3_relativeSplatPath: false,
    v3_singleFetch: false,
    v3_throwAbortReason: false,
  },
};