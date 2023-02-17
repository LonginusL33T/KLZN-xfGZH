<template>
    <div class="container">
        <top-head :title="title"></top-head>
        <div class="main search_main overflow_auto">
            <template v-if="dataList && dataList.length">
                <van-list v-model="loading" :finished="finished" offset="10" finished-text="没有更多数据了" @load="getData">
                    <div class="data_wrapper" v-for="(item, index) in dataList" :key="index">
                        <div class="item_wrapper">
                            <!-- 上下线记录 -->
                            <template v-if="deviceInfo.type == 1">
                                <van-row>
                                    <van-col span="6">创建时间</van-col>
                                    <van-col span="18">{{ item.createdTime || '--' }}</van-col>
                                </van-row>
                                <van-row>
                                    <van-col span="6">设备名称</van-col>
                                    <van-col span="18">{{ item.deviceName || '--' }}</van-col>
                                </van-row>
                                <van-row>
                                    <van-col span="6">设备编号</van-col>
                                    <van-col span="18">{{ item.deviceNumber || '--' }}</van-col>
                                </van-row>
                                <van-row>
                                    <van-col span="6">上下线</van-col>
                                    <van-col span="18">{{ item.online ? '上线' : '离线' }}</van-col>
                                </van-row>
                            </template>
                            <!-- 发送指令记录 -->
                            <template v-if="deviceInfo.type == 2">
                                <van-row>
                                    <van-col span="6">创建时间</van-col>
                                    <van-col span="18">{{ item.createdTime || '--' }}</van-col>
                                </van-row>
                                <van-row>
                                    <van-col span="6">操作人</van-col>
                                    <van-col span="18">{{ item.userName || '--' }}</van-col>
                                </van-row>
                                <van-row>
                                    <van-col span="6">设备名称</van-col>
                                    <van-col span="18">{{ item.deviceName || '--' }}</van-col>
                                </van-row>
                                <van-row>
                                    <van-col span="6">设备类型</van-col>
                                    <van-col span="18">{{ item.deviceTypeName || '--' }}</van-col>
                                </van-row>
                                <van-row>
                                    <van-col span="6">下发内容</van-col>
                                    <van-col span="18">{{ item.content || '--' }}</van-col>
                                </van-row>
                                <van-row>
                                    <van-col span="6">下发指令状态</van-col>
                                    <van-col span="18">{{ item.status == 0 ? '未发送' : item.status == 1 ? '已发送' : item.status == 2 ? '发送失败' : '未知' }}</van-col>
                                </van-row>
                                <van-row>
                                    <van-col span="6">下发指令结果</van-col>
                                    <van-col span="18" v-html="item.message"></van-col>
                                </van-row>
                            </template>
                        </div>
                    </div>
                </van-list>
            </template>
            <no-data v-if="dataList && !dataList.length"></no-data>
        </div>
    </div>
</template>
<script>
import Global from '@/assets/js/global'
import { onlineOfflineRecord, commandRecord } from '@/axios/request'
import TopHead from '@/components/TopHead.vue'
import NoData from '@/components/NoData.vue'
export default {
    components: {
        TopHead,
        NoData
    },
    data() {
        return {
            deviceInfo: {},
            actionEvent: null,
            title: '上下线记录',
            dataList: null,
            // 是否加载数据
            loading: false,
            // 数据是否全部加载
            finished: false,
            // 页码
            page: 0,
            // 每页显示条数
            size: 10,
        }
    },
    mounted() {
        this.deviceInfo = JSON.parse(this.$route.query.params);
        if (this.deviceInfo.type == 1) {
            this.actionEvent = onlineOfflineRecord;
        } else {
            this.title = '发送指令记录'
            this.actionEvent = commandRecord;
        }
        this.$nextTick(() => {
            this.getData();
        });
    },
    methods: {
        getData() {
            this.page++;
            let params = {
                PageNo: this.page,
                PageSize: this.size,
                DeviceId: this.deviceInfo.deviceId
            };
            Global.publicAxiosRequest(params, this.actionEvent, (data, msg) => {
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
        }
    }
}
</script>
<style lang="scss" scoped>
</style>