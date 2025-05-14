import { Document } from 'mongoose'

export interface IUser extends Document {
    name: String
    email: string
    password: string
    createdAt: Date 
}
