const express = require('express');
const fetchUser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');
const router = express.Router()
const userSchema = require('../schema/user')
const commentSchema = require('../schema/comment')
const profileSchema = require('../schema/profile')
const postSchema = require('../schema/post')


// Route 1: Create a comment POST /comment/createcomment/:postId login required

router.post('/createcomment/:postId', fetchUser,
    [body('comment', 'Comment must be atleast of 1 characters').isLength({ min: 1 })],
    async (req, res) => {
        let success
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            success = false
            return res.status(400).send({ success, message: errors.array()[0].msg })
        }
        try {
            const userId = req.userId
            const postId = req.params.postId

            // checking user 
            const user = await profileSchema.findOne({ userId })
            if (!user) {
                success = false
                return res.status(400).send({ success, message: "Not allowed" })
            }
            // checking if the post exists
            const post = await postSchema.findById(postId)
            if (!post) {
                success = false
                return res.status(400).send({ success, message: "Post not found" })
            }
            //  commenting
            const createComment = await commentSchema.create({
                comment: req.body.comment,
                postId: post.id,
                profileId: user.id
            })
            await postSchema.findByIdAndUpdate(post.id, { comment: post.comment + 1 })
            console.log(createComment);

            const commentData = {
                id: createComment.id,
                comment: createComment.comment,
                postId: createComment.postId,
                profileId: createComment.profileId,
                username: user.username,
                profilePhoto: user.profilePhoto,
                timestamp: createComment.timestamp
            }

            success = true
            res.send({ success, message: 'Commented', data: commentData })
        } catch (error) {
            success = false
            res.status(500).send({ success, message: "Internal server error occurred" })
        }
    })

// Route 2: Read a comment GET /comment/getcomment/:postId no login required
router.get('/getcomment/:postId', async (req, res) => {
    let success
    try {
        // check if the post exitst
        const post = await postSchema.findById(req.params.postId)
        if (!post) {
            success = false
            return res.status(400).send({ success, message: "Post not found" })
        }

        // fetching comments
        const comments = await commentSchema.find({ postId: post.id })

        const commentData = await Promise.all(comments.map(async (data) => {

            // fetching profile details
            const profile = await profileSchema.findById(data.profileId)

            return {
                comment: data.comment,
                postId: data.postId,
                profileId: data.profileId,
                timestamp: data.timestamp,
                id: data.id,
                username: profile.username,
                profilePhoto: profile.profilePhoto
            }
        }))

        console.log(commentData);
        success = true
        res.send({ success, message: "Comments found", data: commentData })
    } catch (error) {
        success = false
        res.status(500).send({ success, message: "Internal server error occurred" })
    }
})

// Route 3: Update a comment POST /comment/updatecomment/:commentId login required
router.post('/updatecomment/:commentId', fetchUser,
    [body('comment', "Comment must be atleast of 1 character long").isLength({ min: 1 })],
    async (req, res) => {
        let success
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            success = false
            return res.status(400).send({ success, message: errors.array()[0].msg })
        }
        try {
            const userId = req.userId
            const commentId = req.params.commentId

            // checking user 
            const user = await profileSchema.findOne({ userId })
            if (!user) {
                success = false
                return res.status(400).send({ success, message: "Not allowed" })
            }
            // checking if the comment exists
            const comment = await commentSchema.findById(commentId)
            if (!comment) {
                success = false
                return res.status(400).send({ success, message: "Comment not found" })
            }
            //  updating comment
            const updatedComment = await commentSchema.findByIdAndUpdate(
                comment.id,
                { comment: req.body.comment, },
                { new: true })

            success = true
            res.send({
                success, message: "Comment updated", data: {
                    ...updatedComment,
                    username: user.username,
                    profilePhoto: user.profilePhoto
                }
            })
        } catch (error) {
            success = false
            res.status(500).send({ success, message: "Internal server error occurred" })
        }
    }
)

// Route 4: Delete a comment DELETE /comment/deletecomment/:commentId login required
router.delete('/deletecomment/:commentId', fetchUser,
    async (req, res) => {
        let success
        try {
            const userId = req.userId
            const commentId = req.params.commentId

            // checking user 
            const user = await profileSchema.findOne({ userId })
            if (!user) {
                success = false
                return res.status(400).send({ success, message: "Not allowed" })
            }
            // checking if the comment exists
            const comment = await commentSchema.findById(commentId)
            if (!comment) {
                success = false
                return res.status(400).send({ success, message: "Comment not found" })
            }
            // checking if the post exists
            const post = await postSchema.findById(comment.postId)
            if (!post) {
                success = false
                return res.status(400).send({ success, message: "Post not found" })
            }
            //  deleting comment
            await commentSchema.findByIdAndDelete(comment.id)
            await postSchema.findByIdAndUpdate(post.id, { comment: post.comment - 1 })

            success = true
            res.send({ success, message: "Comment deleted" })
        } catch (error) {
            success = false
            res.status(500).send({ success, message: "Internal server error occurred" })
        }
    }
)
module.exports = router