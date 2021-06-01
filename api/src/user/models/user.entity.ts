import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Migration } from "typeorm";
import { UserRole } from "./user.interface";
import { NoteEntity } from "src/note/model/note.entity";


@Entity('user')
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({select: false})
    password: string;

    @Column({type: 'enum', enum: UserRole, default: UserRole.USER})
    role: UserRole;

    @OneToMany(type => NoteEntity, NoteEntity => NoteEntity.user)
    userData: NoteEntity[];

}