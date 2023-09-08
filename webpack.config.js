// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const {globSync, } = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProduction = process.env.NODE_ENV == 'production';


const stylesHandler = 'style-loader';

function htmlPlugins() {
    var plugins = [];
    for (const html of globSync('src/**/*.html')) {
        const in_ = String(html);
        const out = in_.replace(/^src[/\\]/i, '');
        plugins.push(new HtmlWebpackPlugin({
            template: in_,
            minify: false,
            filename: out,
        }));
        console.info(in_, out);
    }
    for (const html of globSync(['src/*.njk', 'src/decks/*.njk'])) {
        const in_ = String(html);
        const out = in_.replace(/^src[/\\]/i, '').replace(/\.njk$/i, '.html');
        plugins.push(new HtmlWebpackPlugin({
            template: in_,
            minify: false,
            filename: out,
        }));
        console.info(in_, out);
    }
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
    plugins: [
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'images',
                    to: 'images',
                }
            ]},
        ),
    ].concat([
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
            },
            {
                test: /\.njk$/,
                use: [{
                    loader: 'simple-nunjucks-loader',
                    options: {
                        searchPaths: [
                            'src/templates'
                        ],

                    }
                }]
            },
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
