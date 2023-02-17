import axios from './axiosConfig'

// 配置接口访问IP
const REQUEST_URL = process.env.VUE_APP_API_URL

// 上传图片
export const uploadImg = params => { return axios.post(`${REQUEST_URL}/api/zhFileInfo/uploadImage`, params).then(res => res.data) }
// 字典查询
export const dictionaryList = params => { return axios.get(`${REQUEST_URL}/api/sysDictData/list`, { params }).then(res => res.data) }

// 首页设备数据
export const deviceData = params => { return axios.get(`${REQUEST_URL}/api/LargeScreen/HomePageGetDevice`, { params }).then(res => res.data) }

// 登录
export const userLogin = params => { return axios.post(`${REQUEST_URL}/api/login`, params).then(res => res.data) }
// 获取登录用户信息
export const userInfo = params => { return axios.get(`${REQUEST_URL}/api/getLoginUser`, { params }).then(res => res.data) }
// 公众号授权-获取appid
export const fetchAppid = params => { return axios.get(`${REQUEST_URL}/api/userExtra/GetWxAppid`, { params }).then(res => res.data) }
// 公众号授权-保存openId
export const saveCode = params => { return axios.post(`${REQUEST_URL}/api/userExtra/UpdateOpenid`, params).then(res => res.data) }
// 主页-获取报警信息
export const alarmInfo = params => { return axios.get(`${REQUEST_URL}/api/LargeScreen/GzhGetAlarm`, { params }).then(res => res.data) }
// 账户修改密码
export const editPassword = params => { return axios.post(`${REQUEST_URL}/api/sysUser/updatePwd`, params).then(res => res.data) }
// 管理员重置用户密码
export const resetPassword = params => { return axios.post(`${REQUEST_URL}/api/sysUser/resetPwd`, params).then(res => res.data) }

// alarm
// 报警列表
export const alarmList = params => { return axios.get(`${REQUEST_URL}/api/zhAlarm/AlarmPageXiaoFang`, { params }).then(res => res.data) }
// 报警一键处理
export const onekeyConfirm = params => { return axios.post(`${REQUEST_URL}/api/zhAlarm/XfChangeAllStatus`, params).then(res => res.data) }
// 处理报警
export const handleAlarmStatus = params => { return axios.post(`${REQUEST_URL}/api/zhAlarm/XiaoFangChangeStatus`, params).then(res => res.data) }

// project
// 项目列表
export const projectList = params => { return axios.get(`${REQUEST_URL}/api/zhProject/page`, { params }).then(res => res.data) }
// 添加项目
export const addProject = params => { return axios.post(`${REQUEST_URL}/api/zhProject/add`, params).then(res => res.data) }
// 编辑项目
export const editProject = params => { return axios.post(`${REQUEST_URL}/api/zhProject/edit`, params).then(res => res.data) }
// 设备列表
export const deviceList = params => { return axios.get(`${REQUEST_URL}/api/zhDevice/page`, { params }).then(res => res.data) }
// 项目分配设备
export const setProjectDevice = params => { return axios.post(`${REQUEST_URL}/api/zhDevice/ChangeProject`, params).then(res => res.data) }
// 添加设备
export const addDevice = params => { return axios.post(`${REQUEST_URL}/api/zhDevice/userAdd`, params).then(res => res.data) }
// 编辑设备
export const editDevice = params => { return axios.post(`${REQUEST_URL}/api/zhDevice/edit`, params).then(res => res.data) }
// 删除设备
export const deleteDevice = params => { return axios.post(`${REQUEST_URL}/api/zhDevice/fakeDelete`, params).then(res => res.data) }
// 查询设备上下线记录
export const onlineOfflineRecord = params => { return axios.get(`${REQUEST_URL}/api/DeviceOnline/page`, { params }).then(res => res.data) }
// 查询设备下发的指令记录
export const commandRecord = params => { return axios.get(`${REQUEST_URL}/api/ZhCommand/page`, { params }).then(res => res.data) }
// 编辑设备地理位置
export const savaLocationd = params => { return axios.post(`${REQUEST_URL}/api/zhDevice/editLatAndLon`, params).then(res => res.data) }
// 公众号扫一扫签名
export const getSignature = params => { return axios.get(`${REQUEST_URL}/api/userExtra/GetSignature`, { params }).then(res => res.data) }
// 设备数据
export const deviceDataInfo = params => { return axios.get(`${REQUEST_URL}/api/zhDevice/DeviceDataInfo`, { params }).then(res => res.data) }
// 曼顿设备线路
export const mtAddr = params => { return axios.get(`${REQUEST_URL}/api/zhMtConfig/GET_BOX_CHANNELS_REALTIME`, { params }).then(res => res.data) }
// 曼顿执行命令
export const mtCmd = params => { return axios.post(`${REQUEST_URL}/api/MtDataManage/MtCmd`, params).then(res => res.data) }
// 海曼执行命令
export const hmCmd = params => { return axios.post(`${REQUEST_URL}/api/HmDataManage/HmCmd`, params).then(res => res.data) }

