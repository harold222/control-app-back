require('dotenv').config()
const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');
const { setDefaultUsers } = require('../controllers/users')

class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.paths = {
            users: '/api/users',
            authentication: '/api/auth',
        }

        // this.connectDb()
    }

    async connections() {
        // console.log('1')
        await dbConnection()
        // console.log('2')
        this.middleware()
        this.routes()
        // console.log('3')
        await setDefaultUsers()
        // console.log('4')
    }

    async connectDb() {
        await dbConnection();
    }

    middleware() {
        this.app.use(cors())
        this.app.use(express.static('public'))
        this.app.use(express.json({ type: '*/*' }))
        this.app.use(express.urlencoded({ extended: true }))
    }

    routes() {
        this.app.use(this.paths.users, require('../routes/users'))
        this.app.use(this.paths.authentication, require('../routes/auth'))
    }

    listen() {
        this.app.listen(this.port, () => console.log(`Server listening on ${this.port}`))
    }
}

module.exports = Server