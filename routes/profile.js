const express = require('express');
const router = express.Router()
const profileSchema = require('../schema/profile');
const fetchUser = require('../middleware/fetchUser');
const userSchema = require('../schema/user');

// Route 1: Read a profile- POST /profile/getprofile/:profileId => not required login

router.get('/getprofile/:profileId', async (req, res) => {
    let success
    try {
        const profileId = req.params.profileId

        const profile = await profileSchema.findById(profileId)
        if (!profile) {
            success = false
            return res.status(400).send({ success, message: "Profile not found" })
        }

        success = true
        res.send({
            success, message: "Profile found", data: {
                profileId: profile.id,
                profilePhoto: profile.profilePhoto,
                username: profile.username,
                bio: profile.bio,
                name: profile.name
            }
        })

    } catch (error) {
        success = false
        res.status(500).send({ success, message: "Internal server error occurred" })
    }
})

// Route 2: Read a profile- POST /profile/getprofile/:profileId => required login

router.get('/fetchprofile', fetchUser,
    async (req, res) => {
        let success
        try {
            const profile = await profileSchema.findOne({ userId: req.userId })
            if (!profile) {
                success = false
                return res.status(400).send({ success, message: "Profile not found" })
            }
            success = true
            res.send({ success, message: "Profile found", data: profile })

        } catch (error) {
            success = false
            res.status(500).send({ success, message: "Internal server error occurred" })
        }
    })

// Route 3: Update a profile- POST /profile/updateprofile/:profileId => required login

router.post('/updateprofile', fetchUser,
    async (req, res) => {
        let success
        try {
            // const profileId = req.params.profileId
            const { name, bio, profilePhoto, phone } = req.body

            const newProfileData = {}
            if (name) { newProfileData = { ...newProfileData, name: newProfileData.name } }
            if (bio) { newProfileData = { ...newProfileData, bio: newProfileData.bio } }
            if (profilePhoto) { newProfileData = { ...newProfileData, profilePhoto: newProfileData.profilePhoto } }
            if (phone) { newProfileData = { ...newProfileData, phone: newProfileData.phone } }

            // find user
            let user = await userSchema.findById(req.userId)

            if (!user) {
                success = false
                return res.status(400).send({ success, message: "Not allowed" })
            }
            // find user and profile
            user = await profileSchema.findOne({ userId: req.userId })
            if (!user) {
                success = false
                return res.status(400).send({ success, message: "Not allowed" })
            }

            //  find profile and update
            let profile = await profileSchema.findByIdAndUpdate(user.id, { $set: newProfileData }, { new: true })

            if (!profile) {
                success = false
                return res.status(400).send({ success, message: "Profile not found" })
            }
            success = true
            res.send({ success, message: "Profile updated", data: profile })

        } catch (error) {
            success = false
            res.status(500).send({ success, message: "Internal server error occurred" })
        }
    })


module.exports = router

