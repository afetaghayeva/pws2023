const fs = require('fs')

const mongoose = require('mongoose')
const { faker } = require('@faker-js/faker')

const person = require('../person.js')

let config = {}
try {
    config = JSON.parse(fs.readFileSync('../config.json'))
} catch(err) {
    console.error(err.message)
    process.exit(0)
}

const deleteExisting = true
const NumOfPersons = 1000

let Person = null

const generateData = async (model, deleteExisting) => {
    if(deleteExisting) {
        console.log('Delete existing %s...', model.collection.name)
        let count = (await model.deleteMany({})).deletedCount
        console.log(count + ' done')
    }
    console.log('Generate and save %d %s', NumOfPersons, model.collection.name)
    for(let i = 0; i < NumOfPersons; i++) {
        let person = new model({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            birthDate: faker.date.birthdate(),
            education: Math.floor(Math.random() * 3)
        })
        await person.save()
        process.stdout.write('\r' + (i + 1) + ' ')
    }
    console.log('done')
    process.exit(0)
}

mongoose.connect(config.dbUrl)
.then(connection => {
    console.log('Database connected')
    let model = person.init(connection)
    generateData(model, deleteExisting)
})
.catch(err => console.error(err.message))