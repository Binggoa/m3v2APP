<template>
	<div id="shop_pay_success" v-clock>
		<template>
			<!--使用render函数与createElement函数创建外部文件链接DOM-->
			<remote-js src=""></remote-js> <!-- 这里js文件相对路径，取决于引用此自定义组件的html页面 -->
			<remote-css href=""></remote-css>
		</template>
		<template>
			<div class="state-container">
				<div v-if="isSuccess==0" class="state-icon state-payfailed"></div>
				<div v-if="isSuccess==1" class="state-icon state-paysuccess"></div>
				<div class="state-title">
					支付成功
				</div>
				<div class="state-subtitle">
					恭喜你支付成功<br />
					感谢您对品牌联盟的支持！
				</div>
				<div class="state-btns">
					<a date-href="toOrder" type="button" class="mui-btn mui-btn-danger mui-btn-outlined">查看订单</a>
					<a date-href="toHome" type="button" class="mui-btn mui-btn-danger">返回首页</a>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
	var _self = {};
	module.exports = {
		name: 'shop_pay_success',
		template: '#shop_pay_success',
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
				isSuccess: 1,
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
			// 方法名1 : function(){},
			// 方法名2 : function(){}
			
		}, //methods
		beforeCreate: function() {
			_self = this;
		}, //beforeCreate
		created: function() {
			/**
			 * HTML5+API准备就绪
			 */
			mui.plusReady(function() {
				var ws = plus.webview.currentWebview();
				_self.isSuccess = ws.isSuccess;
				alert(ws.OrderID)
				mui(".state-btns").on("tap", "a", function(event) {
					var href = $(this).attr("date-href");
					UIAPI.closePages([
						"shop_goods_detail.html",//商品详情
						"shop_search.html",//商品搜索页
						"shop_class_menu.html",//商品搜索页侧滑栏
						"shop_settlement.html",//购物车 确认订单
						"shop_order_detail.html",//订单详情
						"shop_order_list.html",
						"shop_payment.html",//支付页面
					]);
					
					if ("toOrder" == href) {
						var extras = {
							Status: "",
							OrderID:ws.OrderID
						}
						
						UIAPI.openWindowWithTitle("./shop_order_detail.html", "shop_order_detail.html", extras)
						plus.webview.currentWebview().close();
					} else {
						var shop_main = plus.webview.getLaunchWebview();
						mui.fire(shop_main, 'refresh', {
							index: 0
						});
						plus.webview.currentWebview().close();
					}
				})
			});
			_self.$nextTick(function() {
				
			});
		}, //created
		beforeMount: function() {
			
		}, //beforeMount
		mounted: function() {
			/**
			 * MUI框架初始化
			 */
			mui.init({
				
			});
			
			/**
			 * 所有动态获取的控件初始化需在mui.ready(function(){});内执行
			 */
			mui.ready(function() { // console.log("执行顺序:5");
				// mui('#list').pullRefresh().pullupLoading();
				mui.back = function() {
					// plus.webview.currentWebview().close();
				};
			});
			
			_self.$nextTick(function() {
				
			});
		}, //mounted
		beforeUpdate: function() { // console.log("执行顺序:11、15");
			_self.$nextTick(function() { // console.log("执行顺序:13、17");
				
			});
		}, //beforeUpdate
		updated: function() { // console.log("执行顺序:12、16");
			_self.$nextTick(function() { // console.log("执行顺序:14、18");
				
			});
		}, //updated
		beforeDestroy: function() {
			
		}, //beforeDestroy
		destroyed: function() {
			
		} //destroyed
	}
</script>

<style scoped> /* scoped属性：私有属性，样式只对此组件内元素生效，不影响其他组件*/
	
</style>
