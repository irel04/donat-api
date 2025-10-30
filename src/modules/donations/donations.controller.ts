import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, BadRequestException, Query } from '@nestjs/common';
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
  @Get()
  async findAll(@Query() {page=1, size=10, ...queries}: DonationQueryDto) {

    const { type, search } = queries
    
    const { data, total } = await this.donationsService.findAll(size, page, queries.sortBy, queries.sortOrder, {
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDonationDto: UpdateDonationDto) {
    return this.donationsService.update(id, updateDonationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.donationsService.remove(+id);
  }
}
