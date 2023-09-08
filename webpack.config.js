// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

const isProduction = process.env.NODE_ENV == 'production';


const stylesHandler = 'style-loader';

function htmlPlugins() {
    var plugins = [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            minify: false,
            filename: 'index.html',
        }),
    ];
    return plugins;
}

const config = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        assetModuleFilename: '[file]',
    },
    devServer: {
        open: true,
        host: 'localhost',
    },
    plugins: [].concat([
        

        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ], htmlPlugins()),
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: [stylesHandler,'css-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
            {
                test: /.nojekyll/,
                type: 'asset/resource',
                generator: {
                    filename: '[base]',
                },
            }
            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    optimization: {
        minimize: false,
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        
        
        config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
        
    } else {
        config.mode = 'development';
    }
    return config;
};
