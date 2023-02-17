<template>
    <div class="container">
        <top-head title="阈值设置"></top-head>
        <div class="main overflow_auto">
            <van-form @submit="saveVal">
                <ul class="ul_form no_top">
					<van-tabs v-model="active" color="#4664be" @click="onClick">
						<van-tab title="电压">
							<li class="bottom-none caption">电压(V)</li>
							<li>
							    <div class="left">上限</div>
							    <div class="right">
							        <van-field type="number" placeholder="请输入电压上限" v-model="currentVal.volH" />
							    </div>
							</li>
							<li class="bottom-none">
							    <div class="left">下限</div>
							    <div class="right">
							        <van-field type="number" placeholder="请输入电压下限" v-model="currentVal.volL" />
							    </div>
							</li>
						</van-tab>
						<van-tab title="电流">
							<li class="bottom-none caption">电流(A)</li>
							<li class="bottom-none">
							    <div class="left">上限</div>
							    <div class="right">
							        <van-field type="number" placeholder="请输入电流上限" v-model="currentVal.curH" />
							    </div>
							</li>
						</van-tab>
						<van-tab title="功率">
							<li class="bottom-none caption">功率(W)</li>
							<li class="bottom-none">
							    <div class="left">上限</div>
							    <div class="right">
							        <van-field type="number" placeholder="请输入功率上限" v-model="currentVal.pwrH" />
							    </div>
							</li>
						</van-tab>
						<van-tab title="温度">
							<li class="bottom-none caption">温度(℃)</li>
							<li class="bottom-none">
							    <div class="left">上限</div>
							    <div class="right">
							        <van-field type="number" placeholder="请输入温度上限" v-model="currentVal.tmpH" />
							    </div>
							</li>
						</van-tab>
						<van-tab title="漏电流">
							<li class="bottom-none caption">漏电流(mA)</li>
							<li class="bottom-none">
							    <div class="left">上限</div>
							    <div class="right">
							        <van-field type="number" placeholder="请输入漏电流上限" v-model="currentVal.lkiH" />
							    </div>
							</li>
						</van-tab>
					</van-tabs>
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
import { mtCmd } from '@/axios/request'
import TopHead from '@/components/TopHead.vue'
export default {
    components: {
        TopHead
    },
    data() {
        return {
			active: 0,
            // 阈值对象
            currentVal: {
                volH: '',
                volL: '',
                curH: '',
                pwrH: '',
                tmpH: '',
                lkiH: ''
            },
			deviceId: '',
			addr: '',
			cmdType: '',
			data: ''
        }
    },
	mounted() {
		let params = JSON.parse(this.$route.query.params)
        this.deviceId = params.deviceId;
		this.addr = params.addr;
		this.currentVal.volH = this.getJSON(params, 'vol')['volH'];
		this.currentVal.volL = this.getJSON(params, 'vol')['volL'];
		this.currentVal.curH = this.getJSON(params, 'cur')['curH'];
		this.currentVal.pwrH = this.getJSON(params, 'pwr')['pwrH'];
		this.currentVal.tmpH = this.getJSON(params, 'tmp')['tmpH'];
		this.currentVal.lkiH = this.getJSON(params, 'lki')['lkiH'];
		
		this.cmdType = '3005'
		this.data = JSON.stringify({addr: this.addr, upper: this.currentVal.volH, lower: this.currentVal.volL})
    },
    methods: {
		getJSON(object, attr) {
		    return !Global.isObjectNull(object) ? object[attr] ? object[attr] : '' : '';
		},
		onClick(name, title) {
			if (name === 0) {
				this.cmdType = '3005'
			} else if (name === 1) {
				this.cmdType = '3002'
			} else if (name === 2) {
				this.cmdType = '3001'
			} else if (name === 3) {
				this.cmdType = '3004'
			} else if (name === 4) {
				this.cmdType = '3003'
			}
		},
        // 编辑阈值
        saveVal() {
			if (this.cmdType === '3005') {
				if (!this.currentVal.volH || !this.currentVal.volL) {
					Global.axiosMessage('warning', '请输入值');
					return;
				}
				this.data = JSON.stringify({addr: this.addr, upper: this.currentVal.volH, lower: this.currentVal.volL})
			} else if (this.cmdType === '3002') {
				if (!this.currentVal.curH) {
					Global.axiosMessage('warning', '请输入值');
					return;
				}
				this.data = JSON.stringify({addr: this.addr, upper: this.currentVal.curH})
			} else if (this.cmdType === '3001') {
				if (!this.currentVal.pwrH) {
					Global.axiosMessage('warning', '请输入值');
					return;
				}
				this.data = JSON.stringify({addr: this.addr, upper: this.currentVal.pwrH})
			} else if (this.cmdType === '3004') {
				if (!this.currentVal.tmpH) {
					Global.axiosMessage('warning', '请输入值');
					return;
				}
				this.data = JSON.stringify({addr: this.addr, upper: this.currentVal.tmpH})
			} else if (this.cmdType === '3003') {
				if (!this.currentVal.lkiH) {
					Global.axiosMessage('warning', '请输入值');
					return;
				}
				this.data = JSON.stringify({addr: this.addr, upper: this.currentVal.lkiH})
			}
            let params = {
				deviceId: this.deviceId,
				cmdType: this.cmdType,
				cmdData: this.data
            };
            Global.publicAxiosRequest(params, mtCmd, (data, msg) => {
                Global.axiosMessage('success', '阈值设置成功');
                window.history.go(-1);
            });
        }
    }
}
</script>