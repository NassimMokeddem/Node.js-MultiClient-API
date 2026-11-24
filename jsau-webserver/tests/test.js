'use strict'

const supertest = require('supertest')
const app = require('../app')

describe('GET /', () => {
    it('should send home page', async() => {
        const response = await supertest(app).get('/')
        expect(response.status).toBe(200)
        expect(response.text).toContain('Accueil JSau Webserver')
    })
})
