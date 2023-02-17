<template>
    <div class="container">
        <top-head title="历史数据"></top-head>
        <div class="search_wrapper" v-if="deviceInfo.deviceType == 271859088232517 || deviceInfo.deviceType == 271865456455749">
            <div class="device_type" @click="lineArrShow = true" v-if="lineArr.length">
                <van-icon name="add" />线路({{ currentLine.addr }})
            </div>
            <div class="device_type" v-else>暂无线路</div>
        </div>
        <div class="main search_main overflow_auto">
            <div class="data_wrapper">
                <div class="item_wrapper">
                    <van-row>
                        <van-col span="6">设备名称</van-col>
                        <van-col span="18">{{ deviceInfo.name || '--' }}</van-col>
                    </van-row>
                    <van-row>
                        <van-col span="6">设备地址</van-col>
                        <van-col span="18">{{ deviceInfo.address || '--' }}</van-col>
                    </van-row>
                    <template v-if="deviceInfo.deviceJson">
                        <van-row v-for="(item, index) in JSON.parse(deviceInfo.deviceJson).lxr" :key="index">
                            <van-col span="6"><span v-if="!index">联系人</span></van-col>
                            <van-col span="18">{{ item.userName }} - {{ item.phone }}</van-col>
                        </van-row>
                    </template>
                    <template v-else>
                        <van-row>
                            <van-col span="6">联系人</van-col>
                            <van-col span="18">--</van-col>
                        </van-row>
                    </template>
                    <van-row>
                        <van-col span="6">更新时间</van-col>
                        <van-col span="18">{{ deviceInfo.updatedTime || '--' }}</van-col>
                    </van-row>
                </div>
            </div>
            <div class="data_wrapper bottom_none">
                <div class="title">最新上报数据</div>
                <div class="item_wrapper">
                    <template v-if="deviceInfo.platform == 271874081681477 && (deviceInfo.deviceType == 271859088232517 || deviceInfo.deviceType == 271865456455749) && newUploadData1.lineType == '单相'">
                        <van-row>
                            <van-col span="12">用电量(kW/h)</van-col>
                            <van-col span="12">功率(W)</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ newUploadData1.data1 }}</van-col>
                            <van-col span="12">{{ newUploadData1.data2 }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">电流(A)</van-col>
                            <van-col span="12">温度(℃)</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ newUploadData1.data3 }}</van-col>
                            <van-col span="12">{{ newUploadData1.data4 }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">电压(V)</van-col>
                            <van-col span="12">信号强度</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ newUploadData1.data5 }}</van-col>
                            <van-col span="12">{{ newUploadData1.data6 || '--' }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">信噪比</van-col>
                            <van-col span="12">无线信号等级</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ newUploadData1.data7 || '--' }}</van-col>
                            <van-col span="12">{{ newUploadData1.data8 || '--' }}</van-col>
                        </van-row>
                    </template>
                    <template v-if="deviceInfo.platform == 271874536079429 && (deviceInfo.deviceType == 271859088232517 || deviceInfo.deviceType == 271865456455749) && newUploadData2.lineType == '单相'">
                        <van-row>
                            <van-col span="12">电压(V)</van-col>
                            <van-col span="12">电流(A)</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ newUploadData2.data1 }}</van-col>
                            <van-col span="12">{{ newUploadData2.data2 }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">温度(℃)</van-col>
                            <van-col span="12">功率(W)</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ newUploadData2.data3 }}</van-col>
                            <van-col span="12">{{ newUploadData2.data4 }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">功率因数</van-col>
                            <van-col span="12">漏电流(mA)</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ newUploadData2.data5 }}</van-col>
                            <van-col span="12">{{ newUploadData2.data6 }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">信号强度</van-col>
                            <van-col span="12">信噪比</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ newUploadData2.data7 || '--' }}</van-col>
                            <van-col span="12">{{ newUploadData2.data8 || '--' }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">无线信号等级</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ newUploadData2.data9 || '--' }}</van-col>
                        </van-row>
                    </template>
                    <template v-if="(deviceInfo.deviceType == 271859088232517 || deviceInfo.deviceType == 271865456455749) && newUploadData4.lineType == '三相'">
                        <van-row>
                            <van-col span="6">类型</van-col>
                            <van-col span="6">电压(V)</van-col>
                            <van-col span="6">电流(A)</van-col>
                            <van-col span="6">温度(℃)</van-col>
                        </van-row>
                        <van-row v-for="(item, index) in newUploadData3" :key="'top' + index">
                            <van-col span="6">{{ item.type }}</van-col>
                            <van-col span="6">{{ item.voltage }}</van-col>
                            <van-col span="6">{{ item.current }}</van-col>
                            <van-col span="6">{{ item.tem }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="6">功率(W)</van-col>
                            <van-col span="6">功率因数</van-col>
                        </van-row>
                        <van-row v-for="(item, index) in newUploadData3" :key="'bottom' + index">
                            <van-col span="6">{{ item.power }}</van-col>
                            <van-col span="6">{{ item.powerFactor }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">平均电压(V)</van-col>
                            <van-col span="12">平均电流(A)</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ newUploadData4.data1 }}</van-col>
                            <van-col span="12">{{ newUploadData4.data2 }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">壳温度(℃)</van-col>
                            <van-col span="12">功率和值(W)</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ newUploadData4.data3 }}</van-col>
                            <van-col span="12">{{ newUploadData4.data4 }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">合相功率因数</van-col>
                            <van-col span="12">漏电流(mA)</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ newUploadData4.data5 }}</van-col>
                            <van-col span="12">{{ newUploadData4.data6 }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">零线电流(A)</van-col>
                            <van-col span="12">零线温度(V)</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ newUploadData4.data7 }}</van-col>
                            <van-col span="12">{{ newUploadData4.data8 }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">信号强度</van-col>
                            <van-col span="12">信噪比</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ newUploadData4.data9 || '--' }}</van-col>
                            <van-col span="12">{{ newUploadData4.data10 || '--' }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">无线信号等级</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ newUploadData4.data11 || '--' }}</van-col>
                        </van-row>
                    </template>
                    <template v-if="deviceInfo.deviceType == 271858556186693">
                        <van-row>
                            <van-col span="12">信噪比</van-col>
                            <van-col span="12">信号强度</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ smokeTable_B.data1 || '--' }}</van-col>
                            <van-col span="12">{{ smokeTable_B.data2 || '--' }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">烟雾监测状态</van-col>
                            <van-col span="12">信号强度</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ smokeTable_B.data3 || '--' }}</van-col>
                            <van-col span="12">{{ smokeTable_B.data4 || '--' }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">电池电量</van-col>
                            <van-col span="12">心跳时间</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ smokeTable_B.data5 || '--' }}</van-col>
                            <van-col span="12">{{ smokeTable_B.data6 || '--' }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">电池电压</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ smokeTable_B.data7 || '--' }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">烟雾浓度</van-col>
                            <van-col span="12">温度值</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ smokeTable_C.data1 || '--' }}</van-col>
                            <van-col span="12">{{ smokeTable_C.data2 || '--' }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">烟雾板电量</van-col>
                            <van-col span="12">NB板电量</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ smokeTable_C.data3 || '--' }}</van-col>
                            <van-col span="12">{{ smokeTable_C.data4 || '--' }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">信号强度</van-col>
                            <van-col span="12">报警状态</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ smokeTable_C.data5 || '--' }}</van-col>
                            <van-col span="12">{{ smokeTable_C.data6 || '--' }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">迷宫污染度</van-col>
                            <van-col span="12">参考信号功率</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ smokeTable_C.data7 || '--' }}</van-col>
                            <van-col span="12">{{ smokeTable_C.data8 || '--' }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">接收信号质量</van-col>
                            <van-col span="12">信号信噪比</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ smokeTable_C.data9 || '--' }}</van-col>
                            <van-col span="12">{{ smokeTable_C.data10 || '--' }}</van-col>
                        </van-row>
                    </template>
                    <template v-if="deviceInfo.deviceType == 271858390593605">
                        <van-row>
                            <van-col span="12">信号强度</van-col>
                            <van-col span="12">信噪比</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ smokeTable_D.data1 || '--' }}</van-col>
                            <van-col span="12">{{ smokeTable_D.data2 || '--' }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">燃气值</van-col>
                            <van-col span="12">电池电量</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ smokeTable_D.data3 || '--' }}</van-col>
                            <van-col span="12">{{ smokeTable_D.data4 || '--' }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">心跳时间</van-col>
                            <van-col span="12">电池电压</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ smokeTable_D.data5 || '--' }}</van-col>
                            <van-col span="12">{{ smokeTable_D.data6 || '--' }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">信号强度</van-col>
                            <van-col span="12">电量</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ smokeTable_E.data1 || '--' }}</van-col>
                            <van-col span="12">{{ smokeTable_E.data2 || '--' }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">状态</van-col>
                            <van-col span="12">气体浓度</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ smokeTable_E.data3 || '--' }}</van-col>
                            <van-col span="12">{{ smokeTable_E.data4 || '--' }}</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">报警类型</van-col>
                            <van-col span="12">气感阀值</van-col>
                        </van-row>
                        <van-row>
                            <van-col span="12">{{ smokeTable_E.data5 || '--' }}</van-col>
                            <van-col span="12">{{ smokeTable_E.data6 || '--' }}</van-col>
                        </van-row>
                        <van-row>
							<van-col span="12" class="danger">机械手状态</van-col>
						</van-row>
						<van-row>
							<van-col span="12" class="danger">{{ !smokeTable_D.valve_state || smokeTable_D.valve_state == 2 || smokeTable_D.valve_state == 3 ? '机械手未连接' : smokeTable_D.valve_state == 0 ? '阀门开启' : '阀门关闭' }}</van-col>
						</van-row>
                    </template>
                </div>
                <div class="item_wrapper">
                    <div class="btn_wrapper">
						<van-button type="info" size="mini" round @click="routeJump('/setValue', JSON.stringify(currentLine))" v-if="deviceInfo.platform == 271874536079429 && deviceInfo.deviceType == 271859088232517 && lineArr.length">阈值设置</van-button>
                        <van-button type="info" size="mini" round @click="routeJump('/chartData', JSON.stringify(deviceInfo))">图表数据</van-button>
                        <van-button type="info" size="mini" round @click="delVoice" :disabled="(deviceInfo.deviceType == 271859088232517 || deviceInfo.deviceType == 271865456455749) && !lineArr.length">消音</van-button>
						<van-button type="info" size="mini" round @click="delVoice1" v-if="(deviceInfo.deviceType == 271859088232517 || deviceInfo.deviceType == 271865456455749) && lineArr.length">复位</van-button>
                        <van-button type="info" size="mini" round @click="delVoice2(delVoice2Value)" v-if="deviceInfo.deviceType == 271858390593605" :disabled="!smokeTable_D.valve_state || smokeTable_D.valve_state == 2 || smokeTable_D.valve_state == 3">机械手: {{ delVoice2Value == 0 ? '关' : '开' }}</van-button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 线路 -->
        <van-popup v-model="lineArrShow" round position="bottom">
            <van-picker show-toolbar title="选择线路" :columns="lineArr" value-key="addrTitle" @cancel="lineArrShow = false" @confirm="lineConfirm" />
        </van-popup>
    </div>
