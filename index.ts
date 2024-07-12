/**
 * 企业微信API-通讯录管理-成员管理
 * https://work.weixin.qq.com/api/doc/90000/90135/90194
 */
import axios from 'axios';
import Debug from 'debug';
import {GetToken, getToken, qyHost, WecomError} from 'wecom-common';
import { WecomResponse } from 'wecom-common';
import {
  Attr, DeptUser,
  ExtAttr, GetUserIdResult,
  GetUserResult,
  UserCreateParams, UserCreateResult,
  UserListParams,
  UserListResult,
  UserUpdateParams
} from './types';
const debug = Debug('wecom-user:debug');
const warn = Debug('wecom-user:warn');
/**
 * 获取部门成员
 * @see https://work.weixin.qq.com/api/doc/90000/90135/90200
 * @param {String} id 部门id
 * @param {Object} options.fetchChild 是否递归获取子部门成员
 * @returns 成员列表
 * @deprecated 企微已停用
 */
export const simpleList = async (id: string, options: any) => {
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
 * @param {Object} user 更新成员请求参数，详见：https://work.weixin.qq.com/api/doc/90000/90135/90197
 * @param {Object} options 配置信息
 * @returns 错误代码
 */
export const update = async (user: UserUpdateParams, options: GetToken):Promise<WecomResponse> => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/user/update?access_token=${token}`, user);
  const { errcode, errmsg } = res.data;
  if (errcode) {
    warn('update失败::', `${errmsg}(${errcode})`);
    throw new WecomError(errcode, errmsg);
  }
  return res.data;
};

/**
 * 创建成员
 * @param {UserCreateParams} user 创建成员请求参数
 * @param {GetToken} options 配置信息
 * @see https://work.weixin.qq.com/api/doc/90000/90135/90195
 * @returns 错误代码
 */
export const create = async (user: UserCreateParams, options: GetToken):Promise<UserCreateResult> => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/user/create?access_token=${token}`, {
    ...user,
    to_invite: false, // 默认不发送邀请
  });
  const { errcode, errmsg } = res.data;
  if (errcode) {
    throw new WecomError(errcode, errmsg);
  }
  return res.data;
};

/**
 * 读取成员
 * https://work.weixin.qq.com/api/doc/90000/90135/90200
 * @param {String} userid 成员id
 * @param {GetToken} options 配置信息
 * @returns 成员
 */
export const get = async (userid: string, options: GetToken):Promise<GetUserResult> => {
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
 * @param {string} userid 成员UserID。对应管理端的账号，详见：https://work.weixin.qq.com/api/doc/90000/90135/90197
 * @param {GetToken} options 配置信息
 * @returns 错误代码
 */
export const del = async (userid: string, options: GetToken):Promise<WecomResponse> => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/user/delete?access_token=${token}&userid=${userid}`);
  const { errcode, errmsg } = res.data;
  if (errcode) {
    warn('delete失败::', `${errmsg}(${errcode})`);
    throw new WecomError(errcode, errmsg);
  }
  return res.data;
};

/**
 * 根据手机号查询用户userid
 * @param {String} mobile 手机号
 * @param {GetToken} options 配置信息
 * @returns userid
 */
export const getUserId = async (mobile: string, options: GetToken):Promise<GetUserIdResult> => {
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/user/getuserid?access_token=${token}`, {
    mobile,
  });
  const { errcode, errmsg, userid } = res.data;
  if (errcode) {
    debug('getUserId失败::', `mobile:${mobile}, ${errmsg}(${errcode})`);
    throw new WecomError(errcode, errmsg);
  }
  return res.data;
}

/**
 * 根据手机号获取企微成员详情
 * @param {String} mobile 手机号
 * @param {GetToken} options 配置信息
 * @returns 成员详情
 */
export const getUserByMobile = async (mobile: string, options: GetToken):Promise<GetUserResult> => {
  const res = await getUserId(mobile, options);
  const userid = res.userid;
  return get(userid, options);
}

/**
 * 添加额外文本信息到成员中
 * @param {ExtAttr} target 扩展对象
 * @param {string} name 文本名称
 * @param {string} value 文本值
 */
export const attachTextExtAttrTo = (target: ExtAttr, name: string, value: string) => {
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
 * @param {ExtAttr} target 自定义字段对象
 * @param {string} name 文本名称
 * @returns
 */
export const getExtAttrFrom = (target: ExtAttr, name: string):{ url: string; title: string } | undefined | string => {
  if(target && target.extattr && target.extattr.attrs) {
    const attr = target.extattr.attrs.find((attr: { name: any; }) => attr.name == name);
    if (attr) {
      return attr.type ? attr.web : attr.text?.value;
    } else return '';
  } else return '';
}

/**
 * 变更主部门
 * @param {string} userid 成员UserID
 * @param {number} newDeptId 新的部门ID
 * @param {Object} options.preserveOldDepts 是否保留原主部门（保存在部门列表中）
 * @returns
 */
export const changeMainDepartment = async (userid: string, newDeptId: number, options: any):Promise<WecomResponse> => {
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
 * @param {UserListParams} params 可选参数
 *  - cursor 下次取值的游标，默认为空
 *  - limit 取值数量，默认为10000，最大10000
 * @param {GetToken} options 凭证（仅支持通过“通讯录同步secret”调用）
 * @see https://developer.work.weixin.qq.com/document/path/96067
 */
export const listId = async (params: UserListParams, options: GetToken):Promise<UserListResult> => {
  params.cursor = params?.cursor || '';
  params.limit = params?.limit || 10000;
  const token = await getToken(options);
  const res = await axios.post(`${qyHost}/user/list_id?access_token=${token}`, params);
  const { errcode, errmsg, next_cursor, dept_user } = res.data;
  if (errcode) {
    debug('listId失败::', `${errmsg}(${errcode})`);
    throw new WecomError(errcode, errmsg);
  }
  return res.data;
}

/**
 * 获取全部企业成员的userid与对应的部门ID列表
 * @param {GetToken} options 凭证（仅支持通过“通讯录同步secret”调用）
 * @returns
 */
export const listAllId = async (options: GetToken): Promise<DeptUser[]> => {
  let dept_user: DeptUser[] = [];
  let cursor: string | undefined = '';
  do {
    const res: UserListResult = await listId({ cursor }, options);
    // 确保 dept_user 是数组类型
    if (Array.isArray(res.dept_user)) {
      dept_user = [...dept_user, ...res.dept_user];
    }
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