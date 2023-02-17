<template>
    <div class="main_wrapper">
        <div class="location">
            <img src="../assets/images/location.png">{{ address }}
            <a class="logout" @click="logout">
                <van-icon class="vertical_middle" name="aim"></van-icon> <span class="vertical_middle">退出</span>
            </a>
        </div>
        <div class="router_wrapper">
            <router-view />
        </div>
    </div>
</template>
<script>
import Global from '@/assets/js/global'
export default {
    data() {
        return {
            address: '信捷安物联'
        }
    },
    methods: {
        logout() {
            this.$dialog.confirm({
                message: '确定退出当前应用吗？'
            }).then(() => {
                Global.storage.clean();
                if (process.env.VUE_APP_API_URL == '/keli') {
                    location.href = `${location.origin}/#/`;
                } else {
                    location.href = `${Global.baseURL}/app/#/`;
                }
            }).catch(() => {});
        }
    }
}
</script>
<style lang="scss" scoped>
.location {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 28px;
    padding: 0 10px;
    color: #101010;
    font-size: 14px;
    align-items: center;
    background-color: #fff;
    img {
        max-width: 12px;
        margin-right: 10px;
    }
    .logout {
        position: absolute;
        top: 4px;
        right: 10px;
    }
}
.router_wrapper {
    position: fixed;
    width: 100%;
    height: calc(100% - 28px);
    top: 28px;
    left: 0;
}
</style>