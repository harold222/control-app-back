const { response } = require('express')
const { StatusCodes } = require('http-status-codes');
const { generateJWT } = require('../helpers/generateJWT');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');

const login = async(req, res = response, next) => {
    try {
        const { email, password } = req.body;
        const userDb = await User.findOne({ email })

        if (userDb.state) {
            const validPassword = bcryptjs.compareSync(password, userDb.password)

            if (validPassword) {

                const token = await generateJWT(userDb.id, userDb.name, userDb.lastname, userDb.email, userDb.rol)

                return res.status(StatusCodes.ACCEPTED).json({
                    status: true,
                    message: 'Iniciando sesión.',
                    token
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