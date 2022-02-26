const { response, request } = require('express')
const { ReasonPhrases, StatusCodes } = require('http-status-codes')
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

const getAllUsers = (req, res = response, next) => {
    
}

const getUnregisteredUsers = (req, res = response, next) => {

}

const getRegisteredUsers = (req, res = response, next) => {

}

const postUser = async (req, res = response, next) => {
    try {
        if (req.body) {
            const newUser = new User({ ...req.body })
            const { _id } = await newUser.save()
            res.status(StatusCodes.CREATED).json({
                result: true,
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
    getAllUsers,
    getUnregisteredUsers,
    getRegisteredUsers,
    postUser,
    putUser,
    deleteUser,
    setDefaultUsers
}
