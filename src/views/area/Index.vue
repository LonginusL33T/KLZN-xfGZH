<template>
    <div class="container">
        <top-head title="区域列表" targetName="添加区域" targetLink="/handleArea"></top-head>
        <div class="search_wrapper">
            <van-search v-model="Name" :clearable="false" placeholder="输入区域名称" />
            <van-button class="search_btn" color="#4664be" icon="search" size="mini" @click="search"></van-button>
        </div>
        <div class="search_wrapper" @click="treeShow = true">
            <div class="device_type">
                <van-icon name="cluster" />区域树状图
            </div>
        </div>
        <div class="main search_main overflow_auto">
            <template v-if="dataList && dataList.length">
                <div class="normal_wrapper">
                    <van-list v-model="loading" :finished="finished" offset="10" finished-text="没有更多数据了" @load="getData">
                        <div class="data_wrapper normal_list" v-for="(item, index) in dataList" :key="index">
                            <van-row>
                                <van-col span="8">区域名称</van-col>
                                <van-col span="16">{{ item.name }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">设备详情</van-col>
                                <van-col span="16">
                                    <div>电气火灾：{{ JSON.parse(item.deviceInfo)['电气火灾'] }}</div>
                                    <div>智慧空开：{{ JSON.parse(item.deviceInfo)['智慧空开'] }}</div>
                                    <div>烟感：{{ JSON.parse(item.deviceInfo)['烟感设备'] }}</div>
                                    <div>燃气：{{ JSON.parse(item.deviceInfo)['燃气设备'] }}</div>
                                    <div>门磁：{{ JSON.parse(item.deviceInfo)['门磁'] }}</div>
                                </van-col>
                            </van-row>
                            <div class="item_wrapper">
                                <div class="btn_wrapper">
                                    <van-button type="info" size="mini" round @click="routeJump('/handleArea', JSON.stringify(item))">编辑</van-button>
                                    <van-button type="danger" size="mini" round @click="deleteArea(item.id)">删除</van-button>
                                </div>
                            </div>
                        </div>
                    </van-list>
                </div>
            </template>
            <no-data v-if="dataList && !dataList.length"></no-data>
        </div>
        <van-popup v-model="treeShow" round position="bottom">
            <van-cascader title="区域树状图" :options="options" :field-names="fieldNames" @close="treeShow = false" />
        </van-popup>
    </div>
</template>
<script>
import Global from '@/assets/js/global'
import { areaList, areaTree, deleteArea } from '@/axios/request'
import TopHead from '@/components/TopHead.vue'
import NoData from '@/components/NoData.vue'
export default {
    components: {
        TopHead,
        NoData
    },
    data() {
        return {
            Name: '',
            dataList: null,
            loading: false,
            finished: false,
            page: 0,
            size: 20,
            treeShow: false,
            options: [],
            fieldNames: {
                text: 'title',
                value: 'id'
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getData();
        });
    },
    methods: {
        // 获取用户列表
        getData() {
            this.page++;
            let params = {
                PageNo: this.page,
                PageSize: this.size,
                Name: this.Name
            };
            Global.publicAxiosRequest(params, areaList, (data, msg) => {
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
            });
            Global.publicAxiosRequest({}, areaTree, (data, msg) => {
                this.options = data
            });
        },
        // 搜索
        search() {
            this.page = 0;
            this.dataList = null;
            this.finished = false;
            this.getData();
        },
        // 删除区域
        deleteArea(id) {
            this.$dialog.confirm({
                message: '确认删除该区域吗？'
            }).then(() => {
                let params = {
                    id: id
                };
                Global.publicAxiosRequest(params, deleteArea, (data, msg) => {
                    Global.axiosMessage('success', '删除成功');
                    this.search();
                });
            }).catch(() => {});
        },
        routeJump(path, params) {
            Global.routeJump(this.$router, path, params)
        }
    }
}
</script>
<style lang="scss" scoped>
.search_main {
    height: calc(100% - 78px - 39px);
}
.normal_list {
    padding: 6px 17px;
    line-height: 24px;
}
</style>