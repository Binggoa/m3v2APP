<template>
	<div id="shop_explain" v-clock>
		<template>
			<!--使用render函数与createElement函数创建外部文件链接DOM-->
			<remote-js src=""></remote-js> <!-- 这里js文件相对路径，取决于引用此自定义组件的html页面 -->
			<remote-js src=""></remote-js>
			<remote-css href=""></remote-css>
			<remote-css href=""></remote-css>
		</template>
		<template>
			
		</template>
	</div>
</template>

<script>
	var _self = {};
	module.exports = { //这里等同于Vue自定义组件Vue.component('test', {
		//webpack写法Nodejs规范
		// 组件内部定义方法
		name: 'shop_explain',
		template: '#shop_explain', //写法2：var comment = '<div>{{message}}</div>'; template: comment,
		components: { //使用render函数与createElement函数创建外部文件链接DOM，加载外部组件
			'remote-js': {
				render(createElement) {return createElement('script', {attrs: {type: 'text/javascript', src: this.src //这里只能用this，因为_self指向module.exports内，标签内的src为Windows对象
						}
					})
				},
				props: {src: {type: String, required: true}}
			},
			'remote-css': {
				render(createElement) {return createElement('link', {attrs: {rel: 'stylesheet', type: 'text/css', href: this.href} }) },
				props: {href: {type: String, required: true}}
			}
		}, //components
		store: shop_store,
		router: shop_router,
		props: { //子组件通过 Prop 获取父组件向子组件传递数据，不支持驼峰命名，父组件使用"v-bind"data里定义的数据来动态传递 ：<blog-post v-for="post in posts" v-bind:key="post.id" v-bind:title="post.title"></blog-post>
			title: { type: String }
		}, //props
		data: function() {
			return { //这里不要忘记return
				// 这里可以定义初始的变量
				// Vue不允许动态添加根级别的响应属性，
				// 因此必须通过预先声明所有根级别的响应数据属性来初始化Vue实例，即使是空值 
				
			} //retrun
		}, //data
		computed: { //计算属性
			//多对一或一对一，支持缓存，不支持异步，只有依赖数据发生改变，才会重新进行计算
			// fname: function() {return null;}
			
		}, //computed
		watch: {
			// alert('Watch');
		}, //watch
		filters: { //自定义过滤函数

		}, //filters
		methods: { //定义绑定标签函数的地方，通过标签v-on:"方法名"等绑定使用；不需要绑定使用的方法在mounted里定义
			//可以定义多个函数
			//这里不能用retrun
			// 方法名1: function() {}, // 多个方法用逗号隔开
			// 方法名2: function() {}
			
		}, //methods
		beforeCreate: function() { // console.log("执行顺序:1");
			_self = this;
			_self.$nextTick(function() { // console.log("执行顺序:6");
				
			});
			// alert('Before Create');
		}, //beforeCreate
		created: function() { // console.log("执行顺序:2"); //页面加载完成前，vue实例创建完成之后
			//当我们的组件加载完成时，需要执行的内容.created是vuejs中的勾子函数之一
			//this.函数名();//函数的调用
			// alert('Created');
			_self.$nextTick(function() { // console.log("执行顺序:7");
				_self.$store.dispatch('test2/updateLoginState'); // 更新缓存
			});
			/**
			 * HTML5+API准备就绪
			 */
			mui.plusReady(function() { // console.log("执行顺序:10");
				// 在这里调用plus api
			});
		}, //created
		beforeMount: function() { // console.log("执行顺序:3");
			_self.$nextTick(function() {
				// console.log("执行顺序:8");
			});
			// alert('Before Mount');
			// $(document).ready(function() {});
		}, //beforeMount
		mounted: function() { // console.log("执行顺序:4"); //页面加载完成后
			/**
			 * MUI框架初始化
			 */
			mui.init({
				
			}); //其他组件已经初始化过mui.init({});以内容最多的为主
			
			/**
			 * 所有动态获取的控件初始化需在mui.ready(function(){});内执行
			 */
			mui.ready(function() { // console.log("执行顺序:5");
				// mui('#list').pullRefresh().pullupLoading();
				
			});
			
			_self.$nextTick(function() { // console.log("执行顺序:9");
				
			});
		}, //mounted
		beforeUpdate: function() { // console.log("执行顺序:11、15");动态获取数据后再次执行
			_self.$nextTick(function() {
				// console.log("执行顺序:13、17");动态获取数据后再次执行
			});
			// alert('Before Update');
		}, //beforeUpdate
		updated: function() { // console.log("执行顺序:12、16");动态获取数据后再次执行
			_self.$nextTick(function() {
				// console.log("执行顺序:14、18");动态获取数据后再次执行
			});
			// alert('Updated');
		}, //updated
		beforeDestroy: function() {
			// alert('Before Destroy');
		}, //beforeDestroy
		destroyed: function() {
			// alert('Destroyed');
		} //destroyed
	}
</script>

<style scoped> /* scoped属性：私有属性，样式只对此组件内元素生效，不影响其他组件*/
	
</style>
