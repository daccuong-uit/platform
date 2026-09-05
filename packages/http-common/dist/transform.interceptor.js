"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let TransformInterceptor = class TransformInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)((resData) => {
            // If already fully wrapped
            if (resData &&
                typeof resData === 'object' &&
                'statusCode' in resData &&
                'data' in resData &&
                'meta' in resData) {
                if (Array.isArray(resData.data)) {
                    return resData;
                }
                if (resData.data &&
                    typeof resData.data === 'object' &&
                    !Array.isArray(resData.data) &&
                    Object.keys(resData.data).every((key) => /^\d+$/.test(key))) {
                    return {
                        statusCode: resData.statusCode,
                        data: Object.values(resData.data),
                        meta: {
                            ...resData.meta,
                            timestamp: resData.meta?.timestamp || new Date().toISOString(),
                            path: resData.meta?.path || '',
                        },
                        ...(resData.message ? { message: resData.message } : {}),
                    };
                }
                return resData;
            }
            // If it's a paginated or custom DTO containing data + meta
            if (resData &&
                typeof resData === 'object' &&
                'data' in resData &&
                'meta' in resData) {
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
            if (resData &&
                typeof resData === 'object' &&
                'message' in resData) {
                const { message, ...rest } = resData;
                return {
                    statusCode: 200,
                    message: message,
                    data: rest,
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
        }));
    }
};
exports.TransformInterceptor = TransformInterceptor;
exports.TransformInterceptor = TransformInterceptor = __decorate([
    (0, common_1.Injectable)()
], TransformInterceptor);
//# sourceMappingURL=transform.interceptor.js.map