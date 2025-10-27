import { CloudinaryResponse } from '@/modules/cloudinary/cloudinaryResponse';
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from "cloudinary"

import * as streamifier from "streamifier";

@Injectable()
export class CloudinaryService {
	upload(files: Express.Multer.File[]): Promise<CloudinaryResponse[]>{
		const uploadPromises = files.map(file => new Promise<CloudinaryResponse>((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				(error, result) => {
					if (error) return reject(new Error(error.message || String(error)));

					resolve(result as CloudinaryResponse);
				}
			)
			streamifier.createReadStream(file.buffer).pipe(uploadStream);
		}))
		
		return Promise.all(uploadPromises);
	}
}
