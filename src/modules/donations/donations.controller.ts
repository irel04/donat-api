import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, BadRequestException } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { UserParam } from '@/common/decorators/user.decorator';
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

  @Get()
  findAll() {
    return this.donationsService.findAll();
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
