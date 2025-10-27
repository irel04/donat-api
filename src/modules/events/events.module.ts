import { EventsEntity } from '@/modules/events/events.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { CloudinaryModule } from '@/modules/cloudinary/cloudinary.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([EventsEntity]),
		CloudinaryModule
	],
	controllers: [EventsController],
	providers: [EventsService]
})
export class EventsModule {}
