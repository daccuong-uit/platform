import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export interface ApiErrorResponse {
    statusCode: number;
    error: string;
    message: string;
    path?: string;
    timestamp: string;
    errors?: Record<string, string[]>;
}
export declare class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void;
    private extractValidationErrors;
}
