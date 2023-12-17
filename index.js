const cors = require('cors')
const connectToMongo = require('./db.js')
const express = require('express')

const port = 5000
const app = express()

// mongodb connection
connectToMongo()

// middleware
app.use(cors())
app.use(express.json())

// available routes
app.use('/auth', require('./routes/auth.js'))
app.use('/profile',require('./routes/profile.js'))
app.use('/post',require('./routes/post.js'))
app.use('/comment',require('./routes/comment.js'))
app.use('/follow',require('./routes/follow.js'))
app.use('/like',require('./routes/like.js'))

app.listen(port, (req, res) => {
    console.log("App listening at port", port);
})