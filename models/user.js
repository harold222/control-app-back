const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'The name is required'],
    },
    lastname: {
        type: String,
        required: false,
        default: ""
    },
    email: {
        type: String,
        required: [true, 'The email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'The password is required'],
    },
    phone: {
        type: Number,
        required: false,
        default: 0
    },
    img: {
        type: String,
        required: false,
        default: ""
    },
    city: {
        type: String,
        required: false,
        default: ""
    },
    rol: {
        type: String,
        required: [true, 'The rol is required'],
        emun: ['ADMIN_ROLE', 'USER_ROLE', 'SUPERVISOR_ROLE', 'HUMAN_RESOURCES_ROLE']
    },
    // calcular edad a partir de fecha actual -  nacimiento
    birthDate: {
        type: Date,
        required: [true, 'The birth date is required'],
        min: '1910-01-01',
        max: '2022-01-01'
    },
    sex: {
        type: String,
        required: false,
        default: ""
    },
    state: {
        type: Boolean,
        default: true
    }
}, { versionKey: false })

const db = mongoose.connection.useDb('controlApp');
UserSchema.methods.toJSON = function() {
    const { _id, ...data  } = this.toObject();
    return data;
}

module.exports = db.model('Users', UserSchema);