const { response } = require('express')
const { ReasonPhrases, StatusCodes } = require('http-status-codes')

const login = (req, res = response, next) => {

    try {
        const { email, password } = req.body;

        // exist email

        // user is active

        // verify password

        // generate jwt

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }

    res.json({  })
}

module.exports = {
    login
}