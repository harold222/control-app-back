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
    completed: {
        type: Boolean,
        default: false
    }
}, { versionKey: false })

const db = mongoose.connection.useDb('controlApp');
RecordSchema.methods.toJSON = function() {
    const { _id, ...data  } = this.toObject();
    return data;
}

module.exports = db.model('Records', RecordSchema);