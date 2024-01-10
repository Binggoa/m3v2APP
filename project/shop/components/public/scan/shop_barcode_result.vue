<template>
	<div id="shop_barcode_result" v-clock>
		<template>
			<!--使用render函数与createElement函数创建外部文件链接DOM-->
			<remote-js src=""></remote-js>
			<remote-css href=""></remote-css>
		</template>
		<template>
			<header class="mui-bar mui-bar-nav bg-red noShadow">
				<a  class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left text-white"></a>
				<h1 class="mui-title text-white">扫码结果</h1>
			</header>
			<div class="mui-content">
				<div class="mui-table-view-cell" v-if="dataInfo.code==1" style="width: 100%;">
					<p style="color: #070707;">条形码：{{dataInfo.data.barcode}}</p>
					<p style="color: #070707;">商品名称：{{dataInfo.data.goodsName}}</template></p>
					<p style="color: #070707;" v-if="dataInfo.data.price">价格：{{dataInfo.data.price}} 元</p>
					<p style="color: #070707;" v-if="dataInfo.data.brand">品牌：{{dataInfo.data.brand}}</p>
					<p style="color: #070707;" v-if="dataInfo.data.standard">规格：{{dataInfo.data.standard}}</p>
					<p style="color: #070707;">生产企业：{{dataInfo.data.supplier}}</p>
				</div>
				<div class="mui-table-view-cell" v-if="dataInfo.code==0" style="text-align: center;width: 100%;">
					<p style="color: #070707;">扫码结果：{{dataInfo.msg}}</p>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
	var _self = {};
	module.exports = {
		name: 'shop_barcode_result',
		template: '#shop_barcode_result',
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
				dataInfo:{}
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
			/**
			 * 获取被扫码的商品信息
			 */
			getScanGoodsInfo: function(){
				var ws = plus.webview.currentWebview();
				var barcode = ws.barcode;
				var wd = plus.nativeUI.showWaiting();
				console.log(barcode);
				mui.ajax("http://www.mxnzp.com/api/barcode/goods/details", {
					data:{
						barcode:barcode
					},
					dataType: 'json', //服务器返回json格式数据
					type: 'get', //HTTP请求类型
					success: function(data) {
						wd.close();
						_self.dataInfo = data;
						console.log(JSON.stringify(_self.dataInfo));
					},
					error: function(xhr, type, errorThrown) {
						wd.close();
						//异常处理；
						var msg = "系统异常，请联系客服";
						if ("timeout" == type) {
							msg = "网络连接超时";
						} else if ("abort" == type) {
							msg = "网络请求失败，请检查您的网络设置";
						}
						mui.toast(msg);
						console.log(JSON.stringify(xhr));
						console.log(JSON.stringify(errorThrown));
					}
				});
			} //end
		}, //methods
		beforeCreate: function() {
			_self = this;
		}, //beforeCreate
		created: function() {
			/**
			 * HTML5+API准备就绪
			 */
			mui.plusReady(function() {
				_self.getScanGoodsInfo();
				// window.setTimeout(function() {
					var barcode = plus.webview.currentWebview().opener();
					console.log(barcode);
					if (barcode) {
						plus.webview.close(barcode, "none");
					}
				// }, 2000);
			});
			_self.$nextTick(function() {
				
			});
		}, //created
		beforeMount: function() {
			
		}, //beforeMount
		mounted: function() {
			/**
			 * MUI初始化
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
	
</style>
