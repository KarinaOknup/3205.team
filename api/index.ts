import express, { Express, Response, NextFunction} from 'express';
import requestIp from 'request-ip'
import bodyParser from 'body-parser'
import cors from 'cors'

import { Request } from './types'
import urlService from './services/url'
import validation from './validation'

import {
    createSchema,
    redirectSchema,
    getInfoSchema,
    deleteSchema,
    analyticsSchema,
} from './schemas'

const app: Express = express();
const port = 8100;

const corsOptions = {
    origin : ['http://localhost:3000'],
 }

app.use(cors(corsOptions))
app.use(bodyParser.json({ limit: '50mb' }));

app.use((req: Request, res: Response, next: NextFunction) => {
    req.ctx = {};
    next();
  });

const router = express.Router();

router.post('/shorten', validation(createSchema), async (req: Request, res: Response) => {
    try {
        const result = await urlService.create(req.ctx.validatedData);
        res.status(200).send(result);
    } catch (err){
        console.log('ERROR:', err);
        res.status(400).send({message: err.message});
    }
});

router.get(`/info/:shortId`, validation(getInfoSchema),  async (req: Request, res: Response) => {
    try {
        const info = await urlService.getInfo(req.ctx.validatedData);
        console.log(info)
        res.status(200).send(info);
    } catch (err) {
        console.log('ERROR:', err);
        res.status(400).send({message: err.message});
    }
})

router.delete('/:shortId', validation(deleteSchema), async (req: Request, res: Response) => {
    console.log(req.ctx.validatedData)
    try {
        await urlService.deleteUrl(req.ctx.validatedData);
        res.status(200).send();
    } catch (err) {
        console.log('ERROR:', err);
        res.status(400).send({message: err.message});
    }
})

router.get(`/analytics/:shortId`, validation(analyticsSchema), async (req: Request, res: Response) => {
    try {
        const info = await urlService.getAnalytics(req.ctx.validatedData);
        res.status(200).send(info);
    } catch (err) {
        console.log('ERROR:', err);
        res.status(400).send({message: err.message});
    }
})

const routerRedirect = express.Router();

routerRedirect.get('/:shortId', validation(redirectSchema), async (req: Request, res: Response) => {
    try {
        const originalUrl = await urlService.getOriginalUrl({
            ...req.ctx.validatedData,
            userIp: requestIp.getClientIp(req)
        });

        if (originalUrl) {
            res.redirect(originalUrl);
            return;
        }

        res.status(404);
    } catch (err){
        console.log('ERROR:', err);
        res.status(400).send({message: err.message});
    }
});
app.use('/api/v1', router);
app.use('/', routerRedirect);

app.listen(port, () => console.log(`Running on port ${port}`));
