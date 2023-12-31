const { Schema, default: mongoose } = require("mongoose");

const commentSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: "sociol-posts"
    },
    comment: String,
    profileId: {
        type: Schema.Types.ObjectId,
        ref: 'sociol-posts'
    },
    timestamp: {
        type: Date,
        default: () => Date.now(),
    },
    // profilePhoto: String,

})

module.exports = mongoose.model("sociol-comment", commentSchema)