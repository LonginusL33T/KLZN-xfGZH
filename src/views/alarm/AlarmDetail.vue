<template>
    <div class="container mapDialog">
        <top-head title="处理详情"></top-head>
        <div class="main overflow_auto">
            <van-form>
                <ul class="ul_form">
                    <li>
                        <div class="left">设备名称</div>
                        <div class="right" style="color: #999;">{{ item.deviceName || '--' }}</div>
                    </li>
                    <li>
                        <div class="left">设备号</div>
                        <div class="right" style="color: #999;">{{ item.deviceNumber || '--' }}</div>
                    </li>
                    <li>
                        <div class="left">所属项目</div>
                        <div class="right" style="color: #999;">{{ item.projectName || '--' }}</div>
                    </li>
                    <li class="bottom-none caption">维保内容</li>
                    <li class="remarks">
                        <van-field type="textarea" rows="2" autosize show-word-limit maxlength="100" placeholder="暂无内容" v-model="item.maintain" disabled />
                    </li>
                    <li class="bottom-none caption">处理结果</li>
                    <li class="remarks">
                        <van-field type="textarea" rows="2" autosize show-word-limit maxlength="100" placeholder="暂无内容" v-model="item.result" disabled />
                    </li>
                    <li class="bottom-none caption">图片</li>
                    <li class="bottom-none upload_wrapper img">
                        <template v-if="!item.images || JSON.parse(item.images).length == 0">无</template>
                        <template v-else>
                            <img class="object-fit_cover" v-for="item in JSON.parse(item.images)" :key="item" :src="baseURL + item" @click="imagePreview(baseURL + item)">
                        </template>
                    </li>
                </ul>
            </van-form>
        </div>
    </div>
</template>
<script>
import Global from '@/assets/js/global'
import TopHead from '@/components/TopHead.vue'
import { ImagePreview } from 'vant';
export default {
    components: {
        TopHead
    },
    data() {
        return {
            baseURL: Global.baseURL,
            item: {}
        }
    },
    mounted() {
        if (this.$route.query.params) {
            this.item = JSON.parse(this.$route.query.params);
        }
    },
    methods: {
        // 图片预览
        imagePreview(val) {
            ImagePreview([val]);
        }
    }
}
</script>
<style lang="scss" scoped>
.img {
    padding-top: 20px;
}
</style>