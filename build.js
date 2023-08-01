import * as fs from 'fs'
import { readFilesRecursively } from './utils.js'
import { compile } from './compile/index.js'

const FileFormat = 'utf8'

const pathInputToOutput = function (path) {
    return path.replace('src', 'dist')
}

const checkDist = function () {
    const path = './dist'
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
    }
}

const buildSrc = function () {
  const path = './src'
  readFilesRecursively(path)
    .then(files => {
            files.forEach(file => {
                const data = fs.readFileSync(file, FileFormat)
                const r = compile(data)
                fs.writeFileSync(pathInputToOutput(file), r, FileFormat)
          })
    })
}

const main = function () {
    checkDist()
    buildSrc()
}

main()
