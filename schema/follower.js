const { Schema, default: mongoose } = require("mongoose");

const followers = new Schema({
    // username: String,
    // profilePhoto: String,
    profileId: {
        type: Schema.Types.ObjectId,
        ref: "sociol-profiles"
    },
    userId: String
})

module.exports = mongoose.model("sociol-follower", followers)