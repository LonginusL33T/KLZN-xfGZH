<template>
    <div class="home_wrapper">
        <img class="banner" src="@/assets/images/icons/banner.png">
        <div class="menu_wrapper">
            <div class="menu" @click="toMenu('/projectList', '/alarmList', '/deviceList')">
                <div class="top">
                    <img src="@/assets/images/icons/project.png">
                    <div>
                        <div class="num">总数：{{ gzhData.projectCount }}</div>
                        <div class="num">在线：{{ gzhData.projectCount }}</div>
                        <div>离线：0</div>
                    </div>
                </div>
                <div class="bottom">项目管理</div>
            </div>
            <div class="menu" @click="routeJump('/userList')">
                <div class="top">
                    <img src="@/assets/images/icons/user.png">
                    <div>
                        <div class="num">总数：{{ gzhData.userCount }}</div>
                        <div class="num">在线：{{ gzhData.userCount }}</div>
                        <div>离线：0</div>
                    </div>
                </div>
                <div class="bottom">用户管理</div>
            </div>
        </div>
        <div class="menu_wrapper">
            <div class="menu">
                <div class="top">
                    <img src="@/assets/images/icons/device.png">
                    <div>
                        <div class="num">总数：{{ deviceCount.deviceCount }}</div>
                        <div class="num">在线：{{ deviceCount.onlineCount }}</div>
                        <div>离线：{{ deviceCount.offlineCount }}</div>
                    </div>
                </div>
                <div class="bottom">设备管理</div>
            </div>
            <div class="menu" @click="routeJump('/workOrderList')">
                <div class="top">
                    <img src="@/assets/images/icons/work_order.png">
                    <div>
                        <div class="num">总数：{{ gzhData.workerOrderCount }}</div>
                        <div class="num">已处理：{{ gzhData.workerOrderCountFinish }}</div>
                        <div>未处理：{{ gzhData.workerOrderCountNoFinish }}</div>
                    </div>
                </div>
                <div class="bottom">运维工单</div>
            </div>
        </div>
        <div class="device_wrapper">
            <label>设备监控</label>
            <van-row>
                <van-col span="6" @click.native="routeJump('/deviceList', JSON.stringify({ deviceType: getDeviceTypeId('电气火灾'), deviceStatus: '-1' }))">
                    <img src="@/assets/images/icons/dqhz.png">
                    <span>电气火灾</span>
                </van-col>
                <van-col span="6" @click.native="routeJump('/deviceList', JSON.stringify({ deviceType: getDeviceTypeId('空开'), deviceStatus: '-1' }))">
                    <img src="@/assets/images/icons/zhkk.png">
                    <span>智慧空开</span>
                </van-col>
                <van-col span="6" @click.native="routeJump('/deviceList', JSON.stringify({ deviceType: getDeviceTypeId('烟感设备'), deviceStatus: '-1' }))">
                    <img src="@/assets/images/icons/yg.png">
                    <span>烟感</span>
                </van-col>
                <van-col span="6" @click.native="routeJump('/deviceList', JSON.stringify({ deviceType: getDeviceTypeId('燃气设备'), deviceStatus: '-1' }))">
                    <img src="@/assets/images/icons/rq.png">
                    <span>燃气</span>
                </van-col>
                <van-col span="6" @click.native="routeJump('/deviceList', JSON.stringify({ deviceType: getDeviceTypeId('门磁'), deviceStatus: '-1' }))">
                    <img src="@/assets/images/icons/mc.png">
                    <span>门磁</span>
                </van-col>
                <van-col span="6">
                    <img src="@/assets/images/icons/swjc.png">
                    <span>水位监测</span>
                </van-col>
                <van-col span="6">
                    <img src="@/assets/images/icons/pl.png">
                    <span>喷淋</span>
                </van-col>
                <van-col span="6">
                    <img src="@/assets/images/icons/yhqt.png">
                    <span>有害气体</span>
                </van-col>
            </van-row>
        </div>
        <div class="device_wrapper">
            <label>系统监控</label>
            <div class="num_wrapper" @click="routeJump('/alarmList')">
                <div class="left">
                    <img src="@/assets/images/icons/alarm.png">
                    <span>报警总数</span>
                </div>
                <div>{{ alarm }}</div>
            </div>
            <div class="horizontal_line"></div>
            <div class="num_wrapper" @click="routeJump('/areaList')">
                <div class="left">
                    <img src="@/assets/images/icons/area.png">
                    <span>区域管理</span>
                </div>
            </div>
            <div class="horizontal_line"></div>
            <div class="num_wrapper" @click="routeJump('/personalCenter')">
                <div class="left">
                    <img src="@/assets/images/icons/personal.png">
                    <span>个人中心</span>
                </div>
            </div>
            <div class="horizontal_line"></div>
            <div class="num_wrapper" @click="toMenu('/operationLog', '/messagePushRecord')">
                <div class="left">
                    <img src="@/assets/images/icons/log.png">
                    <span>系统日志</span>
                </div>
            </div>
        </div>
        <van-action-sheet v-model="show" :actions="actions" cancel-text="取消" close-on-click-action @select="selectAction" />
    </div>
