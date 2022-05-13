const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecordSchema = Schema({
    createdTime:{
        type: Date,
        required: true,
    },
    idSupervisor: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    idStation: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    completedIngress: {
        type: Boolean,
        default: false
    },
    completedExit: {
        type: Boolean,
        default: false
    }
}, { versionKey: false })

const db = mongoose.connection.useDb('controlApp');

module.exports = db.model('Records', RecordSchema);