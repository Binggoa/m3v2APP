<template>
	<div id="shop_search" v-clock>
		<template>
			<!--使用render函数与createElement函数创建外部文件链接DOM-->
			<remote-js src=""></remote-js>
			<remote-css href=""></remote-css>
		</template>
		<template>
			<!-- 主页面部分 -->
			<header class="mui-bar mui-bar-nav bg-red noShadow header-boxz">
				<div class="topbar">
					<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left text-white"></a>
					<div class="header-search">
						<form action="" method="get">
							<input id="search-input" type="search" v-on:tap="onInput" placeholder="点击搜索名称,  产品型号">
							<button class="btn-search" type="button">
								<span class="iconfont icon-m-ah"></span>
							</button>
						</form>
					</div>
				</div>
			</header>
			<div class="classfy beforeline flexbox" style="position: fixed;background-color: #F4F4F4;">
				<div class="classfy-item classfy-sort">
					销量
					<svg class="svg-icon" aria-hidden="true">
						<use xlink:href="#icon-m-av"></use>
					</svg>
				</div>
				<div class="classfy-item classfy-sort">
					上市
					<svg class="svg-icon" aria-hidden="true">
						<use xlink:href="#icon-m-av"></use>
					</svg>
				</div>
				<div class="classfy-item classfy-sort">
					价格
					<svg class="svg-icon" aria-hidden="true">
						<use xlink:href="#icon-m-av"></use>
					</svg>
				</div>
				<div class="classfy-item" id="show-btn">
					<a id="offCanvasBtn">筛选 <span class="mui-icon iconfont icon-m-af"></span></a>
				</div>
			</div>

			<div class="mui-content pdb-0">
				<ul class="mui-table-view">
					<li class="mui-table-view-cell mui-media" v-for="(item,index) in MallGoodsList">
						<a href="javascript:;" v-on:tap="gotoGoodsDetail(item.GoodsID)">
							<!-- 清仓 -->
							<div :class="classObject(index)" class="classfy-item__img icon-tag flexbox">
								<img class="mui-media-object mui-pull-left" v-lazy="item.DefaultPicURL">
							</div>
							<div class="mui-media-body classfy-item__body" style="min-height: 100px;height:auto;">
								<h2 class="mui-media-title" style="padding-right: 0px;word-wrap:break-word;overflow: hidden;line-height: 22px;font-size: 14px;">
									{{item.GoodsName}}
								</h2>
								<p class="mui-media-decr" style="font-size: 13px;">型号：{{item.GoodsModel}}</p>
								<p class="mui-media-price">
									<span class="price-now"><span style="font-size: 15px;">￥</span>{{item.NoInvoicePrice}}</span>
									<s class="price-origin">￥{{item.OldNoInvoicePrice}}</s>
								</p>
							</div>
						</a>
					</li>
				</ul>
				<div class="underline">------------ 已经没有更多了 ------------</div>
			</div>
		</template>
	</div>
</template>

