import { Public } from '@/common/decorators/public.decorator';
import { Role, Roles } from '@/common/decorators/role.decorator';
import { UserParam } from '@/common/decorators/user.decorator';
import { PaginationMetadata } from '@/common/interceptors/transform.interceptor';
import { CreateEventDTO, PaginationDTO, UpdateEventDTO } from '@/modules/events/events.dto';
import { EventsService } from '@/modules/events/events.service';
// import { EVENTS_FILTER, ORDER } from '@/types/filter';
import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';

@UseInterceptors(ClassSerializerInterceptor)
@Controller({
	path: "events",
	version: "1"
})
export class EventsController {
	constructor(
		private eventService: EventsService
	){}

	@Post()
	async postAnEvent(@Body() createEventDto: CreateEventDTO, @UserParam("sub") userId: string){
		return this.eventService.createEvent(createEventDto, userId);
	}

	@Public()
	@Get()
	async getAllEvents(@Query() { size = 20, page = 1, search, sortBy, sortOrder }: PaginationDTO) {
		
		if(page <= 0){
			throw new BadRequestException("You cannot paginated less than or equal 0")
		}

		const offset = (page - 1) * size

		const { data, total } = await this.eventService.findAllEvents(size, offset, search, sortBy, sortOrder);

		const metadata: PaginationMetadata = {
			size,
			page: total > 0 ? page : 0,
			totalPage: Math.ceil(total / size),
			total,
			nextPage: offset + size < total ? offset + size : null
		}

		return {
			data,
			metadata
		};
	}

	@Get('me')
	async getMyEvents(@UserParam("sub") userId: string, @Query() { size = 20, page = 1 }: PaginationDTO) {

		if(page <= 0){
			throw new BadRequestException("You cannot paginated less than or equal 0")
		}

		const offset = (page - 1) * size

		const { data, total } = await this.eventService.findEventByUser(userId, size, offset);

		const metadata: PaginationMetadata = {
			size,
			page: total > 0 ? page : 0,
			totalPage: Math.ceil(total / size),
			total,
			nextPage: offset + size < total ? offset + size : null
		}

		return {
			data,
			metadata
		};
	}


	@Public()
	@Get(':eventId')
	getEventById(@Param('eventId') eventId: string) {
		return this.eventService.findEventById(eventId);
	}

	@Patch(":eventId/edit-my-event")
	async editMyEvent(@Param("eventId") eventId: string, @UserParam("sub") userId: string, @Body() payload: UpdateEventDTO){
		const event = await this.eventService.editMyEvent(payload, eventId, userId)

		if(!event){
			throw new NotFoundException("Event associated with the provided credential was not found")
		}

		return event;
	}

	// Approved event by user with role - Admin
	@Patch(":eventId/approve-event")
	@HttpCode(204)
	@Roles(Role.Admin)
	async approveEvent(@Param("eventId") eventId: string){
		await this.eventService.approveEvent(eventId);
	}

	// Soft delete - marking event as inactive and will delete using CRON 
	@Delete(":eventId")
	@HttpCode(204)
	async deleteEvent(@Param("eventId") eventId: string, @UserParam("sub") userId: string){
		await this.eventService.deleteEvent(eventId, userId);
	}
}
