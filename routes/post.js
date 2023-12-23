const express = require('express');
const fetchUser = require('../middleware/fetchUser');
const router = express.Router()
const profileSchema = require('../schema/profile')
const userSchema = require('../schema/user')
const postSchema = require('../schema/post')

// Route 1: Create a post POST /post/createpost => required login

router.post('/createpost', fetchUser,
    async (req, res) => {
        let success

        try {
            // checking if the user exists
            const userid = req.userId

            let user = await userSchema.findById(userid)
            if (!user) {
                success = false
                return res.status(400).send({ success, message: "Not allowed" })
            }
            user = await profileSchema.findOne({ userId: userid })
            if (!user) {
                success = false
                return res.status(400).send({ success, message: "Not allowed" })
            }
            const { text, image } = req.body
            // checking request body
            if (!text) {
                success = false
                return res.status(400).send({ success, message: 'Either text or image is required' })
            }
            else if (!image) {
                success = false
                return res.status(400).send({ success, message: 'Either text or image is required' })
            }
            // creating post and adding to the database

            let postData = {}
            if (image) { postData.image = image }
            postData = {
                ...postData,
                text,
                userId: user.userId,
                profileId: user.id,
                like: 0,
            }

            // 5tilak 11barat  
            const createPost = await postSchema.create(postData)

            const newPostData = {
                profilePhoto: user.profilePhoto,
                username: user.username,
                profileId: createPost.profileId,
                id: createPost.id,
                text: createPost.text,
                like: createPost.like,
                image: createPost?.image,
                timestamp: createPost.timestamp,
            }

            success = true
            res.send({ success, message: "Post created", data: newPostData })

        } catch (error) {
            success = false
            res.status(500).send({ success, message: "Internal server error occurred" })
        }
    })

//  Route 2: Get a post GET /post/getpost/:postId => no login required

router.get('/getpost/:postId', async (req, res) => {
    let success
    try {
        const postId = req.params.postId
        const post = await postSchema.findById(postId).select("-userId")
        if (!post) {
            success = false
            return res.status(400).send({ success, message: "Post not found" })
        }
        const user = await profileSchema.findById(post.profileId)

        const postData = {
            id: post.id,
            image: post.image,
            like: post.like,
            text: post.text,
            timestamp: post.timestamp,
            profileId: user.id,
            username: user.username,
            profilePhoto: user.profilePhoto,
        }
        success = true
        res.send({ success, message: "Post found", data: postData })
    } catch (error) {
        success = false
        res.status(500).send({ success, message: "Internal server error occurred" })
    }
})

// Route 3: Update a post POST /post/update/:postId => login required

router.post('/updatepost/:postId', fetchUser,
    async (req, res) => {
        let success
        try {
            const postId = req.params.postId
            const userId = req.userId

            // check a user
            let user = await profileSchema.findOne({ userId })
            if (!user) {
                success = false
                return res.status(400).send({ success, message: "Not allowed" })
            }

            user = await postSchema.findOne({ _id: postId, profileId: user.id })
            if (!user) {
                success = false
                return res.status(400).send({ success, message: "Post not found" })
            }

            // creating a new post
            const { text, image } = req.body
            let newPost = {}
            if (text) { newPost = { ...newPost, text } }
            if (image) { newPost = { ...newPost, image } }

            const post = await postSchema.findByIdAndUpdate(postId, { $set: newPost }, { new: true }).select("-userId")
            success = true
            res.send({ success, message: "Post updated", data: post })
        } catch (error) {
            success = false
            res.status(500).send({ success, message: "Internal server error occurred" })
        }
    })


//  Route 4: Deleting a post DELETE /post/deletepost/:postId => login required

router.delete('/deletepost/:postId', fetchUser,
    async (req, res) => {
        let success
        try {
            const userId = req.userId
            const postId = req.params.postId

            // checking the user
            let user = await profileSchema.findOne({ userId })
            if (!user) {
                success = false
                return res.status(400).send({ success, message: "Not allowed" })
            }
            user = await postSchema.findOne({ profileId: user.id, _id: postId })
            if (!user) {
                success = false
                return res.status(400).send({ success, message: "Post not found" })
            }

            //  delting the post

            const deletedPost = await postSchema.findByIdAndDelete(postId)
            success = true
            res.send({ success, message: "Post deleted" })
        } catch (error) {
            success = false
            res.status(500).send({ success, message: "Internal server error occurred" })
        }
    })

module.exports = router