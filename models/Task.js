const mongoose = require('mongoose')
const { Schema, model } = mongoose

const TaskSchema = new Schema({
    title: {
        type: String,
        required: [true, 'You must give your task a title'],
        min: [1, 'Min title length is 1 character.'],
        max: [20, 'Max title length is 20 characters']
    },
    description: {
        type: String,
        required: [true, 'You must add a description to your task.'],
        min: [1, 'Min description length is 1 character.'],
        max: [1000, 'Max description length is 1000.']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Your task must belong to a user']
    }
})

const Task = model('Task', TaskSchema)
module.exports = Task