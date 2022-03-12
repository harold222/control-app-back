const { response } = require('express')
const { validationResult } = require('express-validator')
const { ReasonPhrases, StatusCodes } = require('http-status-codes')
const Roles = require('../models/roles')

const getAllRoles = async (req, res = response, next) => {
    const allRoles = await Roles.find({})
    res.status(StatusCodes.ACCEPTED).json({
        status: true,
        roles: allRoles.map(rol => rol.rol)
    }) 
}

const createNewRoles = async (req, res = response, next) => {
    const errors = validationResult(req)
    if (errors.errors?.length) return res.status(StatusCodes.BAD_GATEWAY).json(errors)

    try {
        if (req.body?.roles) {
            await Roles.insertMany(req.body.roles.map(rolName => ({ rol: rolName })))
            res.status(StatusCodes.ACCEPTED).json({ status: true })
        } else 
            res.status(StatusCodes.BAD_GATEWAY).json({
                status: false,
                message: 'Ha ocurrido un error.'
            })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: 'Ha ocurrido un error.',
            error
        })
        next()
    }
}

module.exports = {
    getAllRoles,
    createNewRoles
}