import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class AddUserDto {
    @IsNotEmpty()
    @MinLength(4)
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    password: string;
}
