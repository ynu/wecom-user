/**
 * 企业微信API-通讯录管理-成员管理
 * https://work.weixin.qq.com/api/doc/90000/90135/90194
 */
 const fetch = require('node-fetch');
 const debug = require('debug')('wecom-user:debug');
 const warn = require('debug')('wecom-user:warn');
 const { getToken, qyHost, WecomError } = require('wecom-common');

 /**
  * 获取部门成员
  * @see https://work.weixin.qq.com/api/doc/90000/90135/90200
  * @param {String} id 部门id
  * @param {Boolean} fetchChild 是否递归获取子部门成员
  * @returns 成员列表
  */
 const simpleList = async (id, options = {}) => {
   const fetchChild = options.fetchChild || false;
   const token = await getToken(options);
   const res = await fetch(`${qyHost}/user/simplelist?access_token=${token}&department_id=${id}&fetch_child=${fetchChild ? 1 : 0}`, {
     method: 'GET',
   });
   const { errcode, errmsg, userlist } = await res.json();
   
   if (errcode === 0) {
     debug('simpleList结果长度::', userlist.length);
     return userlist;
   }
   warn('simpleList::出错', `${errmsg}(${errcode})`);
   throw new WecomError(errcode, errmsg);
 };
 
 /**
  * 更新成员
  * @param {Object} dept 成员信息，详见：https://work.weixin.qq.com/api/doc/90000/90135/90197
  * @returns 错误代码
  */
 const update = async (user, options = {}) => {
   const token = await getToken(options);
   const res = await fetch(`${qyHost}/user/update?access_token=${token}`, {
     method: 'POST',
     body: JSON.stringify(user),
   });
   const { errcode, errmsg } = await res.json();
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
 const create = async (user, options = {}) => {
   const token = await getToken(options);
   const res = await fetch(`${qyHost}/user/create?access_token=${token}`, {
     method: 'POST',
     body: JSON.stringify({
       ...user,
       to_invite: false, // 默认不发送邀请
     }),
   });
   const { errcode, errmsg } = await res.json();
   switch (errcode) {
     case 0:
       return 0;
     case 40066:
       warn(`用户create失败(40066)：不合法的部门列表:${user.department}(${errcode})`);
       break;
     case 60104:
       warn(`用户create失败(60104):用户[${user.name}](${user.userid})拟加入部门:${user.department}, 手机号码(${user.mobile})已存在`);
       break;
     case 60103:
       warn(`用户create失败(60103):用户[${user.name}](${user.userid})拟加入部门:${user.department}, 手机号码(${user.mobile})不正确`);
       break;
     default:
       warn('用户create失败::', `${errmsg}(${errcode})`);
   }
   throw new WecomError(errcode, errmsg);
 };
 
 /**
  * 读取成员
  * https://work.weixin.qq.com/api/doc/90000/90135/90200
  * @param {String} userid 成员id
  * @returns 成员
  */
 const get = async (userid, options = {}) => {
   const token = await getToken(options);
   const res = await fetch(`${qyHost}/user/get?access_token=${token}&userid=${userid}`, {
     method: 'GET',
   });
   const user = await res.json();
   const { errcode, errmsg } = user;
 
   // 处理错误
   switch (errcode) {
     case 0:
       return user;
     case 60111:
       debug('userid不存在::', `userid:${userid}`);
       break;
     default:
       debug('get失败::', `userid:${userid}, ${errmsg}(${errcode})`);
   }
   throw new WecomError(errcode, errmsg);
 };
 
 /**
  * 根据手机号查询用户userid
  * @param {String} mobile 手机号
  * @param {Object} options 配置信息
  * @returns userid
  */
 const getUserId = async (mobile, options = {}) => {
   const token = await getToken(options);
   const res = await fetch(`${qyHost}/user/getuserid?access_token=${token}`, {
     method: 'POST',
     body: JSON.stringify({
       mobile,
     }),
   });
   const user = await res.json();
   const { errcode, errmsg } = user;
 
   // 处理错误
   switch (errcode) {
     case 0:
       return user;
     default:
       debug('getUserId失败::', `mobile:${mobile}, ${errmsg}(${errcode})`);
       throw new WecomError(errcode, errmsg);
   }
 }
 
 /**
  * 根据手机号获取企微成员详情
  * @param {String} mobile 手机号
  * @param {Object} options 配置
  * @returns 成员详情
  */
 const getUserByMobile = async (mobile, options = {}) => {
    const result = await getUserId(mobile, options);
    return get(result.userid, options);
 }
 
 /**
  * 添加额外文本信息到成员中
  * @param {*} target 
  * @param {*} name 
  * @param {*} value 
  */
 const attachTextExtAttrTo = (target, name, value) => {
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
 const getExtAttrFrom = (target, name) => {
   if(target && target.extattr && target.extattr.attrs) {
     const attr = target.extattr.attrs.find(attr => attr.name == name);
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
 const changeMainDepartment = async (userid, newDeptId, options = {}) => {
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
 
 module.exports = {
   simpleList,
   update,
   create,
   get,
   getUserId,
   attachTextExtAttrTo,
   getExtAttrFrom,
   changeMainDepartment,
   getUserByMobile,
 };
 