const asyncHandler = require('../errorHandlers/asyncHandler')
const Task = require('../models/Task')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errorHandlers/customError')
const { OK, CREATED, UNAUTHORIZED, BAD_REQUEST, NOT_FOUND } = StatusCodes

exports.createTask = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    if (!title || !description) {
        throw new CustomError('You must supply a title and description for you task.', BAD_REQUEST)
    }
    const task = await Task.create({
        title, 
        description,
        user: req.user
    })
    res.status(CREATED).json({
        task
    })
})

exports.getTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params
    const task = await Task.findById(taskId)
    if (!task) {
        throw new CustomError('No task found.', NOT_FOUND)
    }

    if (task.user !== req.user.id) {
        throw new CustomError('Unauhtorized', UNAUTHORIZED)
    }
    res.status(OK).json({
        task
    })
})

exports.getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({
        user: req.user.id
    })
    res.status(OK).json({
        tasks
    })
})

exports.updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params
    const { title, description } = req.body
    if (!title && !description) {
        throw new CustomError('Nothing to update.', BAD_REQUEST)
    }
    const task = await Task.findById(taskId)
    if (!task) {
        throw new CustomError('No task found.', NOT_FOUND)
    }
    if (task.user !== req.user.id) {
        throw new CustomError('Unauhtorized', UNAUTHORIZED)
    }
    if (title) {
        task.title = title
    }
    if (description) {
        task.description = description
    }
    await task.save()
    res.status(OK).json({
        task
    })
})

exports.deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params
    const task = await Task.findById(taskId)
    if (!task) {
        throw new CustomError('No task found.', NOT_FOUND)
    }

    if (task.user !== req.user.id) {
        throw new CustomError('Unauthorized', UNAUTHORIZED)
    }
    await task.remove()
    res.status(OK).json({
        msg: 'Task deleted.'
    })
})