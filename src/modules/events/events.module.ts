import { CloudinaryModule } from '@/modules/cloudinary/cloudinary.module';
import { EventImageEntity } from '@/modules/events/entities/event-image.entity';
import { EventsEntity } from '@/modules/events/entities/events.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([EventsEntity, EventImageEntity]),
		CloudinaryModule
	],
	controllers: [EventsController],
	providers: [EventsService]
})
export class EventsModule { }
