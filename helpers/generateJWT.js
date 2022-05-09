require('dotenv').config();

const jwt = require('jsonwebtoken')

const generateJWT = (id = '', name = '', lastname = '', email = '', rol = '', image = '') => {
    return new Promise((resolve, reject) => {
        const payload = { id, name, lastname, email, rol, image }
        jwt.sign(payload, process.env.PRIVATEKEY, {
            expiresIn: '3h',
        }, (err, token) => {
            err ?
                reject('Error create token'):
                resolve(token)
        })
    })
}

module.exports = { generateJWT }