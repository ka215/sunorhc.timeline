// <reference types="vitest" />
import { defineConfig } from 'vite'
import * as path from 'path'
import basicSsl from '@vitejs/plugin-basic-ssl'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    define: {
        //__DEV__: mode === 'development',
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    },
    root: '',
    base: '/',
    publicDir: 'public',
    build: {
        outDir: './dist',
        emptyOutDir: true,
        manifest: true,
        lib: {
            entry: path.resolve(__dirname, 'src/main.ts'),
            name: 'Sunorhc',
            formats: ['es', 'umd'],
            fileName: (format) => `SunorhcTimeline.${format}.js`
        },
        rollupOptions: {
            external: [
                'pino',
                path.resolve(__dirname, 'src/dispatcher.ts'),
                path.resolve(__dirname, 'src/SunorhcTimelineTester.ts'),
                path.resolve(__dirname, 'src/tester.ts'),
                /^.+(dispatcher|SunorhcTimelineTester|tester)\.ts$/,
                /test/,
            ],
            //input: [ 'src/index.html', ],
            output: {
                globals: {
                    pino: 'pino',
                },
                entryFileNames: `assets/js/[name].js`,
                chunkFileNames: `assets/js/[name].js`,
                assetFileNames: (assetInfo) => {
                    if (/\.(gif|jpe?g|png|svg|webp)$/.test(assetInfo.name!)) {
                        return `assets/images/[name].[ext]`
                    } else if (/\.css$/.test(assetInfo.name!)) {
                        return `assets/css/[name].[ext]`
                    } else {
                        return `assets/[name].[ext]`
                    }
                },
            },
        },
    },
    envDir: './',
    plugins: [
        basicSsl(),
        tsconfigPaths({
            root: './',
        }),
    ],
    css: {
        postcss: './postcss.config.cjs'
    },
    test: {
        globals: true,
        environment: 'happy-dom',
        setupFiles: ['./vitest.setup.ts'],// for using jest-dom
        include: [
            'test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
            //'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
        ],
        //exclude: ['test/**/_*'],
        coverage: {
            provider: 'v8',// or 'istanbul'
            reporter: ['text', 'json', 'html'],
            reportsDirectory: 'docs/coverage',
            exclude: [
                'docs/**/*',
                'mock/**/*',
                'public/**/*',
                'src/**/_*',
                'postcss.config.cjs',
            ],
            all: true,
        },
    }
})