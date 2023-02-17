<template>
    <div class="container">
        <top-head title="报警列表"></top-head>
        <div class="search_wrapper">
            <div class="device_type" @click="showDeviceTypeArr = true">
                <van-icon name="add" />{{ deviceTypeName }}
            </div>
            <van-search class="length_55" style="width: 32%;" v-model="deviceName" :clearable="false" placeholder="输入设备名称" />
            <van-button class="search_btn" style="right: 100px;" color="#4664be" icon="search" size="mini" @click="searchWarning"></van-button>
			<van-button class="search_btn" color="#4664be" size="mini" @click="onekey">一键处理</van-button>
        </div>
        <div class="main search_main overflow_auto">
            <template v-if="dataList && dataList.length">
                <van-list v-model="loading" :finished="finished" offset="10" finished-text="没有更多数据了" @load="getAllWarning">
                    <div class="data_wrapper" v-for="(item, index) in dataList" :key="index">
                        <div class="item_wrapper">
                            <van-row>
                                <van-col span="6">设备名称</van-col>
                                <van-col span="18">{{ item.deviceName || '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="6">设备号</van-col>
                                <van-col span="18">{{ item.deviceNumber || '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="6">所属项目</van-col>
                                <van-col span="18">{{ item.projectName || '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="6">设备类型</van-col>
                                <van-col span="18">{{ item.deviceTypeName || '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="6">设备地址</van-col>
                                <van-col span="18">{{ item.address || '--' }}</van-col>
                            </van-row>
                            <template v-if="item.deviceJson">
                                <van-row v-for="(item1, index1) in JSON.parse(item.deviceJson).lxr" :key="index1">
                                    <van-col span="6"><span v-if="!index1">联系人</span></van-col>
                                    <van-col span="18">{{ item1.userName }} - {{ item1.phone }}</van-col>
                                </van-row>
                            </template>
                            <template v-else>
                                <van-row>
                                    <van-col span="6">联系人</van-col>
                                    <van-col span="18">--</van-col>
                                </van-row>
                            </template>
                            <van-row>
                                <van-col span="6">报警时间</van-col>
                                <van-col span="18">{{ item.createdTime || '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="6">报警信息</van-col>
                                <van-col span="18" class="danger">{{ item.alarmType || '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="6">报警信息详情</van-col>
                                <van-col span="18">{{ item.content || '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="6">报警状态</van-col>
                                <!-- 1：已处理，0：未处理 -->
                                <van-col span="18" class="danger">{{item.status ? '已处理' : '未处理'}}</van-col>
                            </van-row>
                        </div>
                        <!-- 报警提示 -->
                        <div class="warn_wrapper" v-if="item.status" @click="routeJump('/alarmDetail', JSON.stringify(item))">
                            <img src="@/assets/images/warning_success.png">
                            <span class="success">已处理</span>
                        </div>
                        <div class="warn_wrapper" v-else  @click="routeJump('/handleAlarm', JSON.stringify(item))">
                            <img src="@/assets/images/warning.gif">
                            <span class="danger">未处理</span>
                        </div>
                    </div>
                </van-list>
            </template>
            <no-data v-if="dataList && !dataList.length"></no-data>
        </div>
        <!-- 设备类型 -->
        <van-popup v-model="showDeviceTypeArr" round position="bottom">
            <van-picker value-key="value" show-toolbar title="选择设备类型" :columns="deviceTypeArr" @cancel="showDeviceTypeArr = false" @confirm="deviceTypeConfirm" />
        </van-popup>
    </div>
</template>
<script>
import Global from '@/assets/js/global'
import { dictionaryList, alarmList, onekeyConfirm } from '@/axios/request'
import TopHead from '@/components/TopHead.vue'
import NoData from '@/components/NoData.vue'
export default {
    components: {
        TopHead,
        NoData
    },
    data() {
        return {
            showDeviceTypeArr: false,
            deviceTypeName: '全部',
            deviceName: '',
            dataList: null,
            loading: false,
            finished: false,
            page: 0,
            size: 20,
            deviceTypeArr: [{
                id: '-1',
                value: '全部'
            }],
            deviceType: '-1',
            projectId: ''
        }
    },
    mounted() {
        if (this.$route.query.params) {
            let params = JSON.parse(this.$route.query.params)
            this.projectId = params.projectId;
        }
        this.$nextTick(() => {
            this.getList();
        });
    },
    methods: {
        getList() {
            let params = {
                TypeId: '271857273098309',
                AppCode: 'xiaofang'
            }
            Global.publicAxiosRequest(params, dictionaryList, (data, msg) => {
                this.deviceTypeArr = this.deviceTypeArr.concat(data)
                this.getAllWarning();
            });
        },
        // 获取所有报警
        getAllWarning() {
            this.page++;
            let params = {
                PageNo: this.page,
                PageSize: this.size,
                DeviceName: this.deviceName,
                DeviceType: this.deviceType,
                ProjectId: this.projectId
            }
            Global.publicAxiosRequest(params, alarmList, (data, msg) => {
                this.loading = false;
                if (data.rows && data.rows.length) {
                    if (!this.dataList) {
                        this.dataList = data.rows;
                    } else {
                        data.rows.map(item => {
                            this.dataList.push(item);
                        });
                    }
                    // 判断是否加载完所有数据
                    if (this.dataList.length >= data.totalRows) {
                        this.finished = true;
                    }
                } else {
                    this.dataList = [];
                }
            });
        },
        // 选择设备类型
        deviceTypeConfirm(obj) {
            this.deviceTypeName = obj.value;
            this.deviceType = obj.id;
            this.showDeviceTypeArr = false;
            // 选择设备类型后重新加载数据
            this.searchWarning();
        },
        // 搜索
        searchWarning() {
            this.page = 0;
            this.dataList = null;
            this.getAllWarning();
        },
		// 一键处理
		onekey() {
		    this.$dialog.confirm({
		        message: '是否一键处理所有预报警信息？'
		    }).then(() => {
		        Global.publicAxiosRequest({}, onekeyConfirm, (data, msg) => {
		            Global.axiosMessage('success', '一键处理成功');
					this.searchWarning();
		        });
		    }).catch(() => {});
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
.warn_wrapper {
    width: 56px;
    height: 56px;
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 100%;
    background-color: #e6e6e6;
    img {
        max-height: 28px;
    }
    span {
        display: block;
        margin-top: 3px;
        font-size: 10px;
    }
}
</style>