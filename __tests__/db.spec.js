const fs = require('fs')
const db = require('../db')

jest.mock('fs')

describe('db', () => {

    afterEach(() => {
        fs.clearMocks()
    })

    it('can read', async () => {
        const data = [{ title: 'hi', done: true }]
        fs.setReadMocks('/xxx', null, JSON.stringify(data))
        const result = await db.read('/xxx')
        expect(result).toStrictEqual(data)

        fs.setReadMocks('/aaa', null, '')
        const result2 = await db.read('/aaa')
        expect(result2).toStrictEqual([])
    })

    it('can write', async () => {
        let fakeFile
        fs.setWriteMocks('/yyy', (path, data, callback) => {
            fakeFile = data
            callback()
        })
        const data = [{ title: 'hi', done: true }]
        await db.write(data, '/yyy')
        expect(fakeFile).toBe(JSON.stringify(data))

        let fakeFile2
        fs.setWriteMocks('/zzz', (path, data, callback) => {
            fakeFile2 = data
            callback()
        })
        await db.write('', '/zzz')
        expect(fakeFile2).toBe('')
    })
})
