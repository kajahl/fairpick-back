import { Body, Controller, Patch, UsePipes, ValidationPipe } from '@nestjs/common';
import { EditUserDto } from 'src/dtos/EditUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Patch('me')
    @UsePipes(ValidationPipe)
    async editMe(@Body() editMe: EditUserDto) {
        const user = await this.usersService.editUser(1, editMe);
        return user;
    }
}
