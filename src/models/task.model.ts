import mongoose, { Schema, model } from 'mongoose';
import { ITask } from '../types/task';

const TaskSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    dueDate: {
        type: Date,
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.model<ITask>('Task', TaskSchema)
