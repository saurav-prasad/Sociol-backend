const express = require('express');
const router = express.Router()
const profileSchema = require('../schema/profile')
const postSchema = require('../schema/post');
const fetchUser = require('../middleware/fetchUser');
const likeSchema = require('../schema/like');

// Route 1: Like a post by post id GET /like/createlike/:postId
router.get('/like/:postId', fetchUser,
    async (req, res) => {
        let success
        try {
            const userId = req.userId
            const postId = req.params.postId

            // checking the profile
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

            const checkLike = await likeSchema.findOne({
                profileId: user.id,
                postId: post.id
            })
            if (checkLike) {
                success = true
                return res.send({ success, message: "Post already liked", data: { liked: false } })
            }
            await postSchema.findByIdAndUpdate(post.id, { like: post.like + 1 })

            await likeSchema.create({
                profileId: user.id,
                postId: post.id
            })

            success = true
            res.send({ success, message: "Post liked", data: { liked: true } })

        } catch (error) {
            success = false
            res.status(500).send({ success, message: "Internal server error occurred" })
        }
    })

// Route 2: Un-like a post by post id GET /like/unlike/:postId
router.get('/unlike/:postId', fetchUser,
    async (req, res) => {
        let success
        try {
            const userId = req.userId
            const postId = req.params.postId

            // checking the profile
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

            const checkLike = await likeSchema.findOne({
                profileId: user.id,
                postId: post.id
            })

            if (!checkLike) {
                success = true
                return res.send({ success, message: "Post not liked, cannot unlike", data: { unLiked: false } })
            }

            await postSchema.findByIdAndUpdate(post.id, { like: post.like - 1 })

            await likeSchema.findByIdAndDelete(checkLike.id)

            success = true
            res.send({ success, message: "Post un-liked", data: { unLiked: true } })

        } catch (error) {
            success = false
            res.status(500).send({ success, message: "Internal server error occurred" })
        }
    })

// Route 3: check if a user liked a post by post id GET /like/iflike/:postId
router.get('/iflike/:postId', fetchUser,
    async (req, res) => {
        let success
        try {
            const userId = req.userId
            const postId = req.params.postId

            // checking the profile
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

            const checkLike = await likeSchema.findOne({
                profileId: user.id,
                postId: post.id
            })

            if (!checkLike) {
                success = true
                return res.send({ success, message: "Post not liked", data: { liked: false } })
            }

            success = true
            res.send({ success, message: "Post liked", data: { liked: true } })

        } catch (error) {
            success = false
            res.status(500).send({ success, message: "Internal server error occurred" })
        }
    })

module.exports = router