const { response } = require('express')
const { ReasonPhrases, StatusCodes } = require('http-status-codes')
const Registration = require('../models/registration')
const Station = require('../models/station')
const Records = require('../models/records')

// ---------------TASKS---------------

const updateStateRegistration = async (idSupervisor, createdTime) => {
    const registration = await Registration.updateMany(
        { state: false, idSupervisor, createdTime },
        { $set: { state: true } },
        { multi: true, upsert: false }
    )

    return registration ? true : false
}

// ---------------API---------------

const createNewRegistration = async (req, res = response, next) => {
    try {
        if (req.body) {
            const { idStation } = req.body
            const createdTime = Date.now()

            // get station
            const station = await Station.findById(idStation)
            let ids = []
        
            if (station.idOperators?.length > 0) {
                // create a new record
                const createRecord = new Records({
                    createdTime,
                    idSupervisor: req.user['id'],
                    idStation,
                })
                const { _id: idHistory  } = await createRecord.save()

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
            } else {
                res.status(StatusCodes.BAD_GATEWAY).json({
                    status: false,
                    message: `No existen operarios en la estacion ${station.name}.`,
                })
            }
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

const updateOpeningTime = async (req, res = response, next) => {
    try {
        if (req.body) {
            await Registration.findOneAndUpdate(
                { idOperator: req.body.idOperator, idSupervisor: req.body.idSupervisor, state: false },
                { $set: { openingTime: Date.now() } },
                { new: false }
            );
            res.status(StatusCodes.CREATED).json({ status: true })
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

const updateClosingTime = async (req, res = response, next) => {
    try {
        if (req.body) {

            let registrationdb = await Registration.findOne(
                {
                    idOperator: req.body.idOperator,
                    idSupervisor: req.body.idSupervisor,
                    state: false
                }
            );

            if (registrationdb['openingTime'] != null) {
                await Registration.findByIdAndUpdate(
                    registrationdb['_id'],
                    { $set: { closingTime: Date.now() } },
                    { new: false }    
                )
                
                res.status(StatusCodes.CREATED).json({ status: true })
            } else {
                res.status(StatusCodes.BAD_GATEWAY).json({
                    status: false,
                    message: 'No realizo el registro de ingreso.'
                })
            }
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
    createNewRegistration,
    updateOpeningTime,
    updateStateRegistration,
    updateClosingTime
}