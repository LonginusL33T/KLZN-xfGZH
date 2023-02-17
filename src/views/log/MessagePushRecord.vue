<template>
    <div class="container">
        <top-head title="消息推送记录"></top-head>
        <div class="main search_main overflow_auto">
            <template v-if="dataList && dataList.length">
                <van-list v-model="loading" :finished="finished" offset="10" finished-text="没有更多数据了" @load="getData">
                    <div class="data_wrapper" v-for="(item, index) in dataList" :key="index">
                        <div class="item_wrapper">
                            <van-row>
                                <van-col span="6">创建时间</van-col>
                                <van-col span="18">{{ item.createdTime }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="6">消息类型</van-col>
                                <van-col span="18">{{ item.noticeType }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="6">推送对象</van-col>
                                <van-col span="18">{{ item.remark }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="6">推送内容</van-col>
                                <van-col span="18">{{ item.content }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="6">推送状态</van-col>
                                <van-col span="18">{{ item.status }}</van-col>
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
import { messagePushRecord } from '@/axios/request'
import TopHead from '@/components/TopHead.vue'
import NoData from '@/components/NoData.vue'
export default {
    components: {
        TopHead,
        NoData
    },
    data() {
        return {
            dataList: null,
            // 是否加载数据
            loading: false,
            // 数据是否全部加载
            finished: false,
            // 页码
            page: 0,
            // 每页显示条数
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
                PageSize: this.size,
                StartTime: '2000-01-01',
                EndTime: Global.getDate(new Date())
            };
            Global.publicAxiosRequest(params, messagePushRecord, (data, msg) => {
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
<style lang="scss" scoped></style>