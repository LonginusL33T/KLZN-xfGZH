<template>
    <div class="container mapDialog">
        <top-head title="申请工单"></top-head>
        <div class="main overflow_auto">
            <van-form @submit="saveDevice">
                <ul class="ul_form">
                    <li>
                        <van-cell class="van-ellipsis" is-link @click="show = !show">{{ deviceName }}</van-cell>
                    </li>
                    <li>
                        <div class="left">联系用户</div>
                        <div class="right">
                            <van-field type="text" placeholder="请输入联系用户" v-model="applyForm.linkName" :rules="[{ required: true }]" />
                        </div>
                    </li>
                    <li>
                        <div class="left">手机号码</div>
                        <div class="right">
                            <van-field type="number" placeholder="请输入手机号码" v-model="applyForm.phone" :rules="phoneRules" />
                        </div>
                    </li>
                    <li class="bottom-none caption">希望处理日期</li>
                    <li>
                        <div class="left">希望处理日期</div>
                        <div class="right">
                            <van-field type="text" placeholder="请设置希望处理日期" v-model="applyForm.expectedTime" :rules="[{ required: true }]" readonly @click="showPicker = !showPicker" />
                        </div>
                    </li>
                    <li class="bottom-none caption">工单详情</li>
                    <li class="remarks">
                        <van-field type="textarea" rows="2" autosize show-word-limit maxlength="100" placeholder="请描述您遇到的问题" v-model="applyForm.contentText" :rules="[{ required: true }]" />
                    </li>
                    <li class="bottom-none caption">工单图片</li>
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
        <!-- 查询设备 -->
        <van-dialog v-model="show" width="100%">
            <van-radio-group v-model="radio">
                <van-cell :title="item.name" clickable @click="deviceClick(item)" v-for="(item, index) in deviceList" :key="index">
                    <template #right-icon>
                        <van-radio :name="item.id" />
                    </template>
                </van-cell>
            </van-radio-group>
        </van-dialog>
        <!-- 查询日期 -->
        <van-popup v-model="showPicker" round position="bottom">
            <van-datetime-picker v-model="currentDate" title="请选择日期" type="date" @confirm="searchDateConfirm" @cancel="showPicker = false" />
        </van-popup>
    </div>
</template>
<script>
import Global from '@/assets/js/global'
import { userBindingDeviceList, uploadImg, userSubmitWork } from '@/axios/request'
import TopHead from '@/components/TopHead.vue'
export default {
    components: {
        TopHead
    },
    data() {
        return {
            show: false,
            deviceName: '选择设备',
            applyForm: {
                linkName: '',
                phone: '',
                expectedTime: '',
                contentText: '',
                imageList: []
            },
            // 图片预览列表
            fileList: [],
            // 校验手机号码
            phoneRules: [
                { required: true },
                {
                    validator: (val) => {
                        return /^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(val);
                    },
                    message: '手机号码格式错误'
                }
            ],
            radio: '',
            deviceList: [],
            showPicker: false,
            currentDate: new Date()
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getData();
        });
    },
    methods: {
        getData() {
            let params = {
                PageNo: 1,
                PageSize: 100000,
                Id: Global.storage.get('userInfo').id
            }
            Global.publicAxiosRequest(params, userBindingDeviceList, (data, msg) => {
                if (data.rows) {
                    this.deviceList = data.rows
                }
            });
        },
        // 希望处理日期
        searchDateConfirm(date) {
            this.applyForm.expectedTime = Global.getDate(date);
            this.showPicker = false;
        },
        // 选择设备
        deviceClick(item) {
            this.radio = item.id
            this.deviceName = item.name
        },
        // 上传前置处理
        beforeRead(file) {
            if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
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
            this.applyForm.imageList = this.applyForm.imageList.filter(url => {
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
                    this.applyForm.imageList.push(data);
                } else {
                    file.status = 'failed';
                    file.message = '上传失败';
                }
            });
        },
        // 保存
        saveDevice() {
            if (!this.radio) {
                this.$notify({ type: 'warning', message: '请选择设备' });
                return;
            }
            // if (this.applyForm.imageList.length == 0) {
            //     this.$notify({ type: 'warning', message: '请上传图片' });
            //     return;
            // }
            let params = {
                linkName: this.applyForm.linkName,
                phone: this.applyForm.phone,
                imageList: JSON.stringify(this.applyForm.imageList),
                expectedTime: this.applyForm.expectedTime,
                contentText: this.applyForm.contentText,
                deviceId: this.radio
            }
            Global.publicAxiosRequest(params, userSubmitWork, (data, msg) => {
                Global.axiosMessage('success', '提交工单成功');
                window.history.go(-1);
            });
        }
    }
}
</script>
<style lang="scss" scoped>
.van-radio-group {
    .van-cell {
        padding-right: 10px;
        padding-left: 10px;
        border-bottom: 1px solid #e6e6e6;
    }
}
</style>