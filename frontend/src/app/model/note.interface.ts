import { User } from './user.interface';

export interface Note {
    id?: number;
    title?: string;
    text?: string;
    background_color?: string;
    font_color?: FontColor;
    user?: User;
}

export interface Meta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface Links {
    first: string;
    previous: string;
    next: string;
    last: string;
}

export interface NotesPageable {
    items: Object[];
    meta: Meta;
    links: Links;
}

export enum FontColor {
    BLACK = 'black',
    WHITE = 'white'
}