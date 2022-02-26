const { response, request } = require('express')
const { ReasonPhrases, StatusCodes } = require('http-status-codes')
const crypt = require('bcryptjs')
const User = require('../models/user')

// ---------------TASKS---------------
const setDefaultUsers = async () => {
    const allUsers = await User.count()
    // save test users on json file
    if (!allUsers) {
        const testUsers = require('../helpers/usersTest.json')
        User.insertMany(testUsers.users, (error, inserted) => {
            !error ?
                console.log('Create users test') :
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
        res.status(StatusCodes.BAD_GATEWAY).send(ReasonPhrases.BAD_GATEWAY)
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
    try {
        if (req.body) {
            let body = { ...req.body }

            // the email exist


            // crypt the password
            body.password = crypt.hashSync(body.password, crypt.genSaltSync(12))

            // save db


            const newUser = new User(body)
            const { _id } = await newUser.save()
            res.status(StatusCodes.CREATED).json({
                status: true,
                _id
            })
        } else
            res.status(StatusCodes.BAD_GATEWAY).send(ReasonPhrases.BAD_GATEWAY)
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR)
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
