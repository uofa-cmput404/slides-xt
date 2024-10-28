import vituum from 'vituum'
import nunjucks from '@vituum/vite-plugin-nunjucks'
import Inspect from 'vite-plugin-inspect'

import {prexample} from './src/scripts/prexample.js'
import assetListPlugin from './assetListPlugin.js'



export default {
    clearScreen: false,
    // base: 'https://uofa-cmput404.github.io/slides-xt/',
    base: '/slides-xt/',
    // base: './',
    build: {
        minify: false,
        rollupOptions: {
            output: {
                preserveModules: true,
                compact: false,
                minifyInternalExports: false,
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name.endsWith('sw.js')) {
                        return '[name]-[hash].[ext]';
                    } else {
                        return 'assets/[name]-[hash].[ext]';
                    }
                },
            },
            preserveEntrySignatures: "exports-only",
        },
        sourcemap: true,
        target: 'esnext',
        assetsInlineLimit: 0,
        modulePreload: {
            polyfill: false,
        },
    },
    preview: {
        host: "0.0.0.0",
        https: {
            ciphers: 'ALL:COMPLEMENTOFALL',
            cert: "./cert.pem",
            key: "./key.pem",
        },
    },
    optimizeDeps: {
        noDiscovery: true,
        include: undefined,
    },
    plugins: [
        vituum({
            pages: {
                normalizeBasePath: true,
            }
        }),
        nunjucks({
            root: './src',
            filters: {
                prexample
            },
            options: {
                autoescape: true,
            }
        }),
        assetListPlugin({
            file: '/sw.js'
        }),
        Inspect(),
    ]
}