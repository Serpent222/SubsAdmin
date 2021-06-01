import { Controller, Post, Body, Request, UseGuards, Get, Query, Param, Delete, Put } from '@nestjs/common';
import { NoteService } from '../service/note.service';
import { Observable } from 'rxjs';
import { Note } from '../model/note.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import path = require('path');
import { UserPermitions } from 'src/auth/guards/UserPermitions';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/user/models/user.interface';

export const USER_DATA_URL ='http://localhost:3000/api/note';

@Controller('note')
export class NoteController {

    constructor(private noteService: NoteService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body()note: Note, @Request() req): Observable<Note> {
        const user = req.user;
        return this.noteService.create(user, note);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('')
    index(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        limit = limit > 100 ? 100 : limit;
        

        return this.noteService.paginateAll({
            limit: Number(limit),
            page: Number(page),
            route: USER_DATA_URL
        })
    }

    @UseGuards(JwtAuthGuard)
    @Get('user/:userId')
    indexByUser(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Param('userId') userId: number
    ) {
        limit = limit > 100 ? 100 : limit;

        return this.noteService.paginateByUser({
            limit: Number(limit),
            page: Number(page),
            route: USER_DATA_URL + '/user/' + userId 
        }, Number(userId))
    }

    @UseGuards(JwtAuthGuard)
    @Get('find/user/:userId')
    findByUser(@Param('userId') userId: number): Observable<Note[]>{
        return this.noteService.findByUser(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: number): Observable<Note> {
        return this.noteService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, UserPermitions)
    @Put(':id')
    updateOne(@Param('id') id: number, @Body() note: Note): Observable<Note> {
        return this.noteService.updateOne(Number(id), note);
    }

    @UseGuards(JwtAuthGuard, UserPermitions)
    @Delete(':id')
    deleteOne(@Param('id') id: number): Observable<any> {
        return this.noteService.deleteOne(id);
    }
}
