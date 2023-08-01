import * as http from 'http'
import * as fs from 'fs'

const Port = 3000

const getFileByUrl = function (url) {
    if (url === '/') {
        return {
            path: './index.html',
            contentType: 'text/html',
        }
    }
    return {
        path: `.${url}`,
        contentType: 'text/javascript',
    }
}

const createServer = function () {
    const server = http.createServer((req, res) => {
        const {
            path,
            contentType,
        } = getFileByUrl(req.url)

        fs.readFile(path, (err, data) => {
            if (!err) {
                res.statusCode = 200
                res.setHeader('Content-Type', contentType)
                res.end(data)
            }
            res.statusCode = 500
        })
    })
    server.listen(Port)
}

const main = function () {
    createServer()
    console.log(`run server at http://localhost:${Port}`)
}

main()
