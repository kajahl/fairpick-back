import {
    Body,
    Controller,
    Patch,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { EditUserDto } from 'src/dtos/EditUser.dto';
import { AddUserDto } from 'src/dtos/AddUser.dto';
import { UsersService } from '../../services/users/users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('add')
    @UsePipes(ValidationPipe)
    async createUser(@Body() user: AddUserDto) {
        const created = await this.usersService.createUser(user);
        return created;
    }

    @Patch('me')
    @UsePipes(ValidationPipe)
    async editMe(@Body() editMe: EditUserDto) {
        const user = await this.usersService.editUser(1, editMe);
        return user;
    }
}
