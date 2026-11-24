'use strict'
const supertest = require('supertest')
const app = require('../src/service')
const fs = require('fs')

describe('GET /info', () => {
    it('should return the API version', async() => {
        const response = await supertest(app).get('/info')
        expect(response.status).toBe(200)
        expect(response.text).toBe('jsau-apiserver-1.0.0')
    })
})

jest.mock('fs', () => ({
    promises: {
        readdir: jest.fn(),
    },
    existsSync: jest.fn(),
    writeFileSync: jest.fn(),
    readFile: jest.fn((path, cb) => cb(null, '[]')),
}))

describe('GET /search', () => {
    it('should return the filtered list of files', async() => {
        const mockFiles = ['file1.html', 'file2.html', 'otherfile.txt']
        await fs.promises.readdir.mockResolvedValue(mockFiles)

        const response = await supertest(app).get('/search?text=file')
        expect(response.status).toBe(200)
        expect(response.body).toEqual(['file1.html', 'file2.html'])
    })

    it('should return 404 if no matching files are found', async() => {
        await fs.promises.readdir.mockResolvedValue(['unrelatedfile.txt'])

        const response = await supertest(app).get('/search?text=nomatch')
        expect(response.status).toBe(404)
    })
})

describe('POST /add/:html', () => {
    it('should add a bookmark successfully', async() => {
        fs.existsSync.mockReturnValue(true)

        const response = await supertest(app).post('/add/test.html')
        expect(response.status).toBe(200)
        expect(response.text).toBe('Bookmark ajouté avec succés')
    })

    it('should return 404 if the file does not exist', async() => {
        fs.existsSync.mockReturnValue(false)

        const response = await supertest(app).post('/add/nonexistent.html')
        expect(response.status).toBe(404)
    })
})

describe('DELETE /remove/:html', () => {
    it('should remove a bookmark successfully', async() => {
        fs.existsSync.mockReturnValue(true)
        fs.promises.readFile = jest.fn().mockResolvedValue(JSON.stringify(['test.html']))
        fs.promises.writeFile = jest.fn().mockResolvedValue()

        const response = await supertest(app).delete('/remove/test.html')
        expect(response.status).toBe(200)
        expect(response.text).toBe('"test.html" a été supprimé')
    })

    it('should return 404 if the file does not exist in bookmarks', async() => {
        fs.existsSync.mockReturnValue(true)
        fs.promises.readFile = jest.fn().mockResolvedValue(JSON.stringify([]))

        const response = await supertest(app).delete('/remove/test.html')
        expect(response.status).toBe(404)
    })
})