import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { Donation } from '@/modules/donations/entities/donation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { EventsService } from '@/modules/events/events.service';
import { TrackingService } from '@/modules/tracking/tracking.service';
import { TRACKING_STATUS } from '@/types/tracking-status';
import { generateTrackingNumber } from '@/common/utils/tracking-number-generator';
import { DONATIONS_FILTER } from '@/types/filter';
import { ORDER, SORT_BY } from '@/types/sort';
import { DataAndTotal } from '@/types/data-and-total';

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
        console.error(`Error: ${error.message}`);
        throw new InternalServerErrorException(error.message);
      }

    })
  }

  async findAll(size: number = 50, page: number = 1, sortBy: SORT_BY = SORT_BY.CREATED_AT, sortOrder: ORDER = ORDER.DESC, filter: DONATIONS_FILTER): Promise<DataAndTotal<Donation>> {

    let where: FindOptionsWhere<Donation> | FindOptionsWhere<Donation>[] = [];

    

    if(filter.search){
      const search = ILike(`%${filter.search}%`)
      where = [
        { ...(filter.type ? { type: filter.type } : {}), name: search },
        { ...(filter.type ? { type: filter.type } : {}), description: search },
      ]
    } else if (filter.type) {
      where = [{ type: filter.type }];
    }

    const [data, total] = await this.donationRepository.findAndCount({
      where,
      take: size,
      skip: (page - 1) * size,
      order: {
        [sortBy]: sortOrder
      },
      relations: ['user', 'event'],
    });

    return { data, total };
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
