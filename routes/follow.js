const express = require('express');
const fetchUser = require('../middleware/fetchUser');
const router = express.Router()
const profileSchema = require('../schema/profile')
const followSchema = require('../schema/follow')

// Route 1: Follow a profile POST /follow/createfollow/:profileId
router.post('/createfollow/:profileId', fetchUser,
    async (req, res) => {
        let success
        try {
            const userId = req.userId
            const profileId = req.params.profileId

            // checking follower user
            const user = await profileSchema.findOne({ userId })
            if (!user) {
                success = false
                return res.status(400).send({ success, message: "Not allowed" })
            }
            // checking the user to follow 
            const follow = await profileSchema.findById(profileId)
            if (!follow) {
                success = false
                return res.status(400).send({ success, message: "Profile not found" })
            }
            // checking if the user already follows
            const follows = await followSchema.findOne({
                followerProfileId: user.id,
                profileId: follow.id,
            })

            if (follows) {
                success = false
                return res.status(400).send({ success, message: "Profile already following" })
            }
            // following
            const followCreate = await followSchema.create({
                followerProfileId: user.id,
                profileId: follow.id,
            })
            success = true
            res.send({ success, message: "Following", data: followCreate })

        } catch (error) {
            console.log(error);
            success = false
            res.status(500).send({ success, message: "Internal server error occurred" })
        }

    })


// Route 2: Unfollow a profile DELETE /follow/unfollow/:profileId
router.delete('/unfollow/:profileId', fetchUser,
    async (req, res) => {
        let success
        try {
            const userId = req.userId
            const profileId = req.params.profileId

            // checking follower user
            const user = await profileSchema.findOne({ userId })
            if (!user) {
                success = false
                return res.status(400).send({ success, message: "Not allowed" })
            }
            // checking follwing user
            const follow = await profileSchema.findById(profileId)
            if (!follow) {
                success = false
                return res.status(400).send({ success, message: "Profile not found" })
            }
            // check if the user follows
            const follows = await followSchema.findOne({
                followerProfileId: user.id,
                profileId: follow.id
            })
            if (!follows) {
                success = false
                return res.status(400).send({ success, message: "Something went wrong" })
            }
            // un-following
            const deleteFollow = await followSchema.findOneAndDelete({
                followerProfileId: user.id,
                profileId: follow.id,
            })
            success = true
            res.send({ success, message: "Un-following" })

        } catch (error) {
            success = false
            res.status.send({ success, message: "Internal server error occurred" })
        }

    })


module.exports = router
