import type { ValidationChain } from 'express-validator';
import winston from 'winston';
import express, { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
declare const logger: winston.Logger;
export declare const authLimiter: express.RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const generalLimiter: express.RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const ussdLimiter: express.RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const validateLogin: ValidationChain[];
export declare const validateCertificateGeneration: ValidationChain[];
export declare const validateQuizSubmission: ValidationChain[];
export declare const handleValidationErrors: (req: Request, res: Response, next: NextFunction) => void;
export declare const requestLogger: (req: Request, res: Response, next: NextFunction) => void;
export declare const corsOptions: {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void;
    credentials: boolean;
    optionsSuccessStatus: number;
    methods: string[];
    allowedHeaders: string[];
};
export declare const authenticateToken: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const sanitizeInput: (req: Request, _res: Response, next: NextFunction) => void;
export declare const securityHeaders: (_req: Request, res: Response, next: NextFunction) => void;
export declare const requestId: (req: Request & {
    id?: string;
}, res: Response, next: NextFunction) => void;
export declare const errorLogger: (err: Error, req: Request, _res: Response, next: NextFunction) => void;
export declare const developmentErrorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => void;
export declare const productionErrorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => void;
export declare const notFoundHandler: (req: Request, res: Response) => void;
export declare const userRateLimit: () => express.RequestHandler;
export declare const ipRateLimit: (max: number, windowMs: number) => express.RequestHandler;
export declare const validateAnonymousCode: (code: string) => boolean;
export declare const maskSensitiveData: (data: Record<string, unknown>) => Record<string, unknown>;
export { logger };
//# sourceMappingURL=security.d.ts.map