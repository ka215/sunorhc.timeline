const { rimrafSync } = require('rimraf')
const { spawn } = require('cross-spawn')
const fs   = require('fs').promises
const path = require('path')

const outputDir = path.join('dists', '')

const cleanOutputDir = () => {
    console.log(`Cleaning output directory: ${outputDir}`)
    rimrafSync(outputDir + '/*', { glob: true })
}

const spawnPromise = (command, args) => {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args, { stdio: 'inherit' })

        process.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(`Process exited with code ${code}`))
            }
            resolve()
        })

        process.on('error', (err) => {
            reject(err)
        })
    })
}

const copyDirectory = async (source, destination) => {
    await fs.mkdir(destination, { recursive: true })
    const entries = await fs.readdir(source, { withFileTypes: true })

    for (const entry of entries) {
        const srcPath  = path.join(source, entry.name)
        const destPath = path.join(destination, entry.name)

        if (entry.isDirectory()) {
            await copyDirectory(srcPath, destPath)
        } else {
            await fs.copyFile(srcPath, destPath)
        }
    }
}

const runBuild = async () => {
    try {
        console.log('Running build...')
        await spawnPromise('pnpm', ['vite', 'build', '--mode', 'Timeline'])
        console.log('Copying Timeline build to distribution directory...')
        await copyDirectory('dist/assets', 'dists')

        console.log('Running build:tester...')
        await spawnPromise('pnpm', ['vite', 'build', '--mode', 'Tester'])
        console.log('Copying Tester build to distribution directory...')
        await copyDirectory('dist/assets', 'dists')

        console.log('Build process completed successfully.')
    } catch (error) {
        console.error(`Build process failed: ${error.message}`)
    } finally {
        console.log('Completed all.')
    }
}

cleanOutputDir()
runBuild()