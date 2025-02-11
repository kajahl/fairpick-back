import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EditUserDto } from 'src/dtos/EditUser.dto';
import { User as UserEntity } from 'src/typeorm';
import { User } from 'src/types/User';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AddUserDto } from 'src/dtos/AddUser.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
    ) {}

    /**
     * Tworzenie nowego użytkownika w bazie danych - lokalne konto do którego będą przypisywane konta zewnętrzne
     * @param user Dane nowego użytkownika pochodzące z zewnętrznego konta
     * @returns Zwraca obiekt użytkownika
     */
    async createUser(user: AddUserDto): Promise<User> {
        const existingUser = await this.userRepository.findOne({
            where: [{ username: user.username }, { email: user.email }],
        });

        if (existingUser) {
            throw new BadRequestException('User with this username or email already exists');
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        const created = await this.userRepository.save({
            ...user,
            password: hashedPassword,
        });
        return created;
    }

    /**
     * Aktualizowanie lokalnego konta użytkownika
     * @param id Id użytkownika
     * @param user Nowe dane użytkownika
     * @returns Zwraca obiekt użytkownika (aktualizowany obiekt)
     */
    async editUser(id: number, user: EditUserDto): Promise<User> {
        const existingUser = await this.userRepository.findOne({ where: { id } });
        if (!existingUser) throw new NotFoundException('User not found');

        await this.userRepository.update(id, user);
        const updatedUser = await this.userRepository.findOne({ where: { id } });
        if(updatedUser === null) throw new InternalServerErrorException('User not updated. Contact with support');
        return updatedUser;
    }

    async findOneByUsername(username: string): Promise<UserEntity | null> {
        return await this.userRepository.findOne({ where: { username } });
    }

    async findOneByEmail(email: string): Promise<UserEntity | null> {
        return await this.userRepository.findOne({ where: { email } });
    }
}