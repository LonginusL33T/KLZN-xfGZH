import { createRouter } from './index'
import Main from '../views/Main.vue'

const home = [{
    path: '/home',
    component: () => import( /* webpackChunkName: "home" */ '../views/home/Index.vue')
}]

const alarm = [{
    path: '/alarmList',
    component: () => import( /* webpackChunkName: "alarm" */ '@/views/alarm/Index.vue')
}, {
    path: '/handleAlarm',
    component: () => import( /* webpackChunkName: "alarm" */ '@/views/alarm/HandleAlarm.vue')
}, {
    path: '/alarmDetail',
    component: () => import( /* webpackChunkName: "alarm" */ '@/views/alarm/AlarmDetail.vue')
}]

const project = [{
    path: '/projectList',
    component: () => import( /* webpackChunkName: "project" */ '@/views/project/Index.vue')
}, {
    path: '/addProject',
    component: () => import( /* webpackChunkName: "project" */ '@/views/project/AddProject.vue')
}, {
    path: '/projectDeviceSet',
    component: () => import( /* webpackChunkName: "project" */ '@/views/project/DeviceSet.vue')
}, {
    path: '/deviceManage',
    component: () => import( /* webpackChunkName: "project" */ '@/views/project/DeviceManage.vue')
}, {
    path: '/addDevice',
    component: () => import( /* webpackChunkName: "project" */ '@/views/project/AddDevice.vue')
}, {
    path: '/editDevice',
    component: () => import( /* webpackChunkName: "project" */ '@/views/project/EditDevice.vue')
}, {
    path: '/deviceLog',
    component: () => import( /* webpackChunkName: "project" */ '@/views/project/DeviceLog.vue')
}, {
    path: '/deviceList',
    component: () => import( /* webpackChunkName: "project" */ '@/views/project/DeviceList.vue')
}, {
    path: '/historyData',
    component: () => import( /* webpackChunkName: "project" */ '@/views/project/HistoryData.vue')
}, {
    path: '/setValue',
    component: () => import( /* webpackChunkName: "project" */ '@/views/project/SetValue.vue')
}, {
    path: '/chartData',
    component: () => import( /* webpackChunkName: "project" */ '@/views/project/ChartData.vue')
}]

const user = [{
    path: '/userList',
    component: () => import( /* webpackChunkName: "user" */ '@/views/user/Index.vue')
}, {
    path: '/handleUser',
    component: () => import( /* webpackChunkName: "user" */ '@/views/user/HandleUser.vue')
}, {
    path: '/userDeviceSet',
    component: () => import( /* webpackChunkName: "user" */ '@/views/user/DeviceSet.vue')
}]

const log = [{
    path: '/operationLog',
    component: () => import( /* webpackChunkName: "log" */ '@/views/log/Index.vue')
}, {
    path: '/messagePushRecord',
    component: () => import( /* webpackChunkName: "log" */ '@/views/log/MessagePushRecord.vue')
}]

const work = [{
    path: '/workOrderList',
    component: () => import( /* webpackChunkName: "work" */ '@/views/work/Index.vue')
}, {
    path: '/applyWorkOrder',
    component: () => import( /* webpackChunkName: "work" */ '@/views/work/ApplyWorkOrder.vue')
}, {
    path: '/workOrderDetail',
    component: () => import( /* webpackChunkName: "work" */ '@/views/work/WorkOrderDetail.vue')
}]

const area = [{
    path: '/areaList',
    component: () => import( /* webpackChunkName: "area" */ '@/views/area/Index.vue')
}, {
    path: '/handleArea',
    component: () => import( /* webpackChunkName: "area" */ '@/views/area/HandleArea.vue')
}]

const personal = [{
    path: '/personalCenter',
    component: () => import( /* webpackChunkName: "personal" */ '@/views/personal/Index.vue')
}, {
    path: '/updatePwd',
    component: () => import( /* webpackChunkName: "personal" */ '@/views/personal/UpdatePwd.vue')
}]

const systemRouter = [{
    path: '/main',
    name: 'Main',
    component: Main,
    redirect: '/home',
    children: []
}];

export const generateRoutes = $router => {
    systemRouter[0]['children'] = [...home, ...alarm, ...project, ...user, ...log, ...work, ...area, ...personal];
    // addRoutes前重置matcher，防止重复添加路由
    $router.matcher = createRouter().matcher;
    for (let item of systemRouter) {
        $router.addRoute(item)
    }
}