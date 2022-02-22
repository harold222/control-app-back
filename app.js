require('dotenv').config()
const { server } = require('./models')

const app = new server()
app.listen()


// CREAR UN GITHUB ACTION PARA GENERAR EL RELEASE