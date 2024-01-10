<template>
	<div id="shop_home_top" v-clock>
		<template>
			<!--使用render函数与createElement函数创建外部文件链接DOM-->
			<remote-js src=""></remote-js>
			<remote-css href=""></remote-css>
		</template>
		<template class="bg-white">
			<header class="mui-bar mui-bar-nav bg-red noShadow">
				<div class="topbar">
					<div class="header-search">
						<input v-model="searchString" id="search" type="search" placeholder="点击搜索名称,产品型号" style="height: 30px !important;">
						<button class="btn-search" type="button" v-on:tap="gotoGoodsClass('')">
							<span class="iconfont icon-m-ah"></span>
						</button>
					</div>
				</div>
			</header>
			
			<div class="mui-content goods-content">
			
				<div id="slider" class="mui-slider mui-fullscreen goods-scroll-wrapper" style="bottom: 0px;">
					<div id="sliderSegmentedControl" style="" class="mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
						<div class="mui-scroll" id="class_list">
							<a v-if="GoodsClass || GoodsClass.children.length>0" class="mui-control-item" v-on:tap="swichTab(index)" v-bind:href="index" v-bind:class="{'mui-active':index==0}"
							 v-for="(GoodsClass,index) in GoodsClassList">
								<span>{{GoodsClass.GoodsClassName }}</span>
							</a>
						</div>
					</div>
			
					<div class="mui-slider-group bg-color" id="class_children">
						<div v-bind:id="index" class="mui-slider-item mui-control-content bg-color" v-bind:class="{'mui-active':index==0}" v-for="(GoodsClass,index) in GoodsClassList">
							<div style="" class="mui-scroll-wrapper scroll">
								<div id="scroll-list" class="mui-scroll">
									<ul class="mui-table-view mui-table-view-chevron mui-grid-view goods-list"  style="background-color: #F5F5F5;">
										<li class="mui-table-view-cell mui-media" v-bind:class="mui_col_xs" v-for="(child,index) in GoodsClass.children">
											<a v-on:tap="gotoGoodsClass(child.GoodsClassID)">
												<img style="height: 90px;" v-bind:src="child.PicURL">
												<div style="font-size: 13px;">{{child.GoodsClassName}}</div>
											</a>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
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
				GoodsClassList: [],
				searchString: "",
				getJsonCount: 0
			} //retrun
		}, //data
		computed: { //计算属性
			//多对一或一对一，支持缓存，不支持异步，只有依赖数据发生改变，才会重新进行计算
			// fname: function() {return null;}
			mui_col_xs: function() {
				if (os.isTablet) {
					return "mui-col-xs-2";
				} else {
					return "mui-col-xs-4";
				}
			},
		}, //computed
		watch: {
			
		}, //watch
		filters: { //自定义过滤函数

		}, //filters
		methods: {
			gotoGoodsClass: function(GoodsClassID) {
				document.activeElement.blur(); //隐藏软键盘  
				var extras = {};
				UIAPI.openWindow("public/search/shop_search.html", "shop_search.html", extras);
				_self.searchString = "";
			},
			swichTab: function(index) {
				mui('#slider').slider().gotoItem(index);
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
			
			_self.$nextTick(function() {
				var search = document.getElementById("search");
				//监听input框键盘事件
				search.addEventListener("keypress", function(e) {
					//当e.keyCode的值为13 即，点击前往/搜索 按键时执行以下操作
					if (e.keyCode == 13) {
						document.activeElement.blur(); //隐藏软键盘  
						var t0 = window.setTimeout(function() {
							_self.gotoGoodsClass('')
						}.bind(_self), 500); //使用字符串执行方法
					}
				});
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
				//阻尼系数
				var deceleration = mui.os.ios ? 0.003 : 0.0009;
				mui('.mui-scroll-wrapper').scroll({
					scrollY: true, //是否竖向滚动
					scrollX: true, //是否横向滚动
					bounce: false,	//滚动条是否有弹力默认是true
					indicators: true, //是否显示滚动条,默认是true
					deceleration: deceleration
				});
			});
			
			$.ajax({
				url: '../assets/data/json/classyModel.json',
				type: 'GET',
				contentType: "application/json; charset=utf-8",
				dataType: 'json',
				cache: false,
				async: false,
				success: function(data) {
					var classListByCache = data;
					_self.GoodsClassList = classListByCache;
					_self.$forceUpdate();
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					// alert(XMLHttpRequest.status);
					// alert(XMLHttpRequest.readyState);
					// alert(textStatus);
				}
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
	.mui-content {
		min-height: calc(100vh);
	}
	.mui-scroll-wrapper {
		overflow: scroll;
	}
</style>
