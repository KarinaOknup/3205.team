import { Request as ExpressRequest } from 'express';

export type Request = ExpressRequest & {ctx?: { validatedData?: any}};

export type CreateParams = {
    originalUrl: string
    expiresAt: Date
    alias: string
    shortId: string
}

export type RedirectParams = {
    shortId: string,
    userIp?: string
}

export type ShortIdParams = {
    shortId: string,
}