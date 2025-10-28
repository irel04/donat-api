import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity({name: "users"})
export class User {
	// @Exclude()
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({name: 'first_name', nullable: false})
	firstName: string;

	@Column({name: 'last_name', nullable: false})
	lastName: string;

	@Column({nullable: false})
	email: string;

	@Exclude()
	@Column({nullable: false})
	password: string;

	@Column({nullable: false})
	role: string;

	@Exclude()
	@Column({
		name: 'created_at',
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	createdAt: Date;
}