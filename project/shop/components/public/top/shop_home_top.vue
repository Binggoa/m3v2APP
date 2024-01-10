<template>
	<div id="shop_home_top" v-clock>
		<template>
			<!--使用render函数与createElement函数创建外部文件链接DOM-->
			<remote-js src="../../assets/js/api.js"></remote-js>
			<remote-js src="../../assets/js/common.js"></remote-js>
			<remote-css href=""></remote-css>
		</template>
		<template>
			
		</template>
	</div>
</template>

<script>
	var _self = {};
	module.exports = {
		name: 'shop_home_top',
		template: '#shop_home_top',
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
				homeList: [],
			} //retrun
		}, //data
		computed: { //计算属性
			//多对一或一对一，支持缓存，不支持异步，只有依赖数据发生改变，才会重新进行计算
			// fname(){return null;}
			
		}, //computed
		watch: {
			
		}, //watch
		filters: { //自定义过滤函数

		}, //filters
		methods: {
			/**
			 * @param {Object} goodsList
			 * @param {Object} classInfo
			 */
			convertMallData: function(goodsList, classInfo) {
				this.homeList.push({
					GoodsClassID: classInfo != null ? classInfo.GoodsClassID : "",
					GoodsClassName: classInfo != null ? classInfo.GoodsClassName : "",
					MallGoodsList1: [],
					MallGoodsList2: []
				});
				mui.each(goodsList, function(index, item) {
					if (index < 2) {
						this.homeList[goodsGroupIndex].MallGoodsList1.push(item);
					} else {
						//  if (index < 15)
						this.homeList[goodsGroupIndex].MallGoodsList2.push(item);
					}
				})
				goodsGroupIndex++;
			},
			aaa: function(){
				alert("GetMallGoodsList");
			}
		}, //methods
		beforeCreate: function() {
			_self = this;
		}, //beforeCreate
		created: function() {
			/**
			 * HTML5+API准备就绪
			 */
			mui.plusReady(function() {
				
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
			
			_self.$nextTick(function () {
				
			})
			// alert(111);
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
