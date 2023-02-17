<template>
    <div class="container">
        <top-head title="工单详情"></top-head>
        <div class="main overflow_auto">
            <div class="detail_wrapper">
                <van-row>
                    <van-col span="8">创建时间</van-col>
                    <van-col span="16">{{ workOrderDetail.createdTime || '--' }}</van-col>
                </van-row>
                <van-row>
                    <van-col span="8">创建人</van-col>
                    <van-col span="16">{{ workOrderDetail.linkName || '--' }}</van-col>
                </van-row>
                <van-row>
                    <van-col span="8">创建人联系方式</van-col>
                    <van-col span="16"><a class="danger" :href="'tel:' + workOrderDetail.phone">{{ workOrderDetail.phone }}</a></van-col>
                </van-row>
                <van-row>
                    <van-col span="8">工单状态</van-col>
                    <van-col span="16" class="danger">{{ workOrderDetail.status == 1 || workOrderDetail.status == 2 ? '处理中' : workOrderDetail.status  == 3 ? '待确认' : workOrderDetail.status  == 6 ? '已取消' : workOrderDetail.status  == 8 ? '已完成' : '未知' }}</van-col>
                </van-row>
                <div style="height: 10px;"></div>
                <van-row type="flex" justify="center" v-if="!isAdmin && workOrderOperationShow && workOrderDetail.operatUserId != userId">
                    <van-button type="info" size="mini" round @click="completeWorkOrder(workOrderId)">完成工单</van-button>
                    <van-button type="info" size="mini" round @click="cancelWorkOrder(workOrderId)">取消工单</van-button>
                </van-row>
            </div>
            <ul class="ul_form">
                <li class="bottom-none caption">报修详情</li>
            </ul>
            <div class="detail_wrapper">
                <van-row>
                    <van-col span="8">设备名称</van-col>
                    <van-col span="16">{{ workOrderDetail.deviceName || '--' }}</van-col>
                </van-row>
                <van-row>
                    <van-col span="8">希望处理时间</van-col>
                    <van-col span="16">{{ workOrderDetail.expectedTime || '--' }}</van-col>
                </van-row>
                <van-row>
                    <van-col span="8">工单内容</van-col>
                    <van-col span="16">{{ workOrderDetail.contentText || '--' }}</van-col>
                </van-row>
                <van-row>
                    <van-col span="8">工单图片</van-col>
                    <van-col span="16">
                        <template v-if="!workOrderDetail.imageList || JSON.parse(workOrderDetail.imageList).length == 0">--</template>
                        <template v-else>
                            <img class="object-fit_cover" v-for="item in JSON.parse(workOrderDetail.imageList)" :key="item" :src="baseURL + item" @click="imagePreview(baseURL + item)">
                        </template>
                    </van-col>
                </van-row>
                <van-row>
                    <van-col span="8">处理人</van-col>
                    <van-col span="16">{{ workOrderDetail.operatUserName || '--' }}</van-col>
                </van-row>
                <van-row>
                    <van-col span="8">处理人联系方式</van-col>
                    <van-col span="16"><a class="danger" :href="'tel:' + operatUserPhone">{{ operatUserPhone }}</a></van-col>
                </van-row>
            </div>
            <template v-for="(item, index) in workOrderList">
                <div :key="index">
                    <ul class="ul_form">
                        <li class="bottom-none caption">流程-{{ index + 1 }}（{{ item.isAdmin ? '管理员' : '用户' }}）</li>
                    </ul>
                    <div class="detail_wrapper">
                        <van-row>
                            <van-col span="8">创建时间</van-col>
                            <van-col span="16">{{ item.createdTime || '--' }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="8">名称</van-col>
                            <van-col span="16">{{ item.operatUserName || '--' }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="8">联系方式</van-col>
                            <van-col span="16">{{ item.operatPhone || '--' }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="8">内容</van-col>
                            <van-col span="16">{{ item.contentText || '--' }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="8">图片</van-col>
                            <van-col span="16">
                                <template v-if="item.imageList == 'string' || !item.imageList || JSON.parse(item.imageList).length == 0">--</template>
                                <template v-else>
                                    <img class="object-fit_cover" v-for="item1 in JSON.parse(item.imageList)" :key="item1" :src="baseURL + item1" @click.stop="imagePreview(baseURL + item1)">
                                </template>
                            </van-col>
                        </van-row>
                    </div>
                </div>
            </template>
            <ul class="ul_form" v-if="workOrderOperationShow">
                <van-form @submit="submitBtn">
                    <li class="bottom-none caption">工单处理</li>
                    <li>
                        <div class="left">手机号码</div>
                        <div class="right">
                            <van-field type="number" placeholder="请输入手机号码" v-model="form.operatPhone" :rules="phoneRules" />
                        </div>
                    </li>
                    <li class="remarks">
                        <van-field type="textarea" rows="2" autosize show-word-limit maxlength="100" placeholder="请输入您的描述" v-model="form.contentText" :rules="[{ required: true }]" />
                    </li>
                    <li class="upload_wrapper">
                        <van-uploader v-model="fileList" :before-read="beforeRead" :after-read="uploadImage" @oversize="onOversize" :max-size="10 * 1024 * 1024" :max-count="1" @delete="delImage">
                            <van-button icon="plus" type="primary" size="mini">上传图片</van-button>
                        </van-uploader>
                    </li>
                    <van-button class="sure_btn" native-type="submit">提交</van-button>
                </van-form>
            </ul>
        </div>
    </div>
</template>
<script>
import Global from '@/assets/js/global'
import { uploadImg, workOrderDetail, handleWorkOrder, replyWorkOrder, completeWorkOrder, cancelWorkOrder } from '@/axios/request'
import TopHead from '@/components/TopHead.vue'
import NoData from '@/components/NoData.vue'
import { ImagePreview } from 'vant';
export default {
    components: {
        TopHead,
        NoData
    },
    data() {
        return {
            isAdmin: Global.storage.get('userInfo').adminType != 3,
            userId: Global.storage.get('userInfo').id,
            workOrderOperationShow: false,
            workOrderId: '',
            workOrderDetail: {},
            operatUserPhone: '',
            workOrderList: [],
            baseURL: Global.baseURL,
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
            form: {
                operatPhone: '',
                contentText: '',
                imageList: []
            }
        }
    },
    mounted() {
        let params = JSON.parse(this.$route.query.params)
        this.workOrderId = params.workOrderId
        this.operatUserPhone = params.operatUserPhone
        this.$nextTick(() => {
            this.getData();
        });
    },
    methods: {
        getData() {
            let params = {
                OrderId: this.workOrderId,
                PageNo: 1,
                PageSize: 100000
            };
            Global.publicAxiosRequest(params, workOrderDetail, (data, msg) => {
                this.workOrderDetail = data.orderOutput
                this.workOrderList = data.workRecord.rows.reverse()
                if (this.workOrderDetail.status != 6 && this.workOrderDetail.status != 8) {
                    this.workOrderOperationShow = true
                }
            });
        },
        // 图片预览
        imagePreview(val) {
            ImagePreview([val]);
        },
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
            this.form.imageList = this.form.imageList.filter(url => {
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
                    this.form.imageList.push(data);
                } else {
                    file.status = 'failed';
                    file.message = '上传失败';
                }
            });
        },
        // 提交
        submitBtn() {
            // if (this.form.imageList.length == 0) {
            //     this.$notify({ type: 'warning', message: '请上传图片' });
            //     return;
            // }
            let isAdmin = this.isAdmin || this.workOrderDetail.operatUserId == this.userId
            let params = {
                orderId: this.workOrderId,
                operatPhone: this.form.operatPhone,
                contentText: this.form.contentText,
                imageList: JSON.stringify(this.form.imageList),
                remark: isAdmin ? '管理员处理' : '用户回复'
            }
            Global.publicAxiosRequest(params, isAdmin ? handleWorkOrder : replyWorkOrder, (data, msg) => {
                Global.axiosMessage('success', '处理成功');
                window.history.go(-1);
            });
        },
        // 用户完成工单
        completeWorkOrder(id) {
            this.$dialog.confirm({
                message: '确定完成该工单吗？'
            }).then(() => {
                let params = {
                    orderId: id,
                    grade: 100,
                    remark: '完成工单'
                }
                Global.publicAxiosRequest(params, completeWorkOrder, (data, msg) => {
                    Global.axiosMessage('success', '工单已完结');
                    window.history.go(-1);
                });
            }).catch(() => {});
        },
        // 用户取消工单
        cancelWorkOrder(id) {
            this.$dialog.confirm({
                message: '确定取消该工单吗？'
            }).then(() => {
                let params = {
                    orderId: id,
                    remark: '取消工单'
                }
                Global.publicAxiosRequest(params, cancelWorkOrder, (data, msg) => {
                    Global.axiosMessage('success', '工单已取消');
                    window.history.go(-1);
                });
            }).catch(() => {});
        }
    }
}
</script>
<style lang="scss" scoped>
.detail_wrapper {
    padding: 10px 20px;
    line-height: 22px;
}
.ul_form {
    padding: 0;
}
.sure_btn {
    width: 80%;
    margin: 20px auto 40px;
}
</style>