const mongoose = require("mongoose")
const { Schema } = mongoose

const credentialSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        required: true,
        type: String
    },
    phone: {
        type: Number
    }
})

module.exports = mongoose.model('sociol-credential', credentialSchema)