import { Injectable } from '@nestjs/common';
import { Observable, of, from } from 'rxjs';
import { Note } from '../model/note.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { NoteEntity } from '../model/note.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/service/user.service';
import { User } from 'src/user/models/user.interface';
import { switchMap, map, tap } from 'rxjs/operators';
import { Pagination, IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class NoteService {

    constructor(
        @InjectRepository(NoteEntity) private readonly noteRepository: Repository<Note>,
        private userService: UserService
    ) {}


    create(user: User, note: Note): Observable<Note> {
        note.user = user;
        return from(this.noteRepository.save(note));
    }

    findAll(): Observable<Note[]> {
        return from(this.noteRepository.find({relations: ['user']}));
    }

    paginateAll(options: IPaginationOptions): Observable<Pagination<Note>> {
        return from(paginate<Note>(this.noteRepository, options, {
            relations: ['user']
        })).pipe(
            map((Note: Pagination<Note>) => Note)
        )
    }

    paginateByUser(options: IPaginationOptions, userId: number): Observable<Pagination<Note>> {
        return from(paginate<Note>(this.noteRepository, options, {
            relations: ['user'],
            where: [
                {user: userId}
            ]
        })).pipe(
            map((Note: Pagination<Note>) => Note)
        )
    }

    findOne(id: number): Observable<Note> {
        return from(this.noteRepository.findOne({id}, {relations: ['user']}));
    }

    findByUser(userId: number): Observable<Note[]> {
        return from(this.noteRepository.find({
            where: {
                user: userId
            },
            relations: ['user']
        })).pipe(map((Note: Note[]) => Note))
    }

    updateOne(id: number, note: Note): Observable<Note> {
        return from(this.noteRepository.update(id, note)).pipe(
            switchMap(() => this.findOne(id))
        )
    }

    deleteOne(id: number): Observable<any> {
        return from(this.noteRepository.delete(id));
    }

}
