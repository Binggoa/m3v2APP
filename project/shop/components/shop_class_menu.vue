<template>
	<div id="shop_class_menu" v-clock>
		<template>
			<!--使用render函数与createElement函数创建外部文件链接DOM-->
			<remote-js src=""></remote-js>
			<remote-css href=""></remote-css>
		</template>
		<template>
			<!--侧滑菜单容器-->
			<div id="offCanvasWrapper" class="mui-off-canvas-wrap mui-draggable mui-slide-in">
				<!-- 菜单容器 -->
				<!--品牌菜单部分-->
				<aside id="offCanvasSide1" class="mui-off-canvas-right" style="width: 100%;top:-20px">
					<div class="mui-bar mui-bar-nav sidebar-header noShadow" style="width: 90%;">
						<a v-on:tap="closeSide" class="action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
						<h1 class="mui-title">品牌</h1>
						<a v-on:tap="conformSide" class="link-confirm mui-pull-right">确定</a>
					</div>
					<div class="mui-scroll-wrapper sidebar-body" style="bottom:20px">
						<div class="mui-scroll">
							<!-- 菜单具体展示内容 -->
							<div class="mgb-20">
								<ul class="mui-table-view mui-table-view-checkbox" style="padding: 10px;">
									<template v-for="(Brand,index) in BrandList">
										<li tabindex="1" class="btns-group class-item-group">
											<button class="mui-btn btns-item class-item" v-on:tap="checkedBrand($event,Brand)">
												{{Brand.CompanyBrandName}}
											</button>
										</li>
									</template>
								</ul>
							</div>
						</div>
					</div>
				</aside>
				<!--分类菜单部分-->
				<aside id="offCanvasSide2" class="mui-off-canvas-right " style="width: 100%;top:-20px">
					<div class="mui-bar mui-bar-nav sidebar-header noShadow" style="width: 90%;">
						<a v-on:tap="closeSide" class="action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
						<h1 class="mui-title">分类</h1>
						<a v-on:tap="conformSide" class="link-confirm mui-pull-right">确定</a>
					</div>
					<div class="mui-scroll-wrapper sidebar-body" style="bottom:20px">
						<div class="mui-scroll">
							<!-- 菜单具体展示内容 -->
							<div v-if="classy.IsVisible==0" class="mgb-20" v-for="(classy,index) in ClassList">
								<h5 class="mui-content-padded title">{{classy.GoodsClassName}}</h5>
								<ul class="mui-table-view mui-table-view-checkbox" style="padding: 10px;">
									<template v-for="(child,index) in classy.children">
										<li v-if="child.IsVisible==0" tabindex="1" class="btns-group class-item-group">
											<button class="mui-btn btns-item class-item" v-on:tap="checkedClass($event,child)">
												{{child.GoodsClassName}}
											</button>
										</li>
									</template>
								</ul>
							</div>
						</div>
					</div>
				</aside>
				<!-- 主页面部分 -->
				<div class="mui-inner-wrap">
					<div class="mui-content mui-scroll-wrapper" style="background-color: #ffffff;width: 90%;top:-5px;bottom:20px">
						<div class="mui-scroll">
							<div class="wedget">
								<div class="widget-title">价格区间</div>
								<div class="widget-body">
									<div class="filter-price flexbox align-items-center">
										<div class="filter-item"><input v-model="minPrice" type="number" placeholder="最低价"></div>
										&nbsp;&nbsp;—&nbsp;&nbsp;
										<div class="filter-item"><input v-model="maxPrice" type="number" placeholder="最高价"></div>
									</div>
								</div>
							</div>
							<div class="wedget">
								<div class="widget-title mui-table-view-cell">
									<a href="#offCanvasSide1" class="mui-navigate-right navigate-right">品牌</a>
								</div>
								<div v-if="isShowSelected" class="widget-body">
									<span class="selected-item" v-for="(Brand,index) in selectedBrand">{{Brand.CompanyBrandName}}</span>
								</div>
							</div>
							<div class="wedget">
								<div class="widget-title">类型</div>
								<div class="widget-body">
									<div class="btns-group flexbox align-items-center mg-0">
										<button type="button" class="mui-btn btns-item" style="width: 46%;" v-on:tap="checkType($event,1)">热销</button>
										<button type="button" class="mui-btn btns-item" style="width: 46%;" v-on:tap="checkType($event,2)">新品</button>
									</div>
									<div class="btns-group flexbox align-items-center">
										<button type="button" class="mui-btn btns-item" style="width: 46%;" v-on:tap="checkType($event,3)">促销</button>
										<button type="button" class="mui-btn btns-item" style="width: 46%;" v-on:tap="checkType($event,4)">清仓</button>
									</div>
								</div>
							</div>
							<div class="wedget">
								<div class="widget-title mui-table-view-cell">
									<a href="#offCanvasSide2" class="mui-navigate-right navigate-right">分类</a>
								</div>
								<div v-if="isShowSelected" class="widget-body">
									<span class="selected-item" v-for="(classy,index) in selectedClass">{{classy.GoodsClassName}}</span>
								</div>
							</div>
						</div>
						<div class="offCanvasSide-bottom">
							<div class="offCanvasSide-bottom-body afterline">
								<button type="button" v-on:tap="reSetSearch" class="btn bg-white">重置</button>
								<button type="button" v-on:tap="queRsearch" class="btn bg-danger text-white">确定</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
	var _self = {},
		main = null;
	module.exports = {
		name: 'shop_class_menu',
		template: '#shop_class_menu',
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
				BrandList: [],
				ClassList: [],
				minPrice: "",
				maxPrice: "",
				typeList: [],
				selectedBrand: [],
				selectedClass: [],
				isShowSelected: false
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
			 * 关闭第二层侧滑栏
			 */
			closeSide: function() {
				mui('#offCanvasWrapper').offCanvas('close');
			},
			/**
			 * 第二层侧滑栏确定
			 */
			conformSide: function() {
				_self.isShowSelected = true;
				// _self.$forceUpdate();
				mui('#offCanvasWrapper').offCanvas('close');
			},
			/**
			 * 选择品牌
			 * @param {Object} event
			 * @param {Object} brandItem
			 */
			checkedBrand: function(event, brandItem) {
				if (event.target.classList.contains('active')) {
					event.target.classList.remove('active');
					_self.selectedBrand.splice(_self.selectedBrand.indexOf(brandItem), 1)
				} else {
					event.target.classList.add('active');
					_self.selectedBrand.push(brandItem);
				}
			},
			/**
			 * 选择分类
			 * @param {Object} event
			 * @param {Object} classItem
			 */
			checkedClass: function(event, classItem) {
				if (event.target.classList.contains('active')) {
					event.target.classList.remove('active');
					_self.selectedClass.splice(_self.selectedClass.indexOf(classItem), 1)
				} else {
					event.target.classList.add('active');
					_self.selectedClass.push(classItem);
				}
			},
			/**
			 * 选择类型
			 * @param {Object} event
			 * @param {Object} Type
			 */
			checkType: function(event, Type) {
				if (event.target.classList.contains('active')) {
					event.target.classList.remove('active');
					_self.typeList.splice(_self.typeList.indexOf(Type), 1)
				} else {
					event.target.classList.add('active');
					_self.typeList.push(Type);
				}
			},
			/**
			 * 重置
			 */
			reSetSearch: function() {
				_self.minPrice = "";
				_self.maxPrice = "";
				_self.typeList = [];
				_self.selectedBrand = [];
				_self.selectedClass = [];
				// mui.fire(main, "menu:swiperight");
			},
			/**
			 * 确定
			 */
			queRsearch: function() {
				var params = {
					minPrice: _self.minPrice,
					maxPrice: _self.maxPrice,
					typeList: _self.typeList,
					selectedBrand: _self.selectedBrand,
					selectedClass: _self.selectedClass,
				}
				mui.fire(main, "menu:swiperight", params);
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
				main = plus.webview.currentWebview().opener();
			});

			var files = ['../assets/data/json/brandModel.json', '../assets/data/json/classyModel.json'],
				brandListByCache = "",
				classListByCache = "";
			$.getJSON(files[0], function(brandMdata) {
				brandListByCache = brandMdata;
				$.getJSON(files[1], function(classyMdata) {
					classListByCache = classyMdata;
				});
			});
			var t0 = window.setTimeout(function() {
				_self.BrandList = brandListByCache;
				_self.ClassList = classListByCache;
			}.bind(_self), 500);
			
			_self.$nextTick(function() {
				var originalHeight = document.documentElement.clientHeight || document.body.clientHeight;
				window.onresize = function() {
					//软键盘弹起与隐藏  都会引起窗口的高度发生变化
					var resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
					if (resizeHeight * 1 < originalHeight * 1) { //resizeHeight<originalHeight证明窗口被挤压了
						$('.offCanvasSide-bottom').css('display', 'none');
					} else {
						$('.offCanvasSide-bottom').css('display', 'block');
					}
				}
			});
		}, //created
		beforeMount: function() {
			
		}, //beforeMount
		mounted: function() {
			/**
			 * MUI框架初始化
			 */
			mui.init({
				keyEventBind: {	//关闭back、menu按键监听，这样侧滑主界面会自动获得back和memu的按键事件，仅在主界面处理按键逻辑即可；
					backbutton: false,
					menubutton: false
				}
			});
			
			/**
			 * 所有动态获取的控件初始化需在mui.ready(function(){});内执行
			 */
			mui.ready(function() {
				//侧滑栏滚动
				mui('.mui-scroll-wrapper').scroll();
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
		padding-top: 30px;
	}

	.mui-off-canvas-wrap {
		margin-top: 24px;
	}

	.offCanvasSide-bottom {
		margin-bottom: 24px;
	}

	.mui-selected .mui-navigate-right {
		color: #e60012 !important;
	}

	.class-item-group {
		float: left;
		margin: 0px 6px 15px 0px;
	}

	.mui-scroll-wrapper {
		overflow: auto !important;
	}
</style>
