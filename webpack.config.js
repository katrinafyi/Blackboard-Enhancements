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

module.exports = {
    entry: scriptRoot + '/src/' + scriptName+scriptExt,
    output: {
        filename: scriptName + scriptExt,
        path: path.resolve(scriptRoot, 'dist')
    },
    mode: 'none',
    devtool: 'source-map',
    plugins: [
        new webpack.BannerPlugin({
            raw: true,
            banner: userscriptHeader,
            entryOnly: true
        })],
    externals: {
        'jquery': 'jQuery',
        'lodash': '_',
        'gm_config': 'GM_configStruct',
        'fuse.js': 'Fuse',
        'lz-string': 'LZString',
        'featherlight': 'jQuery.featherlight',
    }
};