</template>
<script>
import Global from '@/assets/js/global'
import { deviceDataInfo, mtAddr, hmCmd, mtCmd } from '@/axios/request'
import TopHead from '@/components/TopHead.vue'
import NoData from '@/components/NoData.vue'
export default {
    components: {
        TopHead,
        NoData
    },
    data() {
        return {
            deviceInfo: {},
            lineArrShow: false,
            currentLine: {},
            lineArr: [],

            newUploadData1: {},
            newUploadData2: {},
            newUploadData3: [],
            newUploadData4: {},
            
            smokeTable_B: {},
            smokeTable_C: {},
            smokeTable_D: {},
            smokeTable_E: {},
            delVoice2Value: 1
        }
    },
    mounted() {
        this.deviceInfo = JSON.parse(this.$route.query.params);
        this.$nextTick(() => {
            this.getData();
        });
    },
    methods: {
        getData() {
            let params = {
                deviceTypeId: this.deviceInfo.deviceType,
                deviceId: this.deviceInfo.id,
                dateTime: Global.getDate(new Date())
            }
            Global.publicAxiosRequest(params, deviceDataInfo, (data, msg) => {
                // 电气火灾或智慧空开
                if (this.deviceInfo.deviceType == 271859088232517 || this.deviceInfo.deviceType == 271865456455749) {
                    if (data.lineType == '单相' && data.deviceInfo) {
                        // 中国电信
                        if (this.deviceInfo.platform == 271874081681477) {
                            this.newUploadData1 = {data1: data.deviceInfo.Energy, data2: data.deviceInfo.active_power_a, data3: data.deviceInfo.current_a, data4: data.deviceInfo.temperature_1, data5: data.deviceInfo.voltage_a, data6: '', data7: '', data8: '', lineType: data.lineType}
                        }

                        // 曼顿平台
                        if (this.deviceInfo.platform == 271874536079429) {
                            this.newUploadData2 = {data1: data.deviceInfo.aV, data2: data.deviceInfo.aA, data3: data.deviceInfo.aT, data4: data.deviceInfo.aW, data5: data.deviceInfo.aPF, data6: data.deviceInfo.aLd, data7: '', data8: '', data9: '', lineType: data.lineType}
                        }
                    }

                    if (data.lineType == '三相' && data.deviceInfo) {
                        this.newUploadData3 = [
                            {type: 'A相', voltage: data.deviceInfo.aV, current: data.deviceInfo.aA, tem: data.deviceInfo.aT, power: data.deviceInfo.aW, powerFactor: data.deviceInfo.aPF},
                            {type: 'B相', voltage: data.deviceInfo.bV, current: data.deviceInfo.bA, tem: data.deviceInfo.bT, power: data.deviceInfo.bW, powerFactor: data.deviceInfo.bPF},
                            {type: 'C相', voltage: data.deviceInfo.cV, current: data.deviceInfo.cA, tem: data.deviceInfo.cT, power: data.deviceInfo.cW, powerFactor: data.deviceInfo.cPF}
                        ]
                        this.newUploadData4 = {data1: data.deviceInfo.gV, data2: data.deviceInfo.gA, data3: data.deviceInfo.gT, data4: data.deviceInfo.gW, data5: data.deviceInfo.gPF, data6: data.deviceInfo.gLd, data7: data.deviceInfo.nA, data8: data.deviceInfo.nT, data9: '', data10: '', data11: '', lineType: data.lineType}
                    }

                    let params1 = {
                        mac: this.deviceInfo.number
                    }
                    Global.publicAxiosRequest(params1, mtAddr, (data, msg) => {
                        if (data.indexOf('没有找到匹配的电箱') == -1) {
                            let arr = JSON.parse(data).data
                            this.currentLine = arr[0]
                            this.currentLine.deviceId = this.deviceInfo.id
                            this.lineArr = arr
                        }
                    });
                }

                // 烟感
                if (this.deviceInfo.deviceType == 271858556186693) {
                    this.smokeTable_B = {data1: '', data2: '', data3: '', data4: '', data5: '', data6: '', data7: ''}
                    this.smokeTable_C = {data1: '', data2: '', data3: '', data4: '', data5: '', data6: '', data7: '', data8: '', data9: '', data10: ''}
                }

                // 燃气
                if (this.deviceInfo.deviceType == 271858390593605) {
                    this.smokeTable_D = {data1: '', data2: '', data3: '', data4: '', data5: '', data6: '', valve_state: data.valve_state}
                    this.smokeTable_E = {data1: '', data2: '', data3: '', data4: '', data5: '', data6: ''}
                }
            });
        },
        // 选择线路
        lineConfirm(value) {
            this.currentLine = value;
            this.currentLine.deviceId = this.deviceInfo.id
            this.lineArrShow = false;
        },
        // 消音
        delVoice() {
            this.$dialog.confirm({
                message: '确认消音吗？<br/><span style="color: #999; font-size: 12px;">(设备名称：' + this.deviceInfo.name + ')</span>'
            }).then(() => {
                let params = {
                    deviceId: this.deviceInfo.id,
                    cmdType: '8007',
                    cmdData: JSON.stringify({ muffling: 1 })
                };
                let apiParams;
				if (this.deviceInfo.platform == 271874536079429 && (this.deviceInfo.deviceType == 271859088232517 || this.deviceInfo.deviceType == 271865456455749)) {
					apiParams = mtCmd
                    params.cmdType = '3006'
                    params.cmdData = JSON.stringify({addr: this.currentLine.addr})
				} else {
					apiParams = hmCmd
				}
                Global.publicAxiosRequest(params, apiParams, (data, msg) => {
                    Global.axiosMessage('success', '操作成功');
                });
            }).catch(() => {});
        },
		// 复位
		delVoice1() {
		    this.$dialog.confirm({
		        message: '确认复位吗？<br/><span style="color: #999; font-size: 12px;">(设备名称：' + this.deviceInfo.name + ')</span>'
		    }).then(() => {
		        let params = {
		            deviceId: this.deviceInfo.id,
		            cmdType: '8017',
		            cmdData: JSON.stringify({ Reset: 1 })
		        };
		        let apiParams;
				if (this.deviceInfo.platform == 271874536079429) {
					apiParams = mtCmd
		            params.cmdType = '3008'
		            params.cmdData = JSON.stringify({addr: this.currentLine.addr})
				} else {
					apiParams = hmCmd
				}
		        Global.publicAxiosRequest(params, apiParams, (data, msg) => {
		            Global.axiosMessage('success', '操作成功');
		        });
		    }).catch(() => {});
		},
        // 机械手
		delVoice2(val) {
            let text = '';
            if (val == 0) {
                text = '关闭'
            } else {
                text = '开启'
            }
		    this.$dialog.confirm({
		        message: '确认' + text + '阀门吗？<br/><span style="color: #999; font-size: 12px;">(设备名称：' + this.deviceInfo.name + ')</span>'
		    }).then(() => {
		        let params = {
                    deviceId: this.deviceInfo.id,
                    cmdType: '8031',
                    cmdData: val == 0 ? JSON.stringify({ handonoff: 1 }) : JSON.stringify({ handonoff: 0 })
		        };
		        Global.publicAxiosRequest(params, hmCmd, (data, msg) => {
		            Global.axiosMessage('success', '操作成功');
					if (val == 0) {
						this.delVoice2Value = 1
                        this.smokeTable_D.valve_state = 1
					} else {
						this.delVoice2Value = 0
                        this.smokeTable_D.valve_state = 0
					}
		        });
		    }).catch(() => {});
		},
        routeJump(path, params) {
            Global.routeJump(this.$router, path, params)
        }
    }
}
</script>