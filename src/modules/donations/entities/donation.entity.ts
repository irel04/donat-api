import { EventsEntity } from '@/modules/events/entities/events.entity';
import { TrackingEntity } from '@/modules/tracking/entities/tracking.entity';
import { User } from '@/modules/users/entities/user.entity';
import { DONATION_TYPE } from '@/types/dontation-type';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity("donations")
export class Donation {

	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: "user_id" })
	user: User;

	@ManyToOne(() => EventsEntity)
	@JoinColumn({ name: "event_id" })
	event: EventsEntity;

	@OneToMany(() => TrackingEntity, (tracking) => tracking.donation)
	trackingRecords: TrackingEntity[];

	@Column()
	name: string;

	@Column()
	description: string;

	@Column()
	type: DONATION_TYPE;

	@Column({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	createdAt: Date;
}
