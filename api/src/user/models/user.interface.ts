import { Note } from "src/note/model/note.interface";

export interface User {
    id?: number;
    username?: string;
    password?: string;
    role?: UserRole;
    userData?: Note[];
}

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}