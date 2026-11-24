'use strict'

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const {assets} = require('@11922864/jsau-npmpackage')
const infoRouter = require('./routes/fonc')
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, '@11922864/jsau-npmpackage')))

app.use('/', infoRouter)

app.use('/assets', express.static(path.join(assets.image), {
    setHeaders: (res) => {

    }
}))

app.use('/css', express.static(path.join(assets.styles), {
    setHeaders: (res) => {

    }
}))
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app
