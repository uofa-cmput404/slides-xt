import vituum from 'vituum'
import nunjucks from '@vituum/vite-plugin-nunjucks'
import {prexample} from './src/scripts/prexample.js'

export default {
    base: './',
    build: {
        minify: false,
        rollupOptions: {
            output: {
                preserveModules: true,
            },
            preserveEntrySignatures: "exports-only",
        }
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
        })
    ]
}