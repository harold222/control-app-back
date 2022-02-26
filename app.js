require('dotenv').config()
const { server } = require('./models')

const app = new server()
app.connections().then()
app.listen()