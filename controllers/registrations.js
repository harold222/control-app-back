const { response } = require('express')
const { ReasonPhrases, StatusCodes } = require('http-status-codes')
const Registration = require('../models/registration')
const User = require('../models/user')
const Station = require('../models/station')

const createNewRegistration = async (req, res = response, next) => {
    try {
        if (req.body) {
            const { idStation } = req.body

            const currentDate = Date.now()

            // crear el historial tambien con Date.now, verificar el await y default para opening y close
            const station = await Station.findById(idStation)
            let ids = []

            station.idOperators.forEach(async idOperator => {
                const newRegistration = new Registration(
                    {
                        createdTime: currentDate,
                        idSupervisor: req.user['id'],
                        idOperator,
                        idStation,
                    }
                );
                const { _id } = await newRegistration.save();
                ids.push(_id);
            });
            
            res.status(StatusCodes.CREATED).json({
                status: true,
                ids
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

module.exports = {
    createNewRegistration
}