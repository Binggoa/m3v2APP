<template>
	<div id="shop_settlement" v-clock>
		<template>
			<!--使用render函数与createElement函数创建外部文件链接DOM-->
			<remote-js src=""></remote-js>
			<remote-css href=""></remote-css>
		</template>
		<template id="el-box">
			<header id="header" class="mui-bar mui-bar-nav bg-red noShadow">
				<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left text-white"></a>
				<h1 class="mui-title text-white">确认订单</h1>
			</header>
			
			<div class="mui-content pdb-100">
				<div id="adress-detail" class="mui-table-view-cell adress-detail mgb-6">
					<a class="mui-navigate-right white-space--initial" v-on:tap="gotoAddressManage()">
						<template v-if="RecieveAddress!=null">
							<div class="adress-detail__title" style="font-size: 14px;color: #646464;">
								<img src="../assets/images/img/customer_location.png" style="height: 19px;width: 16px;position: relative;top: 3px;margin-right: 9px;">
								<strong>{{RecieveAddress.RecieveName}}</strong>
								<strong  class="adress-detail__body font-size-16">{{RecieveAddress.MobilePhone}}</strong>
							</div>
							<div class="adress-detail__body" style="font-size: 13px;color: #757575;">
								地址：{{RecieveAddress.RecieverProvinceName}}{{RecieveAddress.RecieverCityName}}{{RecieveAddress.RecieverCountyName}}{{RecieveAddress.RecieverAddress}}
								<template v-if="RecieveAddress.PostCode">
									({{RecieveAddress.PostCode}})
								</template>
							</div>
						</template>
						<div v-if="RecieveAddress==null" style="padding: 10px;text-align:center">
							<span class="text-red" style="color: #F29E96;">
								您还没有收货地址，赶紧添加吧！
							</span>
						</div>
					</a>
				</div>
			
				<div class="goods">
					<div class="block-group">
						<ul class="mui-table-view">
							<li class="li_normal mui-table-view-cell mui-media" v-for="(Goods,index) in GoodsList">
								<div class="classfy-item__img flexbox">
									<img class="mui-media-object mui-pull-left" v-bind:src="Goods.DefaultPicURL">
								</div>
								<div class="mui-media-body classfy-item__body" style="min-height: 100px;height:auto;">
									<div class="mui-media-left">
										<!-- 商品名称 -->
										<div class="goods-name">{{Goods.GoodsName}}</div>
										<div class="goods-model">
											型号: {{Goods.GoodsModel}}
											&nbsp;&nbsp;{{Goods.GoodsAttributesName}}: {{Goods.GoodsAttributesValueName}}
										</div>
										<!-- 商品总价 -->
										<div class="mui-media-price text-red goods-all-price">
											￥{{(Goods.Price * Goods.Amount).toFixed(2)}}
										</div>
									</div>
									<div class="mui-media-right">
										<!-- 商品单价 -->
										<p class="goods-price">
											<span class="unit-price">￥{{(Goods.Price*1).toFixed(2)}}</span>
										</p>
										<!-- 商品原价 -->
										<p class="goods-old-price">
											<s class="price-origin">￥{{(Goods.OldPrice*1).toFixed(2)}}</s>
										</p>
										<p class="goods-old-price">9.5折</p>
										<!-- 商品数量 -->
										<p class="goods-num">X {{Goods.Amount}}</p>
									</div>
								</div>
							</li>
						</ul>
					</div>
					
					<ul class="mui-table-view">
						<!--优惠券勾选-->
						<li class="coupon">
						    <div class="mgb-6" style="position:relative;">
						        <div class="mui-checkbox checkbox-kaifapiao">
						            <label>
						                <input v-model="IsCoupon" name="checkbox" type="checkbox" class="gcs-radio">
						                <label class="point"></label>
						                <span class="checkbox-text">使用优惠券</span>
						            </label>
						            <span class="checkbox-text checkbox-text-tip">&nbsp;&nbsp;&nbsp;{{AmountInfo.CouponName}}（剩余可用￥{{AmountInfo.CouponAmount}}）</span>
						        </div>
						        <!--优惠券说明详情-->
						        <ul class="mui-table-view">
						            <li class="mui-table-view-cell mui-collapse">
						                <a class="mui-navigate-right text-blue">&nbsp;</a>
						                <div class="mui-collapse-content">
						                    <ul class="mui-table-view" >
						                        <li class="mui-table-view-cell mui-table-view-cell-new">
						                            <span class="mui-view-cell-val">
														{{AmountInfo.Description}}
						                            </span>
						                        </li>
						                    </ul>
						                </div>
						            </li>
						        </ul>
						    </div>
						</li>
					</ul>
					<ul class="mui-table-view ">
						
						<li class="mui-table-view-cell" >
							商品总金额
							<span class="mui-view-cell-val text-red text-big">
									￥ {{AmountInfo.GoodsTotalAmount}}
							</span>
						</li>
						<li class="mui-table-view-cell">
							促销优惠
							<span class="mui-view-cell-val text-red text-big">
								-￥{{AmountInfo.GoodsCuXiaoYouHui}}
							</span>
						</li>
						<li class="mui-table-view-cell">
							优&nbsp;&nbsp;惠&nbsp;&nbsp;券
							<span class="mui-view-cell-val text-red text-big">
								-￥{{AmountInfo.CouponOrderAmount}}
							</span>
						</li>
						
					</ul>
				</div>
			</div>
			<div v-if="RecieveAddress!=null" style="display: none;background-color: #FFF1D9;" id="address" class="mui-bar mui-bar-tab noShadow bg-warn text-warn mui-bar-cartsum confirmOrder-warnInfo">
				地址：{{RecieveAddress.RecieverProvinceName}}{{RecieveAddress.RecieverCityName}}{{RecieveAddress.RecieverCountyName}}{{RecieveAddress.RecieverAddress}}
				<template v-if="RecieveAddress.PostCode">
					({{RecieveAddress.PostCode}})
				</template>
			</div>
			
			
			<div id="bottomx" class="mui-bar mui-bar-tab" style="box-shadow: 0 4px 8px #000;">
				<div class="bar-tab-sum">
					应付：<span class="text-red" style="font-weight: bold;">￥
							{{AmountInfo.GoodsTotalAmount-AmountInfo.GoodsCuXiaoYouHui-AmountInfo.CouponOrderAmount}}
					</span>
					<button class="mui-btn mui-btn-danger mui-pull-right" v-bind:disabled="RecieveAddress==null" type="button" v-on:tap="submit()">提交订单</button>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
	var _self = {};
	module.exports = {
		name: 'shop_settlement',
		template: '#shop_settlement',
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
				RecieveAddress: null,
				GoodsList: [],
				AmountInfo: {
					CouponAmount: 0,
					CouponName: "",
					Description: "",
					CouponOrderAmount: 0,
					GoodsCuXiaoYouHui:0,
					GoodsTotalAmount: 0,
				},
				IsCoupon: true,
				user: {}, //StorageAPI.getUser()
				TotalAmount: 0,
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
			* 提交订单
			*/
			submit: function() {
				if (!_self.RecieveAddress.RecieveAddressID || _self.RecieveAddress.RecieveAddressID == 0) {
					mui.toast("请添加或选择收货地址！");
					return false;
				}
				UIAPI.openWindow("./shop_payment.html","shop_payment.html",{});
			},
			gotoAddressManage: function() {
				//去选择收货地址
				var param = {
					selectOneAddress: true
				}
				UIAPI.openWindowWithTitle("./shop_address.html", "shop_address.html",param);
			},
			getSettlementInfo: function() {
				var files = ['../assets/data/json/settlementModel.json'],
					settelementDataByCache = "";
				$.getJSON(files[0], function(sttlMdata){
					settelementDataByCache = sttlMdata;
				});
				window.setTimeout(function() {
					
					var data = settelementDataByCache;
					mui.each(data.RecieveAddressList, function(index, address) {
						//取默认地址，如果没有默认地址就取第一条地址
						if (index == 0) {
							_self.RecieveAddress = address;
						}
						if (address.IsDefault == 1) {
							_self.RecieveAddress = address;
						}
					})
					
					_self.AmountInfo.CouponAmount = data.CouponAmount;
					_self.AmountInfo.CouponName = data.CouponName;
					_self.AmountInfo.Description = data.Description;
					_self.AmountInfo.GoodsCuXiaoYouHui = data.GoodsCuXiaoYouHui;
					_self.AmountInfo.CouponOrderAmount = data.CouponOrderAmount;
					_self.AmountInfo.GoodsTotalAmount = data.GoodsTotalAmount;
					
					_self.GoodsList = data.GoodsList;
					_self.$nextTick(function() { //渲染完成后触发事件
					
						var height = $("#adress-detail").height();
						$(window).scroll(function() {
							if ($(window).scrollTop() >= height) {
								$("#address").show();
							} else {
								$("#address").hide();
							}
						})
					});
				}.bind(_self), 500);
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
				_self.$options.methods.getSettlementInfo();
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
				var RecieveAddressID = "";
				
				//执行刷新
				window.addEventListener('initAddress', function(e) {
					_self.RecieveAddress = e.detail.address;
					if(_self.RecieveAddress){
						$(".mui-content").css("padding-bottom","100px !important");
					}else{
						$(".mui-content").css("padding-bottom","60px !important");
					}
				});
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
	.mui-media-left{
	float: left;width: 75%;min-height: 100px;height:auto;padding-bottom: 25px;
	}
	.goods-name{
	font-size: 14px;line-height:21px;
	}
	.goods-model{
	color: #757575;font-size: 13px;margin-top: 6px;line-height:22px;
	}
	.goods-all-price{
	height: 26px;font-size: 15px;
	}
	.mui-media-right{
	float: right;width:25%;text-align: right;
	}
	.goods-price{line-height:22px;color: #717071;
	}
	.goods-old-price{
	line-height:22px;margin-top: 4px;font-size: 13px;
	}
	.goods-num{
	margin-top: 4px;font-size: 13px;
	}
</style>
