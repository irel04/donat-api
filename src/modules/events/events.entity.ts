import { EventImageEntity } from '@/modules/events/eventImage.entity';
import { User } from '@/modules/users/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

	@OneToMany(() => EventImageEntity, (image) => image.event, { cascade: true })
	images: EventImageEntity[];

	@Column({ type: 'enum', enum: EventStatus })
	status: EventStatus;

	@Column({ name: 'start_date', type: 'date' })
	startDate: Date;

	@Column({ name: 'end_date', type: 'date' })
	endDate: Date;

	@Column({name: "is_active", type: "boolean"})
	isActive: boolean;

	@Column({name: "start_time", type: "time"})
	startTime: string;

	@Column({name: "end_time", type: "time"})
	endTime: string;

	// @Exclude()
	@Column({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	createdAt: Date;

	// @Exclude()
	@Column({ name: "updated_at", type: "timestamp", nullable: true, default: null })
	updatedAt: Date | null;
}
