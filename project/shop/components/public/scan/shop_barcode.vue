<template>
	<div id="shop_barcode" v-clock>
		<template>
			<!--使用render函数与createElement函数创建外部文件链接DOM-->
			<remote-js src=""></remote-js>
			<remote-css href=""></remote-css>
		</template>
		<template style="background-color:#000000;">
			<div id="bcid">
				<div style="height:100%"></div>
				<p class="tip">...载入中...</p>
			</div>
		</template>
	</div>
</template>

<script>
	var _self = {};
	var ws = null,
		wo = null;
	var scan = null;
	// H5 plus事件处理
	function plusReady() {
		// 获取窗口对象
		ws = plus.webview.currentWebview();
		nv = ws.getTitleNView();
		wo = ws.opener();
		// 开始扫描
		ws.addEventListener('show', function() {
			scan = new plus.barcode.Barcode('bcid', [plus.barcode.QR, plus.barcode.EAN8, plus.barcode.EAN13,plus.barcode.CODE128], {
				frameColor: '#00FF00',
				scanbarColor: '#00FF00'
			});
			scan.onmarked = onmarked;
			scan.start({
				conserve: true,
				filename: '_doc/barcode/'
			});
		}, false);
		// 显示页面并关闭等待框
		ws.show('pop-in');
	}
	document.addEventListener('plusready', plusReady, false);
	
	// 二维码扫描成功
	function onmarked(type, result, file) {
		switch (type) {
			case plus.barcode.QR://二维码
				type = 'QR';
				break;
			case plus.barcode.EAN13:
				type = 'EAN13';
				break;
			case plus.barcode.EAN8:
				type = 'EAN8';
				break;
			case plus.barcode.CODE128:
				type = 'CODE128';
				break;
			default:
				type = '其它' + type;
				break;
		}
		result = result.replace(/\r\n/g, '');
		//分析扫描结果：是URL就跳转 ，不是就提示
		if(result.indexOf('http://')==0  || result.indexOf('https://')==0){
			plus.runtime.openURL(result);
			mui.back();//返回上一页
		} else{
			var extras = {
				barcode:result
			}
			UIAPI.openWindow("./shop_barcode_result.html","shop_barcode_result.html",extras);
		}
	}
	// 创建子窗口
	var view = null;
	
	// 开关闪光灯 
	var bFlash = false;
	var AVCaptureDevice = null;
	var Camera = null;
	
	function switchFlash() {
		bFlash = !bFlash;
		scan.setFlash(bFlash);
		ws.setStyle({
			titleNView: {
				buttons: [{
					fontSrc: '../../../assets/fonts/barcode.ttf',
					text: (bFlash ? '\ue400' : '\ue401'),
					fontSize: '18px',
					onclick: 'javascript:switchFlash()'
				}]
			}
		});
	}
	module.exports = {
		name: 'shop_barcode',
		template: '#shop_barcode',
		components: {
			'remote-js': {
				render(createElement) {return createElement('script', {attrs: {type: 'text/javascript', src: this.src}})},
				props: {src: {type: String, required: true}}
			},
			'remote-css': {
				render(createElement) {return createElement('link', {attrs: {rel: 'stylesheet', type: 'text/css', href: this.href}})},
				props: {href: {type: String, required: true}}
			}
		}, //components
		store: shop_store,
		router: shop_router,
		props: {
			title: {type: String}
		}, //props
		data: function() {
			return {
				ws:null,
				wo:null,
				scan:null,
				view: null,	// 创建子窗口
				bFlash: false,	// 开关闪光灯
				AVCaptureDevice: null,
				Camera: null
			} //retrun
		}, //data
		computed: { //计算属性
			//多对一或一对一，支持缓存，不支持异步，只有依赖数据发生改变，才会重新进行计算
			// fname: function() {return null;}
			
		}, //computed
		watch: {
			
		}, //watch
		filters: { //自定义过滤函数

		}, //filters
		methods: {
			// 二维码扫描成功
			// onmarked: function(type, result, file) {
			// 	switch (type) {
			// 		case plus.barcode.QR://二维码
			// 			type = 'QR';
			// 			break;
			// 		case plus.barcode.EAN13:
			// 			type = 'EAN13';
			// 			break;
			// 		case plus.barcode.EAN8:
			// 			type = 'EAN8';
			// 			break;
			// 		case plus.barcode.CODE128:
			// 			type = 'CODE128';
			// 			break;
			// 		default:
			// 			type = '其它' + type;
			// 			break;
			// 	}
			// 	if(result){
			// 		alert(result)
			// 		result = result.replace(/\r\n/g, '');
					
			// 		//分析扫描结果：是URL就跳转 ，不是就提示
			// 		if(result.indexOf('http://')==0  || result.indexOf('https://')==0){
			// 			plus.runtime.openURL(result);
			// 			mui.back();//返回上一页
			// 		} else{
			// 			var extras = {
			// 				barcode:result
			// 			}
			// 			UIAPI.openWindow("./shop_barcode_result.html","shop_barcode_result.html",extras);
			// 		}
			// 	}
			// },
			// switchFlash: function() {
			// 	_self.bFlash = !bFlash;
			// 	_self.scan.setFlash(_self.bFlash);
			// 	_self.ws.setStyle({
			// 		titleNView: {
			// 			buttons: [{
			// 				fontSrc: '../../../assets/fonts/barcode.ttf',
			// 				text: (_self.bFlash ? '\ue400' : '\ue401'),
			// 				fontSize: '18px',
			// 				onclick: 'javascript:switchFlash()'
			// 			}]
			// 		}
			// 	});
			// }
		}, //methods
		beforeCreate: function() {
			_self = this;
		}, //beforeCreate
		created: function() {
			/**
			 * HTML5+API准备就绪
			 */
			mui.plusReady(function() {
				// // 获取窗口对象
				// _self.ws = plus.webview.currentWebview();
				// _self.nv = _self.ws.getTitleNView();
				// _self.wo = _self.ws.opener();
				// // 开始扫描
				// _self.ws.addEventListener('show', function() {
				// 	_self.scan = new plus.barcode.Barcode('bcid', [plus.barcode.QR, plus.barcode.EAN8, plus.barcode.EAN13,plus.barcode.CODE128], {
				// 		frameColor: '#00FF00',
				// 		scanbarColor: '#00FF00'
				// 	});
				// 	_self.scan.onmarked = _self.onmarked();
				// 	_self.scan.start({
				// 		conserve: true,
				// 		filename: '_doc/barcode/'
				// 	});
				// }, false);
				// // 显示页面并关闭等待框
				// _self.ws.show('pop-in');
			});
			_self.$nextTick(function() {
				
			});
		}, //created
		beforeMount: function() {
			
		}, //beforeMount
		mounted: function() { //页面加载完成后
			/**
			 * MUI框架初始化
			 */
			mui.init({
				
			});
			
			/**
			 * 所有动态获取的控件初始化需在mui.ready(function(){});内执行
			 */
			mui.ready(function() {
				
			});
			
			_self.$nextTick(function() {
				
			});
		}, //mounted
		beforeUpdate: function() {
			
		}, //beforeUpdate
		updated: function() {
			
		}, //updated
		beforeDestroy: function() {
			
		}, //beforeDestroy
		destroyed: function() {
			
		} //destroyed
	}
