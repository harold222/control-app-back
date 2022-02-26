require('dotenv').config()
const { server } = require('./models')

const app = new server()
// Execute server
app.connections().then()
// show port
app.listen()