// decaration of use internal modules
const fs = require('fs')

// importing foreign modules
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const expressSession = require('express-session')
const passport = require('passport')
const passportJson = require('passport-json')
const expressWs = require('express-ws')
const fileUpload = require('express-fileupload')

// importing own modules
const auth = require('./auth')
const websocket = require('./websocket')
const person = require('./person')
const project = require('./project')

let config = {}
try {
    config = JSON.parse(fs.readFileSync('config.json'))
} catch(err) {
    console.error(err.message)
    process.exit(0)
}

const app = express()

app.use(morgan('tiny'))
app.use(cors())

app.use(bodyParser.json())
app.use((err, req, res, next) => {
    res.status(400).json({ error: err.message })
})

// authorization middleware
app.use(expressSession({ secret: config.dbUrl, resave: false , saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportJson.Strategy(auth.checkCredentials))
passport.serializeUser(auth.serialize)
passport.deserializeUser(auth.deserialize)

// file upload
app.use(fileUpload())
app.post('/files', auth.checkIfInRole([ 0, 1 ]), (req, res) => {
    let { image } = req.files
    if(!image || !/^image/.test(image.mimetype)) {
        res.sendStatus(400)
        return
    }
    image.mv('./frontend/dist/uploads/' + req.user.username + '.jpg')
    res.sendStatus(200)
})
app.delete('/files', (req, res) => {
    res.sendStatus(200)
})

app.use(express.static(config.frontend))

// authentication endpoints
app.get('/auth', auth.whoami)
app.post('/auth', passport.authenticate('json', { failWithError: true }), auth.login, auth.errorHandler)
app.delete('/auth', auth.logout)

app.get('/person', auth.checkIfInRole([ 0, 1 ]), person.get)
app.post('/person', auth.checkIfInRole([ 1 ]), person.post)
app.put('/person', auth.checkIfInRole([ 1 ]), person.put)
app.delete('/person', auth.checkIfInRole([ 1 ]), person.delete)

app.get('/project', project.get)
app.post('/project', auth.checkIfInRole([ 1 ]), project.post)
app.put('/project', auth.checkIfInRole([ 1 ]), project.put)
app.delete('/project', auth.checkIfInRole([ 1 ]), project.delete)

// websockets handling
const wsInstance = expressWs(app)
app.ws('/websocket', websocket(wsInstance))

mongoose.connect(config.dbUrl)
.then(connection => {
    console.log('Database connected')
    // initialize models over the connection
    person.init(connection)
    project.init(connection)

    app.listen(config.port, () => {
        console.log('Backend listening on port', config.port)
    })
})
.catch(err => console.error(err.message))