"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const HTTP_STATUS_ERROR_NAMES = {
    [common_1.HttpStatus.BAD_REQUEST]: 'Bad Request',
    [common_1.HttpStatus.UNAUTHORIZED]: 'Unauthorized',
    [common_1.HttpStatus.FORBIDDEN]: 'Forbidden',
    [common_1.HttpStatus.NOT_FOUND]: 'Not Found',
    [common_1.HttpStatus.CONFLICT]: 'Conflict',
    [common_1.HttpStatus.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
    [common_1.HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
    [common_1.HttpStatus.BAD_GATEWAY]: 'Bad Gateway',
    [common_1.HttpStatus.SERVICE_UNAVAILABLE]: 'Service Unavailable',
    [common_1.HttpStatus.GATEWAY_TIMEOUT]: 'Gateway Timeout',
};
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let error = 'Internal Server Error';
        let message = 'An unexpected error occurred. Please try again later.';
        let errors;
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            error = HTTP_STATUS_ERROR_NAMES[status] || error;
            if (typeof res === 'string') {
                message = res;
            }
            else if (typeof res === 'object' && res !== null) {
                const payload = res;
                if (payload.message) {
                    if (Array.isArray(payload.message)) {
                        message = payload.message.join(', ');
                    }
                    else {
                        message = String(payload.message);
                    }
                }
                if (payload.error && typeof payload.error === 'string') {
                    error = payload.error;
                }
                if (payload.errors && typeof payload.errors === 'object' && !Array.isArray(payload.errors)) {
                    errors = payload.errors;
                }
                else if (status === common_1.HttpStatus.BAD_REQUEST && Array.isArray(payload.message)) {
                    errors = this.extractValidationErrors(payload);
                }
            }
        }
        else if (exception instanceof Error) {
            message = exception.message;
        }
        const errorResponse = {
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
    extractValidationErrors(payload) {
        const errors = {};
        if (Array.isArray(payload.message)) {
            payload.message.forEach((validationError) => {
                if (validationError && typeof validationError === 'object') {
                    const property = validationError.property;
                    if (property && validationError.constraints) {
                        const constraintMessages = Object.values(validationError.constraints);
                        if (!errors[property]) {
                            errors[property] = [];
                        }
                        errors[property].push(...constraintMessages);
                    }
                }
            });
        }
        return errors;
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map