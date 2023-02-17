<template>
    <div class="map_container">
        <div id="mapApp" class="map_wrapper"></div>
        <div class="position_wrapper">
            <input class="vertical_middle" v-model="keyWords" placeholder="请输入要搜索的地址" />
            <van-button native-type="button" class="sure_btn vertical_middle" icon="search" @click="searchPlace">搜索</van-button>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        showMap: {
            type: Boolean,
            default: false
        },
        currentLon: {
            // type: String,
            default: ''
        },
        currentLat: {
            // type: String,
            default: ''
        }
    },
    data() {
        return {
            // 地图对象
            map: null,
            // 经度
            longitude: '',
            // 纬度
            latitude: '',
            // 当前标记点
            currentMarker: null,
            // 搜索关键字
            keyWords: ''
        }
    },
    watch: {
        showMap(val) {
            if (!val) {
                // 触发父组件方法
                this.$emit('getPosition', this.longitude + '', this.latitude + '');
            } else {
                this.initMap();
            }
        }
    },
    methods: {
        // 初始化地图
        initMap() {
            this.map = null;
            this.longitude = '';
            this.latitude = '';
            this.currentMarker = null;
            this.keyWords = '';
            let point;
            if (this.currentLon && this.currentLat) {
                this.longitude = this.currentLon;
                this.latitude = this.currentLat;
            } else {
                // 默认定位松山湖光大We谷C区
                this.longitude = '113.895484';
                this.latitude = '22.955396';
            }
            point = [this.longitude, this.latitude];
            // 获取地图对象
            this.map = new AMap.Map('mapApp', {
                resizeEnable: true, // 自适应大小
                center: point, // 中心点
                zoom: 18 // 地图缩放级别
            });
            // 设置当前标记点
            this.currentMarker = new AMap.Marker({
                map: this.map,
                position: point
            });
        },
        // 搜索地址
        searchPlace() {
            if (this.keyWords) {
                // 初始化搜索对象
                let placeSearch = new AMap.PlaceSearch({
                    map: this.map,
                    autoFitView: true // 搜索完成后自动调整地图视野
                });
                placeSearch.search(this.keyWords, (status, result) => {
                    // 判断是否查询到搜索地址
                    if (status != 'no_data' && result.poiList.pois.length) {
                        // 清除当前标记点
                        this.map.remove(this.currentMarker);
                        this.currentMarker = null;
                        // 清除所有搜索结果的标记点(存在延迟，markerList可能不存在)
                        setTimeout(() => {
                            placeSearch.render.markerList.clear();
                        }, 1000);
                        // 默认标记第一个搜索结果
                        let pois = result.poiList.pois[0];
                        this.currentMarker = new AMap.Marker({
                            position: pois.location
                        });
                        this.map.add(this.currentMarker);
                        this.map.setFitView();
                        // 更新经纬度
                        this.longitude = pois.location.lng;
                        this.latitude = pois.location.lat;
                    } else {
                        this.$toast('未匹配到地点');
                    }
                });
            } else {
                this.$toast('请输入搜索内容');
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initMap();
        });
    }
}
</script>
<style lang="scss" scoped>
.map_container {
    position: relative;
    height: 100%;
    .map_wrapper {
        height: 100%;
        z-index: 99;
    }
    .position_wrapper {
        position: fixed;
        top: 0;
        padding: 6px 10px;
        z-index: 100;
        border-top: 1px solid #e6e6e6;
        background-color: #eee;
        input {
            width: 285px;
            height: 32px;
            font-size: 13px;
            line-height: 32px;
        }
        button {
            display: inline-block;
            width: 60px;
            height: 32px;
            padding: 0;
            margin-left: 10px;
            font-size: 12px;
            line-height: 32px;
        }
    }
}
</style>