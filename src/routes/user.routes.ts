import { Router } from 'express'
import { createUser, getUsers , getUserById, deleteUser, updateUser} from '../controllers/user.controller'

const router = Router()

// Get all users
router.get('/', getUsers)

// Get user by id
router.get('/:id',getUserById)

// Create new user
router.post('/', createUser)

// Delete user 
router.delete('/:id',deleteUser)

// Update user
router.patch('/:id',updateUser)
export default router