const fs = require('fs')
const path = require('path')
const homedir = require('os').homedir()

const home = process.env.HOME || homedir
const dbPath = path.join(home, '.todo')

const db = {
    read () {
        return new Promise((resolve, reject) => {
            fs.readFile(dbPath, { flag: 'a+' }, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    data = data.toString()
                    try {
                        data = JSON.parse(data)
                    } catch (e) {
                        data = []
                    }
                    resolve(data)
                }
            })
        })
    },
    write (data) {
        data = data ? JSON.stringify(data) : data
        return new Promise((resolve, reject) => {
            fs.writeFile(dbPath, data, err => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }
}

module.exports = db
