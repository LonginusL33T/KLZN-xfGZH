<template>
    <div class="container">
        <top-head title="设备分配" targetName="保存" @targetEvent="saveDevice"></top-head>
        <div class="search_wrapper">
            <div class="device_type" @click="deviceTypeArrShow = true">
                <van-icon name="add" />{{ deviceTypeName }}
            </div>
            <van-search class="length_55" v-model="deviceName" :clearable="false" placeholder="请输入设备名称" />
            <van-button class="search_btn" color="#4664be" icon="search" size="mini" @click="searchBtn"></van-button>
        </div>
        <div class="main overflow_auto">
            <template v-if="dataList && dataList.length">
                <div class="normal_wrapper">
                    <van-list v-model="loading" :finished="finished" offset="10" finished-text="没有更多数据了" @load="getData">
                        <div class="normal_list" v-for="(item, index) in dataList" :key="index">
                            <van-row @click="chooseDevice(item)">
                                <van-col span="12">{{ item.name }}</van-col>
                                <van-col span="12" class="right">{{ getDeviceTypeName(item.deviceType) }}</van-col>
                            </van-row>
                        </div>
                    </van-list>
                </div>
            </template>
            <no-data v-if="dataList && !dataList.length"></no-data>
        </div>
        <!-- 已选设备 -->
        <div class="device_wrapper">
            <div class="title caption">
                已选设备(已选 <span class="danger">{{ selectedDevice.length }}</span> 个)
            </div>
            <div class="device_list overflow_auto">
                <van-row>
                    <van-col span="24" v-for="(item, index) in selectedDevice" :key="index">
                        <div class="device_item">
                            <van-icon name="setting" />{{ item.name }}
                            <van-icon class="del" name="close" color="#ee0a24" @click="delDevice(index)" />
                        </div>
                    </van-col>
                </van-row>
            </div>
        </div>
        <!-- 设备类型 -->
        <van-popup v-model="deviceTypeArrShow" round position="bottom">
            <van-picker value-key="value" show-toolbar title="选择设备类型" :columns="deviceTypeArr" @cancel="deviceTypeArrShow = false" @confirm="deviceTypeConfirm" />
        </van-popup>
    </div>
</template>
<script>
import Global from '@/assets/js/global'
import { dictionaryList, userBindingDeviceList, deviceList, setUserDevice } from '@/axios/request'
import TopHead from '@/components/TopHead.vue'
import NoData from '@/components/NoData.vue'
export default {
    components: {
        TopHead,
        NoData
    },
    data() {
        return {
            deviceTypeArrShow: false,
            deviceTypeName: '全部',
            deviceType: '',
            deviceTypeArr: [{
                id: '',
                value: '全部'
            }],

            deviceName: '',
            dataList: null,
            loading: false,
            finished: false,
            page: 0,
            size: 20,

            userId: '',
            selectedDevice: []
        }
    },
    mounted() {
        let params = JSON.parse(this.$route.query.params);
        this.userId = params.userId;
        this.$nextTick(() => {
            this.getList();
        });
    },
    methods: {
        getData() {
            this.page++;
            let params = {
                PageNo: this.page,
                PageSize: this.size,
                DeviceType: this.deviceType,
                Name: this.deviceName
            };
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
                    // 判断是否加载完所有数据
                    if (this.dataList.length >= data.totalRows) {
                        this.finished = true;
                    }
                } else {
                    this.dataList = [];
                }
            });
        },
        getList(){
            let params = {
                TypeId: '271857273098309',
                AppCode: 'xiaofang'
            }
            Global.publicAxiosRequest(params, dictionaryList, (data, msg) => {
                this.deviceTypeArr = this.deviceTypeArr.concat(data);
                this.getData();
            });
            let params1 = {
                PageNo: 1,
                PageSize: 100000,
                Id: this.userId
            };
            Global.publicAxiosRequest(params1, userBindingDeviceList, (data, msg) => {
                if (data.rows) {
                    this.selectedDevice = data.rows
                }
            });
        },
        // 选择设备类型
        deviceTypeConfirm(obj) {
            this.deviceType = obj.id;
            this.deviceTypeName = obj.value;
            this.deviceTypeArrShow = false;
            this.searchBtn();
        },
        // 搜索
        searchBtn() {
            this.page = 0;
            this.dataList = null;
            this.finished = false;
            this.getData();
        },
        getDeviceTypeName(deviceTypeId) {
            for (let item of this.deviceTypeArr) {
                if (deviceTypeId == item.id) {
                    return item.value;
                }
            }
            return '未知';
        },
        // 选择设备
        chooseDevice(obj) {
            if (!Global.isInArray(this.selectedDevice, obj.id, 'id')) {
                this.selectedDevice.unshift(obj);
            }
        },
        // 删除已选设备
        delDevice(index) {
            this.selectedDevice.splice(index, 1);
        },
        // 保存设备
        saveDevice() {
            if (this.selectedDevice.length > 20) {
                this.$toast('每次最多分配20个设备');
                return;
            }
            this.$dialog.confirm({
                message: '确认保存已选设备吗？'
            }).then(() => {
                let params = {
                    userId: this.userId,
                    deviceIdList: this.selectedDevice.map(item => item.id)
                }
                Global.publicAxiosRequest(params, setUserDevice, (data, msg) => {
                    Global.axiosMessage('success', '设备分配成功');
                    window.history.go(-1);
                });
            }).catch(() => {});
        }
    }
}
</script>
<style lang="scss" scoped>
.main {
    height: calc(60% - 78px);
    .normal_list {
        padding: 4px 17px;
        font-size: 12px;
    }
}
.device_wrapper {
    height: 40%;
    .title {
        position: relative;
        padding: 0 17px;
        font-size: 12px;
    }
    .device_list {
        height: calc(100% - 32px);
        padding: 5px 17px;
        color: #4664be;
        font-size: 12px;
        .device_item {
            position: relative;
            margin: 5px 0;
            padding: 0 10px;
            line-height: 20px;
            border-radius: 100px;
            border: 2px solid #4664be;
            i {
                margin: -3px 5px 0 0;
                font-size: 13px;
                vertical-align: middle;
            }
            .del {
                position: absolute;
                top: 6px;
                right: 3px;
            }
        }
    }
}
.no_data_wrapper {
    top: 25%;
}
</style>