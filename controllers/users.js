const { response, request } = require('express')
const { ReasonPhrases, StatusCodes } = require('http-status-codes')
const User = require('../models/user')

// ---------------TASKS---------------
const setDefaultUsers = async () => {
    const allUsers = await User.count()
    
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

const getUsers = (req, res = response, next) => {
    
}

const postUser = (req, res = response, next) => {

}

const putUser = (req, res = response, next) => {

}

const deleteUser = (req, res = response, next) => {

}

module.exports = {
    getUsers,
    postUser,
    putUser,
    deleteUser,
    setDefaultUsers
}
