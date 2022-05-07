const { response } = require('express')
const { ReasonPhrases, StatusCodes } = require('http-status-codes')
const Record = require('../models/records')
const { updateStateRegistration } = require('./registrations')

const updateStateRecordAndHistory = async (req, res = response, next) => {
    try {
        const { idRecord } = req.body

        let recordDb = await Record.findByIdAndUpdate(idRecord,
            { $set: { completed: true } },
            { new: false }
        )

        const status = await updateStateRegistration(recordDb.idSupervisor, recordDb.createdTime)
        res.status(StatusCodes.CREATED).json({ status })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: 'Ha ocurrido un error.'
        })
        next()
    }
}


module.exports = {
    updateStateRecordAndHistory
}