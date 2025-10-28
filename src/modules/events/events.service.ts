import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';
import { CloudinaryResponse } from '@/modules/cloudinary/cloudinaryResponse';
import { EventImageEntity } from '@/modules/events/eventImage.entity';
import { CreateEventDTO, UpdateEventDTO } from '@/modules/events/events.dto';
import { EventsEntity, EventStatus } from '@/modules/events/events.entity';
import { EVENTS_FILTER, ORDER } from '@/types/filter';
import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class EventsService {
	constructor(
		@InjectRepository(EventsEntity)
		private eventsRepository: Repository<EventsEntity>,
		@InjectRepository(EventImageEntity)
		private eventsImageRepository: Repository<EventImageEntity>,
		private cloudinaryService: CloudinaryService,
	) { }

	private readonly logger = new Logger(EventsService.name);

	async addImageUrlsToEvent(eventId: string, imageUrls: string[]) {
		const event = await this.findEventById(eventId);

		const images = imageUrls.map((url) =>
			this.eventsImageRepository.create({ url, event })
		);

		const savedImages = await this.eventsImageRepository.save(images);

		return savedImages;
	}


	async createEvent(userId: string, payload: CreateEventDTO, files: Express.Multer.File[]): Promise<EventsEntity> {
		let cloudinaryUploadResult: CloudinaryResponse[];
		try {
			cloudinaryUploadResult = await this.cloudinaryService.upload(files)
		} catch (error) {
			this.logger.error(`Cloudinary upload error: ${error.message}`, error.stack);
			throw new InternalServerErrorException("Failed to upload files to Cloudinary");
		}

		const event = this.eventsRepository.create({
			...payload,
			status: EventStatus.PENDING,
			user: { id: userId }
		})

		const savedEvent = await this.eventsRepository.save(event);

		await this.addImageUrlsToEvent(savedEvent.id, cloudinaryUploadResult.map(res => res.secure_url));

		const foundEvent = await this.findEventById(savedEvent.id);

		if (!foundEvent) {
			throw new Error('Event not found after creation');
		}

		return foundEvent;
	}

	async findAllEvents(limit: number = 20, offset: number = 0, search: string, sortBy: EVENTS_FILTER, sortOrder: ORDER): Promise<{ data: EventsEntity[], total: number }> {

		const where = {};
		const order: Record<string, string> = {
			createdAt: "DESC"
		};

		if (search) {
			where["description"] = ILike(`%${search}%`);
		}

		/* eslint-disable @typescript-eslint/no-unused-vars*/
		if (Object.entries(EVENTS_FILTER).some(([_, val]) => val === sortBy)) {
			order[EVENTS_FILTER.CREATED_AT] = sortOrder ?? ORDER.DESC
		}


		const [data, total] = await this.eventsRepository.findAndCount({
			where: {
				isActive: true,
				...where
			},
			order,
			relations: ['user', 'images'],
			skip: offset,
			take: limit
		})


		return { data, total };
	}

	async findEventById(id: string): Promise<EventsEntity> {
		const event = await this.eventsRepository.findOne({
			where: { id, isActive: true },
			relations: ['user', 'images']
		});

		if (!event) throw new NotFoundException(`Event with id ${id} not found`);

		return event;
	}

	async findEventByUser(userId: string, limit: number = 20, offset: number = 0, sortBy: EVENTS_FILTER, sortOrder: ORDER): Promise<{ data: EventsEntity[], total: number }> {
		const [events, total] = await this.eventsRepository.findAndCount({
			where: { user: { id: userId } },
			skip: offset,
			take: limit,
			relations: ["user", 'images'],
			order: { [sortBy]: sortOrder }
		})

		return { data: events, total };
	}

	async editMyEvent(payload: UpdateEventDTO, eventId: string, userId: string): Promise<Partial<EventsEntity> | null> {

		// Check if event is existing
		const event = await this.eventsRepository.findOneBy({
			id: eventId,
			user: {
				id: userId
			}
		})

		if (!event) return null;

		// Proceed to editing when event is found
		await this.eventsRepository.update({
			id: eventId,
			user: {
				id: userId
			}
		}, payload)

		return this.eventsRepository.findOneBy({
			id: eventId
		})
	}

	async approveEvent(eventId: string) {
		const result = await this.eventsRepository.update({ id: eventId }, { status: EventStatus.APPROVED })

		if (result.affected === 0) {
			throw new NotFoundException("Event not found");
		}

	}

	async deleteEvent(eventId: string, userId: string) {
		// Check first if event exist
		const result = await this.eventsRepository.update({ id: eventId, user: { id: userId } }, {
			isActive: false
		})

		if (result.affected === 0) {
			throw new NotFoundException("Event not found or already deleted")
		}
	}
}
