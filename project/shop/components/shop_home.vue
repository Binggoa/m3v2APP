<template>
	<div id="shop_home" v-clock>
		<template>
			<!-- 使用render函数与createElement函数创建外部文件链接DOM -->
			<remote-js src=""></remote-js>
			<remote-css href=""></remote-css>
		</template>
		<template class="bg-gray" style="margin: 0;max-width: 100%;">
			<header id="header" class="mui-bar mui-bar-transparent header-bar">
				<div class="topbar">
					<div class="logo-index">
						<img src="http://iph.href.lu/60x30?text=logo">
					</div>
					<div class="header-search">
						<input id="search-input" type="search" v-on:tap="onInput" placeholder="点击搜索名称,产品型号" style="border: 2px solid #f14646;height: 32px !important;">
						<button v-on:tap="gotoGoodsClass('','','')" class="btn-search" type="button" style="top: 10px;">
							<img src="../assets/images/img/search.png" style="height: 17px;" />
						</button>
					</div>
					<div id="saoma" class="saoma" v-on:tap="scanCode()" style="text-align:center;border-radius: 50%;height: 26px;width: 26px;background:rgba(137,15,21,0.8);">
						<img src="../assets/images/img/saoma.png" style="height: 18px;width: 18px;vertical-align: middle;margin-top: 3px;" />
					</div>
				</div>
				<!-- 不加这行时，IOS快速滑动标题栏变黑 header-bar-->
				<div style="width: 100%;height: 10%;" class="header-bar topbar">

				</div>
			</header>

			<div id="content" class="mui-content" style="padding-bottom: 0px;">
				<div class="banner">
					<div id="slider" class="mui-slider mgauto">
						<div class="mui-slider-group mui-slider-loop">
							<!-- 额外增加的一个节点(循环轮播：第一个节点是最后一张轮播) -->
							<div class="mui-slider-item mui-slider-item-duplicate">
								<a href="#">
									<img style="width: 100%;" src="../assets/images/img/banner3.png">
								</a>
							</div>
							<!-- 第一张 -->
							<div class="mui-slider-item">
								<a href="#">
									<img style="width: 100%;" src="../assets/images/img/banner1.png">
								</a>
							</div>
							<!-- 第二张 -->
							<div class="mui-slider-item">
								<a href="#">
									<img style="width: 100%;" src="../assets/images/img/banner2.png">
								</a>
							</div>
							<!-- 第三张 -->
							<div class="mui-slider-item">
								<a v-on:tap="toRewardInfo()">
									<img style="width: 100%;" src="../assets/images/img/banner3.png">
								</a>
							</div>
							<!-- 额外增加的一个节点(循环轮播：最后一个节点是第一张轮播) -->
							<div class="mui-slider-item mui-slider-item-duplicate">
								<a href="#">
									<img style="width: 100%;" src="../assets/images/img/banner1.png">
								</a>
							</div>
						</div>
						<div class="mui-slider-indicator">
							<div class="mui-indicator mui-active"></div>
							<div class="mui-indicator"></div>
							<div class="mui-indicator"></div>
						</div>
					</div>
					<div class="banner-bg"></div>
				</div>
				<div class="notice-wrapper">
					<div class="notice flexbox">
						<span class="icon-notice"></span>
						<marquee class="notice-text">
							<!-- <template v-if="NoticeList && NoticeList.length>0" v-for="Notice in NoticeList"> -->
							<!-- <span style="color: #e60012">【{{Notice.LogoContent}}】</span> -->
							<!-- <span>{{Notice.NoticeContent}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> -->
							<!-- </template> -->
							<!-- <span v-if="!NoticeList || NoticeList.length==0"> -->
							<span style="color: #e60012">【恭喜】</span>金万年文具品牌联盟已上线，正式走上文具联盟时代，让商家直接与厂家交易，减少中间商环节。
							<!-- </span> -->
						</marquee>
					</div>
				</div>
				<div class="shortcut bg-white mgt-015">
					<a class="shortcut-item" v-on:tap="gotoGoodsClass('','','In')">
						<img class="shortcut-icon" src="../assets/images/img/shortcut-new.png">
						<div class="shortcut-text">
							新品推荐
						</div>
					</a>
					<a class="shortcut-item" v-on:tap="gotoGoodsClass('','','Ih')">
						<img class="shortcut-icon" src="../assets/images/img/shortcut-hot.png">
						<div class="shortcut-text">
							热销市场
						</div>
					</a>
					<a class="shortcut-item" v-on:tap="gotoGoodsClass('','','Ip')">
						<img class="shortcut-icon" src="../assets/images/img/shortcut-discount.png">
						<div class="shortcut-text">
							促销折扣
						</div>
					</a>
					<a v-on:click="myFunction()" class="shortcut-item">
						<img class="shortcut-icon" src="../assets/images/img/shortcut-brand.png">
						<div class="shortcut-text">
							品牌街
						</div>
					</a>
					<a v-on:click="jsonpFunction()" class="shortcut-item">
						<img class="shortcut-icon" src="../assets/images/img/shortcut-suggest.png">
						<div class="shortcut-text">
							建议订单
						</div>
					</a>
				</div>
				<template id="list">
					<div class="cart-product" v-for="(item,index) in homeList">
						<a v-on:tap="gotoGoodsClass(item.GoodsClassID,'','')" class="cart-product__header">
							<span class="bar bar-red" v-bind:style="BarBackground(index)"></span>
							<span class="text" style="padding-top: 2px;">{{item.GoodsClassName}}</span>
							<span class="mui-icon mui-icon-arrowright"></span>
						</a>
						<div class="cart-product__body">
							<div class="goods-row col-2">
								<a v-on:tap="gotoGoodsDetail(MallGood.GoodsID)" class="goods-item__link" v-for="(MallGood,index) in item.MallGoodsList1">
									<div class="goods-item__img" style="background-color: #FFFFFF;">
										<img style="height: 100%;" v-lazy="MallGood.DefaultPicURL" v-bind:key="MallGood.DefaultPicURL">
									</div>
									<div class="goods-item__descr">
										{{MallGood.GoodsName}}
									</div>
									<div class="goods-item__attr">
										<span class="model">型号：{{MallGood.GoodsModel}}</span>
									</div>
									<div class="goods-item__price">
										<template>
											<!-- <template v-if="!user"> -->
											<span class="price-now">￥{{MallGood.InvoicePrice}}</span>
											<s class="price-origin" v-if="MallGood.InvoicePrice*1<MallGood.OldInvoicePrice*1">￥{{MallGood.OldInvoicePrice}}</s>
										</template>
										<!-- 0不含税 1含税 -->
										<!-- <template v-if="user.IsTax==0">
										<span class="price-now">￥{{MallGood.NoInvoicePrice}}</span>
										<s class="price-origin" v-if="MallGood.NoInvoicePrice*1<MallGood.OldNoInvoicePrice*1">￥{{MallGood.OldNoInvoicePrice}}</s>
									</template> -->
										<!-- 1含税 -->
										<!-- <template v-if="user.IsTax==1">
										<span class="price-now">￥{{MallGood.InvoicePrice}}</span>
										<s class="price-origin" v-if="MallGood.InvoicePrice*1<MallGood.OldInvoicePrice*1">￥{{MallGood.OldInvoicePrice}}</s>
									</template> -->
									</div>
								</a>
							</div><!-- goods-row col-2 end -->
							<div class="goods-row col-3">
								<a v-on:tap="gotoGoodsDetail(MallGood.GoodsID)" class="goods-item__link" v-for="(MallGood,index) in item.MallGoodsList2">
									<div class="goods-item__img" style="background-color: #FFFFFF;">
										<img style="height: 100%;" v-lazy="MallGood.DefaultPicURL" v-bind:key="MallGood.DefaultPicURL">
									</div>
									<div class="goods-item__descr">
										{{MallGood.GoodsName}}
									</div>
									<div class="goods-item__attr">
										<span class="model">型号：{{MallGood.GoodsModel}}</span>
									</div>
									<div class="goods-item__price">
										<template>
											<!-- <template v-if="!user"> -->
											<span class="price-now">￥{{MallGood.InvoicePrice}}</span>
											<s class="price-origin" v-if="MallGood.InvoicePrice*1<MallGood.OldInvoicePrice*1">￥{{MallGood.OldInvoicePrice}}</s>
										</template>
										<!-- 0不含税 1含税 -->
										<!-- <template v-if="user.IsTax==0">
										<span class="price-now">￥{{MallGood.NoInvoicePrice}}</span>
										<s class="price-origin" v-if="MallGood.NoInvoicePrice*1<MallGood.OldNoInvoicePrice*1">￥{{MallGood.OldNoInvoicePrice}}</s>
									</template> -->
										<!-- 1含税 -->
										<!-- <template v-if="user.IsTax==1">
										<span class="price-now">￥{{MallGood.InvoicePrice}}</span>
										<s class="price-origin" v-if="MallGood.InvoicePrice*1<MallGood.OldInvoicePrice*1">￥{{MallGood.OldInvoicePrice}}</s>
									</template> -->
									</div>
								</a>
							</div><!-- goods-row col-3 end -->
						</div><!-- cart-product__body end -->
					</div>
				</template>
			</div>
		</template>

	</div>
</template>

<script>
	var _self = {};
	Vue.use(VueLazyload, {
		preLoad: 1.3,
		error: '../assets/images/img/goods-default.gif',
		loading: '../assets/images/img/goods-default.gif',
		attempt: 1
	});
	module.exports = {
		name: 'shop_home',
		template: '#shop_home',
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
			
		}, //props
		data: function() {
			return {
				homeList: [],
				goodsGroupIndex: 0, //显示数据的索引 不同于classIndex，goodsGroupIndex小于等于classIndex，因为分类里面的商品会为空
				classIndex: 0 //分类的索引
			} //retrun
		}, //data
		computed: { //计算属性
			//多对一或一对一，支持缓存，不支持异步，只有依赖数据发生改变，才会重新进行计算
			// fname(){return null;}
			BarBackground: function() {
				return function(index) {
					var iii = index % 4;
					if (iii == 1) {
						return "background-color:#019DE6";
					} else if (iii == 2) {
						return "background-color:#C08EF0";
					} else if (iii == 3) {
						return "background-color:#6CE50D";
					} else {
						return "background-color:#E60012";
					}
				}
			},
			name: function() {
				return _self.$store.state.name
			}
		}, //computed
		watch: {
			homeList: function(newVal, oldVal) { //普通的watch监听
				_self.homeList = newVal;
			}
		}, //watch
		filters: { //自定义过滤函数

		}, //filters
		methods: {
			jsonpFunction: function() {
				// 打开新窗口
				// plus.webview.open('./jsonp.html', 'jsonp', {}, 'slide-in-right', 200);
				plus.webview.open('./shop_setting.html', 'shop_setting.html', {}, 'slide-in-right', 200);
			},
			myFunction: function() {
				alert(JSON.stringify(_self.homeList[0].MallGoodsList1));
			},
			gotoGoodsClass: function(ParantClassID, GoodsClassID, type) {
				document.activeElement.blur(); //隐藏软键盘  
				var extras = {}
				UIAPI.openWindow("./public/search/shop_search.html", "shop_search.html", extras)
				mui("#search-input")[0].value = "";
			},
			gotoGoodsDetail: function(goodsId) {
				UIAPI.openGoodsDetail("./shop_goods_detail.html", goodsId);
			},
			scanCode: function() {
				createWithoutTitle('./public/scan/shop_barcode.html', {
					titleNView: {
						type: 'transparent',
						titleText: '扫一扫',
						autoBackButton: true,
						buttons: [{
							fontSrc: '../assets/fonts/barcode.ttf',
							text: '\ue401',
							fontSize: '18px',
							onclick: 'javascript:switchFlash()'
						}]
					}
				});
			},
			onInput: function() {
				if (mui.os.ios) {
					//禁止页面滚动
					scrollTo(0, 0);
					document.body.addEventListener('touchmove', event_f, {
						passive: false
					});
				}
				// event.detail.gesture.preventDefault();//阻止默认事件
				document.getElementById('search-input').focus();
			},
			/**
			 * 下拉加载
			 */
			pulldownRefresh: function() {
				mui('.mui-content').pullRefresh().refresh(true); // 重置开启上拉加载
				// mui('.mui-content').pullRefresh().enablePullupToRefresh(); // 启用上拉加载
				_self.classIndex = 0;
				_self.goodsGroupIndex = 0;
				var files = ['../assets/data/json/homeModel.json', '../assets/data/json/classyModel.json'],
					homeGoodsListByCache = "",
					classListByCache = "";
				mui.getJSON(files[0], function(hMdata) {
					homeGoodsListByCache = hMdata;
					mui.getJSON(files[1], function(cMdata) {
						classListByCache = cMdata;
					});
				});
				var t1 = window.setTimeout(function() {
					_self.homeList = [];
					_self.$options.methods.convertMallData(homeGoodsListByCache, classListByCache[0]);
					mui('.mui-content').pullRefresh().endPulldownToRefresh();
					_self.classIndex++;
				}.bind(_self), 1000);
			},
			/**
			 * 上拉加载更多，以分类为页数
			 */
			pullupLoading: function() {
				var files = ['../assets/data/json/homeModel.json', '../assets/data/json/classyModel.json'],
					homeGoodsListByCache = "",
					classListByCache = "";
				mui.getJSON(files[0], function(hMdata) {
					homeGoodsListByCache = hMdata;
					mui.getJSON(files[1], function(cMdata) {
						classListByCache = cMdata;
					});
				});
				//首页显示5个分类 
				if (_self.classIndex == 5 || classListByCache.length == _self.classIndex) {
					// mui('.mui-content').pullRefresh().disablePullupToRefresh(); //会导致下拉刷新后上拉无效且无法重置上拉加载
					mui('.mui-content').pullRefresh().endPullupToRefresh(true); // 加载数据没有更多内容时传入true，默认false
					var t0 = window.setTimeout(function() {
						mui('.mui-content').pullRefresh().disablePullupToRefresh(); // 禁用上拉刷新
						// var t1 = window.setTimeout(function(){  
						//     mui('.mui-content').pullRefresh().enablePullupToRefresh();  // 启用上拉加载
						// }.bind(_self), 1000); // 等待1s执行：恢复下拉加载更多功能（可根据需要，不恢复）  
					}.bind(_self), 2000); // 显示“没有更多了”2s后执行：关闭向下加载更多功能（直接隐藏了“没有更多”）
					return false;
				}
				var t2 = window.setTimeout(function() {
					_self.$options.methods.convertMallData(homeGoodsListByCache, classListByCache[_self.classIndex]);
					mui('.mui-content').pullRefresh().endPullupToRefresh();
					_self.classIndex++;
				}.bind(_self), 1000);
			},
			GetMallGoodsList: function() {
				// _self.$store.dispatch('test2/updateLoginState');
				var files = ['../assets/data/json/homeModel.json', '../assets/data/json/classyModel.json'],
					homeGoodsListByCache = "",
					classListByCache = "";
				mui.getJSON(files[0], function(hMdata) {
					homeGoodsListByCache = hMdata;
					mui.getJSON(files[1], function(cMdata) {
						classListByCache = cMdata;
					});
				});
				var t1 = window.setTimeout(function() {
					_self.$options.methods.convertMallData(homeGoodsListByCache, classListByCache[0]);
					_self.classIndex++;
				}.bind(_self), 1000);
				// _self.$forceUpdate();
			},
			convertMallData: function(goodsList, classInfo) {

				// vue中循环数组push时候是一个对象，导致和想要的不一致，可能会出现问题。
				// 方法1：避免bData.push的依次添加数据的操作
				// i.重新申请一个内存空间 let tempData = []
				// var tempData = [];
				// ii.依次向tempData中赋值
				_self.homeList.push({
					GoodsClassID: classInfo != null ? classInfo.GoodsClassID : "",
					GoodsClassName: classInfo != null ? classInfo.GoodsClassName : "",
					MallGoodsList1: [],
					MallGoodsList2: []
				});
				// iii.最后一次性将临时存储数据的数组tempData赋值bData
				// _self.homeList = tempData;
				// _self.homeList = Object.assign({}, _self.homeList);
				_self.$forceUpdate();
				mui.each(goodsList, function(index, item) {
					if (index < 2) {
						_self.homeList[_self.goodsGroupIndex].MallGoodsList1.push(item);
						// _self.homeList = Object.assign({}, _self.homeList);
					} else {
						//  if (index < 15)
						_self.homeList[_self.goodsGroupIndex].MallGoodsList2.push(item);
						// _self.homeList = Object.assign({}, _self.homeList);
					}
				});
				_self.goodsGroupIndex++;
				// console.log(JSON.stringify(_self.homeList));
			}
		}, //methods
		beforeCreate: function() {
			_self = this; // 定义this指向本组件
			
		}, //beforeCreate
		created: function() {
			/**
			 * HTML5+API准备就绪
			 */
			mui.plusReady(function() {
				plus.screen.lockOrientation("portrait-primary"); //锁定屏幕方向

				var topoffset = '45px';
				var header = document.getElementById('header');
				if (plus.navigator.isImmersedStatusbar()) {
					// 兼容immersed状态栏模式 // 获取状态栏高度并根据业务需求处理，这里重新计算了子窗口的偏移位置 
					topoffset = (Math.round(plus.navigator.getStatusbarHeight()) + 45);
					header.style.height = topoffset + 'px';
					header.style.paddingTop = (topoffset - 45) + 'px';

					// 设置系统状态栏背景为蓝色
					// plus.navigator.setStatusBarBackground( "#007AFF" );
					// 设置系统状态栏样式为浅色文字
					// plus.navigator.setStatusBarStyle( "UIStatusBarStyleBlackOpaque" );
					// }
					// if(window.plus){
					// plusReady();
					// }else{
					// document.addEventListener("plusready",plusReady,false);
				}
				_self.GetMallGoodsList();
				// _self.$forceUpdate();
			});
			
			window.addEventListener('refrash_loginData', function(e) { //执行刷新
				_self.classIndex = 0;
				_self.goodsGroupIndex = 0;
				_self.homeList = [];
				_self.GetMallGoodsList();
			});
			
			_self.$nextTick(function() {
				//预加载详情页
				// webview_detail = mui.preload({
				// 	url: './shop_goods_detail.html',
				// 	id: 'shop_goods_detail',
				// 	styles: {
				// 		"render": "always",
				// 		"popGesture": "hide",
				// 		"bounce": "vertical",
				// 		"bounceBackground": "#efeff4"
				// 		// "titleNView": this.titleNView
				// 	}
				// });
				var search = document.getElementById("search-input");
				//监听input框键盘事件
				search.addEventListener("keypress", function(e) {
					//当e.keyCode的值为13 即，点击前往/搜索 按键时执行以下操作
					if (e.keyCode == 13) {
						e.preventDefault();
						document.activeElement.blur(); //隐藏软键盘  
						var t1 = window.setTimeout(function() {
							_self.gotoGoodsClass('', '', '');
						}.bind(_self), 500);
					}
				});
				var event_f = function(e) {
					e.preventDefault();
				}
				$(document).on('focusin', function() {
					//软键盘弹出的事件处理
					//当页面因为搜索框使页面窗口变小时动态的隐藏掉底部导航
					// alert("获取焦点");
				});
				$(document).on('focusout', function() {
					//软键盘收起的事件处理
					// alert("丢失焦点");
					//删除 禁止页面滚动
					document.body.removeEventListener('touchmove', event_f, {
						passive: false
					});
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
				pullRefresh: {
					// container: '.mui-content',
					container: '#content',
					down: {
						style: 'circle',
						offset: '10px',
						range: '64px',
						auto: false,
						callback: _self.pulldownRefresh //vue 用this.方法名 调用methods里定义的方法
					},
					up: {
						height: 50, //可选,默认50.触发下拉刷新拖动距离,
						auto: false, //可选,默认false.自动下拉刷新一次
						show: true, //显示底部上拉加载提示信息，可选；
						contentdown: '', //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
						contentover: '释放立即刷新', //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
						contentrefresh: '正在探索新数据....', //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
						contentnomore: '已经到底啦', //可选，请求完毕若没有更多数据时显示的提醒内容
						callback: _self.pullupLoading //vue 用this.方法名调用methods里定义的方法
					}
				}
			});
			
			/**
			 * 所有动态获取的控件初始化需在mui.ready(function(){});内执行
			 */
			mui.ready(function() { // console.log("执行顺序:5");
				// mui('#list').pullRefresh().pullupLoading();
				mui('.mui-bar-transparent').transparent();
				mui(".mui-slider").slider({
					interval: 4000, //自动轮播周期，若为0则不自动播放，默认为0；
					scrollTime: 500
				});
			});
			
			_self.$nextTick(function() {
				// setTimeout(function(){ 
				// _self.GetMallGoodsList(); 
				// alert("Hello"); }.bind(this), 3000);

				// if (mui.os.plus) {
				// 	mui.plusReady(function() {
				// 		setTimeout(function() {
				// 			_self.GetMallGoodsList();
				// 			mui('.mui-content').pullRefresh().pullupLoading();
				// 		}.bind(_self), 1000);
				// 	});
				// } else {
				// 	mui.ready(function() {
				// 		_self.GetMallGoodsList();
				// 		mui('.mui-content').pullRefresh().pullupLoading();
				// 	});
				// };
				// _self.$forceUpdate();
				// alert("this5:" + _self.a);
				// alert("homeList333" + JSON.stringify(this.homeList));
				// alert(JSON.stringify(plus.webview.currentWebview().getStyle()));
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
	.header-bar {
		background-color: rgba(230, 0, 18, 0);
	}

	.mui-scroll-wrapper {
		overflow: scroll;
	}
	.col-2{
		border-bottom: 1px solid #E4E4E4;
	}
	.col-3 a{
		border-bottom: 1px solid #E4E4E4;
	}
</style>
