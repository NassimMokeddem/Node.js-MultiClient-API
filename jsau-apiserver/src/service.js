'use strict'
const fs = require('fs')
const express = require('express')
const morgan = require('morgan')
const {env} = require('node:process')
const app = express()

const {helpSearch} = require('@11922864/jsau-npmpackage')

app.use(morgan('dev'))

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
})

app.get('/info', (req, res) => {
    res.send('jsau-apiserver-1.0.0')
})

app.get('/search', (req, res) => {
    const recherche = req.query.text
    // async-promise-then
    fs.promises.readdir(env.JSAU_REPOSITORY_FILE_PATH)
        .then(filenames => {
            const searchfile = filenames.filter(filename => filename.includes('.html'))
            const newsearchfile = helpSearch(searchfile, recherche)
            // searchfile = searchfile.map(filename => filename.replace('.html', ''))
            // searchfile = searchfile.filter(filename => filename.includes(recherche))
            // searchfile = searchfile.map(filename => filename + '.html')
            if (newsearchfile.length > 0) {
                res.send(newsearchfile)
            } else {
                res.sendStatus(404)
            }
        })
        .catch((err) => {
            //console.error('Erreur lecture fichier html:', err)
            res.status(500).send(err)
        })
})

app.get('/documents/:html', (req, res) => {
    res.download(env.JSAU_REPOSITORY_FILE_PATH + '/' + req.params.html, (err) => {
        if (err) {
            res.status(404).send('Erreur : Fichier non trouvé')
        }
    })
})

app.get('/list', (req, res) => {
    res.download(env.JSAU_REPOSITORY_FILE_PATH + '/' + req.params.html, (err) => {
        if (err) {
            res.status(404).send('Erreur : Fichier non trouvé')
        }
    })
})

app.post('/add/:html', (req, res) => {
    //console.log(fs.existsSync((env.JSAU_REPOSITORY_FILE_PATH + '/' + req.params.html)))
    if (fs.existsSync(env.JSAU_REPOSITORY_FILE_PATH + '/' + req.params.html) && req.params.html.endsWith('.html')) {
        try {
            if (!fs.existsSync(env.JSAU_REPOSITORY_FILE_PATH + '/bookmarks.json')) {
                fs.writeFileSync(env.JSAU_REPOSITORY_FILE_PATH + '/bookmarks.json', '[]')
            }
            // async-callback
            fs.readFile(env.JSAU_REPOSITORY_FILE_PATH + '/bookmarks.json', (err, data) => {
                if (err) {
                    //console.error('Erreur de lecture du fichier:', err)
                } else {
                    try {
                        const jsonData = JSON.parse(data)

                        if (jsonData.includes(req.params.html)) {
                            res.send('Bookmark déja présent')
                        } else {
                            jsonData.push(req.params.html)
                            fs.writeFileSync(env.JSAU_REPOSITORY_FILE_PATH + '/bookmarks.json', JSON.stringify(jsonData, null, 2), (erro) => {
                                if (erro) {
                                    //console.error('Erreur de sauvegarde du fichier:', err)
                                } else {
                                    //console.log('Objet ajouté avec succès.')
                                }
                            })
                            res.send('Bookmark ajouté avec succés')
                        }
                    } catch {
                        //console.error('Fichier json invalide', erri)
                    }
                }
            })
        } catch {
            //console.log(data.length)
        }
    } else {
        res.status(404).send('Erreur : Fichier non trouvé')
    }
})

app.delete('/remove/:html', (req, res) => {
    if (fs.existsSync(env.JSAU_REPOSITORY_FILE_PATH + '/' + req.params.html)) {
        if (!fs.existsSync(env.JSAU_REPOSITORY_FILE_PATH + '/bookmarks.json')) {
            fs.writeFileSync(env.JSAU_REPOSITORY_FILE_PATH + '/bookmarks.json', '[]', 'utf8')
        }
        try {
            // async-promise-async-await
            (async() => {
                try {
                    const data = await fs.promises.readFile(env.JSAU_REPOSITORY_FILE_PATH + '/bookmarks.json')
                    const jsonData = JSON.parse(data)
                    if (!jsonData.includes(req.params.html)) {
                        res.status(404).send(`"${req.params.html}" n'est pas dans les bookmarks`)
                    } else {
                        await fs.promises.writeFile(env.JSAU_REPOSITORY_FILE_PATH + '/bookmarks.json', JSON.stringify(jsonData.filter(html => html !== req.params.html)))
                        res.send(`"${req.params.html}" a été supprimé`)
                    }
                } catch {
                    res.status(404).send('Erreur : Bookmark non présent')
                }
            })()
        } catch {
            //console.log(data.length)
        }
    } else {
        res.status(404).send('Erreur : Fichier non trouvé')
    }
})

module.exports = app