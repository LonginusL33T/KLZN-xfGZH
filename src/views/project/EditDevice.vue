<template>
    <div class="container mapDialog">
        <top-head title="添加设备"></top-head>
        <div class="main overflow_auto">
            <van-form @submit="addDevice">
                <ul class="ul_form">
					<li>
					    <div class="left">供应商</div>
					    <div class="right" @click="supplierTypeArrShow = true">
					        <span class="vertical_middle">{{ supplierTypeName }}</span><img class="vertical_middle" src="@/assets/images/choose.png">
					    </div>
					</li>
                    <li>
                        <div class="left">平台</div>
                        <div class="right" @click="platformTypeArrShow = true">
                            <span class="vertical_middle">{{ platformTypeName }}</span><img class="vertical_middle" src="@/assets/images/choose.png">
                        </div>
                    </li>
                    <li>
                        <div class="left">设备类型</div>
                        <div class="right" @click="deviceTypeArrShow = true">
                            <span class="vertical_middle">{{ deviceTypeName }}</span><img class="vertical_middle" src="@/assets/images/choose.png">
                        </div>
                    </li>
                    <li>
                        <div class="left">区域</div>
                        <div class="right" @click="areaArrShow = true">
                            <span class="vertical_middle">{{ areaName }}</span><img class="vertical_middle" src="@/assets/images/choose.png">
                        </div>
                    </li>
                    <li>
                        <div class="left">设备到期时间</div>
                        <div class="right" @click="deviceExpirationTimeShow = true">
                            <span class="vertical_middle">{{ deviceExpirationTimeName }}</span><img class="vertical_middle" src="@/assets/images/choose.png">
                        </div>
                    </li>
                    <li>
                        <div class="left">名称</div>
                        <div class="right">
                            <van-field type="text" placeholder="请输入设备名称" v-model="currentDevice.name" :rules="[{ required: true }]" />
                        </div>
                    </li>
                    <li>
                        <div class="left">IMEI</div>
                        <div class="right scan_wrapper">
                            <van-field type="text" placeholder="请输入设备IMEI" v-model="imei" :rules="[{ required: true }]" />
                            <van-icon name="scan" size="16" @click="scanIMEI(1)" />
                        </div>
                    </li>
                    <li>
                        <div class="left">IMSI</div>
                        <div class="right scan_wrapper">
                            <van-field type="text" placeholder="请输入设备IMSI" v-model="imsi" :rules="[{ required: true }]" />
                            <van-icon name="scan" size="16" @click="scanIMEI(1)" />
                        </div>
                    </li>
                    <li class="bottom-none">
                        <div class="left">SIM</div>
                        <div class="right scan_wrapper">
                            <van-field type="text" placeholder="请输入设备SIM" v-model="sim" :rules="[{ required: true }]" />
                            <van-icon name="scan" size="16" @click="scanIMEI(2)" />
                        </div>
                    </li>
                    <li class="bottom-none caption">地理定位</li>
                    <li class="bottom-none map_wrapper">
                        <div class="left">经度</div>
                        <div class="right">
                            <van-field type="number" placeholder="经度" v-model="currentDevice.lon" :rules="[{ required: true }]" />
                        </div>
                    </li>
                    <li class="bottom-none map_wrapper">
                        <div class="left">纬度</div>
                        <div class="right">
                            <van-field type="number" placeholder="纬度" v-model="currentDevice.lat" :rules="[{ required: true }]" />
                        </div>
                    </li>
                    <li class="bottom-none map_wrapper map_btn">
                        <a @click="openMap">地图</a>
                    </li>
                    <li class="bottom-none caption">详细地址</li>
                    <li>
                        <div class="left">地址</div>
                        <div class="right">
                            <van-field type="text" placeholder="请输入设备所在地址" v-model="currentDevice.address" :rules="[{ required: true }]" />
                        </div>
                    </li>
					<li class="bottom-none caption">设备联系人
					    <van-icon class="deviceBtn add" name="add" color="#4664be" size="0.5rem" @click="addPerson" />
					</li>
					<template v-for="(man, index) in lxr">
					    <li :key="index" :class="lxr.length ==  index + 1 ? 'bottom-none' : ''">
					        <div class="person_item">
					            <van-field type="text" left-icon="user-o" placeholder="请输入联系人姓名" v-model="man.userName" :rules="[{ required: true }]" />
					        </div>
					        <div class="person_item">
					            <van-field type="number" left-icon="phone-o" placeholder="请输入联系人电话" v-model="man.phone" :rules="phoneRules" />
					        </div>
					        <van-icon class="deviceBtn del" name="clear" color="#ee0a24" size="0.5rem" v-if="index != 0" @click="delPerson(index)" />
					    </li>
					</template>
					<li class="bottom-none caption">设备图片</li>
					<li class="bottom-none upload_wrapper">
					    <van-uploader v-model="fileList" :before-read="beforeRead" :after-read="uploadImage" :max-size="10 * 1024 * 1024" @oversize="onOversize" :max-count="2" multiple @delete="delImage">
					        <van-button icon="plus" type="primary" size="mini">上传图片</van-button>
					    </van-uploader>
					</li>
                    <li class="bottom-none caption">备注</li>
                    <li class="remarks">
                        <van-field type="textarea" rows="2" autosize show-word-limit maxlength="100" placeholder="请输入备注" v-model="currentDevice.remark" />
                    </li>
                    <li class="bottom-none keep_btn">
                        <van-button native-type="submit" class="sure_btn">保存</van-button>
                    </li>
                </ul>
            </van-form>
        </div>
		<!-- 供应商 -->
		<van-popup v-model="supplierTypeArrShow" round position="bottom">
		    <van-picker value-key="value" show-toolbar title="供应商" :columns="supplierTypeArr" @cancel="supplierTypeArrShow = false" @confirm="supplierTypeConfirm" />
		</van-popup>
        <!-- 平台 -->
        <van-popup v-model="platformTypeArrShow" round position="bottom">
            <van-picker value-key="value" show-toolbar title="平台类型" :columns="platformTypeArr" @cancel="platformTypeArrShow = false" @confirm="platformTypeConfirm" />
        </van-popup>
        <!-- 设备 -->
        <van-popup v-model="deviceTypeArrShow" round position="bottom">
            <van-picker value-key="value" show-toolbar title="设备类型" :columns="deviceTypeArr" @cancel="deviceTypeArrShow = false" @confirm="deviceTypeConfirm" />
        </van-popup>
        <!-- 区域 -->
        <van-popup v-model="areaArrShow" round position="bottom">
            <van-picker value-key="name" show-toolbar title="设备类型" :columns="areaArr" @cancel="areaArrShow = false" @confirm="areaConfirm" />
        </van-popup>
        <!-- 设备到期时间 -->
        <van-popup v-model="deviceExpirationTimeShow" round position="bottom">
            <van-datetime-picker v-model="expirationTime" title="请选择日期" type="date" @cancel="deviceExpirationTimeShow = false" @confirm="deviceExpirationTimeConfirm" />
        </van-popup>
        <!-- 高德地图 -->
        <van-dialog v-model="showMap" title="高德地图" width="100%" :overlay="false" cancel-button-text="关闭" cancel-button-color="#999" confirm-button-text="确定" show-cancel-button @confirm="mapConfirm" @cancel="mapCancel">
            <gaode-map :show-map="showMap" :current-lon="currentDevice.lon" :current-lat="currentDevice.lat" @getPosition="getPosition"></gaode-map>
        </van-dialog>
    </div>
