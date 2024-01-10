<template>
	<div id="shop_goods_detail" v-clock>
		<template>
			<!--使用render函数与createElement函数创建外部文件链接DOM-->
			<remote-js src=""></remote-js>
			<remote-css href=""></remote-css>
		</template>
		<template>
			<div class="mui-content pdb-50" style="padding-top: 25px;background-color: white;">
				<!--轮播图片-->
				<div id="slider" class="mui-slider">
					<div class="mui-slider-group mui-slider-group">
						<div class="mui-slider-item" v-for="(goodsPic,index) in GetGoodsPicURL">
							<div style="height: 350px;display: flex;justify-content: center; align-items: center; ">
								<img v-lazy="goodsPic.PicURL" v-bind:key="goodsPic.PicURL" data-preview-src="" data-preview-group="1">
							</div>
						</div>
						<div class="mui-slider-item" v-if="GetGoodsPicURL.length==0">
							<div style="height: 350px;display: flex;justify-content: center; align-items: center; ">
								<img src="../assets/images/img/goods-default.gif">
							</div>
						</div>
					</div>
					<div class="mui-slider-indicator">
						<div class="mui-indicator" v-bind:class="{'mui-active':index==0}" v-for="(goodsPic,index) in GetGoodsPicURL"></div>
					</div>
				</div>
			
				<div class="goods">
					<div class="block-group">
						<div class="block-row block-price" style="height: 40px;">
							<span id="totalGoodsPrice">
								￥12.90
							</span>
							<span id="unitPrice" style="color: #000; font-size: .2rem;font-weight: normal;margin-left: 15px;">
								单品价：￥0.65
							</span>
							<s class="price-origin" style="color: #000; font-size: .2rem;font-weight: normal;margin-left: 15px;">
								原价： ￥1.20
							</s>
							<span class="tag" style="padding-top:2px">{{Goods.GoodsTag}}</span>
						</div>
						<h1 class="block-row block-title" style="line-height:2;">
							{{Goods.GoodsName}}{{Goods.GoodsName}}
						</h1>
						<!-- 1:折扣促销  2:满量  3：满额  4：坎级 -->
						<div class="block-row block-mane">
							<span class="tag">满减</span>
							<span class="confirmOrder-reduction mg-r-2">
								{{Goods.ReductionStr}}
							</span>
						</div>
						<div class="block-row block-attr mui-clearfix">
							<label class="block-attr__title">属&nbsp;&nbsp;&nbsp;&nbsp;性</label>
							<div class="block-attr__body" id="goodsSkuUl">
								<template v-for="(sku,index) in GoodsSkuList">
									<span v-bind:data-index="index" class="inline-attr__val" v-bind:class="{'active':index==0}">{{sku.GoodsAttributesValueName}}</span>
								</template>
							</div>
						</div>
						<div class="block-row block-attr mui-clearfix">
							<label class="block-attr__title">包&nbsp;&nbsp;&nbsp;&nbsp;装</label>
							<div class="block-attr__body" id="goodsTemplate">
								<template v-for="(temp,index) in GoodsUnitTemplateList">
									<span v-bind:data-index="index" class="inline-pack__val" v-bind:class="{'active':index==0}">{{temp.UnitTemplateDes}}</span>
								</template>
							</div>
						</div>
						<div class="block-row block-attr mui-clearfix">
							<label class="block-attr__title pdtb-10">购买数量</label>
							<div class="block-attr__body">
								<div class="mui-numbox" data-numbox-min='1'>
									<button class="mui-btn mui-btn-numbox-minus" type="button">-</button>
									<input class="mui-input-numbox" v-model="inputNum" type="number" />
									<button class="mui-btn mui-btn-numbox-plus" type="button">+</button>
								</div>
							</div>
						</div>
					</div>
			
					<div class="block-group">
						<div class="block-row block-attr mui-clearfix">
							<label class="block-attr__title">商品卖点</label>
							<div class="block-attr__body">
								{{Goods.GoodsSalePoint}}
							</div>
						</div>
						<div class="block-row block-attr mui-clearfix">
							<label class="block-attr__title">产品型号</label>
							<div class="block-attr__body">
								{{Goods.GoodsModel}}
							</div>
						</div>
						<div class="block-row block-attr mui-clearfix">
							<label class="block-attr__title">产品规格</label>
							<div class="block-attr__body">
								{{Goods.GoodsUnitTemplateDes}}
							</div>
						</div>
						<div class="block-row block-attr mui-clearfix">
							<label class="block-attr__title">适用人群</label>
							<div class="block-attr__body">
								学生
							</div>
						</div>
					</div>
			
					<div class="goods-detail">
						<div class="goods-detail__title">
							商品详情
						</div>
						<div class="goods-detail__body" v-html="Goods.GoodsDesc">
							{{Goods.GoodsDesc}}
						</div>
					</div>
				</div>
			
			</div>
			
			<nav class="mui-bar mui-bar-tab table-layout-auto">
				<a class="mui-tab-item ft-tab-item" data-index="0">
					<span class=" mui-icon iconfont icon-m-ao"></span>
					<span class="mui-tab-label">首页</span>
				</a>
				<a class="mui-tab-item ft-tab-item" data-index="2">
					<!--经沟通原型设计只设计一个即可，开发做公用组件-->
					<span v-if="cartNum>0" class="goods-corner-marker" style="
							width: 15px;
							height: 15px;
							line-height: 17px;
							background: red;
							color: #fff;
							font-size: 10px;
							position: absolute;
							margin-left: 14px;
							border-radius: 50%;
							z-index: 100000;">
						<span class="goods-num">{{cartNum}}</span>
					</span>
					<span class="mui-icon iconfont icon-m-ak"></span>
					<span class="mui-tab-label">购物车</span>
				</a>
				<a class="mui-tab-item ft-tab-item" data-index="3">
					<span class="mui-icon iconfont icon-m-am"></span>
					<span class="mui-tab-label">收藏</span>
				</a>
				<a class="mui-tab-item-nolink" data-index="4">
					<button class="mui-btn-danger">加入购物车</button>
				</a>
				<a class="mui-tab-item-nolink" data-index="5">
					<button class="mui-btn-danger">立即购买</button>
				</a>
			</nav>
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
		name: 'shop_goods_detail',
		template: '#shop_goods_detail',
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
				Goods: {},
				GoodsSkuList: [],
				GetGoodsPicURL: [],
				GoodsUnitTemplateList: [],
				selectSku: {}, //选中属性对象的商品sku
				selectUnitTemplate: {}, //选中包装规格
				inputNum: 1,
				cartNum: 6,
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
			showWindow: function() {
				var currentView = plus.webview.currentWebview();
				currentView.show('slide-in-right', 300);
				plus.nativeUI.closeWaiting();
			},
			toShopping: function(PromotionID) {
				var extras = {
					GoodsClassID: "",
					type: "Ip",
					keyWords: "",
					PmID: PromotionID,
				}
				UIAPI.openWindow("./second-classfy.html", "second-classfy.html", extras)
			},
			/**
			 * 商品详情数据
			 */
			getGoodsDetail: function() {
				var files = ['../assets/data/json/goodsDetailModel.json'],
					goodsDetailModleByCache = "";
				// $.getJSON(files[0], function(gdMdata){
				// 	goodsDetailModleByCache = gdMdata;
				// 	alert("111"+JSON.stringify(goodsDetailModleByCache));
				// });
				$.ajax({
					url: files[0],
					type: 'GET',
					contentType: "application/json; charset=utf-8",
					dataType: 'json',
					cache: false,
					async: false,
					success: function(gdMdata) {
						goodsDetailModleByCache = gdMdata;
						// alert("111"+JSON.stringify(goodsDetailModleByCache));
						// _self.$forceUpdate();
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						// alert(JSON.stringify(XMLHttpRequest));alert(XMLHttpRequest.status);alert(XMLHttpRequest.readyState);alert(textStatus);
						
					}
				});
				
				var wc = plus.webview.currentWebview();
				var goodsId = wc.goodsId;
				
				var t1 = window.setTimeout(function() {
					var data = goodsDetailModleByCache;
					// alert("222"+JSON.stringify(data));
					//描述图片信息
					// var ggd = "%3Cp%3E%3Cimg%20src%3D%22http%3A%2F%2F%7BIMGIP%7D%2Fupload%2Fgoods%2F201906161027479513.jpg%22%20title%3D%22G-3126%E8%AF%A6%E6%83%85_03.jpg%22%2F%3E%3C%2Fp%3E%3Cp%3E%3Cimg%20src%3D%22http%3A%2F%2F%7BIMGIP%7D%2Fupload%2Fgoods%2F201906161027487433.jpg%22%20title%3D%22G-3126%E8%AF%A6%E6%83%85_01.jpg%22%2F%3E%3C%2Fp%3E%3Cp%3E%3Cimg%20src%3D%22http%3A%2F%2F%7BIMGIP%7D%2Fupload%2Fgoods%2F201906161027493361.jpg%22%20title%3D%22G-3126%E8%AF%A6%E6%83%85_02.jpg%22%2F%3E%3C%2Fp%3E%3Cp%3E%3Cbr%2F%3E%3C%2Fp%3E";
					// <p><img src="http: //{IMGIP}/upload/goods/201906161027479513.jpg" title="G-3126详情_03.jpg"/></p><p><img src="http://{IMGIP}/upload/goods/201906161027487433.jpg" title="G-3126详情_01.jpg"/></p><p><img src="http://{IMGIP}/upload/goods/201906161027493361.jpg" title="G-3126详情_02.jpg"/></p><p><br/></p>
					var GoodsDesc = decodeURIComponent(data.Goods.GoodsDesc);
					// console.log("0123"+ggd);
					// var GoodsDesc = decodeURIComponent(ggd);
					// console.log("3210"+GoodsDesc);
					GoodsDesc = GoodsDesc.replace(new RegExp("{IMGIP}", 'g'), "res.genvana.cn");
			
					var htmlDOM = UIAPI.parseDom("<div>" + GoodsDesc + "</div>")
					var imgs = htmlDOM[0].getElementsByTagName('img');
					mui.each(imgs, function(i, img) {
						img.setAttribute("data-preview-src", "");
						img.setAttribute("data-preview-group", "2");
					})
					data.Goods.GoodsDesc = UIAPI.nodeToString(htmlDOM[0]);
					// console.log("0000"+data.Goods.GoodsDesc);
					_self.Goods = data.Goods;
					_self.GoodsSkuList = data.GoodsSku;
					_self.GoodsUnitTemplateList = data.GoodsUnitTemplateList;
					_self.GetGoodsPicURL = data.GetGoodsPicURL;
					// _self.$forceUpdate();
					_self.$nextTick(function() {
						mui(".mui-slider").slider({
							interval: 5000, //如果你想自动3000ms滑动一下就写上这个。 
						});
						//设置状态栏的背景颜色
						// plus.navigator.setStatusBarBackground('#262630');
						//设置系统状态栏样式 (可选值:dark,light,UIStatusBarStyleDefault,UIStatusBarStyleBlackOpaque)
						plus.navigator.setStatusBarStyle('dark');
					})
				}.bind(_self), 500);
			},
			//添加购物车
			AddShoppingCar: function () {
				//判断用户是否登录
				var goodNum = mui('.mui-numbox').numbox().getValue(); // 获取添加商品数量
				if (goodNum > 1){
					_self.inputNum = goodNum;
					_self.cartNum = _self.cartNum + goodNum;
				}else{_self.inputNum = goodNum;_self.cartNum++;}
				mui.toast("已添加，请到购物车查看");
			},
			gotoHome: function(index){
				if (index == 2) {
					var taskList = plus.webview.getWebviewById('shop_cart.html');
					// alert(taskList);
					if (taskList == undefined || taskList == null){
						UIAPI.openWindow('./shop_cart.html', 'shop_cart.html', "");
						mui.fire(taskList, 'loadData');
					}
					else {mui.fire(taskList, 'loadData');}
				}
				var search = plus.webview.getWebviewById('shop_search.html');
				if (search){
					plus.webview.close(search, "none");
				}
				var main = plus.webview.getLaunchWebview();
				mui.fire(main, 'refresh', {
					index: index
				});
				mui.back();
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
				_self.showWindow();
				_self.getGoodsDetail();
				mui('.mui-bar-tab').on('tap', 'a', function(e) {
					var index = this.getAttribute('data-index');
					// alert(index);
					if (index == 0 || index == 2) {
						_self.gotoHome(index);
					} else if (index == 3) { //收藏
						mui.toast("已收藏");
					} else if (index == 4) { //添加购物车
						_self.AddShoppingCar();
					} else if (index == 5) {
						//判断用户是否登录
						UIAPI.openWindow("./shop_settlement.html","shop_settlement.html",{});
					}
				});
				mui.previewImage();
			});
			_self.$nextTick(function() {
				
			});
		}, //created
		beforeMount: function() {
			var scrollTimeout = null;
			var scrollendDelay = 1500; // ms
			$(document).ready(function() {
				var p = 0,
					t = 0;
				$(window).scroll(function() {
					p = $(this).scrollTop();
					if (t != p) {
						var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
						if (scrollTop > 44) {
							//设置系统状态栏样式 (可选值:dark,light,UIStatusBarStyleDefault,UIStatusBarStyleBlackOpaque)
							plus.navigator.setStatusBarStyle('UIStatusBarStyleDefault');
						} else {
							//设置系统状态栏样式 (可选值:dark,light,UIStatusBarStyleDefault,UIStatusBarStyleBlackOpaque)
							plus.navigator.setStatusBarStyle('dark');
						}
					}
					setTimeout(function() {
						t = p;
					}, 0)
				})
			});
		}, //beforeMount
		mounted: function() {
			/**
			 * MUI框架初始化
			 */
			mui.init({
				beforeback: function() {
					//设置系统状态栏样式 (可选值:dark,light,UIStatusBarStyleDefault,UIStatusBarStyleBlackOpaque)
					plus.navigator.setStatusBarStyle('UIStatusBarStyleDefault');
					return true;
				},
			});
			
			/**
			 * 所有动态获取的控件初始化需在mui.ready(function(){});内执行
			 */
			mui.ready(function() {
				mui(".mui-numbox").numbox(); // 初始化数字数字选择框；getValue()//获取当前值；setValue(Value)//动态设置新值 Int；setOption(options)//更新选项,可取值: min(Int),step(Int),max(Int),如setOption("step",5)
				//阻尼系数
				var deceleration = mui.os.ios ? 0.003 : 0.0009;
				mui('.mui-scroll-wrapper').scroll({
					scrollY: true, //是否竖向滚动
					scrollX: false, //是否横向滚动
					bounce: false,	//滚动条是否有弹力默认是true
					indicators: true, //是否显示滚动条,默认是true
					deceleration: deceleration
				});
				/**
				 * 属性
				 */
				$('.block-attr__body').on('click', '.inline-attr__val', function() {
					// 这里是操作<template><template内,属于<script><script>module.exports外,为windows对象
					// _self指向为<script><script>module.exports内
					if ($(this).hasClass('active')) return false;
					$('.inline-attr__val').removeClass('active');
					$(this).addClass('active');
				})
				/**
				 * 包装
				 */
				$('.block-attr__body').on('click', '.inline-pack__val', function() {
					// 注释说明不能包含闭合标签 ↓↓↓ 否则程序不能正常运行
					// _self指向为<script> module.exports <script>内,<script> module.exports <script>外,为windows对象
					// 这里是操作<template><template>内,windows对象,固用this
					if ($(this).hasClass('active')) return false;
					$('.inline-pack__val').removeClass('active');
					$(this).addClass('active');
				})
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
	.header-bar { background-color: rgba(230,0,18,0);}
	.icon-share{ width: 24px;height: 24px;text-align: center; font-size: 18px !important;}
	.mui-title{ color:#ffffff;opacity: 0;}
	/* 改变图标的颜色 */
	.mui-bar a{
		/* color: #fff; */
	}
	.Goods-Display{
		display: none;
	}
	body {
		padding-top: constant(safe-area-inset-top);
	}
	 
	.mui-bar.mui-bar-nav {
		top: constant(safe-area-inset-top);
	}
</style>
