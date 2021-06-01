import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Repository, Like } from 'typeorm';
import { User, UserRole } from '../models/user.interface';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, map, catchError} from 'rxjs/operators';
import {paginate, Pagination, IPaginationOptions} from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<User>
    ) {}

    findOne(id: number): Observable<User> {
        return from(this.userRepository.findOne({id}, {relations: ['userData']})).pipe(
            map((user: User) => {
                const {password, ...result} = user;
                return result;
            } )
        )
    }

    findOneAdmin(id: number): Observable<User> {
        return from(this.userRepository.findOne({id}, {relations: ['userData']})).pipe(
            map((user: User) => {
                const {password, ...result} = user;
                return result;
            } )
        )
    }

    findAll(): Observable<User[]> {
        return from(this.userRepository.find()).pipe(
            map((users: User[]) => {
                users.forEach(function (v) {delete v.password});
                return users;
            })
        );
    }

    paginate(options: IPaginationOptions): Observable<Pagination<User>> {
        return from(paginate<User>(this.userRepository, options));
    }

    paginateFilterByUsername(options: IPaginationOptions, user: User): Observable<Pagination<User>> {
        return from(paginate(this.userRepository, options, {
            where: [
                { username: Like(`%${user.username}%`)}
            ]
        }))
    }
    
    deleteOne(id: number): Observable<any> {
        return from(this.userRepository.delete(id));
    }

    updateOne(id: number, user: User): Observable<any> {
        delete user.role;

        return from(this.userRepository.update(id, user)).pipe(
            switchMap(() => this.findOne(id))
        );
    }

    updateOneAdmin(id: number, user: User): Observable<any> {
        return from(this.userRepository.update(id, user));
    }

    checkUsername(user: User): Observable<boolean>{
        return from (this.findAll()).pipe(
            map((users: User[]) => {
                var bool: boolean = false;
                users.forEach(element => {
                    if(element.username === user.username){
                        bool = true;
                    }
                });
                return bool;
            })
        )
    }
}
