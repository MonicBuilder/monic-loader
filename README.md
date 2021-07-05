monic-loader
============

Using [Monic](https://github.com/MonicBuilder/Monic) with [WebPack](http://webpack.github.io).

[![NPM version](http://img.shields.io/npm/v/monic-loader.svg?style=flat)](http://badge.fury.io/js/monic-loader)
[![NPM dependencies](http://img.shields.io/david/MonicBuilder/monic-loader.svg?style=flat)](https://david-dm.org/MonicBuilder/monic-loader)
[![NPM devDependencies](http://img.shields.io/david/dev/MonicBuilder/monic-loader.svg?style=flat)](https://david-dm.org/MonicBuilder/monic-loader?type=dev)
[![NPM peerDependencies](http://img.shields.io/david/peer/MonicBuilder/monic-loader.svg?style=flat)](https://david-dm.org/MonicBuilder/monic-loader?type=peer)

## Install

```bash
# WebPack 1
npm install monic monic-loader@webpack1 --save-dev

# WebPack 2+
npm install monic monic-loader --save-dev
```

## Usage
### Webpack 1

**webpack.config.json**

```js
var webpack = require('webpack');

webpack({
  entry: {
      index: './index.js'
  },

  output: {
      filename: '[name].bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'monic-loader?flags=ie:7|develop&labels=full|baz'
      }
    ]
  },

  monic: {
    replacers: [
      // Replaces require to #include
      // ("this" refers to the instance of the compiler)
      function (text, file) {
        return text.replace(/^\s*require\('(.*?)'\);/gm, '//#include $1');
      }
    ]
  }

}, function (err, stats) {
    // ...
});
```

### Webpack 2+

**webpack.config.json**

```js
var webpack = require('webpack');

webpack({
  entry: {
      index: './index.js'
  },

  output: {
      filename: '[name].bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            // Can be used: monic-loader?flags=ie:7|develop&labels=full|baz
            loader: 'monic-loader',
            options: {
              flags: ['ie:7', 'develop'],
              labels: ['full', 'baz'],
              replacers: [
                // Replaces require to #include
                // ("this" refers to the compiler' instance)
                function (text, file) {
                  return text.replace(/^\s*require\('(.*?)'\);/gm, '//#include $1');
                }
              ]
            }
          }
        ]
      }
    ]
  }

}, function (err, stats) {
    // ...
});
```

## [Options](https://github.com/MonicBuilder/Monic#using-in-nodejs)
## [License](https://github.com/MonicBuilder/monic-loader/blob/master/LICENSE)

The MIT License.
