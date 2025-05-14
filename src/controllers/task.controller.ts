import { Request, Response } from "express";
import Task from "../models/task.model"; 
import { handleError, validateObjectId } from "../utils/validator"; 
import { ITask } from "../types/task";

// Get all tasks
export const getTasks = async (_req: Request, res: Response): Promise<void> => {
    try {
        const tasks = await Task.find().lean();
        res.status(200).json(tasks);
    } catch (error) {
        handleError(res, error);
    }
};

// Get Task by ID
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!validateObjectId(id, res)) return;

        const task = await Task.findById(id).lean();
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        res.status(200).json(task);
    } catch (error) {
        handleError(res, error);
    }
};

// Create new task
export const createTask = async (req: Request<{}, {}, ITask>, res: Response): Promise<void> => {
    try {
        const { title, description, dueDate, completed } = req.body;

        if (!title) {
            res.status(400).json({ message: 'Title is required field.' });
            return;
        }

        const task = new Task({ title, description, dueDate, completed });
        const savedTask = await task.save();

        res.status(201).json({
            _id: savedTask._id,
            title: savedTask.title,
            description: savedTask.description,
            dueDate: savedTask.dueDate,
            completed: savedTask.completed,
        });

    } catch (error) {
        handleError(res, error);
    }
};

// Update task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description, duedate, completed } = req.body;

        if (!validateObjectId(id, res)) return;

        if (!title && !description && !duedate &&  !completed) {
            res.status(400).json({ message: 'No update fields provided' });
            return;
        }

        const updateData: Partial<ITask> = {};
        if (title) updateData.title = title
           if (description) updateData.description = description;
        if (duedate) updateData.dueDate = duedate;
        if (completed) updateData.completed = completed;

        const updatedTask = await Task.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).lean();

        if (!updatedTask) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        handleError(res, error);
    }
};

// Delete task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!validateObjectId(id, res)) return;

        const deletedTask = await Task.findByIdAndDelete(id).lean();
        if (!deletedTask) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        handleError(res, error);
    }
};
