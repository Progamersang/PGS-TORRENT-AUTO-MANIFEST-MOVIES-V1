const { serveHTTP } = require("stremio-addon-sdk");

const addonInterface = require("./addon.js");
serveHTTP(addonInterface, { port: 7000 });
