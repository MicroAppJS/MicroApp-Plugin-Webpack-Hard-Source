'use strict';

const defaultOpts = {
    filterError: [
        /ReplaceDependency/i,
    ],
    excludeModule: false,
};

module.exports = function WebpackHardSource(api, opts = {}) {

    api.assertVersion('>=0.1.7');

    // commands
    require('./commands/version')(api);

    const path = require('path');

    const logger = api.logger;
    const root = api.root; // 主容器根目录
    const microsConfig = api.microsConfig; // 各模块配置

    opts = Object.assign({}, defaultOpts, opts);
    logger.debug(`[WebpackHardSource] opts: \n${JSON.stringify(opts, false, 4)}`);

    const filterError = opts.filterError ? (Array.isArray(opts.filterError) ? opts.filterError : [ opts.filterError ]) : false;
    logger.debug(`[WebpackHardSource] filterError: \n${JSON.stringify(filterError, false, 4)}`);

    const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
    if (filterError) {
        const logMessages = require('hard-source-webpack-plugin/lib/util/log-messages');
        const _oldModuleFreezeError = logMessages.moduleFreezeError;
        logMessages.moduleFreezeError = function(compilation, module, e) {
            if (e && filterError.some(item => {
                if (item instanceof RegExp) {
                    return item.test(e.message);
                }
                return e.message.includes(item);
            })) {
                return;
            }
            return _oldModuleFreezeError.call(this, compilation, module, e);
        };
    }

    const excludeModule = opts.excludeModule || false;
    logger.debug(`[WebpackHardSource] excludeModule: \n${JSON.stringify(excludeModule, false, 4)}`);

    // 修改 webpack 配置, 此修改会对所有模块进行使用.
    api.modifyChainWebpcakConfig(webpackChainConfig => {

        webpackChainConfig.plugin('hard-source')
            .use(HardSourceWebpackPlugin, [
                Object.assign({
                    environmentHash: {
                        root,
                        directories: Object.keys(microsConfig).reduce((arrs, key) => {
                            const item = microsConfig[key];
                            if (item.hasSoftLink && !!api.microsExtraConfig[key].link) {
                                return arrs.concat([ 'node_modules' ].map(file => {
                                    return path.relative(root, path.resolve(item.root, file));
                                }));
                            }
                            return arrs;
                        }, [ 'node_modules' ]),
                        files: Object.keys(microsConfig).reduce((arrs, key) => {
                            const item = microsConfig[key];
                            if (item.hasSoftLink && !!api.microsExtraConfig[key].link) {
                                return arrs.concat([ 'package.json' ].map(file => {
                                    return path.relative(root, path.resolve(item.root, file));
                                }));
                            }
                            return arrs;
                        }, [ 'package-lock.json', 'yarn.lock', 'package.json', 'micro-app.config.js', 'micro-app.extra.config.js' ]),
                    },
                }, opts),
            ])
            .end();

        if (excludeModule) {
            webpackChainConfig.plugin('hard-source-exclude-module')
                .use(HardSourceWebpackPlugin.ExcludeModulePlugin, [ excludeModule ])
                .end();
        }

        return webpackChainConfig; // 一定要返回
    });

};

module.exports.configuration = {
    description: '适配集成 webpack 插件 hard-source 配置.',
};
