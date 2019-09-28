'use strict';

/* global expect */

const path = require('path');

describe('Plugin WebpackHardSource', () => {

    it('WebpackHardSource', () => {
        const { service } = require('@micro-app/cli/bin/base');
        service.registerPlugin({
            id: '@micro-app/plugin-webpack-adapter',
        });
        service.registerPlugin({
            id: 'test:WebpackHardSource',
            link: path.join(__dirname, './index.js'),
        });

        service.run('help', { _: [] });
    });

});
