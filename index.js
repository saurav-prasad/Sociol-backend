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

app.listen(port, (req, res) => {
    console.log("App listening at port", port);
})