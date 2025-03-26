import db from '../db'
import { CreateParams, RedirectParams, ShortIdParams } from '../types'

const BASE_URL = process.env.BASE_API_URL

function createShortUrl(shortId){
    return `${BASE_URL}/${shortId}`;
}

async function create(data: CreateParams) {
    let shortUrl = createShortUrl(data.shortId);
    const alias = data.alias ? data.alias.replace(/[\/|\\&\? ]/g,'_') : undefined;
    if (alias && alias.length > 0) {
        const isExist = await db.url.findFirst({
            where: {
                OR: [
                    {
                        alias,
                    },
                    { 
                        shortUrl,
                    }
                  ],

                expiresAt:{
                    gte: new Date().toISOString()
                },
                isDeleted: false
            },
            select: {
                id: true
            }
        })

        if (isExist) {
            throw new Error('Link with this alias already exists');
        }
        shortUrl = createShortUrl(data.alias);
    }

    const url = await db.url.create({
        data: {
            originalUrl: data.originalUrl,
            shortUrl,
            alias,
            expiresAt: data.expiresAt ? new Date(data.expiresAt) : new Date('3000-01-01'),
        }
    });

    return url;
}

async function getOriginalUrl(data: RedirectParams) {
    const url = await db.url.findFirst({
        where: {
            shortUrl: createShortUrl(data.shortId),
            expiresAt:{
                gte: new Date()
            },
            isDeleted: false
        },
        select: {
            id: true,
            originalUrl: true
        }
    })

    if (url){
        await db.redirect.create({
            data:{
                urlId: url.id,
                shortUrl: createShortUrl(data.shortId),
                userIp: data.userIp
            }
        })
    }

    return url?.originalUrl || null;
}

async function getInfo(data:ShortIdParams) {
    const url = await db.url.findFirst({
        where:{
            shortUrl: createShortUrl(data.shortId),
            expiresAt:{
                gte: new Date()
            },
            isDeleted: false
        },
        select: {
            originalUrl: true,
            createdAt: true,
            id: true
        }
    })
    let count = 0;

    if(url){
        count = await db.redirect.count({
            where:{
                urlId: url.id
            }
        })
    }

    return {
        originalUrl: url?.originalUrl,
        createdAt: url?.createdAt,
        clickCount: count,
    }
}

async function deleteUrl(data:ShortIdParams) {
    await db.url.updateMany({
        where: {
            isDeleted: false,
            shortUrl: createShortUrl(data.shortId),
        },
        data: {
            isDeleted: true
        }
    })
    return;
}

async function getAnalytics(data:ShortIdParams) {
    const count = await db.redirect.count({
        where:{
            shortUrl: createShortUrl(data.shortId),
        }
    })
    const userIps = await db.redirect.groupBy({
        by: ['userIp'],
        where: {
            shortUrl: createShortUrl(data.shortId),
        },
        orderBy: {
            _max: { createdAt: 'desc' }
        },
        take: 5 
    });

    return {
        count,
        userIps: userIps.map(row => row.userIp)
    }
}

export default {
    create,
    getOriginalUrl,
    getInfo,
    deleteUrl,
    getAnalytics
}