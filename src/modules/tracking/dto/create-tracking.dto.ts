import { User } from '@/modules/users/entities/user.entity';
import { TRACKING_STATUS } from '@/types/tracking-status';
import { IsNotEmpty } from 'class-validator';

export class CreateTrackingDto {

	@IsNotEmpty()
	donationId: string;

	@IsNotEmpty()
	trackingNumber: string;

	@IsNotEmpty()
	status: TRACKING_STATUS;

	receipt?: string;

	updatedBy?: User;

	createdAt?: Date;

}