import { User } from '@/modules/users/user.entity';
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum EventStatus {
	APPROVED = "approved",
	PENDING = "pending",
	DECLINED = "declined"
}

@Entity({ name: "events" })
export class EventsEntity {
	// @Exclude()
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: "user_id" })
	user: User;

	@Column()
	description: string;

	@Column({ type: 'enum', enum: EventStatus })
	status: EventStatus;

	@Column({ name: 'start_date', type: 'timestamp' })
	startDate: Date;

	@Column({ name: 'end_date', type: 'timestamp' })
	endDate: Date;

	@Exclude()
	@Column({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	createdAt: Date;

	@Exclude()
	@Column({ name: "updated_at", type: "timestamp", nullable: true, default: null })
	updatedAt: Date | null;
}
