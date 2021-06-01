import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throwError } from 'rxjs';
import { from, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserEntity } from 'src/user/models/user.entity';
import { User, UserRole } from 'src/user/models/user.interface';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserSecurityService {

    constructor(
        private authService: AuthService,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<User>,
    ) {}


    findOne(id: number): Observable<User> {
        return from(this.userRepository.findOne({id}, {relations: ['userData']})).pipe(
            map((user: User) => {
                const {password, ...result} = user;
                return result;
            } )
        )
    }

    validateUser(username: string, password: string): Observable<User> {
        return from(this.userRepository.findOne({username}, {select: ['id', 'password', 'username', 'role']})).pipe(
            switchMap((user: User) => this.authService.comparePasswords(password, user.password).pipe(
                map((match: boolean) => {
                    if(match) {
                        const {password, ...result} = user;
                        return result;
                    } else {
                        throw Error;
                    }
                })
            ))
        )

    }

    login(user: User): Observable<string> {
        return this.validateUser(user.username, user.password).pipe(
            switchMap((user: User) => {
                if(user) {
                    return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt));
                } else {
                    return 'Wrong Credentials';
                }
            })
        )
    }

    create(user: User): Observable<User> {
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new UserEntity();
                newUser.username = user.username;
                newUser.password = passwordHash;
                newUser.role = UserRole.USER;

                return from (this.userRepository.save(newUser)).pipe(
                    map((user: User) => {
                        const {password, ...result} = user;
                        return result;
                    }),
                    catchError(err => throwError(err))
                )
            })
        )
    }

    updateOnePassword(id: number, user: User): Observable<any> {
        delete user.username;
        delete user.role;
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new UserEntity();
                newUser.id = user.id;
                newUser.password = passwordHash;
                return  this.userRepository.update(id, newUser)
            })
        )
    }

}
