<template>
    <div class="title_wrapper">
        <img class="come_back" src="../assets/images/come_back.png" @click="comeBack">
        <label @click="triggerEvent">{{ title }}<img class="chooseDown" :src="imgSrc" v-if="imgSrc"></label>
        <a @click="linkPage">{{ targetName }}</a>
    </div>
</template>
<script>
import Global from '@/assets/js/global'
export default {
    props: {
        // 标题
        title: {
            type: String,
            default: ''
        },
        // 标题图片
        imgSrc: {
            type: String,
            default: ''
        },
        // 链接页面标题
        targetName: {
            type: String,
            default: ''
        },
        // 链接页面路径
        targetLink: {
            type: String,
            default: ''
        },
        // 链接页面参数
        targetParams: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    methods: {
        // 返回上一页
        comeBack() {
            window.history.go(-1);
        },
        // 标题事件
        triggerEvent() {
            if (this.imgSrc) {
                this.$emit('showDate');
            }
        },
        // 跳转链接页面
        linkPage() {
            if (this.targetLink) {
                let pushObj = !Global.isObjectNull(this.targetParams) ? { path: this.targetLink, query: this.targetParams } : { path: this.targetLink };
                this.$router.push(pushObj);
            } else {
                this.$emit('targetEvent');
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.title_wrapper {
    display: flex;
    height: 39px;
    padding: 0 17px;
    color: #fff;
    line-height: 39px;
    align-items: center;
    justify-content: center;
    background-color: #4664be;
    img.come_back {
        position: absolute;
        left: 17px;
        max-height: 18px;
        cursor: pointer;
    }
    label {
        font-size: 16px;
        cursor: pointer;
        img.chooseDown {
            max-height: 12px;
            margin: 0 0 -1px 5px;
            transform: rotate(-90deg);
        }
    }
    a {
        position: absolute;
        right: 17px;
        font-size: 12px;
    }
}
.specialTitle {
    label {
        width: 200px;
        font-size: 14px;
        text-align: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}
</style>