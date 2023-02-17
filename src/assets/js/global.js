import { Toast, Notify } from 'vant'

/*
 * @baseURL
 * 服务器地址
 */
let baseURL = process.env.VUE_APP_API_URL

/*
 * @isJsonFormat
 * 判断是否是JSON字符串
 */
let isJsonFormat = (str) => {
    try {
        if (typeof JSON.parse(str) == "object") {
            return true;
        }
    } catch (e) {}
    return false;
}

/*
 * @isObjectNull
 * 判断是否空对象
 */
let isObjectNull = (object) => {
    for (var key in object) {
        return false;
    }
    return true;
}

/*
 * @isInArray
 * 判断对象是否存在于数组中
 */
let isInArray = (arr, value, key) => {
    for (var i = 0; i < arr.length; i++) {
        if (value === arr[i][key]) {
            return true;
        }
    }
    return false;
}

/*
 * @localStorage
 * 封装localStorage常用方法的对象
 * set: 设置localStorage要存储的值
 * get: 从localStorage中获取值
 * remove: 从localStorage中删除值
 * clean: 清空localStorage所有存储值
 */
let storage = {
    set: (key, value) => {
        if (typeof value == 'object') {
            window.localStorage.setItem(key, JSON.stringify(value));
        } else {
            window.localStorage.setItem(key, value);
        }
    },
    get: (key) => {
        var result = window.localStorage.getItem(key);
        if (Global.isJsonFormat(result)) {
            return JSON.parse(result);
        } else {
            return result;
        }
    },
    remove: (key) => {
        window.localStorage.removeItem(key);
    },
    clean: (key) => {
        window.localStorage.clear();
    }
}

/*
 * @axiosMessage
 * 封装axios请求消息提示
 * type: 提示类型|msg: 提示消息|callBack: 消息关闭时的回调函数|settings: 其他配置项
 */
let axiosMessage = (type, msg, callBack, settings) => {
    let defultSettings = {
        type: type,
        message: msg,
        duration: 2000,
        onClose: callBack ? callBack : null
    };
    if (settings && typeof settings == 'object') {
        for (let p in settings) {
            defultSettings[p] = settings[p];
        }
    }
    Notify(defultSettings);
}

/*
 * @requestLoading
 * 全局的Loading实例对象
 */
let requestLoading = null

/*
 * @startLoading
 * 初始化Loading加载效果
 */
let startLoading = () => {
    Global.requestLoading = Toast.loading({
        duration: 0,
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner'
    })
}

/*
 * @endLoading
 * 关闭Loading加载效果
 */
let endLoading = () => {
    if (Global.requestLoading) {
        Global.requestLoading.clear()
        Global.requestLoading = null
    }
}

/*
 * @publicAxiosRequest
 * 封装公用的axios请求处理方法
 * params: 请求参数|axiosFunc: axios请求|callBack: 请求成功的回调函数
 */
let publicAxiosRequest = (params, axiosFunc, callBack) => {
    axiosFunc(params).then(res => {
        let { code, message, data } = res;
        if (code == 200 || code == 204) {
            callBack(data, message);
        } else {
            Global.axiosMessage('danger', message);
        }
    }).catch((e) => {
        Global.endLoading();
        console.info(e);
    });
}

/*
 * @getQueryString
 * 获取url参数
 * key: 指定参数的键值|currentURL: 当前路径
 */
let getQueryString = (key, currentURL) => {
    var reg = new RegExp('(^|\\?|&)' + key + '=([^&]*)(\\s|&|$)', 'i'),
        url;
    if (currentURL) {
        url = currentURL;
    } else {
        url = window.location.href;
    }
    if (reg.test(url)) return decodeURIComponent(RegExp.$2.replace(/\+/g, ''));
    return '';
}

// 获取日期 yyyy-mm-dd
let getDate = date => {
    let year = date.getFullYear(),
        month = (date.getMonth() + 1) > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1),
        day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
    return year + '-' + month + '-' + day;
}

let routeJump = (router, path, params) => {
    router.push({
        path,
        query: {
            params
        }
    });
}

const Global = {
    baseURL,
    isJsonFormat,
    isObjectNull,
    isInArray,
    storage,
    axiosMessage,
    requestLoading,
    startLoading,
    endLoading,
    publicAxiosRequest,
    getQueryString,
    getDate,
    routeJump
}

export default Global