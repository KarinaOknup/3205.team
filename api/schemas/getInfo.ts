import  { z } from 'zod';

const schema = z.object({
    shortId: z.string(),
});

export default schema;