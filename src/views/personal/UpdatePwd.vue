<template>
    <div class="container">
        <top-head title="修改密码"></top-head>
        <div class="main overflow_auto">
            <van-form @submit="saveUser">
                <ul class="ul_form">
                    <li>
                        <div class="left font">{{userInfo.name || '--'}}</div>
                        <div class="right font">
                            {{userInfo.phone || '--'}}
                        </div>
                    </li>
                    <li>
                        <div class="left">旧密码 </div>
                        <div class="right">
                            <van-field type="password" placeholder="请输入旧密码" v-model="passwordForm.oldpwd" />
                        </div>
                    </li>
                    <li>
                        <div class="left">新密码</div>
                        <div class="right">
                            <van-field type="password" placeholder="请输入新密码" v-model="passwordForm.newpwd" />
                        </div>
                    </li>
                    <li class="bottom-none">
                        <div class="left">确认新密码</div>
                        <div class="right">
                            <van-field type="password" placeholder="请再次输入新密码" v-model="passwordForm.renewpwd" />
                        </div>
                    </li>
                    <li class="bottom-none keep_btn">
                        <van-button native-type="submit" class="sure_btn">修改密码</van-button>
                    </li>
                </ul>
            </van-form>
        </div>
    </div>
</template>
<script>
import Global from '@/assets/js/global'
import { editPassword } from '@/axios/request'
import TopHead from '@/components/TopHead.vue'
export default {
    components: {
        TopHead
    },
    data() {
        return {
            userInfo: Global.storage.get('userInfo'),
            passwordForm:{
                oldpwd:'',
                newpwd:'',
                renewpwd:''
            }
        }
    },
    methods: {
        // 保存
        saveUser() {
            if(this.passwordForm.newpwd != this.passwordForm.renewpwd){
				this.$toast('新密码输入不一致');
                return;
            }
            let params = {
                id: this.userInfo.id,
                password: this.passwordForm.oldpwd,
                newPassword: this.passwordForm.newpwd
            }
            Global.publicAxiosRequest(params, editPassword, (data, msg) => {
                Global.axiosMessage('success', '修改成功,请重新登陆');
                Global.storage.clean();
                window.location.href = window.location.href.indexOf('xjaiot') > -1 ? Global.baseURL + '/SafeSystem/#/' : window.location.origin + '/#/';
            });
        }
    }
}
</script>
<style lang="scss" scoped>
.font{
    font-weight: 800;
}
</style>