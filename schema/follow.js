const { Schema, default: mongoose } = require("mongoose");

const follow = new Schema({
    profileId: {
        type: Schema.Types.ObjectId,
        ref: "sociol-profiles"
    },
    followerProfileId: {
        type: Schema.Types.ObjectId,
        ref: "sociol-profiles"
    }
})

module.exports = mongoose.model("sociol-follow", follow)