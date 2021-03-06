require('dotenv').config()
const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');
const { setDefaultUsers, setDefaultRoles } = require('../controllers/users')

class Server {

    constructor() {
        this.app = express()
        // default port in local or production
        this.port = process.env.PORT
        // all paths endpoints of the app
        this.paths = {
            users: '/api/users',
            authentication: '/api/auth',
            roles: '/api/roles',
            stations: '/api/stations',
            registration: '/api/registration',
            record: '/api/records'
        }
    }

    async connections() {
        await dbConnection()
        this.middleware()
        this.routes()
        await setDefaultUsers()
        await setDefaultRoles()
    }

    middleware() {
        this.app.use(cors())
        this.app.use(express.static('public'))
        this.app.use(express.json({ type: '*/*' }))
        this.app.use(express.urlencoded({ extended: true }))
    }

    routes() {
        this.app.use(this.paths.authentication, require('../routes/auth'))
        this.app.use(this.paths.users, require('../routes/users'))
        this.app.use(this.paths.roles, require('../routes/roles'))
        this.app.use(this.paths.stations, require('../routes/stations'))
        this.app.use(this.paths.registration, require('../routes/registrations'))
        this.app.use(this.paths.record, require('../routes/records'))
    }

    listen() {
        this.app.listen(this.port, () => console.log(`Server listening on ${this.port}`))
    }
}

module.exports = Server