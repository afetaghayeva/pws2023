const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true, transform: v => v.toISOString().slice(0, 10) },
    education: { type: Number, required: false, enum: [ 0, 1, 2 ], default: 0 },
    projects: { type: [ mongoose.ObjectId ], required: false, default: [] }
}, {
    versionKey: false,
    additionalProperties: false
})

let model = null

module.exports = {

    getSchema: () => schema,
    getModel: () => model,

    init: connection => {
        model = connection.model('Person', schema)
        return model
    },

    get: (req, res) => {
        const _id = req.query._id
        if(_id) {
            model.findOne({ _id })
            .then(data => {
                if(data) {
                    res.json(data)
                } else {
                    res.status(404).json({ error: 'No such object' })
                }
            })
            .catch(err => {
                res.status(408).json({ error: err.message })
            })
        } else {
            let aggregation = [
                { $sort: { lastName: 1, firstName: 1 }},
                { $match: { $or: [
                    { firstName: { $regex: new RegExp(req.query.search, 'i') } },
                    { lastName: { $regex: new RegExp(req.query.search, 'i') } }
                ]}}
            ]
            try {
                let education = JSON.parse(req.query.education)
                if(Array.isArray(education)) {
                    aggregation.push({ $match: { education: { $in: education } } })    
                }
            } catch(err) {}
            try {
                let minProjectsCount = JSON.parse(req.query.minProjects)
                if(minProjectsCount > 0) {
                    aggregation.push({ $match: { projects: { $exists: true }}})
                    aggregation.push({ $set: { projectsCount: { $size: '$projects' }}})
                    aggregation.push({ $match: { projectsCount: { $gte: minProjectsCount }}})
                    aggregation.push({ $sort: { projectsCount: -1 }})
                }
            } catch(ex) {}
            aggregation.push({ $skip: parseInt(req.query.skip) || 0 })
            aggregation.push({ $limit: parseInt(req.query.limit) || 10 })
            aggregation.push({ $lookup: {
                from: 'projects',
                localField: 'projects',
                foreignField: '_id',
                as: 'projects',
                pipeline: [
                    { $sort: { name: 1 }}
                ]
            }})
            model.aggregate(aggregation)
            .then(data => {
                res.json(data)
            })
            .catch(err => {
                res.status(408).json({ error: err.message })
            })
        }
    },

    post: (req, res) => {
        const instance = new model(req.body)
        instance.save()
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            res.status(406).json({ error: err.message })
        })    
    },

    put: (req, res) => {
        const _id = req.query._id
        model.findOneAndUpdate({ _id }, req.body, { new: true, runValidators: true })
        .then(updated => {
            if(updated) {
                res.json(updated)
            } else {
                res.status(404).json({ error: 'No such object' })
            }
        })
        .catch(err => {
            res.status(406).json({ error: err.message })
        })    
    },

    delete: (req, res) => {
        const _id = req.query._id
        model.findOneAndDelete({ _id }).then((deleted) => {
            if(deleted) {
                res.json(deleted)
            } else {
                res.status(404).json({ error: 'No such object' })
            }
        }).catch(err => {
            res.status(400).json({ error: err.message })
        })
    }

}