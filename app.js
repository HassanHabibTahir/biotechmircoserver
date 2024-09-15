  const express = require("express");
  const { createProxyMiddleware } = require("http-proxy-middleware");

  const app = express();
  // Defines routes and their corresponding target servers
  const routes = {
    "/biotech": "http://localhost:3001",
    "/products": "http://localhost:3002",
  };
  for (const route in routes) {
    const target = routes[route];
    app.use(
      route,
      (req, res, next) => {
        console.log(`Proxying request for ${route} to ${target}`);
        next();
      },
      createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: {
          [`^${route}`]: "",
        },
        timeout: 10000,
      })
    );
  }

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error("Proxy error:", err);
    res.status(500).send("Something went wrong in the proxy.");
  });

  const PORT = 8001;
  app.listen(PORT, () =>
    console.log(`API GATEWAY STARTED at http://localhost:${PORT}`)
  );
  // https://microserviecs-project-40znk1cxm-hassanhabibtahirs-projects.vercel.app/