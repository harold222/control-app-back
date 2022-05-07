const { response, request } = require('express')
const { ReasonPhrases, StatusCodes } = require('http-status-codes')
const crypt = require('bcryptjs')
const User = require('../models/user')
const Questions = require('../models/questions')
const Roles = require('../models/roles')
const Station = require('../models/station')
const { validationResult } = require('express-validator')

// ---------------TASKS---------------
const setDefaultUsers = async () => {
    const allUsers = await User.count()
    // save test users on json file
    if (!allUsers) {
        const testUsers = require('../helpers/usersTest.json')
        User.insertMany(testUsers.users, (error, inserted) => {
            if (!error) {
                console.log('Create users test')
                let basicQuestions = require('../helpers/basicQuestions.json')

                // complete idUser with random id
                basicQuestions.questions[0]['idUser'] = inserted[0]['_id']
                basicQuestions.questions[1]['idUser'] = inserted[1]['_id']
                basicQuestions.questions[2]['idUser'] = inserted[2]['_id']
                basicQuestions.questions[3]['idUser'] = inserted[3]['_id']
                basicQuestions.questions[4]['idUser'] = inserted[4]['_id']

                Questions.insertMany(basicQuestions.questions, (err, ins) => {
                    !err ? 
                        console.log('Create basic questions'):
                        console.log('Error basic questions')
                })
                
                let testStations = require('../helpers/station.json')
                const supervisorId = inserted.find(us => us.rol == 'SUPERVISOR_ROLE')['_id']

                testStations.stations[0]['idSupervisor'] = supervisorId
                testStations.stations[1]['idSupervisor'] = supervisorId

                testStations.stations[0]['idOperators'] = inserted.filter(us => us.rol == 'OPERATOR_ROLE').map(us => us['_id']);

                Station.insertMany(testStations.stations, (err, ins) => {
                    !err ? 
                        console.log('Create stations'):
                        console.log('Error stations')
                })
            } else 
                console.log('Error save users')
        })
    }
}

const setDefaultRoles = async () => {
    const allRoles = await Roles.count()

    if (!allRoles) {
        Roles.insertMany([
            { rol: 'ADMIN_ROLE' },
            { rol: 'OPERATOR_ROLE' },
            { rol: 'SUPERVISOR_ROLE' },
            { rol: 'HUMAN_RESOURCES_ROLE' }
        ], (error, inserted) => {
            !error ? 
                console.log('Create roles'):
                console.log('Error roles')
        })
    }
}

// ---------------API---------------

// /api/users/621aa66eac9b457115de9a74
const getSpecificUser = async(req, res = response, next) => {
    if (req.params) {
        const userDb = await User.findById(req.params.id)

        res.status(StatusCodes.ACCEPTED).json({
            status: true,
            user: userDb,
        }) 
    } else
        res.status(StatusCodes.BAD_GATEWAY).json({
            status: false,
            message: 'Ha ocurrido un error.'
        })
}

// api/users
const getAllUsers = async (req, res = response, next) => {
    try {
        const { limit = 10, from = 0, status = true } = req.query

        const resp = await Promise.all([
            User.countDocuments({ state: Boolean(status) }),
            User.find({ state: Boolean(status) }).skip(Number(from)).limit(Number(limit))
        ])

        res.status(StatusCodes.ACCEPTED).json({
            status: true,
            total: resp[0],
            users: resp[1],
        })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: 'Ha ocurrido un error.'
        })
        next()
    }
}

const getUserByDocument = async (req, res = response, next) => {
    try {
        const userDb = await User.findOne({ document: req.params['document'] })
        res.status(StatusCodes.ACCEPTED).json({
            status: true,
            user: userDb,
        })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: 'Ha ocurrido un error.'
        })
        next()
    }
}

// api/users
const postUser = async (req, res = response, next) => {
    try {
        if (req.body) {
            let body = { ...req.body }

            // crypt the password
            body.password = crypt.hashSync(body.password, crypt.genSaltSync(12))

            // save user in the db
            const newUser = new User(body)
            const { _id } = await newUser.save()
            res.status(StatusCodes.CREATED).json({
                status: true,
                _id
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

// api/users
const putUser = async (req, res = response, next) => {
    try {
        const { id } = req.params
        const { password, email, ...data } = req.body

        if (password) 
            data.password = crypt.hashSync(password, crypt.genSaltSync(12))
        
        await User.findByIdAndUpdate(id, data)
        res.status(StatusCodes.ACCEPTED).json({ status: true })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: 'Ha ocurrido un error.'
        })
        next()
    }
}

// api/users
const deleteUser = async(req, res = response, next) => {
    try {
        const { id } = req.params
        await User.findByIdAndDelete(id)
        res.status(StatusCodes.ACCEPTED).json({
            status: true
        })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: 'Ha ocurrido un error.'
        })
        next()
    }
}

// api/users/newstate/id
const changeStateUser = async(req, res = response, next) => {
    try {
        const { id } = req.query
        const newState = req.query?.state || false

        await User.findByIdAndUpdate(id, { state: Boolean(newState) })
        res.status(StatusCodes.ACCEPTED).json({
            status: true
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
    getSpecificUser,
    getAllUsers,
    postUser,
    putUser,
    deleteUser,
    setDefaultUsers,
    setDefaultRoles,
    changeStateUser,
    getUserByDocument
}
