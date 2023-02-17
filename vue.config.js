/**
 * @vue/cli 4.x
 * edit default configurations of webpack
 */
const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')

const os = require('os');
// 获取本地IPv4地址
const getNetworkIp = () => {
    let needHost = ''; // 打开的host
    try {
        // 获得网络接口列表
        let network = os.networkInterfaces();
        let alias;
        if (network['以太网']) {
            alias = network['以太网'];
        }
        if (network['WLAN']) {
            alias = network['WLAN'];
        }
        for (let i = 0; i < alias.length; i++) {
            if (alias[i]['family'] === 'IPv4' && alias[i]['address'] !== '127.0.0.1' && !alias[i]['internal']) {
                needHost = alias[i]['address'];
            }
        }
    } catch (e) {
        needHost = 'localhost';
    }
    return needHost;
}

module.exports = {
    publicPath: './',
    outputDir: 'dist',
    indexPath: 'index.html',
    assetsDir: 'static',
    devServer: {
        open: 'Google Chrome', // 项目运行成功后打开浏览器展示页面
        overlay: { // 让浏览器overlay同时显示警告和错误
            warnings: true,
            errors: true
        },
        host: getNetworkIp(),
        port: 1888, // 端口号
        proxy: { // 反向代理
            '/keli': {
                // target: 'http://39.107.56.96:5000',
				target: 'http://121.37.231.99:5000',
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    '^/keli': ''
                }
            }
        }
    },
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    autoprefixer({
                        overrideBrowserslist: ['Android >= 4.0', 'iOS >= 7']
                    }),
                    pxtorem({
                        rootValue: 37.5,
                        propList: ['*']
                    })
                ]
            }
        }
    },
	productionSourceMap: false,
    configureWebpack: {
        // webpack的性能提示
        performance: {
            hints: 'warning',
            // 入口起点的最大体积
            maxEntrypointSize: 50000000,
            // 生成文件的最大体积
            maxAssetSize: 30000000,
            // 只给出js文件的性能提示
            assetFilter: function(assetFilename) {
                return assetFilename.endsWith('.js');
            }
        }
    }
}