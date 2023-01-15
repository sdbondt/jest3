const express = require('express')
const app = express()

const errorHandler = require('./errorHandlers/errorHandler')
const notFoundHandler = require('./errorHandlers/notFoundHandler')
const authRoutes = require('./routes/authRoutes')
const taskRoutes = require('./routes/taskRoutes')
const auth = require('./middleware/auth')

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/tasks', auth, taskRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app