</template>
<script>
import Global from '@/assets/js/global'
import { dictionaryList, alarmInfo, deviceData } from '@/axios/request'
export default {
    data() {
        return {
            menuList: Global.storage.get('userInfo').menus,
            deviceTypeArr: [],
            show: false,
            actions: [],
            alarm: 0,
            gzhData: {},
            deviceCount: {}
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getData();
            this.getList();
        });
    },
    methods: {
        getData() {
            Global.publicAxiosRequest({}, alarmInfo, (data, msg) => {
                this.alarm = data.alarmCount;
            });
            Global.publicAxiosRequest({}, deviceData, (data, msg) => {
                this.gzhData = data.gzhData;
                this.deviceCount = data.deviceCount;
            });
        },
        getList() {
            let params = {
                TypeId: '271857273098309',
                AppCode: 'xiaofang'
            }
            Global.publicAxiosRequest(params, dictionaryList, (data, msg) => {
                this.deviceTypeArr = data
            });
        },
        toMenu(menuA, menuB, menuC) {
            this.actions = [];
            for (let item of this.menuList) {
                if (item.path == menuA) {
                    let obj = {
                        name: item.meta.title,
                        value: item.path
                    }
                    this.actions[0] = obj
                }
                if (item.path == menuB) {
                    let obj = {
                        name: item.meta.title,
                        value: item.path
                    }
                    this.actions[1] = obj
                }
                if (item.path == menuC) {
                    let obj = {
                        name: item.meta.title,
                        value: item.path
                    }
                    this.actions[2] = obj
                }
            }
            if (!this.actions.length) {
                Global.axiosMessage('warning', '无菜单权限');
                return;
            }
            this.show = !this.show;
        },
        selectAction(action, index) {
            this.routeJump(action.value)
        },
        getDeviceTypeId(deviceName) {
            for (let item of this.deviceTypeArr) {
                if (deviceName == item.value) {
                    return item.id;
                }
            }
            return '未知';
        },
		routeJump(path, params) {
		    this.$router.push({
		        path,
		        query: {
		            params
		        }
		    })
		}
    }
}
</script>
<style lang="scss" scoped>
img {
    display: block;
}
.home_wrapper {
    width: 100%;
    height: 100%;
    padding: 5px 7px;
    font-size: 14px;
    background-color: #4664be;
    overflow: auto;
    .banner {
        width: 100%;
    }
    .menu_wrapper {
        display: flex;
        justify-content: space-between;
        margin-top: 12px;
        .menu {
            width: 49%;
            background-color: #fff;
            padding: 8px;
            border-radius: 8px;
            .top {
                display: flex;
                align-items: center;
                font-size: 13px;
                margin-bottom: 8px;
                img {
                    width: 60px;
                    height: 60px;
                    margin-right: 12px;
                }
                .num {
                    text-align: end;
                    margin-bottom: 4px;
                }
            }
            .bottom {
                font-size: 16px;
                padding-left: 8px;
            }
        }
    }
    .device_wrapper {
        margin-top: 12px;
        label {
            display: block;
            margin: 0 -7px;
            padding: 0 27px;
            line-height: 36px;
            background-color: #fff;
        }
        .van-row {
            color: #fff;
            .van-col {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-top: 12px;
                img {
                    width: 60px;
                    height: 60px;
                }
            }
        }
        .num_wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 20px;
            color: #fff;
            .left {
                display: flex;
                align-items: center;
                img {
                    width: 40px;
                    height: 40px;
                    margin-right: 8px;
                }
            }
        }
        .horizontal_line {
            height: 4px;
            background-color: #fff;
            margin: 0 -7px;
        }
    }
}
</style>