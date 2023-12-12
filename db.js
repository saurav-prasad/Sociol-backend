const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://saurav:18042003@sociolcluster.td3gkhv.mongodb.net/?retryWrites=true&w=majority'

const connectToMongo = () => {
    mongoose.connect(mongoURI).
        then(() => { console.log("Connected to monogo..."); })
        .catch((err) => { console.log(err); })
}

module.exports = connectToMongo