<template>
    <div class="container mapDialog">
        <top-head :title="title"></top-head>
        <div class="main overflow_auto">
            <van-form @submit="preserve">
                <ul class="ul_form">
                    <li>
                        <div class="left">项目名称</div>
                        <div class="right">
                            <van-field type="text" placeholder="请输入项目名称" v-model="projectForm.name" :rules="[{ required: true }]" />
                        </div>
                    </li>
                    <li>
					    <div class="left">区域</div>
					    <div class="right" @click="areaArrShow = true">
					        <span class="vertical_middle">{{ areaName }}</span><img class="vertical_middle" src="@/assets/images/choose.png">
					    </div>
					</li>
                    <li>
                        <div class="left">项目编号</div>
                        <div class="right">
                            <van-field type="text" placeholder="请输入项目编号" v-model="projectForm.aid" :rules="[{ required: true }]" />
                        </div>
                    </li>
                    <li>
                        <div class="left">项目地址</div>
                        <div class="right">
                            <van-field type="text" placeholder="请输入项目地址" v-model="projectForm.address" :rules="[{ required: true }]" />
                        </div>
                    </li>
                    <li>
                        <div class="left">项目备注</div>
                        <div class="right">
                            <van-field type="text" placeholder="请输入项目备注" v-model="projectForm.remark" />
                        </div>
                    </li>
                    <li class="bottom-none keep_btn">
                        <van-button native-type="submit" class="sure_btn">保存</van-button>
                    </li>
                </ul>
            </van-form>
        </div>
        <!-- 区域 -->
		<van-popup v-model="areaArrShow" round position="bottom">
		    <van-picker value-key="name" show-toolbar title="请选择区域" :columns="areaArr" @cancel="areaArrShow = false" @confirm="areaConfirm" />
		</van-popup>
    </div>
</template>
<script>
import Global from '@/assets/js/global'
import { areaList, addProject, editProject } from '@/axios/request'
import TopHead from '@/components/TopHead.vue'
import GaodeMap from '@/components/GaodeMap.vue'
export default {
    components: {
        TopHead,
        GaodeMap
    },
    data() {
        return {
            title: '',
            actionEvent: null,
            projectForm: {
                name: '',
                orgId: '',
                aid: '',
                address: '',
                remark: ''
            },
            areaArrShow: false,
            areaName: '请选择区域',
            areaArr: []
        }
    },
    methods: {
        getList() {
            let params = {
                PageNo: 1,
                PageSize: 100000
            }
            Global.publicAxiosRequest(params, areaList, (data, msg) => {
                this.areaArr = data.rows
            });
        },
        areaConfirm(obj) {
		    this.areaName = obj.name;
		    this.projectForm.orgId = obj.id;
		    this.areaArrShow = false;
		},
        preserve() {
            if (!this.projectForm.orgId) {
                this.$notify({ type: 'warning', message: '请选择区域' })
                return;
            }
            Global.publicAxiosRequest(this.projectForm, this.actionEvent, (data, msg) => {
                Global.axiosMessage('success', this.title + '成功');
                window.history.go(-1);
            });
        }
    },
    mounted() {
        if (this.$route.query.params) {
            let params = JSON.parse(this.$route.query.params)
            this.title = '编辑项目';
            this.projectForm.name = params.name;
            this.projectForm.orgId = params.orgId;
            this.projectForm.aid = params.aid;
            this.projectForm.address = params.address;
            this.projectForm.remark = params.remark;
            this.projectForm.id = params.id;
            this.areaName = params.orgName;
            this.actionEvent = editProject;
        } else {
            this.title = '添加项目';
            this.actionEvent = addProject;
        }
        this.$nextTick(() => {
            this.getList();
        });
    }
}
</script>