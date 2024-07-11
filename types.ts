import { WecomResponse } from 'wecom-common';
/**
 * 定义企业微信API请求参数的类型
 */
export type UserCreateParams = {
  /**
   * 用户ID
   */
  userid: string;

  /**
   * 用户姓名
   */
  name: string;

  /**
   * 用户别名，可选字段
   */
  alias?: string;

  /**
   * 手机号码，可选字段
   */
  mobile?: string;

  /**
   * 部门ID列表，可选字段
   */
  department?: number[];

  /**
   * 部门内的排序ID列表，可选字段
   */
  order?: number[];

  /**
   * 职位，可选字段
   */
  position?: string;

  /**
   * 性别，0表示女，1表示男，可选字段
   */
  gender?: '0' | '1';

  /**
   * 邮箱，可选字段
   */
  email?: string;

  /**
   * 企业邮箱，可选字段
   */
  biz_mail?: string;

  /**
   * 是否为部门领导，可选字段
   */
  is_leader_in_dept?: boolean[];

  /**
   * 上级ID列表，可选字段
   */
  direct_leader?: string[];

  /**
   * 是否启用，0表示停用，1表示启用，可选字段
   */
  enable?: 0 | 1;

  /**
   * 头像的媒体文件ID，可选字段
   */
  avatar_mediaid?: string;

  /**
   * 办公电话，可选字段
   */
  telephone?: string;

  /**
   * 地址，可选字段
   */
  address?: string;

  /**
   * 主部门ID，可选字段
   */
  main_department?: number;

  /**
   * 扩展属性，可选字段
   */
  extattr?: {
    attrs: ExtAttr[],
  };

  /**
   * 是否邀请该用户，true表示邀请，false或不填表示不邀请，可选字段
   */
  to_invite?: boolean;

  /**
   * 外部职位，可选字段
   */
  external_position?: string;

  /**
   * 外部属性，可选字段
   */
  external_profile?: {
    external_corp_name?: string;
    wechat_channels?: {
      nickname?: string;
    };
    external_attr?: ExtAttr[],
  };
};

/**
 * 定义企业微信API响应结果的类型
 */
export type UserCreateResult = WecomResponse & {
  /**
   * 用户信息，当创建成功时返回，可选字段
   */
  user_info?: {
    userid: string;
    name: string;
    // 其他用户信息字段可以在这里继续添加
  };
};

/**
 * 定义扩展属性的类型
 */
export type ExtAttr = {
  /**
   * 属性类型，0表示文本，1表示网页，2表示小程序
   */
  type: number;

  /**
   * 属性名称，用于标识属性
   */
  name: string;

  /**
   * 文本属性，当type为0时使用
   */
  text?: {
    /**
     * 文本属性的值
     */
    value: string;
  };

  /**
   * 网页属性，当type为1时使用
   */
  web?: {
    /**
     * 网页的链接地址
     */
    url: string;

    /**
     * 网页的标题
     */
    title: string;
  };

  /**
   * 小程序属性，当type为2时使用
   */
  miniprogram?: {
    /**
     * 小程序的appid
     */
    appid: string;

    /**
     * 小程序的页面路径
     */
    pagepath: string;

    /**
     * 小程序的标题
     */
    title: string;
  };
};