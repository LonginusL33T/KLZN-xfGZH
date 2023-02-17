<template>
    <div class="container">
        <top-head title="项目列表" targetName="添加项目" targetLink="/addProject"></top-head>
        <div class="search_wrapper">
			<van-search v-model="projectName" :clearable="false" placeholder="输入项目名称" />
			<van-button class="search_btn" color="#4664be" icon="search" size="mini" @click="getData">搜索</van-button>
        </div>
        <div class="main search_main overflow_auto">
            <template v-if="dataList && dataList.length">
                <div class="normal_wrapper">
                    <van-list v-model="loading" :finished="finished" offset="10" finished-text="没有更多数据了" @load="getData">
                        <div class="normal_list" v-for="(item, index) in dataList" :key="index">
                            <van-row>
                                <van-col span="8">创建时间</van-col>
                                <van-col span="16">{{ item.createdTime || '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">项目名称</van-col>
                                <van-col span="16">{{ item.name || '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">项目编号</van-col>
                                <van-col span="16">{{ item.aid || '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">地址</van-col>
                                <van-col span="16">{{ item.address || '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">备注</van-col>
                                <van-col span="16">{{ item.remark || '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">电气火灾</van-col>
                                <van-col span="5">总数</van-col>
                                <van-col span="5">在线</van-col>
                                <van-col span="6">离线</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8"></van-col>
                                <van-col span="5" class="success" @click="routeJump('/deviceManage', JSON.stringify({ projectId: item.id, deviceType: getDeviceTypeId('电气火灾'), deviceStatus: '-1' }))">{{ item.dqhzCount }}</van-col>
                                <van-col span="5" class="success" @click="routeJump('/deviceManage', JSON.stringify({ projectId: item.id, deviceType: getDeviceTypeId('电气火灾'), deviceStatus: '1' }))">{{ item.dqhzOnline }}</van-col>
                                <van-col span="6" class="success" @click="routeJump('/deviceManage', JSON.stringify({ projectId: item.id, deviceType: getDeviceTypeId('电气火灾'), deviceStatus: '0' }))">{{ item.dqhzOffline }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">智慧空开</van-col>
                                <van-col span="5">总数</van-col>
                                <van-col span="5">在线</van-col>
                                <van-col span="6">离线</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8"></van-col>
                                <van-col span="5" class="success" @click="routeJump('/deviceManage', JSON.stringify({ projectId: item.id, deviceType: getDeviceTypeId('空开'), deviceStatus: '-1' }))">{{ item.kkCount }}</van-col>
                                <van-col span="5" class="success" @click="routeJump('/deviceManage', JSON.stringify({ projectId: item.id, deviceType: getDeviceTypeId('空开'), deviceStatus: '1' }))">{{ item.kkOnline }}</van-col>
                                <van-col span="6" class="success" @click="routeJump('/deviceManage', JSON.stringify({ projectId: item.id, deviceType: getDeviceTypeId('空开'), deviceStatus: '0' }))">{{ item.kkOffline }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">烟感</van-col>
                                <van-col span="5">总数</van-col>
                                <van-col span="5">在线</van-col>
                                <van-col span="6">离线</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8"></van-col>
                                <van-col span="5" class="success" @click="routeJump('/deviceManage', JSON.stringify({ projectId: item.id, deviceType: getDeviceTypeId('烟感设备'), deviceStatus: '-1' }))">{{ item.smokeCount }}</van-col>
                                <van-col span="5" class="success" @click="routeJump('/deviceManage', JSON.stringify({ projectId: item.id, deviceType: getDeviceTypeId('烟感设备'), deviceStatus: '1' }))">{{ item.smokeOnline }}</van-col>
                                <van-col span="6" class="success" @click="routeJump('/deviceManage', JSON.stringify({ projectId: item.id, deviceType: getDeviceTypeId('烟感设备'), deviceStatus: '0' }))">{{ item.smokeOffline }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">燃气</van-col>
                                <van-col span="5">总数</van-col>
                                <van-col span="5">在线</van-col>
                                <van-col span="6">离线</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8"></van-col>
                                <van-col span="5" class="success" @click="routeJump('/deviceManage', JSON.stringify({ projectId: item.id, deviceType: getDeviceTypeId('燃气设备'), deviceStatus: '-1' }))">{{ item.gasCount }}</van-col>
                                <van-col span="5" class="success" @click="routeJump('/deviceManage', JSON.stringify({ projectId: item.id, deviceType: getDeviceTypeId('燃气设备'), deviceStatus: '1' }))">{{ item.gasOnline }}</van-col>
                                <van-col span="6" class="success" @click="routeJump('/deviceManage', JSON.stringify({ projectId: item.id, deviceType: getDeviceTypeId('燃气设备'), deviceStatus: '0' }))">{{ item.gasOffline }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">门磁</van-col>
                                <van-col span="5">总数</van-col>
                                <van-col span="5">在线</van-col>
                                <van-col span="6">离线</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8"></van-col>
                                <van-col span="5" class="success" @click="routeJump('/deviceManage', JSON.stringify({ projectId: item.id, deviceType: getDeviceTypeId('门磁'), deviceStatus: '-1' }))">{{ item.doorCount }}</van-col>
                                <van-col span="5" class="success" @click="routeJump('/deviceManage', JSON.stringify({ projectId: item.id, deviceType: getDeviceTypeId('门磁'), deviceStatus: '1' }))">{{ item.doorOnline }}</van-col>
                                <van-col span="6" class="success" @click="routeJump('/deviceManage', JSON.stringify({ projectId: item.id, deviceType: getDeviceTypeId('门磁'), deviceStatus: '0' }))">{{ item.doorOffline }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">报警数量</van-col>
                                <van-col span="5">总数</van-col>
                                <van-col span="5">已处理</van-col>
                                <van-col span="6">未处理</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8"></van-col>
                                <van-col span="5" class="success" @click="routeJump('/alarmList', JSON.stringify({ projectId: item.id }))">{{ item.alarmCount }}</van-col>
                                <van-col span="5" class="success" @click="routeJump('/alarmList', JSON.stringify({ projectId: item.id }))">{{ item.alarmOkCount }}</van-col>
                                <van-col span="6" class="success" @click="routeJump('/alarmList', JSON.stringify({ projectId: item.id }))">{{ item.alarmNoneCount }}</van-col>
                            </van-row>
                            <van-row class="van-row-btn-top" type="flex" justify="center">
								<van-button type="info" size="mini" round @click="routeJump('/projectDeviceSet', JSON.stringify({ projectId: item.id }))">设备分配</van-button>
                                <van-button type="info" size="mini" round @click="routeJump('/addProject', JSON.stringify(item))">编辑</van-button>
                                <van-button type="info" size="mini" round @click="routeJump('/deviceManage', JSON.stringify({ projectId: item.id, deviceType: '', deviceStatus: '-1' }))">设备管理</van-button>
                            </van-row>
                        </div>
                    </van-list>
                </div>
            </template>
            <no-data v-if="dataList && !dataList.length"></no-data>
        </div>
    </div>
</template>
<script>
import Global from '@/assets/js/global'
import { dictionaryList, projectList } from '@/axios/request'
import TopHead from '@/components/TopHead.vue'
import NoData from '@/components/NoData.vue'
export default {
    components: {
        TopHead,
        NoData
    },
    data() {
        return {
            projectName: '',
            dataList: null,
            loading: false,
            finished: false,
            deviceTypeArr: []
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
            let params = {
                PageNo: 1,
                PageSize: 100000,
                Name: this.projectName
            }
            Global.publicAxiosRequest(params, projectList, (data, msg) => {
                this.loading = false;
                this.finished = true;
                this.dataList = data.rows;
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
        getDeviceTypeId(deviceName) {
            for (let item of this.deviceTypeArr) {
                if (deviceName == item.value) {
                    return item.id;
                }
            }
        },
        routeJump(path, params) {
            this.$router.push({
                path,
                query: {
                    params
                }
            });
        }
    }
}
</script>
<style lang="scss" scoped>
.normal_list {
    padding: 6px 17px;
    line-height: 24px;
}
</style>