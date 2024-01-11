const express = require('express');
const fetchUser = require('../middleware/fetchUser');
const router = express.Router()
const profileSchema = require('../schema/profile')
const followSchema = require('../schema/follow')


// Route 1: Follow a profile POST /follow/createfollow/:profileId -> login required
router.get('/createfollow/:profileId', fetchUser,
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

            // checking security issues
            if (userId === profileId) {
                success = false
                return res.status(400).send({ success, message: "Not allowed" })
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


// Route 2: Unfollow a profile DELETE /follow/unfollow/:profileId -> login required
router.get('/unfollow/:profileId', fetchUser,
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


// Route 3: Check if a user follows a profile GET /follow/iffollow/:profileId -> login required
router.get('/iffollow/:profileId', fetchUser,
    async (req, res) => {
        let success;
        try {
            const userId = req.userId;
            const profileId = req.params.profileId


            const user = await profileSchema.findOne({ userId })
            if (!user) {
                success = false
                return res.status(400).send({ success, message: "Not allowed" })
            }
            const follows = await profileSchema.findById(profileId)
            if (!follows) {
                success = false
                return res.status(400).send({ success, message: "Profile not found" })
            }

            const checkFollow = await followSchema.findOne({
                profileId,
                followerProfileId: user.id
            })
            if (!checkFollow) {
                success = true
                return res.send({ success, message: "Not following", data: { following: false } })
            }
            success = true
            res.send({ success, message: "Following", data: { following: true } })
        } catch (error) {
            success = false
            res.status(500).send({ success, message: "Internal server error occurred" })
        }
    })

// Route 4: Get all followers GET /follow/getfollowers/:profileId -> no login required
router.get('/getfollowers/:profileId', async (req, res) => {
    try {
        let success
        const profileId = req.params.profileId

        const profile = await profileSchema.findById(profileId)
        if (!profile) {
            success = false
            return res.status(400).send({ success, message: "Profile not found" })
        }
        const followers = await followSchema.find({ profileId })

        if (followers?.length === 0) {
            success = true
            return res.send({ success, message: "No followers", data: [] })
        }

        const followersData = await Promise.all(
            followers.map(async (data) => {
                const profileData = await profileSchema.findById(data.followerProfileId);

                return {
                    id: data.id,
                    profileId: profileData.id,
                    profilePhoto: profileData.profilePhoto,
                    username: profileData.username,
                    about: profileData.about
                };
            })
        );

        success = true
        res.send({ success, message: "Followers present", data: followersData })
    } catch (error) {
        success = false
        res.status(500).send({ success, message: "Internal server error occurred" })
    }
})

// Route 5: Get all following profiles  GET /follow/getfollowing -> no login required
router.get('/getfollowings/:profileId', async (req, res) => {
    try {
        let success
        const userId = req.params.profileId
        // checking user
        const user = await profileSchema.findById(userId)
        if (!user) {
            success = false
            return res.status(400).send({ success, message: "Profile not found" })
        }

        const following = await followSchema.find({ followerProfileId: user.id })

        if (following?.length === 0) {
            success = true
            return res.send({ success, message: "No profile following", data: [] })
        }

        const followingData = await Promise.all(
            following.map(async (data) => {
                const profileData = await profileSchema.findById(data.profileId);

                return {
                    id: data.id,
                    profileId: profileData.id,
                    profilePhoto: profileData.profilePhoto,
                    username: profileData.username,
                    about: profileData.about
                };
            })
        );

        success = true
        res.send({ success, message: "Following profiles", data: followingData })
    } catch (error) {
        success = false
        res.status(500).send({ success, message: "Internal server error occurred" })
    }
})

// Route 6: Get all followers GET /follow/gettotalfollowers/:profileId -> not login required
router.get('/gettotalfollowers/:profileId', async (req, res) => {
    try {
        let success
        const profileId = req.params.profileId

        const profile = await profileSchema.findById(profileId)
        if (!profile) {
            success = false
            return res.status(400).send({ success, message: "Profile not found" })
        }
        const followers = await followSchema.find({ profileId })

        success = true
        res.send({ success, message: "Followers present", data: { totalFollowers: followers?.length } })
    } catch (error) {
        success = false
        res.status(500).send({ success, message: "Internal server error occurred" })
    }
})

// Route 7 : Get all following profiles  GET /follow/gettotalfollowing ->  not login required
router.get('/gettotalfollowings/:profileId', async (req, res) => {
    try {
        let success
        const userId = req.params.profileId
        // checking user
        const user = await profileSchema.findById(userId)
        if (!user) {
            success = false
            return res.status(400).send({ success, message: "Profile not found" })
        }

        const following = await followSchema.find({ followerProfileId: user.id })

        success = true
        res.send({ success, message: "Following profiles", data: { totalFollowings: following?.length } })
    } catch (error) {
        success = false
        res.status(500).send({ success, message: "Internal server error occurred" })
    }
})


module.exports = router
