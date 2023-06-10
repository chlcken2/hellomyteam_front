const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://158.247.223.18/",
      changeOrigin: true,
    }),
  );
};
