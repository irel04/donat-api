import { Module } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donation } from '@/modules/donations/entities/donation.entity';
import { EventsModule } from '@/modules/events/events.module';
import { TrackingModule } from '@/modules/tracking/tracking.module';

@Module({
  imports: [TypeOrmModule.forFeature([Donation]), EventsModule, TrackingModule],
  controllers: [DonationsController],
  providers: [DonationsService],
})
export class DonationsModule {}
