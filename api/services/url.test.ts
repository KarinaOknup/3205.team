import {describe, expect, test, beforeAll, afterAll} from '@jest/globals'
import urlServer from './url'
import { nanoid } from 'nanoid'

describe('URL server test', () => {
    let alias;

    beforeAll(() => {
        alias = nanoid();
    });

    async function create() {
        return await urlServer.create({
            originalUrl: 'https://jut.su/chikyuu-no-undou/',
            alias
        })
    }

    test('Create url with original aliase created', async () => {
        const res = await create();

        expect(res).toHaveProperty('shortUrl');
    });

    test('Throw error on create url with exists aliase', async () => {
        expect.assertions(1);
        try {
            await create();
          } catch (error) {
            expect(error.message).toMatch('Link with this alias already exists');
          }
    });

    afterAll(async () => {
        await urlServer.deleteUrl({shortId: alias});
    });
  });