import { EventsEntity } from '@/modules/events/events.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: "event_images"})
export class EventImageEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	 @ManyToOne(() => EventsEntity, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'event_id' }) // optional, but good for clarity
	event: EventsEntity;

	@Column()
	url: string;
}