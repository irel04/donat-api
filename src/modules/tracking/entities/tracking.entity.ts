import { Donation } from '@/modules/donations/entities/donation.entity';
import { User } from '@/modules/users/entities/user.entity';
import { TRACKING_STATUS } from '@/types/tracking-status';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity("tracking")
export class TrackingEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ name: "tracking_number" })
	trackingNumber: string;

	@ManyToOne(() => Donation)
	@JoinColumn({ name: "donation_id" })
	donation: Donation;

	@Column()
	receipt: string;

	@Column()
	status: TRACKING_STATUS;

	@Column({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	createdAt: Date;

	@ManyToOne(() => User)
	@JoinColumn({name: "updated_by"})
	updatedBy: User;

}