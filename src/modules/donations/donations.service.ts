import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { Donation } from '@/modules/donations/entities/donation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { EventsService } from '@/modules/events/events.service';
import { TrackingService } from '@/modules/tracking/tracking.service';
import { TRACKING_STATUS } from '@/types/tracking-status';
import { generateTrackingNumber } from '@/common/utils/tracking-number-generator';

@Injectable()
export class DonationsService {
  constructor(
    @InjectRepository(Donation)
    private donationRepository: Repository<Donation>,
    private dataSource: DataSource,
    private eventsService: EventsService,
    private trackingService: TrackingService,
  ){}

  create(eventId: string, userId: string, createDonationDto: CreateDonationDto): Promise<Donation> {
    return this.dataSource.transaction(async (manager) => {

      try {
        const donationRepoWithManager = manager.getRepository(Donation);

        const event = await this.eventsService.findEventById(eventId);

        if (!event) throw new NotFoundException(`Event with id ${eventId} not found`);

        const donationRequest = donationRepoWithManager.create({
          ...createDonationDto,
          user: { id: userId },
          event: { id: eventId },
        });

        const savedDonation = await donationRepoWithManager.save(donationRequest);

        await this.trackingService.create({
          donationId: savedDonation.id,
          status: TRACKING_STATUS.FOR_VERIFICATION,
          trackingNumber: generateTrackingNumber()
        }, manager);

        const donationRecord = await this.findOne(savedDonation.id, manager);

        return donationRecord;
      } catch (error) {
        console.error(`Error finding donation record: ${error.message}`);
        throw new InternalServerErrorException('Failed to retrieve donation record after creation');
      }

    })
  }

  findAll() {
    return `This action returns all donations`;
  }

  async findOne(id: string, manager?: EntityManager) {
    let donation: Donation | null;

    if (manager) {
      // EntityManager.findOne requires the entity class as the first argument
      donation = await manager.findOne(Donation, {
        where: { id: id },
        relations: ['user', 'event'],
      });
    } else {
      donation = await this.donationRepository.findOne({
        where: { id: id },
        relations: ['user', 'event'],
      });
    }

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
