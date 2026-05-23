const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const coursesRouter = require('./routes/coursesRoutes')
const authRoutes = require('./routes/authRoutes');

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRouter)

app.listen(3001)
