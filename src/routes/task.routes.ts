import { Router } from 'express'
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from '../controllers/task.controller'

const router = Router()

// Get all tasks
router.get('/', getTasks)

// Get task by id
router.get('/:id',getTaskById)

// Create new task
router.post('/',createTask)

// Delete task
router.delete('/:id',deleteTask)

// Update user
router.patch('/:id',updateTask)
export default router
