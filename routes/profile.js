const express = require('express');
const router = express.Router()
const profileSchema = require('../schema/profile');
const fetchUser = require('../middleware/fetchUser');
const userSchema = require('../schema/user');

function isEmail(emailAdress) {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (emailAdress.match(regex))
        return true;

    else
        return false;
}

// Route 1: Read a profile- GET /profile/getprofile/:profileId => not required login

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
        res.send({ success, message: "Profile found", data: profile })

    } catch (error) {
        success = false
        res.status(500).send({ success, message: "Internal server error occurred" })
    }
})
// Route 2: Read a profile by username- GET /profile/getprofile/:username => no required login

router.get('/getprofilebyusername/:username', async (req, res) => {
    let success
    try {
        const username = req.params.username

        const profile = await profileSchema.findOne({ username })
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
// Route 3: get all profile- GET /getallprofile => no required login

router.get('/getallprofile', async (req, res) => {
    let success
    try {
        const profiles = await profileSchema.find()
        if (!profiles) {
            success = false
            return res.status(400).send({ success, message: "Something went wrong" })
        }

        const profilesData = await Promise.all(profiles.map(async (data) => {
            // console.log(data);
            const user = await profileSchema.findById(data.id)
            // console.log(user);
            return {
                id: data.id,
                profileId: user.id,
                username: user.username,
                profilePhoto: user.profilePhoto,
            }
        }))

        success = true
        res.send({ success, message: "Profile found", data: [...profilesData] })

    } catch (error) {
        success = false
        res.status(500).send({ success, message: "Internal server error occurred" })
    }
})

// Route 3: Read a profile- POST /profile/getprofile/:profileId => required login

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

// Route 4: Update a profile- POST /profile/updateprofile/:profileId => required login

router.post('/updateprofile', fetchUser,
    async (req, res) => {
        let success
        try {
            // const profileId = req.params.profileId
            const { name, bio, profilePhoto, phone, about, username, email } = req.body

            let newProfileData = {}
            let newAuthUserData = {}
            if (name) { newProfileData = { ...newProfileData, name } }
            if (about) { newProfileData = { ...newProfileData, about } }
            if (bio) { newProfileData = { ...newProfileData, bio } }
            if (profilePhoto) { newProfileData = { ...newProfileData, profilePhoto } }
            if (phone) { newProfileData = { ...newProfileData, phone } }
            if (username) {
                if (username.length >= 3) {
                    newAuthUserData = { ...newAuthUserData, username }
                }
                else if (username.length <= 3) {
                    success = false
                    return res.status(400).send({ success, message: "Username should not be greater than 15 characters" })
                }
                else {
                    success = false
                    return res.status(400).send({ success, message: "Username should be atleast of 3 characters long" })
                }
            }
            if (email) {

                if (isEmail(email)) {
                    newAuthUserData = { ...newAuthUserData, email }
                }
                else {
                    success = false
                    return res.status(400).send({ success, message: "Please enter a valid email" })
                }
            }
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

            // TODO  find user and update


            // checking the email
            if (newAuthUserData.email && newAuthUserData.email != user.email) {
                const user1 = await userSchema.findOne({ email })
                if (user1) {
                    success = false
                    return res.status(400).send({ success, message: "Email already exist" })
                }
                else {
                    let authUser = await userSchema.findByIdAndUpdate(user.userId, { email: email }, { new: true })
                    newProfileData = { ...newProfileData, email }
                }
            }

            // checking the username
            if (newAuthUserData.username && newAuthUserData.username != user.username) {
                // checking the email
                const user1 = await userSchema.findOne({ username })
                if (user1) {
                    success = false
                    return res.status(400).send({ success, message: "Username already taken" })
                }
                else {
                    let authUser = await userSchema.findByIdAndUpdate(user.userId, { username: username }, { new: true })
                    newProfileData = { ...newProfileData, username }
                }
            }

            //  find profile and update
            let profile = await profileSchema.findByIdAndUpdate(user.id, { $set: newProfileData }, { new: true })

            if (!profile) {
                success = false
                return res.status(400).send({ success, message: "Something went wrong" })
            }


            success = true
            res.send({ success, message: "Profile updated", data: profile })

        } catch (error) {
            console.log(error);
            success = false
            res.status(500).send({ success, message: "Internal server error occurred" })
        }
    })


module.exports = router

