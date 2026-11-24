'use strict'

const {helpSearch} = require('../src/main')

describe('helpSearch', () => {
    it('devrait renvoyer les fichiers correspondants à la recherche', () => {
        const searchfile = ['page1.html', 'page2.html', 'test.html']
        const recherche = 'page'

        const result = helpSearch(searchfile, recherche)

        expect(result).toEqual(['page1.html', 'page2.html'])
    })

    it('devrait renvoyer un tableau vide si aucune correspondance n\'est trouvée', () => {
        const searchfile = ['page1.html', 'page2.html', 'test.html']
        const recherche = 'nonexistent'

        const result = helpSearch(searchfile, recherche)

        expect(result).toEqual([])
    })

    it('devrait renvoyer un tableau contenant tous les fichiers si la recherche est vide', () => {
        const searchfile = ['page1.html', 'page2.html', 'test.html']
        const recherche = ''

        const result = helpSearch(searchfile, recherche)

        expect(result).toEqual(['page1.html', 'page2.html', 'test.html'])
    })

    it('devrait ne pas modifier les extensions des fichiers après la recherche', () => {
        const searchfile = ['about.html', 'contact.html', 'home.html']
        const recherche = 'cont'

        const result = helpSearch(searchfile, recherche)

        expect(result).toEqual(['contact.html'])
    })
})