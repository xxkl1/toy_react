import { promises as fs } from 'fs'
import * as path from 'path'

const isArray = function (o) {
    return Array.isArray(o)
}

const isObject = function (o) {
    return Object.prototype.toString.call(o) === '[object Object]'
}

const readFilesRecursively = function (folderPath) {
    return fs.readdir(folderPath)
      .then(files => {
        const promises = files.map(file => {
          const fullPath = path.join(folderPath, file)
          return fs.stat(fullPath)
            .then(stats => {
              if (stats.isDirectory()) {
                return readFilesRecursively(fullPath)
              } else {
                return fullPath;
              }
            })
            .catch(err => {
              console.error('Error getting file stats:', err);
              return null
            })
        })
        return Promise.all(promises)
          .then(pathsArray => pathsArray.flat())
      })
      .catch(err => {
        console.error('Error reading folder:', err);
        return []
      })
  }

const equals = (a, b) => {
    if (isArray(a) && isArray(b)) {
        if (a.length !== b.length) {
            return false
        }
        for (let i = 0; i < a.length; i++) {
            let a1 = a[i]
            let b1 = b[i]
            if (!equals(a1, b1)) {
                return false
            }
        }
        return true
    } else if (isObject(a) && isObject(b)) {
        let keys1 = Object.keys(a)
        let keys2 = Object.keys(b)
        if (keys1.length !== keys2.length) {
            return false
        }
        for (let i = 0; i < keys1.length; i++) {
            let k1 = keys1[i]
            let k2 = keys2[i]
            if (!equals(a[k1], b[k2])) {
                return false
            }
        }
        return true
    } else {
        return a === b
    }
}

export {
    isObject,
    equals,
    readFilesRecursively,
}
