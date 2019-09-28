# Micro APP Plugin - Webpack-Hard-Source

[Plugin] adapter webpack plugin of hard-source.

适配集成 webpack 插件 hard-source 配置. 用于 `@micro-app/core`.

[![Coverage Status][Coverage-img]][Coverage-url]
[![CircleCI][CircleCI-img]][CircleCI-url]
[![NPM Version][npm-img]][npm-url]
[![NPM Download][download-img]][download-url]

[Coverage-img]: https://coveralls.io/repos/github/MicrosApp/MicroApp-Plugin-Webpack-Hard-Source/badge.svg?branch=master
[Coverage-url]: https://coveralls.io/github/MicrosApp/MicroApp-Plugin-Webpack-Hard-Source?branch=master
[CircleCI-img]: https://circleci.com/gh/MicrosApp/MicroApp-Plugin-Webpack-Hard-Source/tree/master.svg?style=svg
[CircleCI-url]: https://circleci.com/gh/MicrosApp/MicroApp-Plugin-Webpack-Hard-Source/tree/master
[npm-img]: https://img.shields.io/npm/v/@micro-app/plugin-webpack-hard-source.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@micro-app/plugin-webpack-hard-source
[download-img]: https://img.shields.io/npm/dm/@micro-app/plugin-webpack-hard-source.svg?style=flat-square
[download-url]: https://npmjs.org/package/@micro-app/plugin-webpack-hard-source

## Install

```sh
yarn add @micro-app/plugin-webpack-hard-source
```

or

```sh
npm install -S @micro-app/plugin-webpack-hard-source
```

## Usage

### 在项目 `根目录` 的 `micro-app.config.js` 文件中配置

```js
module.exports = {
    // ...

    plugins: [ // 自定义插件
        [ '@micro-app/plugin-webpack-hard-source', {
            // default config
            {
                // Either an absolute path or relative to webpack's options.context.
                cacheDirectory: 'node_modules/.cache/hard-source/[confighash]',
                // Either a string of object hash function given a webpack config.
                configHash: function(webpackConfig) {
                    // node-object-hash on npm can be used to build this.
                    return require('node-object-hash')({sort: false}).hash(webpackConfig);
                },
                // Either false, a string, an object, or a project hashing function.
                environmentHash: {
                    root: process.cwd(),
                    directories: [],
                    files: ['package-lock.json', 'yarn.lock'],
                },
                // An object.
                info: {
                    // 'none' or 'test'.
                    mode: 'none',
                    // 'debug', 'log', 'info', 'warn', or 'error'.
                    level: 'debug',
                },
                // Clean up large, old caches automatically.
                cachePrune: {
                    // Caches younger than `maxAge` are not considered for deletion. They must
                    // be at least this (default: 2 days) old in milliseconds.
                    maxAge: 2 * 24 * 60 * 60 * 1000,
                    // All caches together must be larger than `sizeThreshold` before any
                    // caches will be deleted. Together they must be at least this
                    // (default: 50 MB) big in bytes.
                    sizeThreshold: 50 * 1024 * 1024
                },

                // new options
                filterError: [
                    /ReplaceDependency/i,
                ],
                excludeModule: false,
            }
        } ],
    ],
};
```
