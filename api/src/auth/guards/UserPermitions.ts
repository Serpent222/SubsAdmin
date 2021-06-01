import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { User } from "src/user/models/user.interface";
import { map } from "rxjs/operators";
import { NoteService } from "src/note/service/note.service";
import { Note } from "src/note/model/note.interface";


@Injectable()
export class UserPermitions implements CanActivate{

    constructor(
        private noteService: NoteService
    ) {

    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const params = request.params;
        const user: User = request.user;

        return this.noteService.findOne(params.id).pipe(
            map((note: Note) => {
                let hasPermission = false;
                
                if(user.id === Number(note.user.id)) {
                    hasPermission = true;
                }

                return user && hasPermission;                
            })
        )
    }


}