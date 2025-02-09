import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ nullable: false, default: 0 })
    rank: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false, default: '' })
    description: string;
}