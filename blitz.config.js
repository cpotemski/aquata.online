const { tick } = require("./server/tick")
const { sessionMiddleware, simpleRolesIsAuthorized } = require("blitz")
const { CronJob } = require("cron")

module.exports = {
  target: "server",
  middleware: [
    sessionMiddleware({
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
  experimental: {
    initServer() {
      new CronJob(
        "*/30 * * * * *",
        function () {
          tick()
        },
        null,
        true
      )
    },
  },
  /* Uncomment this to customize the webpack config
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    return config
  },
  */
}
