import { env } from 'node:process';
import { after, describe, it } from 'node:test';
import 'dotenv/config';
import * as assert from 'assert';
import * as cache from 'memory-cache';
import { simpleList, getUserId, get, getUserByMobile, listId, listAllId } from '../index';

const { CORP_ID, SECRET, TEST_DEPT_ID, TEST_USER_PHONE, TEST_USER_ID, CONTACT_SECRET } = process.env;
const options = {
    corpId: CORP_ID,
    secret: SECRET,
};

describe('wecom-user-api 测试', function() {
    console.log(TEST_DEPT_ID)
    after(() => cache.clear());
    it('simpleList 获取部门成员', async () => {
        const userlist = await simpleList(TEST_DEPT_ID,  options);
        assert.ok(userlist);
    });
    it('getUserId 根据手机号获取userid', async () => {
        const res = await getUserId(TEST_USER_PHONE, options);
        assert.equal(res, TEST_USER_ID);
    });
    it('get 获取用户详情', async () => {
        const res = await get(TEST_USER_ID, options);
        assert.equal(res.mobile, TEST_USER_PHONE);
    });
    it('getUserByMobile', async () => {
        const res = await getUserByMobile(TEST_USER_PHONE, options);
        assert.equal(res.userid, TEST_USER_ID);
    });
    it('listId 获取企业成员的userid与对应的部门ID列表', async () => {
        const res = await listId({ limit: 1 }, {
            ...options,
            secret: CONTACT_SECRET,
        });
        assert.equal(res.dept_user.length, 1);
    });
    it('listId 获取全部企业成员的userid与对应的部门ID列表', async () => {
        const res = await listAllId({
            ...options,
            secret: CONTACT_SECRET,
        });
        assert.ok(res.length);
    });
});