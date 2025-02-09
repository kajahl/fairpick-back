import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './Role';

@Entity()
export class User {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ nullable: false, default: '' })
    username: string;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: false, default: '' })
    password: string;

    @ManyToOne(() => Role, role => role.id)
    role: Role;
}
