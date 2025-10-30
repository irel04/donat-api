import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, BadRequestException, Query, HttpCode } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { UserParam } from '@/common/decorators/user.decorator';
import { DonationQueryDto } from '@/modules/donations/dto/donation-query.dto';
import { Public } from '@/common/decorators/public.decorator';
import { PaginationMetadata } from '@/common/interceptors/transform.interceptor';
@UseInterceptors(ClassSerializerInterceptor)
@Controller({
  version: "1",
  path: 'donations',
})
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post(":eventId")
  create(@Param('eventId') eventId: string, @UserParam("sub") userId: string, @Body() createDonationDto: CreateDonationDto) {

    if(eventId === ":eventId" || eventId.trim() === "") throw new BadRequestException("Event ID is required");

    return this.donationsService.create(eventId, userId, createDonationDto);
  }

  @Public()
  @Get(":eventId")
  async findAll(@Query() {page=1, size=10, ...queries}: DonationQueryDto, @Param("eventId") eventId: string) {

    if(eventId === ":eventId") throw new BadRequestException("Event id not found")

    const { type, search } = queries
    
    const { data, total } = await this.donationsService.findAll(eventId, size, page, queries.sortBy, queries.sortOrder, {
      search,
      type
    });

    const totalPage = Math.ceil(total/size)

    const metadata: PaginationMetadata = {
      page,
      size,
      total,
      nextPage: page < totalPage ? page + 1 : null,
      totalPage
    }

    return { data, metadata }
  }

  @Get(':donationId')
  findOne(@Param('donationId') id: string) {
    return this.donationsService.findOne(id);
  }

  @Patch(':donationId')
  @HttpCode(204)
  update(@Param('donationId') donationId: string, @UserParam("sub") userId: string, @Body() updateDonationDto: UpdateDonationDto) {
    return this.donationsService.update(donationId, userId, updateDonationDto);
  }

  @Delete(':donationId')
  @HttpCode(204)
  remove(@Param('donationId') id: string) {
    return this.donationsService.remove(id);
  }
}
