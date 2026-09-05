import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

const HTTP_STATUS_ERROR_NAMES: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'Bad Request',
  [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
  [HttpStatus.FORBIDDEN]: 'Forbidden',
  [HttpStatus.NOT_FOUND]: 'Not Found',
  [HttpStatus.CONFLICT]: 'Conflict',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
  [HttpStatus.BAD_GATEWAY]: 'Bad Gateway',
  [HttpStatus.SERVICE_UNAVAILABLE]: 'Service Unavailable',
  [HttpStatus.GATEWAY_TIMEOUT]: 'Gateway Timeout',
};

export interface ApiErrorResponse {
  statusCode: number;
  error: string;
  message: string;
  path?: string;
  timestamp: string;
  errors?: Record<string, string[]>;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';
    let message = 'An unexpected error occurred. Please try again later.';
    let errors: Record<string, string[]> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      error = HTTP_STATUS_ERROR_NAMES[status] || error;

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const payload = res as Record<string, unknown>;

        if (payload.message) {
          if (Array.isArray(payload.message)) {
            message = payload.message.join(', ');
          } else {
            message = String(payload.message);
          }
        }

        if (payload.error && typeof payload.error === 'string') {
          error = payload.error;
        }

        if (payload.errors && typeof payload.errors === 'object' && !Array.isArray(payload.errors)) {
          errors = payload.errors as Record<string, string[]>;
        } else if (status === HttpStatus.BAD_REQUEST && Array.isArray(payload.message)) {
          errors = this.extractValidationErrors(payload);
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse: ApiErrorResponse = {
      statusCode: status,
      error,
      message,
      path: request?.url,
      timestamp: new Date().toISOString(),
    };

    if (errors && Object.keys(errors).length > 0) {
      errorResponse.errors = errors;
    }

    response.status(status).send(errorResponse);
  }

  private extractValidationErrors(payload: Record<string, unknown>): Record<string, string[]> {
    const errors: Record<string, string[]> = {};

    if (Array.isArray(payload.message)) {
      payload.message.forEach((validationError: any) => {
        if (validationError && typeof validationError === 'object') {
          const property = validationError.property;
          if (property && validationError.constraints) {
            const constraintMessages = Object.values(validationError.constraints);
            if (!errors[property]) {
              errors[property] = [];
            }
            errors[property].push(...(constraintMessages as string[]));
          }
        }
      });
    }

    return errors;
  }
}
