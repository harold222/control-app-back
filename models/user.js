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
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    age: {
        type: Number,
        required: false,
        default: 0
    },
    sex: {
        type: String,
        required: false,
        default: ""
    },
    quantityChildrens: {
        type: Number,
        required: false,
        default: 0
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