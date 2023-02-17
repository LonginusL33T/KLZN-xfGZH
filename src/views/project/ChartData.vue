<template>
    <div class="container">
        <top-head title="图表数据"></top-head>
        <div class="search_wrapper">
            <div class="search_wrapper">
                <van-search v-model="searchValue" left-icon="clock-o" readonly @click="showPicker = true" />
            </div>
        </div>
        <div class="main search_main overflow_auto">
            <template v-if="lineId.deviceType == 271859088232517">
                <!-- 漏电流 -->
                <div class="data_wrapper">
                    <ve-line height="240px" :title="title1" :extend="extendTempLD" :data="chartData1">
                        <div class="no_data" v-if="this.chartData1.rows && !this.chartData1.rows.length">暂无数据</div>
                    </ve-line>
                </div>
                <!-- 温度 -->
                <div class="data_wrapper">
                    <ve-line height="240px" :title="title2" :extend="baseOption" :data="chartData2">
                        <div class="no_data" v-if="this.chartData2.rows && !this.chartData2.rows.length">暂无数据</div>
                    </ve-line>
                </div>
                <!-- 电流 -->
                <div class="data_wrapper">
                    <ve-line height="240px" :title="title4" :extend="baseOption" :data="chartData4">
                        <div class="no_data" v-if="this.chartData4.rows && !this.chartData4.rows.length">暂无数据</div>
                    </ve-line>
                </div>
                <!-- 电压 -->
                <div class="data_wrapper">
                    <ve-line height="240px" :title="title3" :extend="baseOption" :data="chartData3">
                        <div class="no_data" v-if="this.chartData3.rows && !this.chartData3.rows.length">暂无数据</div>
                    </ve-line>
                </div>
                <!-- 功率 -->
                <div class="data_wrapper">
                    <ve-line height="240px" :title="title5" :extend="extendTempPower" :data="chartData5">
                        <div class="no_data" v-if="this.chartData5.rows && !this.chartData5.rows.length">暂无数据</div>
                    </ve-line>
                </div>
            </template>
            <template v-if="lineId.deviceType == 271858556186693 || lineId.deviceType == 271858390593605">
                <!-- 电池电量 -->
                <div class="data_wrapper">
                    <ve-line height="240px" :title="title6" :extend="extendTempLD" :data="chartData6">
                        <div class="no_data" v-if="this.chartData6.rows && !this.chartData6.rows.length">暂无数据</div>
                    </ve-line>
                </div>
                <!-- 信号强度 -->
                <div class="data_wrapper">
                    <ve-line height="240px" :title="title7" :extend="extendTempLD" :data="chartData7">
                        <div class="no_data" v-if="this.chartData7.rows && !this.chartData7.rows.length">暂无数据</div>
                    </ve-line>
                </div>
                <!-- 气体浓度 -->
                <div class="data_wrapper">
                    <ve-line height="240px" :title="title8" :extend="extendTempLD" :data="chartData8">
                        <div class="no_data" v-if="this.chartData8.rows && !this.chartData8.rows.length">暂无数据</div>
                    </ve-line>
                </div>
            </template>
        </div>
        <!-- 查询日期 -->
        <van-popup v-model="showPicker" round position="bottom">
            <van-datetime-picker v-model="currentDate" title="请选择日期" type="date" @confirm="searchDateConfirm" @cancel="showPicker = false" />
        </van-popup>
    </div>
