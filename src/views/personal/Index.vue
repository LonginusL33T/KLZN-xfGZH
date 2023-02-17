<template>
    <div class="container">
        <top-head title="个人中心"></top-head>
        <div class="main overflow_auto">
            <div class="normal_wrapper">
				<van-row class="cost_type_wrapper" type="flex" justify="space-around">
					<van-col span="24">
						<img src="../../assets/images/user.png">
					</van-col>
				</van-row>
                <van-row class="cost_type_wrapper font" type="flex" justify="space-around" style="margin-top:3%">
                    <van-col span="12">
                        用户名
                    </van-col>
                    <van-col>
                        {{userInfo.name || '--'}}
                    </van-col>
                </van-row>
                <van-row class="cost_type_wrapper font" type="flex" justify="space-around">
                    <van-col span="12">
                        手机号码
                    </van-col>
                    <van-col>
                        {{userInfo.phone || '--'}}
                    </van-col>
                </van-row>
                <van-row class="cost_type_wrapper" type="flex" justify="space-around">
                    <van-col span="24">
                    </van-col>
                </van-row>
            </div>
            <div class="cost_wrapper" style="background:white" @click="routeJump('/updatepwd')">
                <van-row class="cost_type_wrapper" type="flex" justify="space-around">
                    <van-col span="16" class="flex_center">
                        <img src="../../assets/images/updatepwd.png">
                        修改密码
                    </van-col>
                    <van-col span="8" style="font-size:20px;width: 40%;text-align: right;line-height:200%">
                        >
                    </van-col>
                </van-row>
            </div>
        </div>
    </div>
</template>
<script>
import Global from '@/assets/js/global'
import TopHead from '@/components/TopHead.vue'
export default {
    components: {
        TopHead
    },
    data() {
        return {
            userInfo: Global.storage.get('userInfo')
        }
    },
    methods: {
        routeJump(path) {
            this.$router.push({
                path
            });
        }
    }
}
</script>
<style lang="scss" scoped>
.font {
    font-weight: 800;
    margin: 3% 0;
}
.cost_type_wrapper>div {
    width: 30%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.font>div {
    width: 50%;
}
.cost_type_wrapper>div .cost_around img {
    max-height: 45px;
    margin: -5% 0 0 24%;
}
.main {
    background: #E6E6E6;
}
.normal_wrapper {
    // height: 30%;
    width: 90%;
    margin: 5%;
    border-radius: 10px;
    background: white;
}
.cost_wrapper .van-col[data-v-2dd53318] {
    height: 40px;
    color: #969799;
    font-size: 14px;
    line-height: 250%;
    img {
        max-height: 28px;
        margin-top: 3px;
    }
}
</style>