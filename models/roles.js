const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RolesSchema = Schema({
    rol: {
        type: String,
        required: [true, 'The rol is required.'],
    },
    description: {
        type: String,
        default: ''
    }
}, { versionKey: false })

const db = mongoose.connection.useDb('controlApp');
RolesSchema.methods.toJSON = function() {
    const { _id, ...data  } = this.toObject();
    return data;
}

module.exports = db.model('Roles', RolesSchema);