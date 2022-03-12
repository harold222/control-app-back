const roles = require("../models/roles")
const user = require("../models/user")

const validateRol = async (rol = '') => {
    const existRol = await roles.findOne({ rol })
    if (!existRol) throw new Error(`el rol ${rol} no existe.`)
}

const validateEmail = async (email = '') => {
    if (!email) throw new Error(`El email es requerido`)

    const existEmail = await user.findOne({ email })
    if (existEmail) 
        throw new Error(`el email ${email} ya existe.`)
}

module.exports = {
    validateRol,
    validateEmail
}