const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegistrationSchema = Schema({
    createdTime:{
        type: Date,
        required: true,
    },
    openingTime: {
        type: Date,
        required: false,
        default: null
    },
    closingTime: {
        type: Date,
        required: false,
        default: null
    },
    idSupervisor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    idOperator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    idStation: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    state: {
        type: Boolean,
        required: false,
        default: false
    }
}, { versionKey: false })

const db = mongoose.connection.useDb('controlApp');
RegistrationSchema.methods.toJSON = function() {
    const { _id, ...data  } = this.toObject();
    return data;
}

module.exports = db.model('Registration', RegistrationSchema);