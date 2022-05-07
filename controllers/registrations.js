const { response } = require('express')
const { ReasonPhrases, StatusCodes } = require('http-status-codes')
const Registration = require('../models/registration')
const User = require('../models/user')
const Station = require('../models/station')
const Records = require('../models/records')

const createNewRegistration = async (req, res = response, next) => {
    try {
        if (req.body) {
            const { idStation } = req.body
            const createdTime = Date.now()

            // create a new record
            const createRecord = new Records({
                createdTime,
                idSupervisor: req.user['id'],
                idStation,
            })
            const { _id: idHistory  } = await createRecord.save()

            // get station
            const station = await Station.findById(idStation)
            let ids = []

            for (const idOperator of station.idOperators) {
                const newRegistration = new Registration(
                    {
                        createdTime,
                        idSupervisor: req.user['id'],
                        idOperator,
                        idStation,
                    }
                );

                // create registration for each operator
                const { _id } = await newRegistration.save();
                ids.push(_id);
            }

            res.status(StatusCodes.CREATED).json({
                status: true,
                history: idHistory,
                ids
            })
        } else
            res.status(StatusCodes.BAD_GATEWAY).json({
                status: false,
                message: 'Ha ocurrido un error.'
            })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: 'Ha ocurrido un error.'
        })
        next()
    }

}

module.exports = {
    createNewRegistration
}