<template>
    <div class="main_wrapper">
        <div class="login_cover"></div>
        <div class="login_container">
            <div class="logo">
                <!-- <img src="../assets/images/logo.png"> -->
                <label>智慧消防/安全用电云系统</label>
            </div>
            <div class="form">
				<van-form class="form" @submit="startLogin">
				    <van-field type="text" class="username" v-model="admin.account" :rules="[{ required: true }]" placeholder="账号" />
				    <van-field type="password" class="userpwd" v-model="admin.password" :rules="[{ required: true }]" placeholder="密码" />
				    <van-button native-type="submit" class="sure_btn">登录</van-button>
				</van-form>
                <!-- <van-tabs v-model="userType">
                    <van-tab title="管理员" name="1">
                        <van-form class="form" @submit="startLogin">
                            <van-field type="text" class="username" v-model="admin.userName" :rules="[{ required: true }]" placeholder="账号" />
                            <van-field type="password" class="userpwd" v-model="admin.pwd" :rules="[{ required: true }]" placeholder="密码" />
                            <van-button native-type="submit" class="sure_btn">登录</van-button>
                        </van-form>
                    </van-tab>
                    <van-tab title="用户" name="2">
                        <van-form class="form" @submit="startLogin">
                            <van-field type="digit" class="userphone" v-model="customer.userName" error-message-align="center" :rules="phoneRules" placeholder="手机号码" />
                            <van-field type="password" class="userpwd" v-model="customer.pwd" :rules="[{ required: true }]" placeholder="密码" />
                            <van-button native-type="submit" class="sure_btn">登录</van-button>
                        </van-form>
                    </van-tab>
                </van-tabs> -->
            </div>
        </div>
    </div>
</template>
<script>
import Global from '@/assets/js/global'
import { generateRoutes } from '@/router/menu'
import { userLogin, userInfo, fetchAppid } from '@/axios/request'
export default {
    data() {
        return {
            admin: {
                account: '',
                password: ''
            },
            // 校验手机号码
            phoneRules: [
                { required: true },
                {
                    validator: (val) => {
                        return /^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(val);
                    },
                    message: '手机号码格式错误'
                }
            ]
        }
    },
    methods: {
        startLogin() {
            // 开启登录loading
            Global.requestLoading = this.$toast.loading({
                duration: 0,
                message: '登录中...',
                forbidClick: true,
                loadingType: 'spinner'
            });
            Global.publicAxiosRequest(this.admin, userLogin, (data, msg) => {
                Global.storage.set('token', data);
                let params = {
                    AppCode: 'xiaofang'
                }
                Global.publicAxiosRequest(params, userInfo, (data1, msg) => {
                    generateRoutes(this.$router);
                    Global.storage.set('userInfo', data1);

                    // 判断是否用户登录，用户登录需要公众号授权
                    if (data1.account == 'xjaiot' || data1.account == 'admin') {
                        this.$router.push('/main');
                    } else {
                        Global.publicAxiosRequest({}, fetchAppid, (data2, msg) => {
                            // 设置公众号授权标志
                            data1.setWXAPPID = data2;
                            // 重新保存用户信息
                            Global.storage.set('userInfo', data1);
                            // 公众号授权
                            this.$router.push('/main');
                            // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + data2 + '&redirect_uri=' + Global.baseURL + '/app&response_type=code&scope=snsapi_base&state=1#wechat_redirect';
                        })
                    }
                })
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.main_wrapper {
    position: fixed;
    width: 100%;
    padding: 0 25px;
    background: #4664be url(../assets/images/login_back.png) no-repeat 50% 15px;
    background-size: 56%;
    overflow: auto;
    .login_cover,
    .login_container {
        position: absolute;
        top: 50%;
        margin-top: -140px;
        width: 327px;
        height: 315px;
    }
    .login_cover {
        border-radius: 15px;
        background-color: #fff;
        opacity: 0.8;
        box-shadow: 0 0 10px #fff;
        z-index: 99;
    }
    .login_container {
        padding: 25px 15px;
        z-index: 100;
        .logo {
            text-align: center;
            label {
                display: block;
                margin-top: 8px;
                font-size: 18px;
            }
        }
        .form {
            margin-top: 10px;
            .sure_btn {
                margin-top: 15px;
                border-radius: 100px;
            }
        }
    }
}
</style>
<style lang="scss">
.login_container {
    .van-tabs {
        .van-tabs__wrap {
            height: 40px;
            .van-tabs__nav {
                background-color: transparent;
                .van-tab {
                    color: #999;
                    &.van-tab--active {
                        color: #1b1b1b;
                    }
                }
                .van-tabs__line {
                    background-color: #4664be;
                }
            }
        }
    }
    .van-cell {
        background-color: transparent;
        .van-field__control {
            width: 100%;
            height: 40px;
            padding: 0 15px 0 45px;
            font-size: 13px;
            border-radius: 8px;
            background-color: #fff;
            background-repeat: no-repeat;
        }
        &.username {
            margin-top: 5px;
            .van-field__control {
                background-image: url(../assets/images/user.png);
                background-size: 15px;
                background-position: 13px 11px;
            }
        }
        &.userphone {
            margin-top: 5px;
            .van-field__control {
                background-image: url(../assets/images/phone.png);
                background-size: 15px;
                background-position: 13px 11px;
            }
        }
        &.userpwd {
            .van-field__control {
                background-image: url(../assets/images/pwd.png);
                background-size: 13px;
                background-position: 14px 11px;
            }
        }
    }
}
</style>