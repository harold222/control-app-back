require('dotenv').config();

const jwt = require('jsonwebtoken')

const generateJWT = (id = '', name = '', lastname = '', email = '', rol = '') => {
    return new Promise((resolve, reject) => {
        const payload = { id, name, lastname, email, rol }
        jwt.sign(payload, process.env.PRIVATEKEY, {
            expiresIn: '2h',
        }, (err, token) => {
            err ?
                reject('Error create token'):
                resolve(token)
        })
    })
}

module.exports = { generateJWT }