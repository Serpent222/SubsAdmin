import { Controller, Post, Body, Get, Param, Delete, Put, UseGuards, Query } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User, UserRole } from '../models/user.interface';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UserIsUserGuard } from 'src/auth/guards/UserIsUser.guard';
import { UserSecurityService } from 'src/auth/services/user-security/user-security.service';


@Controller('users')
export class UserController {

    constructor(private userService: UserService, private userSecurityService: UserSecurityService) { }

    @Post()
    create(@Body() user: User): Observable<User | Object> {
        return this.userSecurityService.create(user).pipe(
            map((user: User) => user),
            catchError(err => of({ error: err.message }))
        );
    }

    @Post('login')
    login(@Body() user: User): Observable<Object> {
        return this.userSecurityService.login(user).pipe(
            map((jwt: string) => {
                return { access_token: jwt };
            })
        )
    }

    @Post('/check/username/:username')
    checkUsername(@Param() username: User): Observable<boolean> {
        return this.userService.checkUsername(username);
    }

    @UseGuards(JwtAuthGuard, UserIsUserGuard)
    @Get(':id')
    findOne(@Param() params): Observable<User> {
        return this.userService.findOne(params.id);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':id/admin')
    findOneAdmin(@Param() params): Observable<User> {
        return this.userService.findOne(params.id);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Observable<Pagination<User>> {
        limit = limit > 100 ? 100 : limit;

        return this.userService.paginate({ 
            page: Number(page), 
            limit: Number(limit), 
            route: 'http://localhost:3000/api/users'});
    }
    

    @Get('search/by/username/:username')
    findAllByUsername(
        @Param('username') username: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Observable<Pagination<User>> {
        return this.userService.paginateFilterByUsername(
            { page: Number(page), limit: Number(limit), route: `http://localhost:3000/api/users/search/by/username/${username}` },
            {username}
        );
    }

    

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    deleteOne(@Param('id') id: string): Observable<any> {
        return this.userService.deleteOne(Number(id));
    }

    @UseGuards(JwtAuthGuard, UserIsUserGuard)
    @Put(':id/password')
    updateOnePassword(@Param('id') id: string, @Body() user: User): Observable<any> {
        return this.userSecurityService.updateOnePassword(Number(id), user);
    }

    @UseGuards(JwtAuthGuard, UserIsUserGuard)
    @Put(':id')
    updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
        return this.userService.updateOne(Number(id), user);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id/admin')
    updateOneAdmin(@Param('id') id: string, @Body() user: User): Observable<User> {
        return this.userService.updateOneAdmin(Number(id), user);
    }
}
