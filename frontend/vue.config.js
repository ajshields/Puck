/*module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api-web.nhle.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '', // Remove the '/api' prefix
        },
      },
    },
  },
};*/
  

  /*


const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {
  apiEndpoint: 'https://api-web.nhle.com/v1/schedule/2024-01-28',
  proxy: createProxyMiddleware('/api', {
    target: 'https://api-web.nhle.com',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '',
    },
  }),
};

module.exports = {
    // options...
    devServer: {
          proxy: 'https://mywebsite/',
      }
  }*/