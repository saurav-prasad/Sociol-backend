const { Schema, default: mongoose } = require("mongoose");

const profileSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "sociol-user"
    },
    name: String,
    bio: String,
    profilePhoto: String,
    username: String,
    phone: Number,
 
})

module.exports = mongoose.model('sociol-profile', profileSchema)