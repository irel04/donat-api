import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

export interface PaginationMetadata {
	total: number;
	limit: number;
	offset: number;
	nextPage: number | null;
}
export interface TResponse<T> {
	status: number;
	data: T,
	metaData: PaginationMetadata | null;
	timestamp: Date;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, TResponse<T>>{
	intercept(context: ExecutionContext, next: CallHandler): Observable<TResponse<T>>{

		const ctx = context.switchToHttp();
		const res = ctx.getResponse<Response>();


		return next.handle().pipe(
			map((data: T) => {

				if(data && typeof data === "object" && "data" in data && "metadata" in data){

					const { data: paginatedData, metadata } = data as { data: T, metadata: PaginationMetadata };

					return {
						status: res.statusCode,
						data: Array.isArray(paginatedData) ? paginatedData : { ...paginatedData },
						metaData: metadata,
						timestamp: new Date()
					}
				}

				return {
					status: res.statusCode,
					data: Array.isArray(data) ? data : { ...data },
					metaData: null,
					timestamp: new Date()
				}
			})
		);
	}
}
