var app_config = {
	version: '1.0.0',
	cssArr: [
		'assets/css/lib/mui.min.css',
		'assets/css/lib/iconfont.css',
		'assets/css/lib/common.css'
	],
	jsArr: [
		'assets/js/lib/es6-promise.auto.min_v4.2.8.js', // 使Promise兼容ES5，es6-promise.auto会检测Promise是否存在，若存在原生的Promise，则不执行；否则会应用polyfill;
		'assets/js/lib/mui.min_v3.7.3.js',
		'assets/js/lib/plus_update.js', // 在浏览器环境使用iframe模拟webview
		'assets/js/lib/vue.min_v2.7.14.js',
		'assets/js/lib/vuex.min_v3.6.2.js',
		'assets/js/lib/vue-router.min_v3.6.5.js',
		'assets/js/lib/httpVueLoader_v1.4.2_update.js', // 简易webpack环境
		'assets/js/lib/jquery.min_v1.7.2.js',
		'assets/js/lib/vue-lazyload_v1.3.3.js',	// 图片懒加载
		'assets/js/lib/vuex-persistedstate.umd.min_v3.2.1.js', // vuex数据持久化
		'assets/js/lib/secure-ls.min_v1.2.6.js', // vuex数据加密
		'assets/js/lib/axios.min_v0.27.2.js', // 基于 Promise 的 HTTP 请求库 与qs.js库配合使用
		'assets/js/lib/pubsub_v1.9.4.js', // 基于JavaScript的订阅和通知(多个已创建页面传值的时候使用)，类似于mui.fire()，当页面没有被创建的时候无法传值，mui.fire()自动检测页面是否被创建然后传值(推荐)，只能单个页面通知。消息的发布：PubSub.publish('自定义事件名', {变量名: 值}); || 消息的订阅/接收：PubSub.subscribe('需监听的自定义事件名', function(msg, data) { _self.$data.变量名 = data.变量名; });
		'assets/js/lib/vue-bus_v1.2.1.js', // 基于vue2.X及以下，组件之间的通信(一个页面多个组件的时候使用)，类似于mui.fire()，当组件没有被创建的时候无法传值，mui.fire()自动检测页面是否被创建然后传值(推荐)，只能单个页面通知。消息的发布：_self.$bus.emit('自定义事件名', {变量名: 值}); || 消息的订阅/接收：_self.$bus.on('需监听的自定义事件名', function(data) { _self.$data.变量名 = data.变量名; });
		'assets/js/lib/qs.min_v6.11.2.js', // url参数格式化的js库：Qs.parse()是将url参数格式化成JSON对象【不同于JSON.parse()】，Qs.stringify()是用“&”将JSON对象拼接成url参数【不同于JSON.stringify()】。Qs.parse('http://item.taobao.com/item.htm?a=1&b=2&c=&d=xxx&e'.split('?')[1]); 的结果为：{a: '1', b: '2', c: '', d: 'xxx', e: ''}
		'assets/js/lib/Hezc.js', // 自定义方法封装
		'assets/js/lib/castapp_update.js', // 基于mui的二次封装
		'assets/js/lib/shop_config.js', // 请求API接口配置
		'assets/js/store/shop_store.js', // 全局公共参数配置
		'assets/js/router/shop_router.js' // 路由配置
	],
}

// 动态加载解决app重启时候缓存问题。
Array.prototype._distinct = function() {
	var arr = this,
		result = [],
		_result = [],
		len = arr.length;
	arr.forEach(function(v, i, arr) {
		var _v = v.split('/')[v.split('/').length - 1];
		if(_result.indexOf(_v) === -1) {
			result.push(v);
			_result.push(_v);
		} else {
			//替换默认引入文件
			result[_result.indexOf(_v)] = v;
			_result[_result.indexOf(_v)] = _v;
		}
	})
	return result;
};
/**
 * @param {Object} lev HTML页面相对于被引用资源目录的相对路径的层级 0、1、2、3、4、5
 * @param {Object} cssArr
 */
function link(lev,cssArr) {
	if (lev === 0){
		addPrefix(app_config.cssArr,'./');
	}else if (lev === 1){
		addPrefix(app_config.cssArr,'../');
	}else if(lev === 2){
		addPrefix(app_config.cssArr,'../../');
	}else if(lev === 3){
		addPrefix(app_config.cssArr,'../../../');
	}else if(lev === 4){
		addPrefix(app_config.cssArr,'../../../../');
	}else if(lev === 5){
		addPrefix(app_config.cssArr,'../../../../../');
	}
	var cssArr = app_config.cssArr.concat(cssArr || [])._distinct();
	
	for(var i = 0; i < cssArr.length; i++) {
		document.write('<link rel="stylesheet" href="' + cssArr[i] + '?version=' + app_config.version + '"/>');
	}
}

/**
 * @param {Object} lev HTML页面相对于被引用资源目录的相对路径的层级 0、1、2、3、4、5
 * @param {Object} jsArr
 */
function script(lev,jsArr) {
	if (lev === 0){
		addPrefix(app_config.jsArr,'./');
	}else if (lev === 1){
		addPrefix(app_config.jsArr,'../');
	}else if(lev === 2){
		addPrefix(app_config.jsArr,'../../');
	}else if(lev === 3){
		addPrefix(app_config.jsArr,'../../../');
	}else if(lev === 4){
		addPrefix(app_config.jsArr,'../../../../');
	}else if(lev === 5){
		addPrefix(app_config.jsArr,'../../../../../');
	}
	var jsArr = app_config.jsArr.concat(jsArr || [])._distinct();
	
	for(var i = 0; i < jsArr.length; i++) {
		document.write('<script src="' + jsArr[i] + '?version=' + app_config.version + ' type="text/javascript" charset="utf-8"><\/script>');
	}
}

function addPrefix(arr,prefix){
	for(var i = 0; i < arr.length; i++) {
		 arr[i] = prefix+arr[i]
	}
}