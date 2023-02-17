<template>
    <div class="container">
        <top-head title="用户列表" :targetName="isAdmin ? '添加用户' : ''" targetLink="/handleUser"></top-head>
        <div class="search_wrapper">
            <van-search v-model="phone" :clearable="false" placeholder="输入手机号码" />
            <van-button class="search_btn" color="#4664be" icon="search" size="mini" @click="searchUser"></van-button>
        </div>
        <div class="main search_main overflow_auto">
            <template v-if="dataList && dataList.length">
                <div class="normal_wrapper">
                    <van-list v-model="loading" :finished="finished" offset="10" finished-text="没有更多数据了" @load="getData">
                        <div class="data_wrapper normal_list" v-for="(item, index) in dataList" :key="index">
                            <van-row>
                                <van-col span="8">用户姓名</van-col>
                                <van-col span="16">{{ item.name }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">手机号码</van-col>
                                <van-col span="16">{{ item.phone }}</van-col>
                            </van-row>
                            <van-row>
                                <van-col span="8">所属区域</van-col>
                                <van-col span="16">{{ item.orgName }}</van-col>
                            </van-row>
							<van-row>
							    <van-col span="8">项目名称</van-col>
							    <van-col span="16" v-if="item.projectNames && item.projectNames.length != 0">
                                    <div v-for="(item1, index1) in item.projectNames" :key="index1">{{ item1.projectName }}</div>
                                </van-col>
                                <van-col span="16" v-else>--</van-col>
							</van-row>
							<van-row>
							    <van-col span="8">安装总数</van-col>
                                <van-col span="5">电气火灾</van-col>
                                <van-col span="5">智慧空开</van-col>
                                <van-col span="6">烟感</van-col>
							</van-row>
                            <van-row>
                                <van-col span="8"></van-col>
                                <van-col span="5" class="success">{{ item.deviceCount.dqhz }}</van-col>
                                <van-col span="5" class="success">{{ item.deviceCount.kk }}</van-col>
                                <van-col span="6" class="success">{{ item.deviceCount.smoke }}</van-col>
                            </van-row>
                            <van-row>
							    <van-col span="8"></van-col>
                                <van-col span="5">燃气</van-col>
                                <van-col span="5">门磁</van-col>
                                <van-col span="6"></van-col>
							</van-row>
                            <van-row>
                                <van-col span="8"></van-col>
                                <van-col span="5" class="success">{{ item.deviceCount.gas }}</van-col>
                                <van-col span="5" class="success">{{ item.deviceCount.door }}</van-col>
                                <van-col span="6"></van-col>
                            </van-row>
                            <div class="item_wrapper">
                                <div class="btn_wrapper">
                                    <van-button type="info" size="mini" round @click="routeJump('/userDeviceSet', JSON.stringify({ userId: item.id }))">设备分配</van-button>
                                    <van-button type="info" size="mini" round @click="routeJump('/handleUser', JSON.stringify(item))">编辑</van-button>
                                    <van-button type="info" size="mini" round @click="resetPassword(item.id)" v-if="isAdmin">重置密码</van-button>
                                    <van-button type="danger" size="mini" round @click="deleteUser(item.id)">删除</van-button>
                                </div>
                            </div>
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
import { userList, resetPassword, deleteUser } from '@/axios/request'
import TopHead from '@/components/TopHead.vue'
import NoData from '@/components/NoData.vue'
export default {
    components: {
        TopHead,
        NoData
    },
    data() {
        return {
            isAdmin: Global.storage.get('userInfo').adminType != 3,
            phone: '',
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
        // 获取用户列表
        getData() {
            this.page++;
            let params = {
                PageNo: this.page,
                PageSize: this.size,
                SearchValue: this.phone
            };
            Global.publicAxiosRequest(params, userList, (data, msg) => {
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
        },
        // 搜索
        searchUser() {
            this.page = 0;
            this.dataList = null;
            this.finished = false;
            this.getData();
        },
        // 管理员重置用户密码
        resetPassword(userId) {
            this.$dialog.confirm({
                message: '确定重置该用户密码吗？'
            }).then(() => {
                let params = {
                    id: userId
                };
                Global.publicAxiosRequest(params, resetPassword, (data, msg) => {
                    Global.axiosMessage('success', '重置密码成功');
                });
            }).catch(() => {});
        },
        // 删除用户
        deleteUser(id) {
            this.$dialog.confirm({
                message: '确认删除该用户吗？'
            }).then(() => {
                let params = {
                    userId: id
                }
                Global.publicAxiosRequest(params, deleteUser, (data, msg) => {
                    Global.axiosMessage('success', '删除成功');
                    this.searchUser();
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
.normal_list {
    padding: 6px 17px;
    line-height: 24px;
}
</style>