<script>
	var _self = {};
	Vue.use(VueLazyload, {
		preLoad: 1.3,
		error: '../../../assets/images/img/goods-default.gif',
		loading: '../../../assets/images/img/goods-default.gif',
		attempt: 1
	});
	module.exports = {
		name: 'shop_search',
		template: '#shop_search',
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
				showMenu: false,
				main: mui.createMask(_self.$options.methods._closeMenu()),
				menu: mui.createMask(_self.$options.methods._closeMenu()),
				mask: mui.createMask(_self.$options.methods._closeMenu()),
				pageIndex: 0,
				pageSize: 10,
				MallGoodsList: []
			} //retrun
		}, //data
		computed: { //计算属性
			//多对一或一对一，支持缓存，不支持异步，只有依赖数据发生改变，才会重新进行计算
			// fname: function() {return null;}
			classObject: function(index) {
				return function(index) {
					if (_self.MallGoodsList[index].IsPromotion == 1) { //促销
						return "icon-tag-cuxiao";
					} else if (_self.MallGoodsList[index].IsUnmarketable == 1) { //清仓
						return "icon-tag-qingcang";
					} else if (_self.MallGoodsList[index].IsHot == 1) { //热销
						return "icon-tag-hot";
					} else if (_self.MallGoodsList[index].IsNew == 1) { //新品
						return "icon-tag-new";
					} else {
						return "";
					}
				}
			} // end
		}, //computed
		watch: {
			
		}, //watch
		filters: { //自定义过滤函数

		}, //filters
		methods: {
			/**
			 * 重构后退方法
			 */
			back: function() {
				if (_self.showMenu) {
					//菜单处于显示状态，返回键应该先关闭菜单,阻止主窗口执行mui.back逻辑；
					_self.$options.methods.closeMenu();
					return false;
				} else {
					//菜单处于隐藏状态，执行返回时，要先close菜单页面，然后继续执行mui.back逻辑关闭主窗口；
					_self.menu.close('none');
					return true;
				}
			}, // end
			/**
			 * 下拉刷新
			 */
			pulldownRefresh: function() {
				// mui('.mui-content').pullRefresh().refresh(true); // 重置开启上拉加载
				// mui('.mui-content').pullRefresh().enablePullupToRefresh(); // 启用上拉加载
				_self.pageIndex = 0;
				$(".underline").css('display', 'none');
				if (mui('.mui-content').pullRefresh()) {
					mui('.mui-content').pullRefresh().enablePullupToRefresh();
				}
				var files = ['../../../assets/data/json/searchModel.json'],
					goodsListByCache = "";
				$.getJSON(files[0], function(seMdata){
					goodsListByCache = seMdata;
				});
				var t0 = window.setTimeout(function() {
					_self.MallGoodsList = goodsListByCache[_self.pageIndex];
					if (mui('.mui-content').pullRefresh()) {
						mui(".mui-content").pullRefresh().endPulldownToRefresh();
					}
					_self.pageIndex++;
				}.bind(_self), 500);
			}, // end
			/**
			 * 上拉加载更多
			 */
			pullupLoading: function() {
				var files = ['../../../assets/data/json/searchModel.json'],
					goodsListByCache = "";
				$.getJSON(files[0], function(seMdata){
					goodsListByCache = seMdata;
				});
				if (_self.pageIndex === goodsListByCache.length) {
					return false;
				}
				var t0 = window.setTimeout(function() {
					//模拟加载数据
					var list = goodsListByCache[_self.pageIndex];
					if (list.length < _self.pageSize) {
						$(".underline").css('display', 'block');
						// mui('.mui-content').pullRefresh().disablePullupToRefresh(); //会导致下拉刷新后上拉无效且无法重置上拉加载
						mui('.mui-content').pullRefresh().endPullupToRefresh(true); // 加载数据没有更多内容时传入true，默认false
						var t1 = window.setTimeout(function(){  
						    mui('.mui-content').pullRefresh().disablePullupToRefresh();  // 禁用上拉刷新
						    // var t2 = window.setTimeout(function(){  
						    //     mui('.mui-content').pullRefresh().enablePullupToRefresh();  // 启用上拉加载
						    // }.bind(_self), 1000); // 等待1s执行：恢复下拉加载更多功能（可根据需要，不恢复）  
						}.bind(_self), 2000); // 显示“没有更多了”2s后执行：关闭向下加载更多功能（直接隐藏了“没有更多”）
						return false;
					} else {
						$(".underline").css('display', 'none');
					}
					_self.MallGoodsList = _self.MallGoodsList.concat(list);
					mui('.mui-content').pullRefresh().endPullupToRefresh();
					_self.pageIndex++;
				}.bind(_self), 500);
			}, // end
			/**
			 * 关键字搜索
			 */
			searchKey: function() {
				_self.$options.methods.filterGoods();
			}, // end
			/**
			 * 商品详情
			 * @param {Object} goodsId
			 */
			gotoGoodsDetail: function(goodsId) {
				UIAPI.openGoodsDetail("./shop_goods_detail.html", goodsId);
			}, // end
			/**
			 * 点击输入框
			 */
			onInput: function() {
				if (mui.os.ios) {
					//禁止页面滚动
					scrollTo(0, 0);
					document.body.addEventListener('touchmove', event_f, {
						passive: false
					});
				}
				$("#search-input").focus();
			}, // end
			/**
			 * 筛选商品
			 */
			filterGoods: function() {
				//模拟 
				UIAPI.showWaiting()
				var t0 = window.setTimeout(function() {
					UIAPI.closeWaiting();
				}.bind(_self), 1000);
			}, // end
			/*
			 * 显示菜单菜单
			 */
			openMenu: function() {
				if (!_self.showMenu) {
					//解决android 4.4以下版本webview移动时，导致fixed定位元素错乱的bug;
					if (mui.os.android && parseFloat(mui.os.version) < 4.4) {
						document.querySelector("header.mui-bar").style.position = "static";
						//同时需要修改以下.mui-contnt的padding-top，否则会多出空白；
						document.querySelector(".mui-bar-nav~.mui-content").style.paddingTop = "0px";
					}
					//侧滑菜单处于隐藏状态，则立即显示出来；
					//显示完毕后，根据不同动画效果移动窗体；
					_self.menu.show('none', 0, function() {
						_self.menu.setStyle({
							left: '20%',
							transition: {
								duration: 150
							}
						});
					});
					//显示主窗体遮罩
					_self.mask.show();
					_self.showMenu = true;
				}
			}, // end
			/**
			 * 关闭菜单
			 * @param {Object} e
			 */
			closeMenu: function(e) {
				//窗体移动
				_self.$options.methods._closeMenu(e);
				//关闭遮罩
				_self.mask.close();
			}, // end
			/**
			 * 关闭侧滑菜单(业务部分)
			 */
			_closeMenu: function(e) {
				if (_self.showMenu) {
					//解决android 4.4以下版本webview移动时，导致fixed定位元素错乱的bug;
					if (mui.os.android && parseFloat(mui.os.version) < 4.4) {
						document.querySelector("header.mui-bar").style.position = "fixed";
						//同时需要修改以下.mui-contnt的padding-top，否则会多出空白；
						document.querySelector(".mui-bar-nav~.mui-content").style.paddingTop = "44px";
					}
					//主窗体开始侧滑；
					_self.menu.setStyle({
						left: '100%',
						transition: {
							duration: 150
						}
					});
					//等窗体动画结束后，隐藏菜单webview，节省资源；
					var t0 = window.setTimeout(function() {
						_self.menu.hide();
					}.bind(_self), 300);
					_self.showMenu = false;
					//接受选择参数
					if (e && e.detail) {
						//价格、品牌、类型、分类
						console.log(JSON.stringify(e.detail));
						//筛选
						_self.$options.methods.filterGoods();
					}
				}
			}, // end
			/**
			 * 识别苹果X
			 */
			isIPhoneX: function() {
				if (plus.device.model.indexOf('iPhone') > -1 && screen.height >= 812) {
					return true;
				} else {
					return false;
				}
			},
			IPhoneXCSS: function() {
				if (plus.navigator.isImmersedStatusbar() && _self.$options.methods.isIPhoneX()) {
					//.mui-bar-nav
					var nav = document.querySelector(".header-boxz");
					if (nav) {
						nav.style.cssText = "height:88px; padding-top: 44px;";
					} else {
						return;
					}
					//.mui-bar-nav ~ .classfy
					var classfy = document.querySelector(".classfy");
					if (classfy) {
						// classfy.style.top = "88px";
						classfy.style.cssText = "top:88px;height: 46px;";
					} else {
						return;
					}
					//.mui-bar-nav ~ .mui-content
					var content = document.querySelector(".mui-content");
					if (content) {
						content.style.paddingTop = "134px";
					} else {
						return;
					}
				}
			} // end
		}, //methods
		beforeCreate: function() {
			_self = this;
		}, //beforeCreate
		created: function() {
			/**
			 * HTML5+API准备就绪
			 */
			mui.plusReady(function() {
				var isIPhoneX = _self.isIPhoneX();
				if (isIPhoneX) {
					_self.IPhoneXCSS();
				} else {
					// 66px=44+22:   (标题栏高度+状态栏高度)
					$(".classfy").css("top", "64px");
					$(".classfy").css("height", "46px");
					// 112 = 44+46+22  (标题栏高度+标题栏下方的tab高度+状态栏高度)
					$(".mui-content").css("padding-top", "112px !important");
				}
				if (mui.os.android) {
					var height = (plus.display.resolutionHeight + 0.5) + "px";
					plus.webview.currentWebview().setStyle({
						height: height
					});
				}

				//plusReady事件后，自动创建menu窗口；
				_self.main = plus.webview.currentWebview();
				//setTimeout的目的是等待窗体动画结束后，再执行create webview操作，避免资源竞争，导致窗口动画不流畅；
				var t0 = setTimeout(function() {
					_self.menu = mui.preload({
						url: '../../shop_class_menu.html',
						id: 'shop_class-menu',
						styles: {
							left: "20%",
							width: '80%',
							zindex: 10000
						}
					});
				}.bind(_self), 500);
				//加载数据
				_self.pulldownRefresh();
			});
			
			_self.$nextTick(function() {});
		}, //created
		beforeMount: function() {
			
		}, //beforeMount
		mounted: function() {
			/**
			 * MUI框架初始化
			 */
			mui.init({
				swipeBack: false,
				beforeback: _self.back,
				pullRefresh: {
					container: '.mui-content',
					down: {
						style: 'circle',
						offset: '10px',
						range: '64px',
						auto: false,
						callback: _self.pulldownRefresh
					},
					up: {
						auto: false, //可选,默认false.自动上拉加载一次
						contentdown: '', //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
						contentover: '释放立即刷新', //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
						contentrefresh: '正在探索新数据....', //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
						contentnomore: '已经到底啦', //可选，请求完毕若没有更多数据时显示的提醒内容
						callback: _self.pullupLoading
					}
				}
			});
			
			/**
			 * 所有动态获取的控件初始化需在mui.ready(function(){});内执行
			 */
			mui.ready(function() {
				var event_f = function(e) {
					e.preventDefault();
				}
				mui(document.body).off("focusin"); // 绑定前先注销事件，防止多次注册on事件
				$(document).on('focusin', function() {
					//软键盘弹出的事件处理
				});
				mui(document.body).off("focusin"); // 绑定前先注销事件，防止多次注册on事件
				$(document).on('focusout', function() {
					//软键盘收起的事件处理
					//删除 禁止页面滚动
					document.body.removeEventListener('touchmove', event_f, {
						passive: false
					});
				});
				document.getElementById("show-btn").addEventListener('tap', _self.openMenu);
				//关闭菜单；
				window.addEventListener("menu:swiperight", _self.closeMenu);
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
	.mui-content{
		margin-top: 44px;
	}
</style>
