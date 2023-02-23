import assert from 'assert';
import cache from 'memory-cache';
import { simpleList, getUserId, get, getUserByMobile } from '../index.mjs';

const { CORP_ID, SECRET, TEST_DEPT_ID, TEST_USER_PHONE, TEST_USER_ID } = process.env;
const options = {
  corpId: CORP_ID,
  secret: SECRET,
};

describe('wecom-user-api 测试', function () {
  after(() => cache.clear());
  this.timeout(100000);
  it('simpleList 获取部门成员', async () => {
    const userlist = await simpleList(TEST_DEPT_ID, {
      fetchChild: true,
    }, options);
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
});