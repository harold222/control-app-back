const { response } = require('express')
const { ReasonPhrases, StatusCodes } = require('http-status-codes')
const Station = require('../models/station')


// /api/stations
const getAllStations = async (req, res = response, next) => {
    const allStations = await Station.find({})
    res.status(StatusCodes.ACCEPTED).json({
        status: true,
        roles: allStations
    }) 
}

// /api/stations/
const getSpecificStation = async(req, res = response, next) => {
    if (req.params) {
        const stationDb = await Station.findById(req.params.id)

        res.status(StatusCodes.ACCEPTED).json({
            status: true,
            station: stationDb,
        }) 
    } else
        res.status(StatusCodes.BAD_GATEWAY).json({
            status: false,
            message: 'Ha ocurrido un error.'
        })
}

// api/stations
const postStation = async (req, res = response, next) => {
    try {
        if (req.body) {
            let body = { ...req.body }

            const newStation = new Station(body)
            const { _id } = await newStation.save()
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

// api/stations
const putStation = async (req, res = response, next) => {
    try {
        const { id } = req.params
        const data = req.body
        
        await Station.findByIdAndUpdate(id, data)
        res.status(StatusCodes.ACCEPTED).json({ status: true })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: 'Ha ocurrido un error.'
        })
        next()
    }
}

// api/stations
const deleteStation = async(req, res = response, next) => {
    try {
        const { id } = req.params
        await Station.findByIdAndDelete(id)
        res.status(StatusCodes.ACCEPTED).json({
            status: true
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
    getAllStations,
    getSpecificStation,
    postStation,
    putStation,
    deleteStation
}