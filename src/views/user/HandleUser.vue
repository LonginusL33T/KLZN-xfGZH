<template>
    <div class="container">
        <top-head :title="title"></top-head>
        <div class="main overflow_auto">
            <van-form @submit="saveUser">
                <ul class="ul_form">
                    <li>
                        <van-field v-model="userForm.name" type="text" label="用户姓名" placeholder="请输入用户姓名" :rules="[{ required: true }]" />
                    </li>
                    <li>
                        <van-field v-model="userForm.phone" type="number" label="手机号码" placeholder="请输入手机号码" :rules="phoneRules" />
                    </li>
					<li class="bottom-none caption">请选择区域</li>
					<li class="bottom-none area">
					    <van-field v-model="areaName" label="区域" placeholder="请选择区域" :rules="[{ required: true }]" is-link readonly @click="areaListShow = true" />
					    <van-action-sheet v-model="areaListShow" :actions="areaList" cancel-text="取消" close-on-click-action @select="areaSelect" />
					</li>
                    <li class="bottom-none caption">请选择角色</li>
                    <li class="bottom-none area">
                        <van-field v-model="roleName" label="角色" placeholder="请选择角色" :rules="[{ required: true }]" is-link readonly @click="roleListShow = true" />
                        <van-action-sheet v-model="roleListShow" :actions="roleList" cancel-text="取消" close-on-click-action @select="roleSelect" />
                    </li>
                    <li class="bottom-none keep_btn">
                        <van-button native-type="submit" class="sure_btn">保存</van-button>
                    </li>
                </ul>
            </van-form>
        </div>
    </div>
</template>
<script>
import Global from '@/assets/js/global'
import { areaList, roleList, addUser, editUser, adminOwnRole, adminGrantRole, userList } from '@/axios/request'
import TopHead from '@/components/TopHead.vue'
export default {
    components: {
        TopHead
    },
    data() {
        return {
            userForm: {
                account: '',
                name: '',
                phone: '',
				orgId: ''
            },
            // 校验手机号码
            phoneRules: [
                {
                    required: true
                },
                {
                    validator: val => /^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(val),
                    message: '手机号码格式错误'
                }
            ],
            areaName: '',
			areaListShow: false,
            areaList: [],
            roleId: '',
            roleName: '',
            roleListShow: false,
            roleList: [], 
            actionEvent: null,
            title: ''
        }
    },
    mounted() {
        // 判断添加或编辑
        if (this.$route.query.params) {
            let params = JSON.parse(this.$route.query.params)
            this.title = '编辑用户';
            this.userForm.id = params.id;
            this.userForm.account = params.account;
            this.userForm.name = params.name;
            this.userForm.phone = params.phone;
            this.userForm.orgId = params.orgId;
            this.areaName = params.orgName;
            this.actionEvent = editUser;
        } else {
            this.title = '添加用户';
            this.userForm.password = '123456';
            this.userForm.confirm = '123456';
            this.actionEvent = addUser;
        }
        this.$nextTick(() => {
			this.getList();
            
        });
    },
    methods: {
        // 查询列表
        getList() {
            let params = {
                PageNo: 1,
				PageSize: 100000
            }
            Global.publicAxiosRequest(params, areaList, (data, msg) => {
                this.areaList = data.rows
            })
            Global.publicAxiosRequest(params, roleList, (data, msg) => {
                this.roleList = data.rows.filter(item => {
                    return item.name != '系统管理员';
                });
                if (this.title == '编辑用户') {
                    let params = {
                        id: this.userForm.id
                    }
                    Global.publicAxiosRequest(params, adminOwnRole, (data, msg) => {
                        for (let item of this.roleList) {
                            if (data[0] == item.id) {
                                this.roleName = item.name
                            }
                        }
                    })
                }
            })
        },
        areaSelect(action, index) {
            this.userForm.orgId = action.id
            this.areaName = action.name
        },
		roleSelect(action, index) {
            this.roleId = action.id
            this.roleName = action.name
        },
        // 保存
        saveUser() {
            if (this.title == '添加用户') {
                this.userForm.account = this.userForm.phone
            }
            Global.publicAxiosRequest(this.userForm, this.actionEvent, (data, msg) => {
                Global.axiosMessage('success', this.title + '成功');
                let params = {
                    PageNo: 1,
                    PageSize: 100000,
                    Phone: this.userForm.phone
                };
                Global.publicAxiosRequest(params, userList, (data, msg) => {
                    let params1 = {
                        id: data.rows[0].id,
                        grantRoleIdList: [this.roleId]
                    }
                    Global.publicAxiosRequest(params1, adminGrantRole, (result, msg) => {

                    });
                });
                window.history.go(-1);
            });
        }
    }
}
</script>
<style lang="scss" scoped>
.isAdmin {
    height: 39px;
    padding: 10px 20px;
}
.area {
    height: 39px;
    padding: 0 20px;
}
// /deep/ .ul_form li {
//     display: flex;
//     border-bottom: none;
// }
</style>