import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class EditUserDto {
    @IsOptional()
    @MinLength(4)
    username: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @MinLength(8)
    password: string;
}
