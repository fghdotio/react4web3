const path = require('path')
const CracoLessPlugin = require('craco-less')
const CracoAlias = require("craco-alias")


module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          // lessOptions: {
          //   modifyVars: { '@primary-color': '#1DA57A' },
          //   javascriptEnabled: true,
          // },
        },
      },
    },
    {
      plugin: CracoAlias,
      options: {
        source: "options",
        baseUrl: "./",
        aliases: {
          // "@file": "./src/file.js",
          "@containers": "./src/containers",
          "@components": "./src/components",
          "@utils": "./src/utils",
          "@models": "./src/models",
          "@assets": "./src/assets",
          // you can alias packages too
          // "@material-ui": "./node_modules/@material-ui-ie10"
        }
      }
    }
  ],
};