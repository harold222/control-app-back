const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = Schema({
    idUser: {
        // pertenece al id del usuario
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    hasChildren: {
        // ¿Tiene hijos? = resp = si - no
        type: String,
        required: false,
        default: "No"
    },
    manyChildren: {
        // ¿Cantidad de hijos? = resp = >= 0
        type: Number,
        required: false,
        default: 0
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
}, { versionKey: false })

const db = mongoose.connection.useDb('controlApp');
QuestionSchema.methods.toJSON = function() {
    const { _id, ...data  } = this.toObject();
    return data;
}

module.exports = db.model('Questions', QuestionSchema);