import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiSuccessResponse } from './api-response.types';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiSuccessResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiSuccessResponse<T>> {
    return next.handle().pipe(
      map((resData) => {
        // If already fully wrapped
        if (
          resData &&
          typeof resData === 'object' &&
          'statusCode' in resData &&
          'data' in resData &&
          'meta' in resData
        ) {
          if (Array.isArray(resData.data)) {
            return resData as ApiSuccessResponse<T>;
          }

          if (
            resData.data &&
            typeof resData.data === 'object' &&
            !Array.isArray(resData.data) &&
            Object.keys(resData.data).every((key) => /^\d+$/.test(key))
          ) {
            return {
              statusCode: resData.statusCode,
              data: Object.values(resData.data) as T,
              meta: {
                ...resData.meta,
                timestamp: resData.meta?.timestamp || new Date().toISOString(),
                path: resData.meta?.path || '',
              },
              ...(resData.message ? { message: resData.message } : {}),
            };
          }

          return resData as ApiSuccessResponse<T>;
        }

        // If it's a paginated or custom DTO containing data + meta
        if (
          resData &&
          typeof resData === 'object' &&
          'data' in resData &&
          'meta' in resData
        ) {
          return {
            statusCode: 200,
            data: resData.data,
            meta: {
              ...resData.meta,
              timestamp: new Date().toISOString(),
              path: '',
            },
            ...(resData.message ? { message: resData.message } : {}),
          };
        }

        // If service returned an object with an embedded message
        if (
          resData &&
          typeof resData === 'object' &&
          'message' in resData
        ) {
          const { message, ...rest } = resData as Record<string, unknown>;
          return {
            statusCode: 200,
            message: message as string,
            data: rest as T,
            meta: {
              timestamp: new Date().toISOString(),
              path: '',
            },
          };
        }

        // Default wrap
        return {
          statusCode: 200,
          data: resData,
          meta: {
            timestamp: new Date().toISOString(),
            path: '',
          },
        };
      }),
    );
  }
}
