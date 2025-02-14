import {
    Column,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { Role } from './Role';
import { TwitchUserEntity } from './TwitchUser.entity';

@Entity({ name: 'users' })
@Unique(['email', 'username'])
export class User {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ nullable: false, default: '' })
    username: string;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: false, default: '' })
    password: string;

    @Column({
        nullable: true,
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date | null;

    @ManyToOne(() => Role, (role) => role.id, { nullable: true })
    role: Role;

    @OneToOne(() => TwitchUserEntity, twitchUser => twitchUser.user)
    twitchUser: TwitchUserEntity;
}
