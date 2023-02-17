<template>
    <div class="container mapDialog">
        <top-head title="设备管理" targetName="添加设备" targetLink="/addDevice" :targetParams="targetParams"></top-head>
        <div class="search_wrapper">
            <van-search v-model="deviceName" :clearable="false" placeholder="输入设备名称" />
            <van-button class="search_btn" color="#4664be" icon="search" size="mini" @click="searchBtn">搜索</van-button>
        </div>
        <div class="search_wrapper">
            <div class="device_type" @click="deviceTypeArrShow = true">
                <van-icon name="add" />{{ deviceTypeName }}
            </div>
            <div class="device_type" @click="deviceStatusArrShow = true">
                <van-icon name="add" />{{ deviceStatusName }}
            </div>
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
                                <van-col span="8">设备名称</van-col>
                                <van-col span="16">{{ item.name || '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">设备激活时间</van-col>
                                <van-col span="16">{{ item.activeTime || '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">设备地址</van-col>
                                <van-col span="16">{{ item.address || '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">设备编号</van-col>
                                <van-col span="16">{{ item.number || '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">设备表号</van-col>
                                <van-col span="16">{{ item.addr || '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">设备图片</van-col>
                                <van-col span="16">
                                    <template v-if="!item.images || JSON.parse(item.images).length == 0">--</template>
                                    <template v-else>
                                        <img class="work_order_img" v-for="item1 in JSON.parse(item.images)" :key="item1" :src="baseURL + item1" @click="imagePreview(baseURL + item1)">
                                    </template>
                                </van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">在线视频</van-col>
                                <van-col span="16">--</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">是否在线</van-col>
                                <van-col span="16"><span :class="item.online ? 'success' : 'warn'">{{ item.online ? '在线' : '离线' }}</span></van-col>
                            </van-row>
                            <van-row>
							    <van-col span="8">供应商</van-col>
							    <van-col span="16"><span>{{ supplierTypeFormatter(item.supplierId) || '--' }}</span></van-col>
							</van-row>
                            <van-row>
                                <van-col span="8">所属平台</van-col>
                                <van-col span="16"><span>{{ platformTypeFormatter(item.platform) || '--' }}</span></van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">设备类型</van-col>
                                <van-col span="16"><span>{{ deviceTypeFormatter(item.deviceType) || '--' }}</span></van-col>
                            </van-row>
                            <template v-if="item.deviceJson">
                                <van-row v-for="(item2, index2) in JSON.parse(item.deviceJson).lxr" :key="index2">
                                    <van-col span="8"><span v-if="!index2">联系人</span></van-col>
                                    <van-col span="16">{{ item2.userName }} - {{ item2.phone }}</van-col>
                                </van-row>
                            </template>
                            <template v-else>
                                <van-row>
                                    <van-col span="8">联系人</van-col>
                                    <van-col span="16">--</van-col>
                                </van-row>
                            </template>
                            <van-row>
                                <van-col span="8">IMEI</van-col>
                                <van-col span="16">{{ item.deviceJson ? JSON.parse(item.deviceJson).imei : '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">IMSI</van-col>
                                <van-col span="16">{{ item.deviceJson ? JSON.parse(item.deviceJson).imsi : '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">SIM</van-col>
                                <van-col span="16">{{ item.deviceJson ? JSON.parse(item.deviceJson).sim : '--' }}</van-col>
                            </van-row>
                            <van-row class="van-row-btn-top" type="flex" justify="center">
                                <van-button type="info" size="mini" round @click="routeJump('/editDevice', JSON.stringify(item))">编辑</van-button>
                                <van-button type="info" size="mini" round @click="editLocation(item)">地图</van-button>
                                <van-button type="info" size="mini" round @click="deviceLog(item.id)">日志</van-button>
                                <van-button type="info" size="mini" round @click="routeJump('/historyData', JSON.stringify(item))" :disabled="item.deviceType != 271859088232517 && item.deviceType != 271865456455749 && item.deviceType != 271858556186693 && item.deviceType != 271858390593605">历史数据</van-button>
                                <van-button type="danger" size="mini" round @click="deleteDeviceBtn(item.id)">删除</van-button>
                            </van-row>
                        </div>
                    </van-list>
                </div>
            </template>
            <no-data v-if="dataList && !dataList.length"></no-data>
        </div>
        <van-action-sheet v-model="showAction" :actions="actions" cancel-text="取消" close-on-click-action @select="selectAction" />
        <!-- 设备类型 -->
        <van-popup v-model="deviceTypeArrShow" round position="bottom">
            <van-picker value-key="value" show-toolbar title="选择设备类型" :columns="deviceTypeArr" @cancel="deviceTypeArrShow = false" @confirm="deviceTypeConfirm" />
        </van-popup>
        <!-- 设备状态 -->
        <van-popup v-model="deviceStatusArrShow" round position="bottom">
            <van-picker value-key="label" show-toolbar title="选择设备状态" :columns="deviceStatusArr" @cancel="deviceStatusArrShow = false" @confirm="deviceStatusConfirm" />
        </van-popup>
        <!-- 高德地图 -->
        <van-dialog v-model="showMap" title="高德地图" width="100%" :overlay="false" cancel-button-text="关闭" cancel-button-color="#999" confirm-button-text="确定" show-cancel-button @confirm="mapConfirm" @cancel="mapCancel">
            <gaode-map :show-map="showMap" :current-lon="locationObj.lon" :current-lat="locationObj.lat" @getPosition="getPosition"></gaode-map>
        </van-dialog>
    </div>
</template>
<script>
import Global from '@/assets/js/global'
import { dictionaryList, deviceList, savaLocationd, deleteDevice } from '@/axios/request'
import TopHead from '@/components/TopHead.vue'
import NoData from '@/components/NoData.vue'
import GaodeMap from '@/components/GaodeMap.vue'
import { ImagePreview } from 'vant';
export default {
    components: {
        TopHead,
        NoData,
        GaodeMap
    },
    data() {
        return {
            baseURL: Global.baseURL,
            targetParams: {},
            
            deviceStatusArrShow: false,
            deviceStatusName: '选择设备状态',
            deviceStatus: '-1',
            deviceStatusArr: [{
                label: '全部',
                value: '-1'
            }, {
                label: '在线',
                value: '1'
            }, {
                label: '离线',
                value: '0'
            }],

            deviceTypeArrShow: false,
            deviceTypeName: '选择设备类型',
            deviceType: '',
            supplierTypeArr: [],
            platformTypeArr: [],
            deviceTypeArr: [{
                id: '',
                value: '全部'
            }],

            projectId: '',
            deviceName: '',
            dataList: null,
            loading: false,
            finished: false,
            page: 0,
            size: 10,

            showAction: false,
            actions: [{ name: '上下线记录', value: '/deviceLog', type: 1 }, { name: '发送指令记录', value: '/deviceLog', type: 2 }],
            deviceId: '',

            /** 高德地图 **/
            showMap: false,
            isGetPosition: false,
            locationObj: {
                lon: '',
                lat: ''
            }
        }
    },
    mounted() {
        this.targetParams.params = this.$route.query.params;
        let params = JSON.parse(this.$route.query.params);
        this.projectId = params.projectId;
        this.deviceType = params.deviceType;
        this.deviceStatus = params.deviceStatus;
        if (this.deviceStatus != -1) {
            for (let item of this.deviceStatusArr) {
                if (this.deviceStatus == item.value) {
                    this.deviceStatusName = item.text
                }
            }
        }
        
        this.$nextTick(() => {
            this.getData();
            this.getList();
        });
    },
    methods: {
        getData() {
            this.page++;
            let params = {
                PageNo: this.page,
                PageSize: this.size,
                ProjectId: this.projectId,
                Name: this.deviceName,
                DeviceType: this.deviceType,
                Online: this.deviceStatus
            }
            Global.publicAxiosRequest(params, deviceList, (data, msg) => {
                this.loading = false;
                if (data.rows && data.rows.length) {
                    if (!this.dataList) {
                        this.dataList = data.rows;
                    } else {
                        data.rows.map(item => {
                            this.dataList.push(item);
                        });
                    }
                    if (this.dataList.length >= data.totalRows) {
                        this.finished = true;
                    }
                } else {
                    this.dataList = [];
                }
            })
        },
        getList() {
            let params = {
                TypeId: '349287476846661'
            }
            Global.publicAxiosRequest(params, dictionaryList, (data, msg) => {
                this.supplierTypeArr = data
            });
            let params1 = {
                TypeId: '271873306419269'
            }
            Global.publicAxiosRequest(params1, dictionaryList, (data, msg) => {
                this.platformTypeArr = data
            });
            let params2 = {
                TypeId: '271857273098309',
                AppCode: 'xiaofang'
            }
            Global.publicAxiosRequest(params2, dictionaryList, (data, msg) => {
                this.deviceTypeArr = this.deviceTypeArr.concat(data)
                if (this.deviceType) {
                    for (let item of this.deviceTypeArr) {
                        if (this.deviceType == item.id) {
                            this.deviceTypeName = item.value
                        }
                    }
                }
            });
        },
        // 搜索
        searchBtn() {
            this.page = 0;
            this.dataList = null;
            this.finished = false;
            this.getData();
        },
        // 图片预览
        imagePreview(val) {
            ImagePreview([val]);
        },
        // 删除设备
        deleteDeviceBtn(deviceId) {
            this.$dialog.confirm({
                message: '确认删除该设备吗？'
            }).then(() => {
                let params = {
                    id: deviceId
                };
                Global.publicAxiosRequest(params, deleteDevice, (data, msg) => {
                    Global.axiosMessage('success', '删除成功');
                    this.searchBtn();
                });
            }).catch(() => {});
        },
        // 数据格式化
        supplierTypeFormatter(val) {
            for (let item of this.supplierTypeArr) {
                if (val == item.id) {
                    return item.value;
                }
            }
        },
        platformTypeFormatter(val) {
            for (let item of this.platformTypeArr) {
                if (val == item.id) {
                    return item.value;
                }
            }
        },
        deviceTypeFormatter(val) {
            for (let item of this.deviceTypeArr) {
                if (val == item.id) {
                    return item.value;
                }
            }
        },
        deviceLog(deviceId) {
            this.deviceId = deviceId;
            this.showAction = !this.showAction;
        },
        selectAction(obj) {
            obj.deviceId = this.deviceId
            this.routeJump(obj.value, JSON.stringify(obj))
        },
        // 选择设备类型
        deviceTypeConfirm(obj) {
            this.deviceTypeName = obj.value;
            this.deviceType = obj.id;
            this.deviceTypeArrShow = false;
            this.searchBtn()
        },
        // 选择设备状态
        deviceStatusConfirm(obj) {
            this.deviceStatusName = obj.value;
            this.deviceStatus = obj.id;
            this.deviceStatusArrShow = false;
            this.searchBtn()
        },
        routeJump(path, params) {
            Global.routeJump(this.$router, path, params)
        },
        /** 高德地图 **/
        // 打开地图
        editLocation(obj) {
            this.locationObj.id = obj.id;
            // 判断是否已设置经纬度
            this.locationObj.lon = obj.lon;
            this.locationObj.lat = obj.lat;
            this.showMap = true;
        },
        // 确定
        mapConfirm() {
            this.isGetPosition = true;
        },
        // 关闭
        mapCancel() {
            this.isGetPosition = false;
        },
        // 获取经纬度
        getPosition(lon, lat) {
            if (this.isGetPosition) {
                if (lon && lat) {
                    this.locationObj.lon = lon;
                    this.locationObj.lat = lat;
                    Global.publicAxiosRequest(this.locationObj, savaLocationd, (data, msg) => {
                        Global.axiosMessage('success', '地图定位成功');
                        // 重新加载数据
                        this.searchBtn();
                    });
                } else {
                    this.$toast('请设置经纬度');
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.device_type {
    width: 50%;
}
.search_main {
    height: calc(100% - 78px - 39px);
}
.normal_list {
    padding: 6px 17px;
    line-height: 24px;
}
.text_color {
    color: #1989fa;
}
.popup_wrapper {
    width: 80%;
    height: 160px;
    .van-col {
        line-height: 40px;
        font-size: 16px;
    }
    .van-field {
        width: 44%;
        border-bottom: 1px solid #ccc;
    }
    .button_wrapper {
        margin-top: 20px;
    }
    .van-button {
        width: 40%;
    }
}
.work_order_img {
    display: inline-block;
    width: 48px;
    height: 48px;
    object-fit: cover;
}
.work_order_img+img {
    margin-left: 10px;
}
</style>