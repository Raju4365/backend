import { Request, Response } from 'express';
import User from '../models/user.model';
import { IUser } from '../types/user';
import { handleError, validateObjectId } from '../utils/validator';

// Get all users
export const getUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find().select('-password').lean();
        res.status(200).json(users);
    } catch (error) {
        handleError(res, error);
    }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!validateObjectId(id, res)) return;

        const user = await User.findById(id).select('-password').lean();
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        handleError(res, error);
    }
};

// Create new user
export const createUser = async (req: Request<{}, {}, IUser>, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const existingUser = await User.findOne({ email }).select('_id').lean();
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = new User({ name, email, password });
        const savedUser = await user.save();

        const { _id, name: userName, email: userEmail, createdAt } = savedUser;
        res.status(201).json({ _id, name: userName, email: userEmail, createdAt });
    } catch (error) {
        handleError(res, error);
    }
};

// Update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        if (!validateObjectId(id, res)) return;
        if (!name && !email) {
            res.status(400).json({ message: 'No update fields provided' });
            return;
        }

        const updateData: Partial<IUser> = {};
        if (name) updateData.name = name;
        if (email) {
            const emailExists = await User.findOne({ email, _id: { $ne: id } }).select('_id').lean();
            if (emailExists) {
                res.status(400).json({ message: 'Email already in use' });
                return;
            }
            updateData.email = email;
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).select('-password').lean();

        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        handleError(res, error);
    }
};

// Delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!validateObjectId(id, res)) return;

        const deletedUser = await User.findByIdAndDelete(id).lean();
        if (!deletedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        handleError(res, error);
    }
};
