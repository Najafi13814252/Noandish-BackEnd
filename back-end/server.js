const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const coursesRouter = require('./routes/coursesRoutes')
const authRoutes = require('./routes/authRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const cartRoutes = require('./routes/cartRoutes');
const errorHandler = require('./middlewares/errorHandlerMiddleware')
require('dotenv').config()

const app = express()

const allowedOrigins = [
    'http://localhost:3000',
    'https://noandish.runflare.run'
]
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use(bodyParser.json())
app.use(errorHandler)

app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRouter)
app.use('/api/favorites', favoritesRoutes)
app.use('/api/cart', cartRoutes)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})