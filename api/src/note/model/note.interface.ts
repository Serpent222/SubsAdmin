import { User } from "src/user/models/user.interface";

export interface Note {
    id?: number;
    title?: string;
    text?: string;
    background_color?: string;
    font_color?: FontColor;
    user?: User;
}

export enum FontColor {
    BLACK = 'black',
    WHITE = 'white'
}