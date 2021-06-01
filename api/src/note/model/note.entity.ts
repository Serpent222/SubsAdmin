import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate, ManyToOne, Double } from "typeorm";
import { UserEntity } from "src/user/models/user.entity";
import { FontColor } from "./note.interface";


@Entity('note')
export class NoteEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({default: ''})
    text: string;

    @Column()
    background_color: string;

    @Column({type: 'enum', enum: FontColor})
    font_color: FontColor;

    @ManyToOne(type => UserEntity, user => user.userData, { onDelete: 'CASCADE' })
    user: UserEntity;
}