// user
// 用户列表
export const userList = params => { return axios.get(`${REQUEST_URL}/api/userExtra/UserPageList`, { params }).then(res => res.data) }
// 添加用户
export const addUser = params => { return axios.post(`${REQUEST_URL}/api/sysUser/KeliAddUser`, params).then(res => res.data) }
// 编辑用户
export const editUser = params => { return axios.post(`${REQUEST_URL}/api/sysUser/KeliUpdateUser`, params).then(res => res.data) }
// 删除用户
export const deleteUser = params => { return axios.post(`${REQUEST_URL}/api/userExtra/fakeDelete`, params).then(res => res.data) }
// 角色列表
export const roleList = params => { return axios.get(`${REQUEST_URL}/api/sysRole/page`, { params }).then(res => res.data) }
// 获取用户角色列表
export const adminOwnRole = params => { return axios.get(`${REQUEST_URL}/api/sysUser/ownRole`, { params }).then(res => res.data) }
// 授权用户角色列表
export const adminGrantRole = params => { return axios.post(`${REQUEST_URL}/api/sysUser/grantRole`, params).then(res => res.data) }
// 用户绑定的设备列表
export const userBindingDeviceList = params => { return axios.get(`${REQUEST_URL}/api/zhDevice/GetUserBinding`, { params }).then(res => res.data) }
// 用户分配设备
export const setUserDevice = params => { return axios.post(`${REQUEST_URL}/api/zhDevice/userBinding`, params).then(res => res.data) }

// log
// 查询操作日志
export const operationLog = params => { return axios.get(`${REQUEST_URL}/api/OperateLog/page`, { params }).then(res => res.data) }
// 查询消息推送记录
export const messagePushRecord = params => { return axios.get(`${REQUEST_URL}/api/ZhCommand/SendCommandPage`, { params }).then(res => res.data) }

// work
// 查询工单列表
export const workOrderList = params => { return axios.get(`${REQUEST_URL}/api/xtWorkOrder/page`, { params }).then(res => res.data) }
// 工单详情
export const workOrderDetail = params => { return axios.get(`${REQUEST_URL}/api/xtWorkOrder/detail`, { params }).then(res => res.data) }
// 用户提交工单-系统派单
export const userSubmitWork = params => { return axios.post(`${REQUEST_URL}/api/xtWorkOrder/PaiWorkOrder`, params).then(res => res.data) }
// 管理员处理工单
export const handleWorkOrder = params => { return axios.post(`${REQUEST_URL}/api/xtWorkOrder/AdminReply`, params).then(res => res.data) }
// 用户回复工单
export const replyWorkOrder = params => { return axios.post(`${REQUEST_URL}/api/xtWorkOrder/CustomerReply`, params).then(res => res.data) }
// 用户完成工单
export const completeWorkOrder = params => { return axios.post(`${REQUEST_URL}/api/xtWorkOrder/complete`, params).then(res => res.data) }
// 用户取消工单
export const cancelWorkOrder = params => { return axios.post(`${REQUEST_URL}/api/xtWorkOrder/Cancel`, params).then(res => res.data) }

// area
// 区域树
export const areaTree = params => { return axios.get(`${REQUEST_URL}/api/zhDevice/OrgTree`, { params }).then(res => res.data) }
// 区域列表
export const areaList = params => { return axios.get(`${REQUEST_URL}/api/zhDevice/sysOrgPage`, { params }).then(res => res.data) }
// 添加区域
export const addArea = params => { return axios.post(`${REQUEST_URL}/api/sysOrg/add`, params).then(res => res.data) }
// 编辑区域
export const editArea = params => { return axios.post(`${REQUEST_URL}/api/sysOrg/edit`, params).then(res => res.data) }
// 删除区域
export const deleteArea = params => { return axios.post(`${REQUEST_URL}/api/sysOrg/delete`, params).then(res => res.data) }