</script>

<style scoped> /* scoped属性：私有属性，样式只对此组件内元素生效，不影响其他组件*/
	* {
		-webkit-user-select: none;
		-ms-touch-select: none;
	}
	html {
		width: 100%;
		height: 100%;
	}
	body {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		font-family: Arial;
		font-size:16px;
		color: #6c6c6c;
		text-align: center;
		-webkit-touch-callout:none;
		-webkit-tap-highlight-color:rgba(0,0,0,0);
		-webkit-text-size-adjust:none;
	}
	.heading {
		margin:0 1em;
		text-align:left;
	}
	.des {
		padding: 0 1em;
		text-align:left;
		text-indent: 2em;
		word-break: break-all;
	}
	.logo {
		width: 100%;
		text-align: center;
	}
	.button {
		font-size: 18px;
		font-weight: normal;
		text-decoration: none;
		display: block;
		text-align: center;
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
		color: #FFF;
		background-color: #FFCC33;
		border: 1px solid #ECB100;
		padding: .5em 0em;
		margin: .5em .7em;
		-webkit-border-radius: 5px;
		border-radius: 5px;
	}
	.button:active {
		outline: 0;
	  	-webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
		box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
	}
	.button-waring {
		color: #666;
		background-color: #ebebeb;
		border-color: #e0e0e0;
	}
	.button-select {
		font-size: 14px;
		background-color: #CCCCCC;
		border: 0;
		-webkit-border-radius: 2px;
		border-radius: 2px;
	}
	.dlist {
		padding: 0px;
		margin: 1em;
		background: #fff;
		border: 1px solid #ddd;
		-webkit-border-radius: 3px;
		border-radius: 3px;
	}
	.ditem {
		overflow: hidden;
		list-style-type: none;
		font-size: 1em;
		padding: 1em;
		border-bottom: inset 1px #ebebeb;
		vertical-align: middle;
	}
	.ditem:active {
		background: #f4f4f4;
	}
	.ditem:last-child {
		border-bottom: inset 0px #ebebeb;
	}
	.ditem-empty {
		overflow: hidden;
		list-style-type: none;
		font-size: 1em;
		padding: 1em;
		vertical-align: middle;
	}
	#outpos {
		height: 100px;
		width: 100%;
	}
	#output {
		height: 64px;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		color: #f00;
		background: #FFF;
		font-size: 12px;
		text-align: left;
		line-height: 16px;
		word-break: break-all;
		z-index: 6666;
		padding: 8px 16px;
		overflow-x: hidden;
		overflow-y: scroll;
		border-top: 2px solid #AAA;
		-webkit-overflow-scrolling: touch;
	}
	#bcid {
		width: 100%;
		position: fixed;
		top: 0px;
		bottom: 0px;
		text-align: center;
	}
	.tip {
		color: #FFFFFF;
		font-weight: bold;
		text-shadow: 0px -1px #103E5C;
	}
</style>
