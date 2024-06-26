const fs   = require('fs')
const zlib = require('zlib')
const path = require('path')

const gzipFolder = (folderPath) => {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err)
            return
        }

        files.forEach((file) => {
            console.log(`Start compressing ${file}...`)
            const filePath = path.join(folderPath, file)
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Error statting file:', err)
                    return
                }

                if (stats.isFile()) {
                    gzipFile(filePath)
                } else if (stats.isDirectory()) {
                    gzipFolder(filePath)
                }
            })
        })
    })
}

const gzipFile = (filePath) => {
    const gzip = zlib.createGzip()
    const input = fs.createReadStream(filePath)
    const output = fs.createWriteStream(filePath + '.gz')

    input.pipe(gzip).pipe(output)

    output.on('finish', () => {
        console.log(`File ${filePath} compressed successfully.`)
    })

    output.on('error', err => {
        console.error(`Error compressing file ${filePath}:`, err)
    })
}

console.log('Compressing built files...')
gzipFolder('dists')