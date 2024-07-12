import { WecomResponse } from 'wecom-common';
/**
 * 定义创建成员请求参数的类型
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
    attrs: Attr[]
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
  external_profile?: ExternalProfile;
};

/**
 * 定义更新成员请求参数的类型
 */
export type UserUpdateParams = {
  /**
   * 成员UserID，企业内必须唯一，不区分大小写，长度1~64字节
   */
  userid: string;

  /**
   * 成员名称，长度1~64个utf8字符，可选字段
   */
  name?: string;

  /**
   * 别名，长度1-64个utf8字符，可选字段
   */
  alias?: string;

  /**
   * 手机号码，企业内必须唯一，可选字段
   */
  mobile?: string;

  /**
   * 成员所属部门id列表，不超过100个，可选字段
   */
  department?: number[];

  /**
   * 部门内的排序值，默认为0，数量必须和department一致，可选字段
   */
  order?: number[];

  /**
   * 职务信息，长度0~128个utf8字符，可选字段
   */
  position?: string;

  /**
   * 性别，1表示男性，2表示女性，可选字段
   */
  gender?: number;

  /**
   * 邮箱，长度不超过64字节，企业内必须唯一，可选字段
   */
  email?: string;

  /**
   * 企业邮箱，仅对开通企业邮箱的企业有效，长度6~64字节，可选字段
   */
  biz_mail?: string;

  /**
   * 座机，由1-32位的纯数字、“-”、“+”或“,”组成，可选字段
   */
  telephone?: string;

  /**
   * 部门负责人字段，个数必须和department一致，0-否，1-是，可选字段
   */
  is_leader_in_dept?: number[];

  /**
   * 直属上级，最多设置1个，可选字段
   */
  direct_leader?: string;

  /**
   * 成员头像的mediaid，通过素材管理接口上传图片获得的mediaid，可选字段
   */
  avatar_mediaid?: string;

  /**
   * 启用/禁用成员，1表示启用成员，0表示禁用成员，可选字段
   */
  enable?: number;

  /**
   * 自定义字段，需要先在WEB管理端添加，可选字段
   */
  extattr?: {
    attrs: Attr[]
  };

  /**
   * 成员对外属性，可选字段
   */
  external_profile?: ExternalProfile;

  /**
   * 地址，可选字段
   */
  address?: string;

  /**
   * 主部门ID，可选字段
   */
  main_department?: number;

  /**
   * 外部职位，可选字段
   */
  external_position?: string;
}

/**
 * 定义获取成员ID列表请求参数的类型
 */
export type UserListParams = {
  /**
   * 用于分页查询的游标，字符串类型，由上一次调用返回，首次调用不填
   */
  cursor?: string,
  /**
   * 分页，预期请求的数据量，取值范围 1 ~ 10000
   */
  limit?: number,
}

/**
 * 获取成员ID列表响应的结果类型
 */
export type UserListResult = WecomResponse & {
  /**
   * 分页游标，下次请求时填写以获取之后分页的记录。如果该字段返回空则表示已没有更多数据
   */
  next_cursor?: string,
  /**
   * 用户-部门关系列表
   */
  dept_user?: DeptUser[],
}

/**
 * 用户-部门关系
 */
export type DeptUser = {
  /**
   * 成员UserID
   */
  userid: string,
  /**
   * 成员所属部门id
   */
  department: number,
}

/**
 * 读取成员响应的结果类型
 */
export type GetUserResult = WecomResponse & {
  /**
   * 成员UserID。企业内必须唯一，不区分大小写，长度1~64字节。
   * 第三方应用返回的值为open_userid。
   */
  userid: string;

  /**
   * 成员名称。第三方不可获取，调用时返回userid代替name。
   * 对于非第三方创建的成员，第三方通讯录应用也不可获取。
   * 需要通过通讯录展示组件来展示名字。
   */
  name?: string;

  /**
   * 手机号码。特定授权下可获取。
   */
  mobile?: string;

  /**
   * 成员所属部门id列表。仅返回应用有查看权限的部门id。
   * 成员授权模式下，固定返回根部门id，即1。
   */
  department: number[];

  /**
   * 部门内的排序值，默认为0。数量必须和department一致。
   * 数值越大排序越前面，值范围是[0, 2^32)。
   * 成员授权模式下不返回该字段。
   */
  order?: number[];

  /**
   * 职务信息。特定授权下可获取。
   */
  position?: string;

  /**
   * 性别。0表示未定义，1表示男性，2表示女性。特定授权下可获取。
   */
  gender?: number;

  /**
   * 邮箱。特定授权下可获取。
   */
  email?: string;

  /**
   * 企业邮箱。特定授权下可获取。
   */
  biz_mail?: string;

  /**
   * 表示在所在的部门内是否为部门负责人。数量与department一致。
   * 特定授权下可获取。
   */
  is_leader_in_dept?: boolean[];

  /**
   * 直属上级UserID。返回在应用可见范围内的直属上级列表。
   * 最多有1个直属上级。特定授权下可获取。
   */
  direct_leader?: string[];

  /**
   * 头像url。特定授权下可获取。
   */
  avatar?: string;

  /**
   * 头像缩略图url。特定授权下可获取。
   */
  thumb_avatar?: string;

  /**
   * 座机。特定授权下可获取。
   */
  telephone?: string;

  /**
   * 别名。特定授权下可获取。
   */
  alias?: string;

  /**
   * 扩展属性。特定授权下可获取。
   */
  extattr?: {
    attrs: Attr[]
  };

  /**
   * 激活状态。1=已激活，2=已禁用，4=未激活，5=退出企业。
   */
  status: number;

  /**
   * 员工个人二维码url。扫描可添加为外部联系人。
   * 特定授权下可获取。
   */
  qr_code?: string;

  /**
   * 成员对外属性。特定授权下可获取。
   */
  external_profile?: ExternalProfile;

  /**
   * 对外职务。如果设置了该值，则以此作为对外展示的职务。
   * 特定授权下可获取。
   */
  external_position?: string;

  /**
   * 地址。特定授权下可获取。
   */
  address?: string;

  /**
   * 全局唯一。对于同一个服务商，不同应用获取到企业内同一个成员的open_userid是相同的。
   * 仅第三方应用可获取。
   */
  open_userid?: string;

  /**
   * 主部门。仅当应用对主部门有查看权限时返回。
   */
  main_department?: number;
}

/**
 * 额外信息
 */
export type ExtAttr = {
  /**
   * 扩展属性
   */
  extattr: {
    attrs: Attr[]
  }
};

/**
 * 定义手机号获取userid响应结果的类型
 */
export type GetUserIdResult = WecomResponse & {
  /**
   * 成员UserID
   */
  userid: string
};

/**
 * 定义创建成员响应结果的类型
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
 * 定义外部属性类型
 */
export type ExternalProfile = {
  /**
   * 企业简称
   */
  external_corp_name?: string;
  /**
   * 视频号属性。须从企业绑定到企业微信的视频号中选择，可在“我的企业”页中查看绑定的视频号。第三方仅通讯录应用可获取；对于非第三方创建的成员，第三方通讯录应用也不可获取
   */
  wechat_channels?: {
    /**
     * 视频号名字（设置后，成员将对外展示该视频号）
     */
    nickname?: string;
    /**
     * 对外展示视频号状态。0表示企业视频号已被确认，可正常使用，1表示企业视频号待确认
     */
    status?: number;
  };
  /**
   * 属性列表，目前支持文本、网页、小程序三种类型
   */
  external_attr?: Attr[],
};


/**
 * 定义扩展属性的类型
 */
export type Attr = {
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