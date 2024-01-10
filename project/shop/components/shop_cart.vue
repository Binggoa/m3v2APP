<template>
	<div id="shop_cart" v-clock>
		<template>
			<!--使用render函数与createElement函数创建外部文件链接DOM-->
			<remote-js src=""></remote-js>
			<remote-css href=""></remote-css>
		</template>
		<template style="margin: 0;">
			<header class="mui-bar mui-bar-nav bg-red noShadow" style="padding-right: 0px;position: fixed;">
				<a class="mui-pull-left text-white"></a>
				<h1 class="mui-title text-white">购物车</h1>
				<span v-if="isLogin==1 && isCartEmpty==false" class="mui-pull-right btn-option btn-edit" style="font-size: 15px;height: 100%;padding: 13px;">编辑</span>
			</header>
				<div class="notice-wrapper" v-if="isLogin==1 && userInfo.CustomerType!=6" style="position: fixed;margin-top: 34px;z-index: 100;width: 100%;">
					<div class="notice flexbox">
						<span class="icon-notice"></span>
						<marquee class="notice-text">
							<span>好消息！下订单只要使用微信和支付宝支付货款，订单经确认并全部发货后，可获得金额计奖励金{{userInfo.RewardAmountRate*100}}%。</span>
						</marquee>
					</div>
				</div>
				<div id="refreshContainer" class="mui-content" style="margin-top: 30px;">
					<div class="state-container" v-if="isLogin==0 && isCartEmpty!=false">
						<div class="state-icon state-cartempty"></div>
						<div class="state-title">
							购物车空空如也~
						</div>
						<div class="state-btns">
							<!-- <router-link v-bind:to="{name: 'shop_cart'}"><a v-on:tap="toShopping()" v-if="isLogin==1" type="button" class="mui-btn mui-btn-danger">去 逛 逛</a></router-link> -->
							<!-- <router-link v-bind:to="{name: 'shop_cart'}"><a v-on:tap="toShopping()" v-else="isLogin==0" type="button" class="mui-btn mui-btn-danger">去 登 录</a></router-link> -->
							<a v-on:tap="toShopping()" v-if="isLogin==1" type="button" class="mui-btn mui-btn-danger">去 逛 逛</a>
							<a v-on:tap="toShopping()" v-else type="button" class="mui-btn mui-btn-danger">去 登 录</a>
							<!-- <router-link v-bind:to="{name: 'user'}" type="button" class="mui-btn mui-btn-danger">user</router-link> -->
							<!-- <router-link v-bind:to="{name: 'index1'}" type="button" class="mui-btn mui-btn-danger">index1</router-link> -->
							<!-- <router-view></router-view> -->
							<!-- <router-view name="shop_cart"></router-view> -->
						</div>
						
					</div>
					<div class="goods" v-if="isCartEmpty==false">
						<!-- 普通商品 -->
						<div class="block-group">
							<ul class="mui-table-view">
								<li class="li_normal mui-table-view-cell mui-media" v-for="(Goods,index) in GoodsList">
									<div class="mui-checkbox mui-pull-left">
										<input class="checkbox" name="checkbox" type="checkbox" checked="checked" v-bind:value="Goods" v-model="check_goods">
									</div>
									<div class="classfy-item__img flexbox">
										<img class="mui-media-object mui-pull-left" v-lazy="Goods.DefaultPicURL" v-bind:key="Goods.DefaultPicURL">
									</div>
									<div class="mui-media-body classfy-item__body">
										<h2 class="mui-media-title">{{Goods.GoodsName}}</h2>
										<p class="mui-media-decr">
											型号: {{Goods.GoodsModel}}
											<span class="mui-pull-right">{{Goods.GoodsAttributesName}}: {{Goods.GoodsAttributesValueName}}</span>
										</p>
										<div style="margin-top: 10px;">
											<span class="price-now">￥{{(Goods.Price*1).toFixed(2)}} </span>
											<div class="mui-pull-right">
												<div class="mui-numbox" data-numbox-min='1'  data-numbox-step='1'>
													<button class="mui-btn mui-btn-numbox-minus" type="button" v-on:click="myMinusBtn(Goods,index)">-</button>
													<input class="mui-input-numbox updateNum" type="number" v-on:tap="tapNum(Goods)" readonly="readonly" v-on:input="watchNum(Goods)"
													 v-model="Goods.MinPCSAmount" />
													<button class="mui-btn mui-btn-numbox-plus" type="button" v-on:click="myPlusBtn(Goods,index)">+</button>
												</div>
												PCS
											</div>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
				
				<div v-if="isLogin==1 && isCartEmpty==false" class="mui-bar mui-bar-tab noShadow mui-bar-cartsum" style="bottom: 0;">
					<div class="bar-tab-sum" style="background-color: #FAFAFA;">
						<div class="mui-checkbox mui-pull-left">
							<label>
								<input class="checkAll" name="checkAll" type="checkbox" v-on:click="check_all()" v-bind:disabled="allCount <= 0"
								 v-bind:checked="total_num == allCount && allCount!=0">
								全选
							</label>
						</div>
						<div class="cartsum__body">
							合计：<strong class="text-red"><span style="font-size: 14px;">￥</span>
								{{total_price}}
							</strong>
							<button v-on:tap="submit()" class="mui-btn-danger mui-pull-right" style="padding-top: 8px; opacity: 0.8;"  v-bind:disabled="total_num <= 0">去结算 ({{total_num}}) </button>
						</div>
						<button v-on:tap="deleteCart()" class="mui-btn-danger mui-btn-outlined mui-pull-right btn-remove mui-hidden" style="font-size: 12px;margin-top: 10px;height: 30px;width: 70px;">删除</button>
					</div>
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
		name: 'shop_cart',
		template: '#shop_cart',
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
				GoodsList: [],	//商品列表
				check_goods: [], //已选择的普通商品
				isCartEmpty: true, //购物车是否为空
				allCount: 0, //有效商品总数
				isDelete: false, //是否删除
				isLogin: 0, //是否已登录
				userInfo: null //用户信息 StorageAPI.getUser()
			} //retrun
		}, //data
		computed: { //计算属性
			//多对一或一对一，支持缓存，不支持异步，只有依赖数据发生改变，才会重新进行计算
			// fname: function() {return null;}
			total_num: function() {
				//删除状态下
				var t_num = 0;
				if (_self.isDelete) {
					t_num = _self.check_goods.length;
				} else {
					t_num = _self.check_goods.length;
				}
				return t_num;
			},
			total_price: function() {
				var t_price = 0;
				mui.each(_self.check_goods, function(index, item) {
					t_price += Number(item.Price) * item.MinPCSAmount;
				})
				return t_price.toFixed(2);
			}
		}, //computed
		watch: {
			
		}, //watch
		filters: { //自定义过滤函数

		}, //filters
		methods: {
			aaa: function() {
				alert(_self.allCount);
			},
			/**
			 * 下拉加载
			 */
			pulldownRefresh: function() {
				_self.$options.methods.GetShoppingCartList();
			},
			/**
			 * 获取购物车数据
			 */
			GetShoppingCartList: function() {
				// mui.plusReady(function(){
					// var userInfo = _eventHub.$options.methods.StorageAPI_getUser();
					// _self.$store.dispatch('test2/updateLoginState');
					var userInfo = _self.$store.state.test2.userInfo;
					if (userInfo == null) {
						console.log('null');
						for(var i = mui.hooks.inits.length-1,item;i>=0;i--){
						item=mui.hooks.inits[i];
						if(item.name=="pullRefresh"){
						item.repeat=true;
						}
						}
						
						setTimeout(function() {mui('#refreshContainer').pullRefresh().endPulldownToRefresh();}, 500);
						mui(".mui-numbox").numbox(); //初始化数字数字选择框；getValue()//获取当前值；setValue(Value)//动态设置新值 Int；setOption(options)//更新选项,可取值: min(Int),step(Int),max(Int),如setOption("step",5)
						_self.GoodsList = [];
						_self.check_goods = [];
						_self.isCartEmpty = true;
						_self.allCount = 0;
						_self.isLogin = 0;
						return false;
					}else{
						console.log("user:" + JSON.stringify(userInfo));
						_self.userInfo = userInfo;
						_self.isLogin = 1;
						
						var files = ['../assets/data/json/cartModel.json'],
							cartListByCache = "";
						$.getJSON(files[0], function(carlMdata) {
							for(var i = mui.hooks.inits.length-1,item;i>=0;i--){
							item=mui.hooks.inits[i];
							if(item.name=="pullrefresh"){
							item.repeat=true;
							}
							}
							setTimeout(function() {mui('#refreshContainer').pullRefresh().endPulldownToRefresh();}, 500);
							cartListByCache = carlMdata;
							var t0 = window.setTimeout(function() {
								_self.check_goods = [];
								_self.GoodsList = cartListByCache.GoodsList.slice();
								console.log(cartListByCache.GoodsList.length)
								if (cartListByCache.GoodsList.length == 0) {
									_self.isCartEmpty = true;
								} else {
									_self.isCartEmpty = false;
								}
								_self.allCount = _self.GoodsList.length;
							
								if (_self.allCount == 0) {
									$(".btn-edit").hide();
								} else {
									$(".btn-edit").show();
								}
							
								// setTimeout(function() {mui('#refreshContainer').pullRefresh().endPulldownToRefresh();}, 500);
								
							}.bind(_self), 1000);
						});
					}
					_self.$forceUpdate();
				// });
			},
			/**
			 * 删除商品
			 */
			deleteCart: function() {
				if (_self.total_num <= 0) {
					mui.toast("请选择商品");
					return false;
				}
				var btnArray = ['否', '是'];
				mui.confirm('确定删除该商品吗？', '', btnArray, function(e) {
					if (e.index == 1) {
						mui.each(_self.check_goods, function(index, item) {
							_self.GoodsList.splice(_self.GoodsList.indexOf(item), 1)
						})
						if (_self.GoodsList.length == 0) {
							_self.isCartEmpty = true;
						}
						mui.toast("删除成功");
					}
				})
			},
			/**
			 * 全选
			 */
			check_all: function() {
				//删除状态下 全部选中
				if (_self.isDelete) {
					if (_self.total_num != _self.allCount) {
						_self.check_goods = [];
						mui.each(_self.GoodsList, function(index, item) {
							_self.check_goods.push(item);
						})
					} else {
						_self.check_goods = [];
					}
				} else {
					// 全选
					if (_self.total_num != _self.allCount) {
						_self.check_goods = [];
						mui.each(_self.GoodsList, function(index, item) {
							_self.check_goods.push(item);
						})
					} else {
						_self.check_goods = [];
					}
				}

			},
			/**
			 * 提交
			 */
			submit: function() {
				UIAPI.openWindow("shop_settlement.html", "shop_settlement.html", {});
			},
			/**
			 * 修改商品购买数量
			 * @param {Object} Goods
			 */
			tapNum: function(Goods) {
				if (mui.os.ios) {
					
				} else {
					var num = Goods.MinPCSAmount;
					var html =
						'<div class="mui-numbox" style="width: 150px;height: 30px !important; margin: 10px;" data-numbox-min="1">' +
						'<button class="mui-btn mui-btn-numbox-minus" style="width: 25% !important;" type="button">-</button>' +
						'<input class="mui-input-numbox updateNum" style="width: 80% !important;"  type="number" />' +
						'<button class="mui-btn mui-btn-numbox-plus" style="width: 25% !important;" type="button">+</button>' +
						'</div>';
					var btnArray = ['取消', '确定'];
					mui.confirm(html, '修改购买数量', btnArray,
						function(e) {
							document.activeElement.blur(); //隐藏软键盘  
							if (e.index == 1) { // 按钮点击:0为取消,1为确定
								Goods.MinPCSAmount = $('.updateNum').val();
							}
						}, "div");

					// mui('.mui-numbox').numbox();
					var t0 = window.setTimeout(function() {
						$('.updateNum').val(parseInt(num)).focus();
					}.bind(_self), 100);
				}
			},
			/**
			 * 查询商品
			 */
			toShopping: function() {
				// var userInfo = _eventHub.$options.methods.StorageAPI_getUser();
				_self.$store.dispatch('test2/updateLoginState');
				var userInfo = _self.$store.state.test2.userInfo;
				// _self.$router.push('shop_cart');
				if (userInfo == null) {
					// UIAPI.goLogin("shop_login.html", "shop_home.html", "shop_home.html", null)
					UIAPI.openWindow("./shop_login.html", "shop_login.html", {})
					return false;
				}else{UIAPI.openWindow("./public/search/shop_search.html", "shop_search.html", {})}
				
			},
			/**
			 * 减号：商品数量减少
			 * @param {Object} Goods
			 * @param {Object} index
			 */
			myMinusBtn: function(Goods,index){
				if(Goods.MinPCSAmount > 1){
					Goods.MinPCSAmount --;
				}
			},
			/**
			 * 加号：商品数量增加
			 * @param {Object} Goods
			 * @param {Object} index
			 */
			myPlusBtn: function(Goods,index){
				if(Goods.MinPCSAmount >= 1){
					Goods.MinPCSAmount ++;
				}
			},
		}, //methods
		beforeCreate: function() { // console.log("执行顺序:1");
			_self = this;
			_self.$nextTick(function() { // console.log("执行顺序:6");
				
			});
		}, //beforeCreate
		created: function() { // console.log("执行顺序:2");
			// _self.userInfo = _eventHub.$options.methods.StorageAPI_getUser();
			_self.$store.dispatch('test2/updateLoginState');
			/**
			 * HTML5+API准备就绪
			 */
			mui.plusReady(function() { // console.log("执行顺序:10");
				_self.$options.methods.GetShoppingCartList();
				
			});
			
			_self.$nextTick(function() { // console.log("执行顺序:7");
				//监听事件
				window.addEventListener('refrash_loginData', function(e) { //执行刷新
					console.log("shop_cart收到!");
					_self.$store.dispatch('test2/updateLoginState');
					_self.$options.methods.pulldownRefresh();
				});
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
				pullRefresh: {
					container: '#refreshContainer',
					down: {
						style: 'circle',
						offset: '10px',
						range: '64px',
						auto: false,
						callback: _self.pulldownRefresh
					}
				}
			});
			
			/**
			 * // 所有动态获取的控件初始化需在mui.ready(function(){});内执行
			 */
			
			mui.ready(function(){ // console.log("执行顺序:5");
				mui(".mui-numbox").numbox(); // 初始化数字输入框控件
				//数量的变化
				mui("body").on('change',".mui-input-numbox",function(){
				});
				//多选框的改变事件
				mui('body').on('change', '[name=checkbox]', function() {
				});
				
			});
			
			_self.$nextTick(function() { // console.log("执行顺序:9");
				// alert(JSON.parse(window.localStorage.getItem("user-test")));
			});
		}, //mounted
		beforeUpdate: function() { // console.log("执行顺序:11、15");
			// 编辑事件
			var _btnEdit = document.querySelector(".btn-edit");
			// TypeError: Cannot read property 'addEventListener' of null(DOM加载失败,document.querySelector为空,报错)
			if(_btnEdit){ //编辑按钮在登录后才生成
				_btnEdit.addEventListener("tap", function() {
					if (_self.allCount > 0) {
				
						if (!$(this).hasClass('btn-complete')) {
							$(this).addClass('btn-complete').html('完成');
							$(".cartsum__body").addClass("mui-hidden");
							$(".btn-remove").removeClass("mui-hidden");
							_self.isDelete = true;
							_self.allCount = _self.GoodsList.length;
						} else {
							$(this).removeClass('btn-complete').html('编辑');
							$(".cartsum__body").removeClass("mui-hidden");
							$(".btn-remove").addClass("mui-hidden");
							_self.isDelete = false;
							_self.allCount = _self.GoodsList.length;
						}
					}
					if ($('.block-group').not('.disabled').length === 0) {
						$('.btn-remove').attr('disabled', 'disabled')
					}
				}, false);
			}
			_self.$nextTick(function() {
				// console.log("执行顺序:13、17");
				
				
			});
			// alert('Before Update');
		}, //beforeUpdate
		updated: function() { // console.log("执行顺序:12、16");
			//当使用下拉刷新控件的时候，更改登录状态后vue重新加载当前页面，因为mounted只执行一次，MUI不会重新实例化，需手动
			mui.init({
				pullRefresh: {
					container: '#refreshContainer',
					down: {
						style: 'circle',
						offset: '10px',
						range: '64px',
						auto: false,
						callback: _self.pulldownRefresh
					}
				}
			});
			_self.$nextTick(function() {
				// console.log("执行顺序:14、18");
				
			});
			// alert('Updated');
			// 由于此处num_box是通过请求获得的数据，在由过得数据通过v-for渲染出多个的num_box，那么问题就出在这里了，我们数据的请求是通过异步获取的那么可能我们的页面已经渲染好了（也就是mounted钩子函数已经执行完了），数据还没有请求到，故在mounted的初始化就等于没有任何效果。
			// 所以解决办法：
			// 就是需要在异步数据请求完成后渲染好最后页面的后执行初始化才有效果，可以用setTimeout延时执行初始化，当然这样做不太切合实际，后来就想到了使用updated钩子函数（当然我这里异步请求来的数据是放在实例的）
			// mui(".mui-numbox").numbox(); // 初始化数字数字选择框；getValue()//获取当前值；setValue(Value)//动态设置新值 Int；setOption(options)//更新选项,可取值: min(Int),step(Int),max(Int),如setOption("step",5)
			// 在这初始化mui-numbox会出现mui-numbox最小值由1变为2
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

	.classfy-item__body {
		min-height: 100px;
		height: auto;
	}

	.mui-media-title {
		font-size: 14px;
		line-height: 20px;
		padding-right: 0px;
		word-break: normal;
		width: auto;
		display: block;
		white-space: pre-wrap;
		word-wrap: break-word;
		overflow: hidden;
	}

	.mui-media-decr {
		font-size: 13px;
	}

	.price-origin {
		color: #757575;
		font-size: 12px;
		margin-right: 10px;
	}

	.pcs-num {
		color: #757575;
		font-size: 13px;
	}

	.mui-numbox {
		width: 100px;
		height: 26px !important;
		border: solid 1px #E4E4E4 !important;
		padding: 0px !important;
		margin-left: 0px;
	}

	.mui-popup-button {
		font-size: 13px;
		line-height: 36px;
		height: 36px;
	}

	.mui-popup {
		margin: 10px;
		top: 45%;
		left: 50%;
		width: 250px;
	}

	.mui-popup-inner {
		position: relative;
		padding: 10px;
		border-radius: 13px 13px 0 0;
		background: rgba(255, 255, 255, .95)
	}

	.mui-popup-title {
		font-size: 14px;
	}

	.mui-bar-cartsum .mui-btn-danger {
		padding: 6px 12px !important;
	}
	.li_normal{  
	    border-bottom: 1px solid #E4E4E4;
	}
</style>
