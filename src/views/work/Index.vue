<template>
    <div class="container">
        <top-head title="工单列表" v-if="isAdmin"></top-head>
        <top-head title="工单列表" targetName="申请工单" targetLink="/applyWorkOrder" v-else></top-head>
        <div class="main overflow_auto">
            <template v-if="dataList && dataList.length">
                <van-list v-model="loading" :finished="finished" offset="10" finished-text="没有更多数据了" @load="getData">
                    <div class="data_wrapper" v-for="(item, index) in dataList" :key="index" @click="routerLink('/workOrderDetail', JSON.stringify({ workOrderId: item.id, operatUserPhone: item.operatUserPhone }))">
                        <div class="item_wrapper">
                            <van-row>
                                <van-col span="8">创建时间</van-col>
                                <van-col span="16">{{ item.createdTime || '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">创建人</van-col>
                                <van-col span="16">{{ item.linkName || '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">创建人联系方式</van-col>
                                <van-col span="16"><a class="danger" :href="'tel:' + item.phone" @click.stop>{{ item.phone }}</a></van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">工单状态</van-col>
                                <van-col span="16" class="danger">{{ item.status == 1 || item.status == 2 ? '处理中' : item.status == 3 ? '待确认' : item.status == 6 ? '已取消' : item.status == 8 ? '已完成' : '未知' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">设备名称</van-col>
                                <van-col span="16">{{ item.deviceName || '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">希望处理时间</van-col>
                                <van-col span="16">{{ item.expectedTime || '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">工单内容</van-col>
                                <van-col span="16">{{ item.contentText || '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">工单图片</van-col>
                                <van-col span="16">
                                    <template v-if="!item.imageList || JSON.parse(item.imageList).length == 0">--</template>
                                    <template v-else>
                                        <img class="object-fit_cover" v-for="item1 in JSON.parse(item.imageList)" :key="item1" :src="baseURL + item1" @click.stop="imagePreview(baseURL + item1)">
                                    </template>
                                </van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">处理人</van-col>
                                <van-col span="16">{{ item.operatUserName || '--' }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">处理人联系方式</van-col>
                                <van-col span="16"><a class="danger" :href="'tel:' + item.operatUserPhone" @click.stop>{{ item.operatUserPhone }}</a></van-col>
                            </van-row>
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
import { workOrderList } from '@/axios/request'
import TopHead from '@/components/TopHead.vue'
import NoData from '@/components/NoData.vue'
import { ImagePreview } from 'vant'
export default {
    components: {
        TopHead,
        NoData
    },
    data() {
        return {
            isAdmin: Global.storage.get('userInfo').adminType != 3,
            userId: Global.storage.get('userInfo').id,
            baseURL: Global.baseURL,
            dataList: null,
            loading: false,
            finished: false,
            page: 0,
            size: 20
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getData();
        });
    },
    methods: {
        getData() {
            this.page++;
            let params = {
                PageNo: this.page,
                PageSize: this.size
            };
            Global.publicAxiosRequest(params, workOrderList, (data, msg) => {
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
                if (!this.isAdmin) {
                    let arr = [];
                    for (let item of this.dataList) {
                        if (item.operatUserId == item.userId) {
                            if (item.operatUserId == this.userId) {
                                arr.push(item)
                            }
                        } else {
                            if (item.operatUserId == this.userId) {
                                arr.push(item)
                            }
                            if (item.userId == this.userId) {
                                arr.push(item)
                            }
                        }
                    }
                    this.dataList = arr;
                }
            });
        },
        // 图片预览
        imagePreview(val) {
            ImagePreview([val]);
        },
        routerLink(path, params) {
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
<style lang="scss" scoped></style>