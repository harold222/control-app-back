require('dotenv').config();
const { response, request } = require('express')
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const sendErrorMessage = (res) =>
    res.status(StatusCodes.UNAUTHORIZED).json({
        status: false,
        message: 'No tiene permisos para realizar esta acción.'
    })

const validateJWT = async (req = request, res = response, next) => {
    const token = req.header('xxxtokenxxx')
    if (!token)
        return sendErrorMessage(res);

    try {
        const decode = jwt.verify(token, process.env.PRIVATEKEY)
        const currentUser = await User.findById(decode.id)

        if (currentUser && currentUser?.state) {
            req.user = currentUser
            req.token = token
            next()
        } else return sendErrorMessage(res)
    } catch (error) { return sendErrorMessage(res) }
}

module.exports = { validateJWT }