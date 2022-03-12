const { response, request } = require('express')
const { ReasonPhrases, StatusCodes } = require('http-status-codes')
const crypt = require('bcryptjs')
const User = require('../models/user')
const Questions = require('../models/questions')
const Roles = require('../models/roles')
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
                const basicQuestions = require('../helpers/basicQuestions.json')

                // complete idUser with random id
                basicQuestions.questions[0]['idUser'] = inserted[0]['_id']
                basicQuestions.questions[1]['idUser'] = inserted[1]['_id']

                Questions.insertMany(basicQuestions.questions, (err, ins) => {
                    !err ? 
                        console.log('Create basic questions'):
                        console.log('Error basic questions')
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
            { rol: 'USER_ROLE' }
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
            User.countDocuments({ status: Boolean(status) }),
            User.find({ status: Boolean(status) }).skip(Number(from)).limit(Number(limit))
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
    changeStateUser
}
