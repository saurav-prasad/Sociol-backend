const jwt = require('jsonwebtoken');

const JWT_SECRET = 'thisissecret'

const fetchUser = (req, res, next) => {
    let success;
    const token = req.header('auth-token')
    if (!token) {
        success = false
        return res.status(400).send({ success, message: 'Please authenticate with a valid token' })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        // console.log("Auth Token ", data);
        req.userId = data.userId
        next()
    } catch (error) {
        res.status(400).send({ success, message: 'Please authenticate with a valid token' })
    }

}
module.exports = fetchUser