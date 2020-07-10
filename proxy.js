const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    '/socket.io',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      ws: true, // enable websocket proxy
      logLevel: 'debug',
    })
  );
};