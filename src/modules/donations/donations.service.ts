import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { Donation } from '@/modules/donations/entities/donation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventsService } from '@/modules/events/events.service';
import { TrackingService } from '@/modules/tracking/tracking.service';
import { DONATION_TYPE } from '@/types/dontation-type';
import { TRACKING_STATUS } from '@/types/tracking-status';
import { generateTrackingNumber } from '@/common/utils/tracking-number-generator';

@Injectable()
export class DonationsService {
  constructor(
    @InjectRepository(Donation)
    private donationRepository: Repository<Donation>,
    private eventsService: EventsService,
    private trackingService: TrackingService,
  ){}

  async create(eventId: string, userId: string, createDonationDto: CreateDonationDto): Promise<Donation> {
    const event = await this.eventsService.findEventById(eventId);

    if(!event) throw new NotFoundException(`Event with id ${eventId} not found`);

    const donationRequest = this.donationRepository.create({
      ...createDonationDto,
      user: { id: userId },
      event,
    })

    await this.donationRepository.save(donationRequest);

    const trackingRecord = await this.trackingService.create({
      donationId: donationRequest.id,
      status: TRACKING_STATUS.FOR_VERIFICATION,
      trackingNumber: generateTrackingNumber()
    });

    

    const donationRecord = await this.findOne(donationRequest.id);



    return donationRecord;

  }

  findAll() {
    return `This action returns all donations`;
  }

  async findOne(id: string) {
    const donation = await this.donationRepository.findOne({
      where: { id: id },
      relations: ['user', 'event', 'trackingRecords'],
    });

    if (!donation) throw new NotFoundException(`Donation with id ${id} not found`);

    return donation;
  }

  update(id: string, updateDonationDto: UpdateDonationDto) {
    console.info(updateDonationDto)
    return `This action updates a #${id} donation`;
  }

  remove(id: number) {
    return `This action removes a #${id} donation`;
  }
}
