const express = require('express')
const { createTask, updateTask, getTasks, deleteTask, getTask } = require('../controllers/taskController')
const router = express.Router()

router.post('/', createTask)
router.patch('/:taskId', updateTask)
router.get('/', getTasks)
router.get('/:taskId', getTask)
router.delete('/:taskId', deleteTask)

module.exports = router