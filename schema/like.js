const { Schema, default: mongoose } = require("mongoose");

const likeSchema = new Schema({
    profileId: {
        type: Schema.Types.ObjectId,
        ref: 'sociol-profiles'
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'sociol-profiles'
    }
})

module.exports = mongoose.model('sociol-like', likeSchema)