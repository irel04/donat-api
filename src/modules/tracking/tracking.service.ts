import { CreateTrackingDto } from '@/modules/tracking/dto/create-tracking.dto';
import { TrackingEntity } from '@/modules/tracking/entities/tracking.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TrackingService {
	constructor(
		@InjectRepository(TrackingEntity)
		private trackingRepository: Repository<TrackingEntity>,
	){}

	async create(createTrackingDto: CreateTrackingDto): Promise<TrackingEntity> {
		const tracking = this.trackingRepository.create(createTrackingDto);

		await this.trackingRepository.save(tracking);
		
		return tracking;
	}

	async findOne(id: string): Promise<TrackingEntity> {
		const tracking = await this.trackingRepository.findOne({
			where: { id: id }
		});	

		if(!tracking) throw new NotFoundException(`Tracking record with id ${id} not found`);

		return tracking;
	}
}
