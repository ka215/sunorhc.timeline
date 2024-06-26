// <reference types="vitest" />
import { defineConfig } from 'vite'
import * as path from 'path'
import basicSsl from '@vitejs/plugin-basic-ssl'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
    const isMain = mode === 'Timeline'

    return {
        define: {
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
                fileName: (format) => `SunorhcTimeline.${format}.js`
            },
            rollupOptions: {
                input: isMain
                    ? path.resolve(__dirname, 'src/main.ts')
                    : path.resolve(__dirname, 'src/tester/main.ts'),
                output: {
                    globals: {
                        pino: 'pino',
                    },
                    entryFileNames: isMain ? 'assets/js/sunorhc.timeline.js' : `assets/js/${mode}.js`,// `assets/js/[name].js`,
                    chunkFileNames: `assets/js/[name].js`,
                    assetFileNames: (assetInfo) => {
                        if (/\.(gif|jpe?g|png|svg|webp)$/.test(assetInfo.name!)) {
                            return `assets/images/[name].[ext]`
                        } else if (/\.css$/.test(assetInfo.name!)) {
                            return 'assets/css/sunorhc.timeline.[ext]'// `assets/css/[name].[ext]`
                        } else {
                            return `assets/[name].[ext]`
                        }
                    },
                    format: 'umd',
                    inlineDynamicImports: false,
                },
                external: (source, importer) => {
                    if (importer) {
                        //console.log(source, importer, isResolved)
                        if (importer.includes('src/main.ts')) {
                            return [
                                'pino',
                                path.resolve(__dirname, 'src/dispatcher.ts'),
                                path.resolve(__dirname, 'src/SunorhcTimelineTester.ts'),
                                path.resolve(__dirname, 'src/tester.ts'),
                                /tester/,
                            ].includes(source)
                        }
                        if (importer.includes('src/tester/main.ts')) {
                            return [
                                'pino',
                            ].includes(source)
                        }
                    }
                    return false
                },
            },
        },
        envDir: './',
        plugins: [
            basicSsl(),
            tsconfigPaths({
                root: './',
            }),
            /*
            {
                name: 'custom-build-plugin',
                closeBundle: async () => {
                }
            },*/
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
            ],
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
    }
})