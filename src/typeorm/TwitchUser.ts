import { Column, Entity } from "typeorm";

@Entity()
export class TwitchUser {
    @Column({ type: 'varchar', length: 255, primary: true })
    id: string;

    @Column({ type: 'varchar', length: 255 })
    login: string;

    @Column({ type: 'varchar', length: 255 })
    display_name: string;

    @Column({ type: 'varchar', length: 255 })
    profile_image_url: string;

    @Column({ type: 'varchar', length: 255 })
    email: string;

    @Column({
        nullable: true,
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date | null;
}