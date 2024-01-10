<template>
	<div id="shop_popover_menu" v-clock>
		<template>
			<!--使用render函数与createElement函数创建外部文件链接DOM-->
			<remote-js src=""></remote-js>
			<remote-css href=""></remote-css>
		</template>
		<template>
			<a style="display: block;height: 100%; background:url(imgs/mask.png);"></a>
			<div id="topPopover" class="mui-popover" style="position:fixed ;top: 20px;right:5px;">
				<div class="mui-popover-arrow" style="top: -30px;"></div>
				<ul class="mui-table-view" style="color: #fff; top: -4px;right: 0;">
					<li class="mui-table-view-cell  ">
						<a id="next" href="javascript:;">下一页</a>
					</li>
					<li class="mui-table-view-cell ">
						<a id="previous" href="javascript:;">上一页</a>
					</li>
					<li class="mui-table-view-cell ">
						<a id="refresh" href="javascript:;">刷&nbsp;&nbsp;新</a>
					</li>
					<li class="mui-table-view-cell ">
						<a id="homePage" href="javascript:;">首&nbsp;&nbsp;页</a>
					</li>
				</ul>
			</div>
		</template>
	</div>
</template>

<script>
	var _self = {};
	module.exports = {
		name: 'shop_popover_menu',
		template: '#shop_popover_menu',
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
				ws = plus.webview.currentWebview();
				ws.setStyle({
					mask: "none"
				});
				window.addEventListener("tap", function() {
					ws.hide();
				})
				window.addEventListener("dragstart", function() {
					ws.hide();
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
			mui.ready(function() {
				
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
	.mui-popover .mui-popover-arrow {
		left: auto;
		right: 10px!important;
	}
	.mui-popover {
		display: block;
		width: auto;
		opacity: 1;
		text-align: center;
	}
	.mui-table-view-cell> a:not(.mui-btn) {
		color: #000;
	}
</style>
