const { response } = require('express')
const { StatusCodes } = require('http-status-codes');
const User = require('../models/user');
const bcryptjs = require('bcryptjs')

const login = async(req, res = response, next) => {
    try {
        const { email, password } = req.body;

        const userDb = await User.findOne({ email })

        // user is active
        if (userDb.state) {
            // verify password
            const validPassword = bcryptjs.compareSync(password, userDb.password)

            if (validPassword) {
                return res.status(StatusCodes.ACCEPTED).json({
                    status: true,
                    message: 'Iniciando sesión.'
                }) 
            }
        } 

        res.status(StatusCodes.ACCEPTED).json({
            status: false,
            message: 'Email o contraseña incorrectos.'
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
    login
}