import { CloudinaryResponse } from '@/modules/cloudinary/cloudinaryResponse';
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from "cloudinary"

import streamifier from "streamifier";

@Injectable()
export class CloudinaryService {
	upload(file: Express.Multer.File): Promise<CloudinaryResponse>{
		return new Promise<CloudinaryResponse>((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream((err, result) => {
				if (err) return reject(new Error(err.message || String(err)));
				
				if(result) resolve(result)
			})

			 streamifier.createReadStream(file.buffer).pipe(uploadStream);
		})
	}
}
