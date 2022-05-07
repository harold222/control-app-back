const   roles = require('../models/roles'),
        user = require('../models/user'),
        station = require('../models/station'),
        record = require('../models/records');

const validateRol = async (rol = '') => {
    if (rol) {
        const existRol = await roles.findOne({ rol })
        if (!existRol) throw new Error(`el rol ${rol} no existe.`)
    }
}

const validateEmail = async (email = '') => {
    if (!email) throw new Error(`El email es requerido`)

    const existEmail = await user.findOne({ email })
    if (existEmail) 
        throw new Error(`el email ${email} ya existe.`)
}

const validateUser = async (id = '') => {
    if (!id) throw new Error(`El id es requerido`)

    const existUser = await user.findById(id)
    if (!existUser) throw new Error(`El usuario con id ${id} no existe.`)
}

const validateStation = async (id = '') => {
    if (!id) throw new Error(`El id es requerido`)

    const existStation = await station.findById(id)
    if (!existStation) throw new Error(`La estacion con id ${id} no existe.`)
}

const validateRecord = async (id = '') => {
    if (!id) throw new Error(`El id es requerido`)

    const existRecord = await record.findById(id)
    if (!existRecord) throw new Error(`La estacion con id ${id} no existe.`)
}

const existEmail =  async (email = '') => {
    if (!email) throw new Error(`El email es requerido`)

    const existEmail = await user.findOne({ email })
    if (!existEmail) 
        throw new Error(`el email ${email} no existe.`)
}

module.exports = {
    validateRol,
    validateEmail,
    validateUser,
    validateStation,
    existEmail,
    validateRecord
}