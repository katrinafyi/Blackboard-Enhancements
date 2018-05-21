const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

let scriptRoot = '.';
let scriptName = 'blackboard_search';
let scriptExt = '.user.js';

const scriptFile = fs.readFileSync(scriptRoot + '/src/' + scriptName+scriptExt, 'utf8');
let userscriptHeader = '';
for (const line of scriptFile.split('\n')) {
    console.log(line);
    if (!line.startsWith('//'))
        break;
    userscriptHeader += line + '\n';
}

module.exports = function (env) {
    let debug = env.production !== true;
    let version = require('./package.json').version;

    return {
        entry: scriptRoot + '/src/' + scriptName+scriptExt,
        output: {
            filename: scriptName + (debug?'.dev':'') + scriptExt,
            path: path.resolve(scriptRoot, 'dist')
        },
        mode: 'none',
        devtool: (debug?'cheap-module-eval-source-map':'source-map'),
        plugins: [
            new webpack.DefinePlugin({
                DEBUG: JSON.stringify(debug),
                VERSION: JSON.stringify(version),
            }),
            new webpack.BannerPlugin({
                raw: true,
                banner: userscriptHeader.replace(/VERSION/g, version),
                entryOnly: true
            })
        ],
        externals: {
            'jquery': 'jQuery',
            'lodash': '_',
            'gm_config': 'GM_configStruct',
            'fuse.js': 'Fuse',
            'lz-string': 'LZString',
            'featherlight': 'jQuery.featherlight',
        }
    };
};