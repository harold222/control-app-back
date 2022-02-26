require('dotenv').config();

// different paths of the db
const development = {
    mongoUri: `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@cluster0.rjayg.mongodb.net/controlApp?retryWrites=true&w=majority`,
}

const production = {
    mongoUri: `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@cluster0.rjayg.mongodb.net/controlApp?retryWrites=true&w=majority`,
}

const config = process.env.NODE_ENV === 'production' ? production : development

module.exports = {
    config
}