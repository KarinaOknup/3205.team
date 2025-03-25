import  { z } from 'zod';

const schema = z.object({
    originalUrl: z.string().url(),
    expiresAt: z.string().datetime().optional(),
    alias: z.string().trim().max(20).optional(),
    shortId: z.string().optional(),
});

export default schema;