const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const coursesRouter = require('./routes/coursesRoutes')
const authRoutes = require('./routes/authRoutes');
require('dotenv').config()

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRouter)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})