import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteEntity } from './model/note.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { NoteController } from './controller/note.controller';
import { NoteService } from './service/note.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([NoteEntity]),
        AuthModule,
        UserModule
    ],
    controllers: [NoteController],
    providers: [NoteService]
})
export class NoteModule {}
