/**
 * 企业微信API-通讯录管理-成员管理
 * https://work.weixin.qq.com/api/doc/90000/90135/90194
 */
import axios from 'axios';
import Debug from 'debug';
import { getToken, qyHost, WecomError } from 'wecom-common';
const debug = Debug('wecom-user:debug');
const warn = Debug('wecom-user:warn');
/**
 * 获取部门成员
 * @see https://work.weixin.qq.com/api/doc/90000/90135/90200
 * @param {String} id 部门id
 * @param {Boolean} fetchChild 是否递归获取子部门成员
 * @returns 成员列表
 * @deprecated 企微已停用
 */
export const simpleList = async (id: any, options: any) => {
  const fetchChild = options.fetchChild || false;
  const token = await getToken(options);
  const res = await axios.get(`${qyHost}/user/simplelist?access_token=${token}&department_id=${id}&fetch_child=${fetchChild ? 1 : 0}`);

  const { errcode, errmsg, userlist } = res.data;

  if (errcode) {
    warn('simpleList::出错', `${errmsg}(${errcode})`);
    throw new WecomError(errcode, errmsg);
  }
  debug('simpleList结果长度::', userlist.length);
  return userlist;
};

/**
 * 更新成员
 * @param {Object} dept 成员信息，详见：https://work.weixin.qq.com/api/doc/90000/90135/90197
 * @returns 错误代码
 */
export const update = async (user: any, options = {}) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/user/update?access_token=${token}`, user);
  const { errcode, errmsg } = res.data;
  if (errcode) {
    warn('update失败::', `${errmsg}(${errcode})`);
    throw new WecomError(errcode, errmsg);
  }
  return errcode;
};

/**
 * 创建成员
 * @param {Object} dept 成员信息，详见：https://work.weixin.qq.com/api/doc/90000/90135/90195
 * @returns 错误代码
 */
export const create = async (user: any, options = {}) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/user/create?access_token=${token}`, {
    ...user,
    to_invite: false, // 默认不发送邀请
  });
  const { errcode, errmsg } = res.data;
  if (errcode) {
    throw new WecomError(errcode, errmsg);
  }
  return errcode;
};

/**
 * 读取成员
 * https://work.weixin.qq.com/api/doc/90000/90135/90200
 * @param {String} userid 成员id
 * @returns 成员
 */
export const get = async (userid: any, options = {}) => {
  const token = await getToken(options);
  const res = await axios.get(`${qyHost}/user/get?access_token=${token}&userid=${userid}`);
  const { errcode, errmsg } = res.data;
  if (errcode) {
    throw new WecomError(errcode, errmsg);
  }
  return res.data;
};

/**
 * 删除成员
 * @param {Object} dept 成员信息，详见：https://work.weixin.qq.com/api/doc/90000/90135/90197
 * @returns 错误代码
 */
export const del = async (userid: any, options = {}) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/user/delete?access_token=${token}&userid=${userid}`);
  const { errcode, errmsg } = res.data;
  if (errcode) {
    warn('delete失败::', `${errmsg}(${errcode})`);
    throw new WecomError(errcode, errmsg);
  }
  return errcode;
};

/**
 * 根据手机号查询用户userid
 * @param {String} mobile 手机号
 * @param {Object} options 配置信息
 * @returns userid
 */
export const getUserId = async (mobile: any, options = {}) => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/user/getuserid?access_token=${token}`, {
    mobile,
  });
  const { errcode, errmsg, userid } = res.data;
  if (errcode) {
    debug('getUserId失败::', `mobile:${mobile}, ${errmsg}(${errcode})`);
    throw new WecomError(errcode, errmsg);
  }
  return userid;
}

/**
 * 根据手机号获取企微成员详情
 * @param {String} mobile 手机号
 * @param {Object} options 配置
 * @returns 成员详情
 */
export const getUserByMobile = async (mobile: any, options = {}) => {
  const userid = await getUserId(mobile, options);
  return get(userid, options);
}

/**
 * 添加额外文本信息到成员中
 * @param {*} target
 * @param {*} name
 * @param {*} value
 */
export const attachTextExtAttrTo = (target: any, name: any, value: any) => {
  if (!target.extattr) {
    target.extattr = {
      attrs: [],
    }
  }
  target.extattr.attrs.push({
    type: 0,
    name,
    text: {
      value,
    },
  });
}

/**
 * 从成员数据中读取额外信息
 * @param {*} target
 * @param {*} name
 * @returns
 */
export const getExtAttrFrom = (target: any, name: any) => {
  if(target && target.extattr && target.extattr.attrs) {
    const attr = target.extattr.attrs.find((attr: { name: any; }) => attr.name == name);
    if (attr) {
      return attr.type ? attr.web : attr.value;
    } else return '';
  } else return '';
}

/**
 * 变更主部门
 * @param {*} userid
 * @param {*} newDeptId
 * @param {Boolean} preserveOldDepts 是否保留原主部门（保存在部门列表中）
 * @returns
 */
export const changeMainDepartment = async (userid: any, newDeptId: any, options: any) => {
  const preserveOldDepts = options.preserveOldDepts || true;
  const user = preserveOldDepts ? await get(userid, options) : { department: [] };
  return update({
    userid,
    department: Array.from(new Set([
      ...user.department,
      newDeptId,
    ])),
    main_department: newDeptId,
  }, options);
}

/**
 * 获取企业成员的userid与对应的部门ID列表
 * @param {Object} params 可选参数
 *  - cursor 下次取值的游标，默认为空
 *  - limit 取值数量，默认为10000，最大10000
 * @param {Object} options 凭证（仅支持通过“通讯录同步secret”调用）
 * @see https://developer.work.weixin.qq.com/document/path/96067
 */
export const listId = async (params: any, options = {}) => {
  params.cursor = params?.cursor || '';
  params.limit = params?.limit || 10000;
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/user/list_id?access_token=${token}`, params);
  const { errcode, errmsg, next_cursor, dept_user } = res.data;
  if (errcode) {
    debug('listId失败::', `${errmsg}(${errcode})`);
    throw new WecomError(errcode, errmsg);
  }
  return { next_cursor, dept_user };
}

/**
 * 获取全部企业成员的userid与对应的部门ID列表
 * @param {Object} options 凭证（仅支持通过“通讯录同步secret”调用）
 * @returns
 */
export const listAllId = async (options: any) => {
  let dept_user: any[] = [];
  let cursor = '';
  do {
    const res = await listId({ cursor }, options);
    dept_user = [
      ...dept_user,
      ...res.dept_user,
    ];
    cursor = res.next_cursor;
  } while (cursor);
  return dept_user;
}

export default {
  simpleList,
  update,
  create,
  get,
  getUserId,
  getUserByMobile,
  attachTextExtAttrTo,
  getExtAttrFrom,
  changeMainDepartment,
  listId,
  listAllId,
}