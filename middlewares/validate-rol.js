const { request, response } = require("express");
const { StatusCodes } = require("http-status-codes");


const sendErrorMessage = (res, code, message) =>
    res.status(code).json({
        status: false,
        message
    })

const verifyRoles = (...roles) => {
    return (req, res = response, next) => {
        if (!req.user)
            return sendErrorMessage(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Se ha generado un error.');
    
        if (!roles.includes(req.user.rol)) 
            return sendErrorMessage(res, StatusCodes.UNAUTHORIZED, 'No tiene permisos para realizar esta acción')

        next()
    }
}

module.exports = { verifyRoles }