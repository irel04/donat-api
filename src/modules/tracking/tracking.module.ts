import { Module } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackingEntity } from '@/modules/tracking/entities/tracking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrackingEntity])],
  controllers: [TrackingController],
  providers: [TrackingService],
  exports: [TrackingService],
})
export class TrackingModule {}
