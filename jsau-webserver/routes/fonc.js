'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const {env} = require('node:process')

/* eslint-disable-next-line new-cap */
const router = express.Router()

router.use(bodyParser.urlencoded({extended: false}))

const methodOverride = require('method-override')

router.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
})

router.use(methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        const method = req.body._method
        delete req.body._method
        return method
    }
}))

//router.use(express.static(path.join(__dirname, 'dist')));

router.get('/', (req, res) => {
    res.render('fonc', {title: 'Accueil JSau Webserver'})
})

router.get('/search', (req, res) => {
    const recherche = req.query.text
    fs.promises.readdir(env.JSAU_REPOSITORY_FILE_PATH)
        .then(filenames => {
            const searchfile = filenames
                .filter(filename => filename.includes('.html'))
                .map(filename => filename.replace('.html', ''))
                .filter(filename => filename.includes(recherche))
                .map(filename => filename + '.html')
            if (searchfile.length > 0) {
                res.render('fonc', {title: searchfile})
            } else {
                res.status(404).render('fonc', {title: 'Aucun fichier trouvé.'})
            }
        })
        .catch(() => res.status(500).render('error', {message: 'Erreur interne du serveur.'}))
})

router.get('/documents', (req, res) => {
    const filePath = path.join(env.JSAU_REPOSITORY_FILE_PATH, req.query.html)
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).render('fonc', {title: 'Fichier .html non trouvé.'})
        }
    })
})

router.post('/add', (req, res) => {
    const {html} = req.body
    const filePath = path.join(env.JSAU_REPOSITORY_FILE_PATH, html)
    if (fs.existsSync(filePath) && html.endsWith('.html')) {
        const bookmarksPath = path.join(env.JSAU_REPOSITORY_FILE_PATH, 'bookmarks.json')
        let bookmarks = []
        if (fs.existsSync(bookmarksPath)) {
            bookmarks = JSON.parse(fs.readFileSync(bookmarksPath))
        }
        if (bookmarks.includes(html)) {
            res.render('fonc', {title: 'Bookmark déjà présent.'})
        } else {
            bookmarks.push(html)
            fs.writeFileSync(bookmarksPath, JSON.stringify(bookmarks, null, 2))
            res.render('fonc', {title: 'Bookmark ajouté avec succès.'})
        }
    } else {
        res.status(404).render('fonc', {title: 'Fichier non trouvé.'})
    }
})

router.delete('/remove', (req, res) => {
    const {html} = req.body
    const bookmarksPath = path.join(env.JSAU_REPOSITORY_FILE_PATH, 'bookmarks.json')
    if (fs.existsSync(bookmarksPath)) {
        const bookmarks = JSON.parse(fs.readFileSync(bookmarksPath))
        if (bookmarks.includes(html)) {
            const updatedBookmarks = bookmarks.filter(item => item !== html)
            fs.writeFileSync(bookmarksPath, JSON.stringify(updatedBookmarks, null, 2))
            res.render('fonc', {title: `"${html}" a été supprimé des bookmarks.`})
        } else {
            res.status(404).render('fonc', {title: `"${html}" n'est pas dans les bookmarks.`})
        }
    } else {
        res.status(404).render('fonc', {title: 'Aucun bookmark trouvé.'})
    }
})

module.exports = router