</template>
<script>
import Global from '@/assets/js/global'
import { dictionaryList, areaList, getSignature, uploadImg, editDevice } from '@/axios/request'
import TopHead from '@/components/TopHead.vue'
import GaodeMap from '@/components/GaodeMap.vue'
export default {
    components: {
        TopHead,
        GaodeMap
    },
    data() {
        return {
            baseURL: Global.baseURL,
            // 供应商
			supplierTypeArrShow: false,
			supplierTypeName: '请选择供应商',
			supplierTypeArr: [],
            // 平台
            platformTypeArrShow: false,
            platformTypeName: '请选择平台',
            platformTypeArr: [],
            // 设备类型
            deviceTypeArrShow: false,
            deviceTypeName: '请选择设备类型',
            deviceTypeArr: [],
            // 区域
            areaArrShow: false,
            areaName: '请选择区域',
            areaArr: [],
            // 设备到期时间
            deviceExpirationTimeShow: false,
            deviceExpirationTimeName: '请选择设备到期时间',
            expirationTime: new Date(),
            // 当前设备
            currentDevice: {
                projectId: '',
                supplierId: '',
                platform: '',
                deviceType: '',
                orgId: '',
                expirationTime: '',
                name: '',
                number: '',
                lon: '',
                lat: '',
                address: '',
                remark: '',
                images: '',
                deviceJson: ''
            },
            lxr: [{
                userName: '',
                phone: ''
            }],
            imei: '',
            imsi: '',
            sim: '',
            images: [],
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
			// 图片预览列表
			fileList: [],
            /** 高德地图 **/
            showMap: false,
            isGetPosition: false
        }
    },
    mounted() {
        let params = JSON.parse(this.$route.query.params)
		this.deviceExpirationTimeName = params.expirationTime
		this.currentDevice = {
			id: params.id,
			projectId: params.projectId,
			supplierId: params.supplierId,
			platform: params.platform,
			deviceType: params.deviceType,
			orgId: params.orgId,
			expirationTime: params.expirationTime,
			name: params.name,
			number: params.number,
			lon: params.lon,
			lat: params.lat,
			address: params.address,
			remark: params.remark,
			images: params.images,
			deviceJson: params.deviceJson
		}
		if (this.currentDevice.deviceJson) {
			let params1 = JSON.parse(this.currentDevice.deviceJson) 
			this.lxr = params1.lxr
			this.imei = params1.imei
			this.imsi = params1.imsi
			this.sim = params1.sim
		}
		if (this.currentDevice.images && JSON.parse(this.currentDevice.images).length) {
			this.images = JSON.parse(this.currentDevice.images)
			this.images.forEach(url => {
				this.fileList.push({
					url: Global.baseURL + url
				});
			});
		}
        this.$nextTick(() => {
            // 注入权限验证配置
            this.wxScan();
            this.getList();
        });
    },
    methods: {
        // 调用微信扫码配置
        wxScan() {
            // 获取微信签名
            let params = {
                url: location.href.split('#')[0]
            }
            Global.publicAxiosRequest(params, getSignature, (data, msg) => {
                wx.config({
                    debug: false,
                    appId: data.appId, // 必填，公众号的唯一标识
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.nonceStr, // 必填，生成签名的随机串
                    signature: data.signature,// 必填，签名
                    jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表
                });
            });
            wx.ready(function(data) {  })
        },
        getList() {
            let params = {
                TypeId: '349287476846661'
            }
            Global.publicAxiosRequest(params, dictionaryList, (data, msg) => {
                this.supplierTypeArr = data
				for (let item of this.supplierTypeArr) {
					if (this.currentDevice.supplierId == item.id) {
						this.supplierTypeName = item.value
					}
				}
            });
            let params1 = {
                TypeId: '271873306419269'
            }
            Global.publicAxiosRequest(params1, dictionaryList, (data, msg) => {
                this.platformTypeArr = data
				for (let item of this.platformTypeArr) {
					if (this.currentDevice.platform == item.id) {
						this.platformTypeName = item.value
					}
				}
            });
            let params2 = {
                TypeId: '271857273098309',
                AppCode: 'xiaofang'
            }
            Global.publicAxiosRequest(params2, dictionaryList, (data, msg) => {
                this.deviceTypeArr = data
				for (let item of this.deviceTypeArr) {
					if (this.currentDevice.deviceType == item.id) {
						this.deviceTypeName = item.value
					}
				}
            });
            let params3 = {
                PageNo: 1,
				PageSize: 100000
            }
            Global.publicAxiosRequest(params3, areaList, (data, msg) => {
                this.areaArr = data.rows
				for (let item of this.areaArr) {
					if (this.currentDevice.orgId == item.id) {
						this.areaName = item.name
					}
				}
            })
        },
		// 获取供应商类型
		supplierTypeConfirm(obj) {
		    this.supplierTypeName = obj.value;
		    this.currentDevice.supplierId = obj.id;
		    this.supplierTypeArrShow = false;
		},
        // 获取平台类型
        platformTypeConfirm(obj) {
            this.platformTypeName = obj.value;
		    this.currentDevice.platform = obj.id;
		    this.platformTypeArrShow = false;
        },
        // 获取设备类型
        deviceTypeConfirm(obj) {
            this.deviceTypeName = obj.value;
		    this.currentDevice.deviceType = obj.id;
		    this.deviceTypeArrShow = false;
        },
        // 获取区域
        areaConfirm(obj) {
            this.areaName = obj.name;
            this.currentDevice.orgId = obj.id;
            this.areaArrShow = false;
        },
        // 获取设备使用时间
        deviceExpirationTimeConfirm(date) {
            this.deviceExpirationTimeName = Global.getDate(date);
            this.currentDevice.expirationTime = Global.getDate(date);
            this.deviceExpirationTimeShow = false;
        },
        // 保存
        addDevice() {
            if (!this.currentDevice.supplierId || !this.currentDevice.platform || !this.currentDevice.deviceType || !this.currentDevice.orgId || !this.currentDevice.expirationTime) {
                this.$notify({ type: 'warning', message: '请选择供应商或平台或设备类型或区域或设备到期时间' })
                return;
            }
            this.currentDevice.images = JSON.stringify(this.images)
            this.currentDevice.number = this.imei
            this.currentDevice.deviceJson = JSON.stringify({
                lxr: this.lxr,
                imei: this.imei,
                imsi: this.imsi,
                sim: this.sim
            })
            Global.publicAxiosRequest(this.currentDevice, editDevice, (data, msg) => {
                Global.axiosMessage('success', '添加设备成功');
                window.history.go(-1);
            });
        },
        // 调用微信扫码
        scanIMEI(type) {
            wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
                scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码（条形码），默认二者都有
                success: res => {
                    let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                    if(result.includes(',')){
                        result = result.split(',')[1]
                    }
                    // IMEI、IMSI
                    if (type === 1) {
                        this.imei = result
                        this.imsi = result
                    }
                    // SIM
                    if (type === 2) {
                        this.sim = result
                    }
                }
            });
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
		    this.images = this.images.filter(url => {
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
		            this.images.push(data);
		        } else {
		            file.status = 'failed';
		            file.message = '上传失败';
		        }
		    });
		},
        /** 高德地图 **/
        // 打开地图
        openMap() {
            this.showMap = true;
        },
        // 确定
        mapConfirm() {
            this.isGetPosition = true;
        },
        // 关闭
        mapCancel() {
            this.isGetPosition = false;
        },
        // 获取经纬度
        getPosition(lon, lat) {
            if (this.isGetPosition) {
                if (lon && lat) {
                    this.currentDevice.lon = lon;
                    this.currentDevice.lat = lat;
                } else {
                    this.$toast('请设置经纬度');
                }
            }
        },
		// 新增联系人
		addPerson() {
		    this.lxr.push({
		        userName: '',
		        phone: ''
		    });
		},
		// 删除联系人
		delPerson(index) {
		    this.lxr.splice(index, 1);
		}
    }
}
</script>
<style lang="scss" scoped>
.ul_form li .person_item {
    width: 50%;
}
.scan_wrapper {
    display: flex;
    align-items: center;
}
.scan_wrapper .van-icon {
    padding-left: 8px;
}
</style>