const { response } = require('express')
const { ReasonPhrases, StatusCodes } = require('http-status-codes')
const Registration = require('../models/registration')
const Station = require('../models/station')
const Records = require('../models/records')
const User = require('../models/user')

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
        
            if (station.idOperators?.length > 0) {
                // create a new record
                const createRecord = new Records({
                    createdTime,
                    idSupervisor: req.user['id'],
                    idStation,
                })
                const { _id: idHistory  } = await createRecord.save()
                let users = []

                for (const idOperator of station.idOperators) {
                    const newRegistration = new Registration(
                        {
                            createdTime,
                            idSupervisor: req.user['id'],
                            idOperator,
                            idStation,
                        }
                    );
    
                    await newRegistration.save();
                    users.push(await User.findById(idOperator))
                }

                res.status(StatusCodes.CREATED).json({
                    status: true,
                    history: idHistory,
                    users
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
            let registrationdb = await Registration.findOneAndUpdate(
                {
                    idOperator: req.body.idOperator,
                    idSupervisor: req.body.idSupervisor,
                    idStation: req.body.idStation,
                    state: false
                },
                { $set: { openingTime: Date.now() } },
                { new: false }
            );

            let allRegistrations = await Registration.find({
                idSupervisor: req.body.idSupervisor,
                idStation: req.body.idStation,
                createdTime: registrationdb['createdTime'],
                openingTime: null,
                state: false
            })

            let updateRecord = false

            if (!allRegistrations?.length) {
                await Records.findOneAndUpdate({
                    idSupervisor: req.body.idSupervisor,
                    idStation: req.body.idStation,
                    createdTime: registrationdb['createdTime'],
                    completedIngress: false
                },
                {
                    $set: { completedIngress: true }
                },
                {
                    new: false
                });
                updateRecord = true;
            }

            res.status(StatusCodes.CREATED).json({ status: true, updateRecord })
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
                    idStation: req.body.idStation,
                    state: false
                }
            );

            let updateRecord = false;

            if (registrationdb['openingTime'] != null) {
                await Registration.findByIdAndUpdate(
                    registrationdb['_id'],
                    { $set: { closingTime: Date.now() } },
                    { new: false }    
                )

                let allRegistrations = await Registration.find({
                    idSupervisor: req.body.idSupervisor,
                    idStation: req.body.idStation,
                    createdTime: registrationdb['createdTime'],
                    closingTime: null,
                    state: false
                })

                if (!allRegistrations?.length) {
                    await Records.findOneAndUpdate({
                        idSupervisor: req.body.idSupervisor,
                        idStation: req.body.idStation,
                        createdTime: registrationdb['createdTime'],
                        completedExit: false
                    },
                    {
                        $set: { completedExit: true }
                    },
                    {
                        new: false
                    });

                    updateRecord = true;

                    await updateStateRegistration(req.body.idSupervisor, registrationdb['createdTime'])
                }
                
                res.status(StatusCodes.CREATED).json({ status: true, updateRecord })
            } else {
                res.status(StatusCodes.BAD_GATEWAY).json({
                    status: false,
                    message: 'No realizo el registro de ingreso, comuniquese con el supervisor.'
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

const getOperatorsByRecord = async (req, res = response, next) => {
    try{
        if (req.body) {
            const { idSupervisor, idStation, createdTime, schedule } = req.body

            let allRegistrations = await Registration.find({
                idSupervisor, createdTime, idStation, state: false
            })

            let allUsers = []

            for (const registration of allRegistrations) {
                switch (schedule) {
                    case 'ingress':
                        if (!registration.openingTime)
                            allUsers.push(await User.findById(registration.idOperator))
                        break;
                    default:
                        if (!registration.closingTime)
                            allUsers.push(await User.findById(registration.idOperator))
                        break;
                }
            }

            res.status(StatusCodes.CREATED).json({ status: true, allUsers })
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
    updateClosingTime,
    getOperatorsByRecord
}