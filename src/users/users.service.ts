import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EditUserDto } from 'src/dtos/EditUser.dto';
import { User as UserEntity } from 'src/typeorm';
import { User } from 'src/types/User';
import { Repository } from 'typeorm';

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
    async createUser(user: Omit<User, 'id'>): Promise<User> {
        const created = await this.userRepository.save(user);
        return created;
    }

    /**
     * Aktualizowanie lokalnego konta użytkownika
     * @param id Id użytkownika
     * @param user Nowe dane użytkownika
     * @returns Zwraca obiekt użytkownika (aktualizowany obiekt)
     */
    async editUser(id:number, user: EditUserDto): Promise<User> {
        const updated = await this.userRepository.update(id, user);
        if(!!!updated.affected) throw new Error('User not found');
        return updated.raw; //TODO: Sprawdzić poprawność typu zwracanego
    }

    async findOne(params: any): Promise<User> {
        const user = await this.userRepository.findOne(params);
        if(user == null) throw new Error('User not found');
        return user;
    }
}
