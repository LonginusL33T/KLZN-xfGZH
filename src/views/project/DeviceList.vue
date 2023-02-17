<template>
    <div class="container mapDialog">
        <top-head title="设备列表"></top-head>
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
                                <van-col span="8">设备名称</van-col>
                                <van-col span="16">{{ item.name || '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">创建时间</van-col>
                                <van-col span="16">{{ item.createdTime || '--' }}</van-col>
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
                                    <template v-if="!item.images || JSON.parse(item.images).length == 0">无</template>
                                    <template v-else>
                                        <img class="work_order_img" v-for="item in JSON.parse(item.images)" :key="item" :src="baseURL + item" @click="imagePreview(baseURL + item)">
                                    </template>
                                </van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">在线视频</van-col>
                                <van-col span="16">无</van-col>
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
                        </div>
                    </van-list>
                </div>
            </template>
            <no-data v-if="dataList && !dataList.length"></no-data>
        </div>
        <!-- 设备类型 -->
        <van-popup v-model="deviceTypeArrShow" round position="bottom">
            <van-picker value-key="value" show-toolbar title="选择设备类型" :columns="deviceTypeArr" @cancel="deviceTypeArrShow = false" @confirm="deviceTypeConfirm" />
        </van-popup>
        <!-- 设备状态 -->
        <van-popup v-model="deviceStatusArrShow" round position="bottom">
            <van-picker value-key="label" show-toolbar title="选择设备状态" :columns="deviceStatusArr" @cancel="deviceStatusArrShow = false" @confirm="deviceStatusConfirm" />
        </van-popup>
    </div>
</template>
<script>
import Global from '@/assets/js/global'
import { dictionaryList, deviceList } from '@/axios/request'
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
            deviceTypeArrShow: false,
            deviceTypeName: '选择设备类型',
            deviceType: '',
            supplierTypeArr: [],
            platformTypeArr: [],
            deviceTypeArr: [{
                id: '',
                value: '全部'
            }],

            deviceStatusArrShow: false,
            deviceStatusName: '选择设备状态',
            deviceStatus: '-1',
            deviceStatusArr: [{
                value: '-1',
                label: '全部'
            }, {
                value: '1',
                label: '在线'
            }, {
                value: '0',
                label: '离线'
            }],

            deviceName: '',
            dataList: null,
            loading: false,
            finished: false,
            page: 0,
            size: 20
        }
    },
    mounted() {
        if (this.$route.query.params) {
            let params = JSON.parse(this.$route.query.params);
            this.deviceType = params.deviceType;
            this.deviceStatus = params.deviceStatus;
        }
        this.$nextTick(() => {
            this.getList();
            this.getData();
        });
    },
    methods: {
        getData() {
            this.page++;
            let params = {
                PageNo: this.page,
                PageSize: this.size,
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
                            this.deviceTypeName = item.value;
                        }
                    }
                }
            });
        },
        // 项目搜索
        searchBtn() {
            this.page = 0;
            this.dataList = null;
            this.finished = null;
            this.getData()
        },
        // 图片预览
        imagePreview(val) {
            ImagePreview([val]);
        },
        // 选择设备类型
        deviceTypeConfirm(obj) {
            this.deviceType  = obj.id;
            this.deviceTypeName = obj.value;
            this.deviceTypeArrShow = false;
            this.searchBtn();
        },
        // 选择设备状态
        deviceStatusConfirm(obj) {
            this.deviceStatus  = obj.value;
            this.deviceStatusName = obj.label;
            this.deviceStatusArrShow = false;
            this.searchBtn();
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
}
.work_order_img+img {
    margin-left: 10px;
}
</style>