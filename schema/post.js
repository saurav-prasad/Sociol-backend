const { Schema, default: mongoose } = require("mongoose");

const postSchema = new Schema({
    image: String,
    like: Number,
    text: String,
    profileId: {
        type: Schema.Types.ObjectId,
        ref: "sociol-profiles"
    },
    // username: String,
    // profilePhoto: String,
    timestamp: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("sociol-post", postSchema)