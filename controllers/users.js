const { response, request } = require('express')
const { ReasonPhrases, StatusCodes } = require('http-status-codes')
const crypt = require('bcryptjs')
const User = require('../models/user')
const Questions = require('../models/questions')
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

// ---------------API---------------

// /api/users/621aa66eac9b457115de9a74
const getSpecificUser = async(req, res = response, next) => {
    if (req.params) {
        const userDb = await User.findById(req.params.id)

        res.status(StatusCodes.ACCEPTED).json({
            status: userDb ? true : false,
            user: userDb || null,
            error: !userDb ? 'The user was not found' : ''
        }) 
    } else
        res.status(StatusCodes.BAD_GATEWAY).json({
            status: false,
            message: 'Ha ocurrido un error.'
        })
}

// api/users
const getAllUsers = (req, res = response, next) => {
    res.status(StatusCodes.ACCEPTED).json({ok: 'ok'})
}

const getUnregisteredUsers = (req, res = response, next) => {

}

const getRegisteredUsers = (req, res = response, next) => {

}

const postUser = async (req, res = response, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) 
        return res.status(StatusCodes.BAD_GATEWAY).json(errors)

    try {
        if (req.body) {
            let body = { ...req.body }

            // the email exist
            const existEmail = await User.findOne({ email: body.email })

            if ( existEmail ) {
                return res.status(StatusCodes.CONFLICT).json({
                    status: false,
                    message: `El correo ${body.email} ya existe.`
                })
            }

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

const putUser = (req, res = response, next) => {

}

const deleteUser = (req, res = response, next) => {

}

module.exports = {
    getSpecificUser,
    getAllUsers,
    getUnregisteredUsers,
    getRegisteredUsers,
    postUser,
    putUser,
    deleteUser,
    setDefaultUsers
}
