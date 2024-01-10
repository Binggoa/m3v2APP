<template>
	<div id="NotFound" v-clock>
		<template>
			<!--使用render函数与createElement函数创建外部文件链接DOM-->
			<remote-js src=""></remote-js> <!-- 这里js文件相对路径，取决于引用此自定义组件的html页面 -->
			<remote-css href=""></remote-css>
		</template>
		<template>
			<div>
				<h1>404</h1>
			</div>
		</template>
	</div>
</template>

<script>
	var _self = {};
	module.exports = {
		name: 'NotFound',
		template: '#NotFound',
		components: {
			'remote-js': {
				render(createElement) {return createElement('script', {attrs: {type: 'text/javascript',src: this.src}})},
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
		beforeCreate: function() { // console.log("执行顺序:1");
			_self = this;
			_self.$nextTick(function() { // console.log("执行顺序:6");
				
			});
		}, //beforeCreate
		created: function() { // console.log("执行顺序:2");
			/**
			 * HTML5+API准备就绪
			 */
			mui.plusReady(function() { // console.log("执行顺序:10");
				// 在这里调用plus api
			});
			_self.$nextTick(function() { // console.log("执行顺序:7");
				
			});
		}, //created
		beforeMount: function() { // console.log("执行顺序:3");
			_self.$nextTick(function() { // console.log("执行顺序:8");
				
			});
		}, //beforeMount
		mounted: function() { // console.log("执行顺序:4");
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
				
			});
			
			_self.$nextTick(function() { // console.log("执行顺序:9");
				
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
