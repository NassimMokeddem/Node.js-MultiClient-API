'use strict'

const path = require('path')

function helpSearch(searchfile, recherche) {
    searchfile = searchfile.map(filename => filename.replace('.html', ''))
    searchfile = searchfile.filter(filename => filename.includes(recherche))
    searchfile = searchfile.map(filename => filename + '.html')
    return searchfile
}

const assets = {
    image: path.resolve(__dirname, './dino.jpg'),
    styles: path.resolve(__dirname, './style.css'),
}

module.exports = {
    helpSearch,
    assets,
}