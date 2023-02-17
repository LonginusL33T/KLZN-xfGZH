<template>
    <div class="container">
        <img src="../assets/images/404.png">
        <a @click="clickEvevt">{{ tipsText }}</a>
    </div>
</template>
<script>
import Global from '@/assets/js/global'
export default {
    data() {
        return {
            // 是否已登录
            isLogin: false,
            // 提示文字
            tipsText: ''
        }
    },
    methods: {
        clickEvevt() {
            if (this.isLogin) {
                window.history.go(-1);
            } else {
                if (process.env.VUE_APP_API_URL == '/keli') {
                    location.href = `${location.origin}/#/`;
                } else {
                    location.href = `${Global.baseURL}/app/#/`;
                }
            }
        }
    },
    mounted() {
        if (Global.storage.get('userInfo')) {
            this.isLogin = true;
        }
        this.tipsText = this.isLogin ? '返回' : '您还没有登录，请点击登录';
    }
}
</script>
<style lang="scss" scoped>
.container {
    position: fixed;
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    img {
        max-width: 180px;
        margin-top: -100px;
    }
    a {
        display: inline-block;
        margin-top: 30px;
        padding: 3px 10px;
        color: #575757;
        font-size: 14px;
        border: 1px solid #575757;
        border-radius: 3px;
    }
}
</style>