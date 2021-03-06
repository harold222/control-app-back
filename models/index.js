const   server = require('./server'),
        User = require('./user'),
        Questions = require('./questions'),
        Roles = require('./roles'),
        Stations = require('./station'),
        Registration = require('./registration'),
        Records = require('./records');


module.exports = {
    server,
    User,
    Questions,
    Roles,
    Stations,
    Registration,
    Records
}