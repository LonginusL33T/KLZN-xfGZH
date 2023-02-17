<template>
    <div class="container">
        <top-head :title="title"></top-head>
        <div class="main overflow_auto">
            <van-form @submit="save">
                <ul class="ul_form">
                    <li>
                        <van-field v-model="areaForm.name" label="名称" placeholder="请输入区域名称" :rules="[{ required: true }]" />
                    </li>
					<li class="bottom-none caption">请选择上级区域</li>
					<li class="bottom-none area">
					    <van-field v-model="topAreaName" label="上级区域" placeholder="请选择上级区域" :rules="[{ required: true }]" is-link readonly @click="topAreaArrShow = true" />
					    <van-action-sheet v-model="topAreaArrShow" :actions="topAreaArr" cancel-text="取消" close-on-click-action @select="topAreaSelect" />
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
import { dictionaryList, areaList, addArea, editArea } from '@/axios/request'
import TopHead from '@/components/TopHead.vue'
export default {
    components: {
        TopHead
    },
    data() {
        return {
            areaForm: {
                name: '',
                code: '',
                orgType: '',
                pid: ''
            },
			topAreaArrShow: false,
            topAreaName: '',
            topAreaArr: [],
            actionEvent: null,
            title: ''
        }
    },
    mounted() {
        // 判断添加或编辑
        if (this.$route.query.params) {
            let params = JSON.parse(this.$route.query.params)
            this.title = '编辑区域';
            this.areaForm.id = params.id;
            this.areaForm.name = params.code;
            this.areaForm.code = params.code;
            this.areaForm.orgType = params.orgType;
            this.areaForm.pid = params.pid;
            this.actionEvent = editArea;
        } else {
            this.title = '添加区域';
            this.actionEvent = addArea;
        }
        this.$nextTick(() => {
			this.getList();
        });
    },
    methods: {
        getList() {
            let params = {
                PageNo: 1,
				PageSize: 100000
            }
            Global.publicAxiosRequest(params, areaList, (data, msg) => {
                this.topAreaArr = data.rows
                if (this.title == '编辑区域') {
                    for (let item of data.rows) {
                        if (this.areaForm.pid == item.id) {
                            this.topAreaName = item.name
                        }
                    }
                }
            })
            if (this.title == '添加区域') {
                Global.publicAxiosRequest({ TypeId: '142307070926942' }, dictionaryList, (data, msg) => {
                    this.areaForm.orgType = data[0].id
                })
            }
        },
        topAreaSelect(action, index) {
            this.areaForm.pid = action.id
            this.topAreaName = action.name
        },
        // 保存
        save() {
            if (this.title == '添加区域') {
                this.areaForm.code = this.areaForm.name;
            }
            Global.publicAxiosRequest(this.areaForm, this.actionEvent, (data, msg) => {
                Global.axiosMessage('success', this.title + '成功');
                window.history.go(-1);
            });
        }
    }
}
</script>
<style lang="scss" scoped>
.isAdmin {
    height: 39px;
    padding: 10px 20px;
}
.area {
    height: 39px;
    padding: 0 20px;
}
// /deep/ .ul_form li {
//     display: flex;
//     border-bottom: none;
// }
</style>