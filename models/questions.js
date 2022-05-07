const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    salaryRange: {
        // ¿Rango salarial? = resp en COP
        type: Number,
        required: false,
        default: 1000000
    },
    civilStatus: {
        // ¿Estado civil? = resp = listado soltero, casado, viudo, etc
        type: String,
        required: false,
        default: "Soltero"
    },
    hasVehicle: {
        // ¿Tiene vehiculo? resp = si - no
        type: String,
        required: false,
        default: "No"
    },
    isStudying: {
        // ¿Esta estudiando? = resp = si - no
        type: String,
        required: false,
        default: "No"
    },
    nacionality: {
        // ¿Cual es su nacionalidad? resp = listado con nacionalidades
        type: String,
        required: false,
        default: "Colombia"
    },
    manyChildren: {
        // ¿Cantidad de hijos? = resp = >= 0
        type: Number,
        required: false,
        default: 0
    },
    etnia: {
        // ¿Posee etnia? resp = cual?
        type: String,
        required: false,
        default: ""
    },
    numberOfPeopleHousehold: {
        // ¿Numero de personas en la casa? = resp = >= 0
        type: Number,
        required: false,
        default: 0
    },
    hasComputer: {
        // ¿Posee computador? resp = Si - No
        type: String,
        required: false,
        default: "No"
    },
    hasInternet: {
        // ¿Posee internet? resp = Si - No
        type: String,
        required: false,
        default: "No"
    },
    motorLimitation: {
        // ¿Posee alguna limitacion motriz? resp = cual?
        type: String,
        required: false,
        default: ""
    }
}, { versionKey: false })

const db = mongoose.connection.useDb('controlApp');
QuestionSchema.methods.toJSON = function() {
    const { _id, ...data  } = this.toObject();
    return data;
}

module.exports = db.model('Questions', QuestionSchema);