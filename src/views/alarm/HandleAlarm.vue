<template>
    <div class="container mapDialog">
        <top-head title="处理报警"></top-head>
        <div class="main overflow_auto">
            <van-form @submit="saveDevice">
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
                        <van-field type="textarea" rows="2" autosize show-word-limit maxlength="100" placeholder="请输入维保内容" v-model="wbForm.maintain" />
                    </li>
                    <li class="bottom-none caption">处理结果</li>
                    <li class="remarks">
                        <van-field type="textarea" rows="2" autosize show-word-limit maxlength="100" placeholder="请输入处理结果" v-model="wbForm.result" />
                    </li>
                    <li class="bottom-none caption">图片</li>
                    <li class="bottom-none upload_wrapper">
                        <van-uploader v-model="fileList" :before-read="beforeRead" :after-read="uploadImage" :max-size="10 * 1024 * 1024" @oversize="onOversize" :max-count="1" multiple @delete="delImage">
                            <van-button icon="plus" type="primary" size="mini">上传图片</van-button>
                        </van-uploader>
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
import { uploadImg, handleAlarmStatus } from '@/axios/request'
import TopHead from '@/components/TopHead.vue'
export default {
    components: {
        TopHead
    },
    data() {
        return {
            item: {},
            wbForm: {
                maintain: '',
                result: '',
                images: ''
            },
            imageList: [],
            // 图片预览列表
            fileList: []
        }
    },
    methods: {
        // 上传前置处理
        beforeRead(file) {
            if (file.type != 'image/jpeg' && file.type != 'image/png') {
                this.$toast('请上传 jpg 或 png 格式的图片');
                return false;
            }
            return true;
        },
        // 限制图片上传大小(10M)
        onOversize(file) {
            this.$toast('上传图片大小不能超过 10M');
        },
        // 删除图片
        delImage(file) {
            this.imageList = this.imageList.filter(url => {
                return file.url.indexOf(url) < 0;
            });
        },
        // 上传图片
        uploadImage(file) {
            file.status = 'uploading';
            file.message = '上传中...';
            let params = new FormData();
            params.append('file', file.file);
            params.append('fileType', 1);
            Global.publicAxiosRequest(params, uploadImg, (data, msg) => {
                if (data) {
                    setTimeout(() => {
                        file.status = 'done';
                    }, 500);
                    // 设置当前图片的服务器路径
                    file.url = Global.baseURL + data;
                    // 保存上传图片
                    this.imageList.push(data);
                } else {
                    file.status = 'failed';
                    file.message = '上传失败';
                }
            });
        },
        // 保存
        saveDevice() {
            this.wbForm.id = this.item.id
            this.wbForm.status = 1
            this.wbForm.images = JSON.stringify(this.imageList)
            Global.publicAxiosRequest(this.wbForm, handleAlarmStatus, (data, msg) => {
                Global.axiosMessage('success', '提交成功');
                window.history.go(-1);
            });
        }
    },
    mounted() {
        if (this.$route.query.params) {
            this.item = JSON.parse(this.$route.query.params);
        }
    }
}
</script>
<style lang="scss" scoped>
</style>