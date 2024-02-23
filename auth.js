const crypto = require('crypto')
const mongoose = require('mongoose')

const User = new mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    roles: { type: [ Number ] }
}, { versionKey: false }))

const makeHash = password => {
    return crypto.createHash('sha256').update(password).digest('base64')
}

User.findOne({ username: 'admin' })
.then(user => {
    if(!user) {
        const admin = new User({ username: 'admin', password: makeHash('admin'), roles: [ 0 ] })
        admin.save()
    }
})
.catch(err => {
    console.error(err.message)
    process.exit(0)
})

User.findOne({ username: 'user' })
.then(user => {
    if(!user) {
        const admin = new User({ username: 'user', password: makeHash('user'), roles: [ 1 ] })
        admin.save()
    }
})
.catch(err => {
    console.error(err.message)
    process.exit(0)
})

const auth = module.exports = {

    makeHash,

    checkCredentials: (username, password, nextTick) => {
        User.findOne({ username, password: auth.makeHash(password) })
        .then(user => {
            nextTick(null, user || false)
        })
        .catch(err => {
            nextTick(null, false)
        })
    },

    checkIfInRole: roleNums => (req, res, nextTick) => {
        let intersection = []
        if(roleNums == null) {
            intersection.push(-1)
        } else {
            roleNums.forEach(roleNum => {
                if(req.user && req.user.roles && req.user.roles.includes(roleNum)) {
                    intersection.push(roleNum)
                }
            })
        }
        if(!req.isAuthenticated()) {
            res.status(401).json({ error: 'Unauthorized' })
        } else if(intersection.length > 0) {
            return nextTick()
        } else {
            res.status(403).json({ error: 'Permission denied' })
        }
    },

    serialize: (user, nextTick) => {
        nextTick(null, user.username)
    },

    deserialize: (username, nextTick) => {
        User.findOne({ username })
        .then(user => {
            if(user) {
                return nextTick(null, user)
            } else {
                return nextTick('No such user', null)
            }
        })
        .catch(err => { error: err.message })
    },

    login: (req, res) => auth.whoami(req, res),

    logout: (req, res) => req.logout(() => auth.whoami(req, res) ),

    whoami: (req, res) => {
        req.session.roles = req.user ? req.user.roles : []
        req.session.save()
        let data = { sessionid: req.session.id }
        if(req.user) {
            data.username = req.user.username
            data.roles = req.user.roles
        }
        res.json(data)
    },

    errorHandler: (err, req, res, nextTick) => res.status(401).json({ error: err.message })
}