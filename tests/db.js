const mongoose = require('mongoose')
const User = require('../models/User')
const connectToDB = require('../db/connectToDB')
const jwt = require('jsonwebtoken')
const Task = require('../models/Task')

const userId = new mongoose.Types.ObjectId()
const userTwoId = new mongoose.Types.ObjectId()

const userToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
)

const userTwoToken = jwt.sign(
    { userId: userTwoId },
    process.env.JWT_SECRET,
    { expiresIn: '30d'}
)
const genericUser = {
    _id: userId,
    email: 'generic@gmail.com',
    password: '123TESTtest'
}

const userTwo = {
    _id: userTwoId,
    email: 'user2@gmail.com',
    password: '123TESTtest'
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    title: 'test',
    description: 'test test test',
    user: userId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    title: 'test 2',
    description: 'test2 test2 test2',
    user: userId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    title: 'test 3',
    description: 'test3 test3 test3',
    user: userTwoId
}

const setupDatabase = async () => {
    await connectToDB(process.env.MONGO_TEST_URI)
    await User.deleteMany({})
    await Task.deleteMany({})
    await User.create(genericUser)
    await User.create(userTwo)
    await Task.create(taskOne)
    await Task.create(taskThree)
    await Task.create(taskTwo)
}

module.exports = {
    userToken,
    userId,
    genericUser,
    userTwo,
    userTwoToken,
    taskOne,
    taskThree,
    taskTwo,
    setupDatabase
}