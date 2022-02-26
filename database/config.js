const mongoose = require('mongoose');
const enviroment = require('../helpers/consts');

const dbConnection = async () => {
    try {
        await mongoose.connect(enviroment.config.mongoUri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) { throw new Error('Error DB: ', error) }
}

module.exports = { dbConnection }