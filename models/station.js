const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StationSchema = Schema({
    name: {
        type: String,
        required: [true, 'The name is required'],
    },
    direction: {
        type: String,
        required: false,
        default: ""
    },
    phone: {
        type: String,
        required: false,
        default: ""
    },
    image: {
        type: String,
        required: false,
        default: ""
    },
    idSupervisor: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
    },
    idOperators: {
        type: [mongoose.Schema.Types.ObjectId],
        required: false,
    },
    openingTime: {
        type: String,
        required: false,
        default: ""
    },
    closingTime: {
        type: String,
        required: false,
        default: ""
    },
    description: {
        type: String,
        required: false,
        default: ""
    }
}, { versionKey: false })

const db = mongoose.connection.useDb('controlApp');
// StationSchema.methods.toJSON = function() {
//     const { _id, ...data  } = this.toObject();
//     return data;
// }

module.exports = db.model('stations', StationSchema);