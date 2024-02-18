const express = require('express');
const fetchUser = require('../middleware/fetchUser');
const router = express.Router()
const profileSchema = require('../schema/profile')
const userSchema = require('../schema/user')
const postSchema = require('../schema/post');
const commentSchema = require('../schema/comment')
const likeSchema = require('../schema/like')

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
            if (!text && !image) {
                success = false
                return res.status(400).send({ success, message: 'Either text or image is required' })
            }
            // creating post and adding to the database

            let postData = {}
            if (image) { postData.image = image }
            if (text) { postData.text = text }
            postData = {
                ...postData,
                userId: user.userId,
                profileId: user.id,
                like: 0,
                comment: 0,
            }


            const createPost = await postSchema.create(postData)

            const newPostData = {
                profilePhoto: user.profilePhoto,
                username: user.username,
                about: user?.about,
                profileId: createPost.profileId,
                id: createPost.id,
                text: createPost.text,
                like: createPost.like,
                comment: createPost.comment,
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

//  Route 2: Get a post by postId GET /post/getpost/:postId => no login required

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
            comment: post.comment,
            text: post.text,
            timestamp: post.timestamp,
            profileId: user.id,
            username: user.username,
            profilePhoto: user.profilePhoto,
            about: user?.about
        }
        success = true
        res.send({ success, message: "Post found", data: postData })
    } catch (error) {
        success = false
        res.status(500).send({ success, message: "Internal server error occurred" })
    }
})
//  Route 3: Get a post by profileId GET /post/getpostbyprofileid/:profileId => no login required

router.get('/getpostbyprofileid/:profileId', async (req, res) => {
    let success
    try {
        const profileId = req.params.profileId
        const profile = await profileSchema.findById(profileId)
        if (!profile) {
            success = false
            return res.status(400).send({ success, message: "Profile not found" })
        }
        const posts = await postSchema.find({ profileId })

        const postsData = await Promise.all(posts.map(async (data) => {
            return {
                id: data.id,
                image: data?.image,
                like: data?.like,
                comment: data?.comment,
                text: data?.text,
                timestamp: data.timestamp,
                profileId: profile.id,
                username: profile.username,
                profilePhoto: profile.profilePhoto,
                about: profile?.about
            }
        }))

        success = true
        res.send({ success, message: "Post found", data: postsData })
    } catch (error) {
        success = false
        res.status(500).send({ success, message: "Internal server error occurred" })
    }
})

//  Route 4: Get all post GET /post/getallpost => no login required

router.get('/getallpost', async (req, res) => {
    let success
    try {
        const posts = await postSchema.find({})
        if (!posts) {
            success = false
            return res.status(400).send({ success, message: 'Something went wrong' })
        }

        const postsData = await Promise.all(posts.map(async (data) => {
            // console.log(data);
            const user = await profileSchema.findById(data.profileId)
            // console.log(user);
            return {
                id: data.id,
                image: data?.image,
                like: data?.like,
                comment: data?.comment,
                text: data?.text,
                timestamp: data.timestamp,
                profileId: user.id,
                username: user.username,
                profilePhoto: user.profilePhoto,
                about: user?.about
            }
        }))

        success = true
        res.send({ success, message: "Post found", data: postsData })
    } catch (error) {
        success = false
        res.status(500).send({ success, message: "Internal server error occurred" })
    }
})
//  Route 5: Get all post GET /post/fetchpost => login required

router.get('/fetchpost', fetchUser, async (req, res) => {
    let success
    try {
        const userId = req.userId
        const profile = await profileSchema.findOne({ userId })
        if (!profile) {
            success = false
            return res.status(400).send({ success, message: 'Profile not found' })
        }
        const posts = await postSchema.find({ profileId: profile.id })
        if (!posts) {
            success = false
            return res.status(400).send({ success, message: 'Posts not found' })
        }
        const postsData = posts.map((data) => {
            return {
                id: data.id,
                image: data?.image,
                like: data?.like,
                comment: data?.comment,
                text: data?.text,
                timestamp: data.timestamp,
                profileId: profile.id,
                username: profile.username,
                profilePhoto: profile.profilePhoto,
                about: profile?.about
            }
        })

        success = true
        res.send({ success, message: "Post fetched", data: postsData })
    } catch (error) {
        success = false
        res.status(500).send({ success, message: "Internal server error occurred" })
    }
})

// Route 6: Update a post POST /post/update/:postId => login required

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
            const { text, image } = req.body
            // checking request body
            if (!text && !image) {
                success = false
                return res.status(400).send({ success, message: 'Either text or image is required' })
            }
            // creating a new post
            let newPost = {}
            // text
            if (text === false) {
                newPost = { ...newPost, text: false }
            } else { newPost = { ...newPost, text } }
            // image
            if (image === false) {
                newPost = { ...newPost, image: false }
            } else { newPost = { ...newPost, image } }

            const post = await postSchema.findByIdAndUpdate(postId, { $set: newPost }, { new: true }).select("-userId")
            success = true
            res.send({ success, message: "Post updated", data: post })
        } catch (error) {
            console.log(error);
            success = false
            res.status(500).send({ success, message: "Internal server error occurred" })
        }
    })


//  Route 7: Deleting a post DELETE /post/deletepost/:postId => login required

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

            //  delting the likes
            await likeSchema.deleteMany({ postId: postId })
            //  delting the comments
            await commentSchema.deleteMany({ postId: postId })
            //  delting the post
            await postSchema.findByIdAndDelete(postId)
            success = true
            res.send({ success, message: "Post deleted" })
        } catch (error) {
            success = false
            res.status(500).send({ success, message: "Internal server error occurred" })
        }
    })

module.exports = router