const { response } = require('express')
const { ReasonPhrases, StatusCodes } = require('http-status-codes')
const Record = require('../models/records')
const { updateStateRegistration } = require('./registrations')

const updateStateRecordAndHistory = async (req, res = response, next) => {
    try {
        const { idRecord, type } = req.body

        let recordDb;

        if (type === 'ingress') {
            recordDb = await Record.findByIdAndUpdate(idRecord,
                { $set: { completedIngress: true } },
                { new: false }
            )
        } else if (type === 'exit') {
            recordDb = await Record.findByIdAndUpdate(idRecord,
                { $set: { completedExit: true } },
                { new: false }
            )
        }

        if (recordDb) {
            let status = true;

            if (type === 'exit')
                status = await updateStateRegistration(recordDb.idSupervisor, recordDb.createdTime)

            res.status(StatusCodes.CREATED).json({ status })
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: 'Ha ocurrido un error.'
            })
            next()
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: 'Ha ocurrido un error.'
        })
        next()
    }
}

const getRecordBySupervisor = async (req, res = response, next) => {
    try {
        const recordDb = await Record.find({
            idSupervisor: req.params['idSupervisor'],
            idStation: req.params['idStation'],
            completedExit: false
        })

        if (recordDb?.length) res.status(StatusCodes.CREATED).json({ status: true, record: recordDb[0] })
        else res.status(StatusCodes.CREATED).json({ status: false, record: null })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: 'Ha ocurrido un error.'
        })
        next()
    }
}

const getSpecificRecord = async(req, res = response, next) => {
    if (req.params) {
        const recordDb = await Record.findById(req.params.id)

        res.status(StatusCodes.ACCEPTED).json({
            status: true,
            record: recordDb,
        }) 
    } else
        res.status(StatusCodes.BAD_GATEWAY).json({
            status: false,
            message: 'Ha ocurrido un error.'
        })
}


module.exports = {
    updateStateRecordAndHistory,
    getRecordBySupervisor,
    getSpecificRecord
}