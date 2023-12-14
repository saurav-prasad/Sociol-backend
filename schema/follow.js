const { Schema, default: mongoose } = require("mongoose");

const follow = new Schema({
    // username: String,
    // profilePhoto: String,
    profileId: {
        type: Schema.Types.ObjectId,
        ref: "sociol-followers"
    },
    userId: String
})

module.exports = mongoose.model("sociol-follow", follow)