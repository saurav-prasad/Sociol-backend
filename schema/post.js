const { Schema, default: mongoose } = require("mongoose");

const postSchema = new Schema({
    image: String,
    like: Number,
    text: {
        type: String,
        required: true
    },
    profileId: {
        type: Schema.Types.ObjectId,
        ref: "sociol-profiles"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "sociol-users"
    },
    // username: String,
    // profilePhoto: String,
    timestamp: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("sociol-post", postSchema)