</template>
<script>
import Global from '@/assets/js/global'
import { deviceDataInfo } from '@/axios/request'
import TopHead from '@/components/TopHead.vue'
export default {
    components: {
        TopHead
    },
    data() {
        // 标题
        const getTitle = (str, top) => {
            return {
                text: str,
                top: top,
                textStyle: {
                    color: '#1b1b1b',
                    fontSize: 13
                }
            };
        };
        this.title1 = getTitle('漏电流(mA)', 0);
        this.title2 = getTitle('温度(℃)', 0);
        this.title3 = getTitle('电压(V)', 0);
        this.title4 = getTitle('电流(A)', 0);
        this.title5 = getTitle('功率(kW/h)', 0);
        this.title6 = getTitle('电池电量', 0);
        this.title7 = getTitle('信号强度', 0);
        this.title8 = getTitle('气体浓度', 0);
        // 配置项
        this.baseOption = {
            color: ['#f8f400', '#009f3c', '#df0024', '#00a8ec'],
            xAxis: {
                axisLabel: {
                    color: '#999',
                    rotate: 45
                },
                axisTick: {
                    show: false
                }
            },
            yAxis: {
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: '#999'
                },
                splitLine: {
                    lineStyle: {
                        color: '#e6e6e6'
                    }
                }
            },
            grid: {
                bottom: 0
            }
        };
        this.extendTempLD = {
            color: ['#e3007b'],
            legend: {
                show: false
            },
            series: {
                type: 'line',
                markPoint: {
                    data: [
                        { type: 'max', name: '最大值' },
                        { type: 'min', name: '最小值' }
                    ]
                }
            }
        };
        this.extendTempLD = { ...this.baseOption, ...this.extendTempLD };
        this.extendTempPower = {
            color: ['#4664be']
        };
        this.extendTempPower = { ...this.baseOption, ...this.extendTempLD, ...this.extendTempPower };
        return {
            lineId: {},
            searchValue: '',
            showPicker: false,
            currentDate: new Date(),
            chartData1: {
                rows: null
            },
            chartData2: {
                rows: null
            },
            chartData3: {
                rows: null
            },
            chartData4: {
                rows: null
            },
            chartData5: {
                rows: null
            },
            chartData6: {
                rows: null
            },
            chartData7: {
                rows: null
            },
            chartData8: {
                rows: null
            }
        }
    },
    mounted() {
        this.lineId = JSON.parse(this.$route.query.params);
        this.searchValue = Global.getDate(this.currentDate);
        this.$nextTick(() => {
            this.getData();
        });
    },
    methods: {
        // 单相数据处理
        aloneData(data, chartObj, name) {
            if (name == '零线温度' || name == '外壳温度') {
                chartObj.columns.push(name)
            } else {
                chartObj.columns = ['时间', name];
            }
            if (data && data.length) {
                data.forEach((item, index) => {
                    if (name == '零线温度' || name == '外壳温度') {
                        chartObj.rows[index][name] = item.value
                    } else {
                        let obj = {};
                        obj['时间'] = item.houre > 9 ? item.houre + ':00' : '0' + item.houre + ':00';
                        obj[name] = item.value;
                        chartObj.rows.push(obj);
                    }
                });
            }
        },
        // 三相数据处理
        multipleData(data, chartObj, number) {
            if (data && data.length) {
                let object;
                chartObj.columns = number > 3 ? ['时间', 'A相', 'B相', 'C相', '零线'] : ['时间', 'A相', 'B相', 'C相'];
                data.forEach((item, index) => {
                    // A相
                    if (index % number == 0) {
                        object = {};
                        object['时间'] = item.houre > 9 ? item.houre + ':00' : '0' + item.houre + ':00';
                        object['A相'] = item.value;
                        chartObj.rows.push(object);
                    }
                    // B相
                    if ((index - 1) % number == 0) {
                        object['B相'] = item.value;
                    }
                    // C相
                    if ((index - 2) % number == 0) {
                        object['C相'] = item.value;
                    }
                    // N相
                    if ((index - 3) % number == 0) {
                        object['零线'] = item.value;
                    }
                });
            }
        },
        // 获取历史数据
        getHistoryData() {
            let params = {
                deviceTypeId: this.lineId.deviceType,
                deviceId: this.lineId.id,
                dateTime: this.searchValue
            };
            Global.publicAxiosRequest(params, deviceDataInfo, (data, msg) => {
                this.chartData1.rows = [];
                this.chartData2.rows = [];
                this.chartData3.rows = [];
                this.chartData4.rows = [];
                this.chartData5.rows = [];
                // 漏电流
                this.aloneData(data.deviceDataList.gLdlist, this.chartData1, '漏电流');
                // 电能
                this.aloneData(data.deviceDataList.aWlist, this.chartData5, '电能');
                // 判断是单相还是三相
                if (data.lineType == '三相') {
                    // 温度
                    this.multipleData(data.deviceDataList.aTlist, this.chartData2, 4);
                    // 电压
                    this.multipleData(data.deviceDataList.aVlist, this.chartData3, 3);
                    // 电流
                    this.multipleData(data.deviceDataList.aAlist, this.chartData4, 3);
                } else {
                    // 单相统一温度、电压、电流颜色
                    this.baseOption.color = ['#4664be'];
                    // 单相隐藏legend
                    this.baseOption.legend = {
                        show: false
                    };
                    let tempH = [{houre: '0', value: '0'}, {houre: '1', value: '0'}, {houre: '2', value: '0'}, {houre: '3', value: '0'}, {houre: '4', value: '0'}, {houre: '5', value: '0'}, {houre: '6', value: '0'}, {houre: '7', value: '0'}, {houre: '8', value: '0'}, {houre: '9', value: '0'}, {houre: '10', value: '0'}, {houre: '11', value: '0'}, {houre: '12', value: '0'}, {houre: '13', value: '0'}, {houre: '14', value: '0'}, {houre: '15', value: '0'}, {houre: '16', value: '0'}, {houre: '17', value: '0'}, {houre: '18', value: '0'}, {houre: '19', value: '0'}, {houre: '20', value: '0'}, {houre: '21', value: '0'}, {houre: '22', value: '0'}, {houre: '23', value: '0'}]
                    let tempZero = tempH
                    let tempShell = tempH
                    // 温度
                    this.aloneData(tempH, this.chartData2, '线路温度');
                    this.aloneData(tempZero, this.chartData2, '零线温度');
                    this.aloneData(tempShell, this.chartData2, '外壳温度');
                    // 电压
                    this.aloneData(data.deviceDataList.aVlist, this.chartData3, '电压');
                    // 电流
                    this.aloneData(data.deviceDataList.aAlist, this.chartData4, '电流');
                }
            });
        },
        // 查询烟感燃气历史数据
        smokeGasHistoryData() {
            let params = {
                deviceTypeId: this.lineId.deviceType,
                deviceId: this.lineId.id,
                dateTime: this.searchValue
            }
            Global.publicAxiosRequest(params, deviceDataInfo, (data, msg) => {
                this.chartData6.rows = [];
                this.chartData7.rows = [];
                this.chartData8.rows = [];
                // 电池电量
                this.aloneData(data.deviceDataList.batteryList, this.chartData6, '电池电量');
                // 信号强度
                this.aloneData(data.deviceDataList.signalList, this.chartData7, '信号强度');
                // 信号强度
                this.aloneData(data.deviceDataList.valueList, this.chartData8, '信号强度');
            })
        },
        searchDateConfirm(date) {
            this.searchValue = Global.getDate(date);
            this.showPicker = false;
            // 重新加载数据
            this.getData();
        },
        getData() {
            if (this.lineId.deviceType == 271859088232517) {
                this.getHistoryData();
            }
            if (this.lineId.deviceType == 271858556186693 || this.lineId.deviceType == 271858390593605) {
                this.smokeGasHistoryData();
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.data_wrapper {
    position: relative;
    padding: 10px;
    &:last-child {
        border-bottom: none;
    }
    .no_data {
        position: absolute;
        top: 50%;
        left: 50%;
        color: #999;
        font-size: 12px;
        transform: translate(-50%, -50%);
    }
}
</style>