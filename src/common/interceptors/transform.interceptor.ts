import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';


export interface TResponse<T> {
	status: number;
	data: T
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, TResponse<T>>{
	intercept(context: ExecutionContext, next: CallHandler): Observable<TResponse<T>>{

		const ctx = context.switchToHttp();
		const res = ctx.getResponse<Response>();


		return next.handle().pipe(
			map((data: T) => ({
				status: res.statusCode,
				data: { ...data },
				timestamp: new Date()
			}))
		);
	}
}
