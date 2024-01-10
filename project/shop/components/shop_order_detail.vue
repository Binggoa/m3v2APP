<template>
	<div id="shop_order_detail" v-clock>
		<template>
			<!--使用render函数与createElement函数创建外部文件链接DOM-->
			<remote-js src=""></remote-js> <!-- 这里js文件相对路径，取决于引用此自定义组件的html页面 -->
			<remote-css href=""></remote-css>
		</template>
		<template>
			<div class="bar-apply-state bg-danger" style="top: 0px;">
				<div class="state mg-0 mgl-15">
					<p><span style="top: 4px;" class="iconfont" v-bind:class="PayStatusClass()"></span>
					{{PayStatusName}} 
					{{order.OrderStatusName}} 
					{{order.OrderReturnStatusName}} 
					{{order.CancelStatus==1?"部分取消":(order.CancelStatus==2?"全部取消":"")}}
					</p>
					<p class="pdl-33">
						<small>{{order.OrderTypeName}}</small>
						<small style="float: right;">{{order.OrderNo}}</small>
					</p>
				</div>
			</div>
			<div class="adress-bar" style="top:54px;position: relative;"></div>
			<div class="mui-content" style="padding-top: 14px !important;padding-bottom:50px">
				<div class="adress-detail-wrapper">
					<div class="adress-detail">
						<div class="adress-detail__title" style="font-size: 14px;color: #646464;">
							<span class="mui-icon mui-icon-location"></span>
							<strong>{{order.ReceviedName}}</strong>
							<strong class="adress-detail__body font-size-16">{{order.ReceviedPhone}}</strong>
						</div>
						<div class="adress-detail__body" style="font-size: 13px;color: #757575;">
							地址：{{order.ReceviedAddress}} 
							<template v-if="order.ReceviedZipCode">
								({{order.ReceviedZipCode}})
							</template>
						</div>
					</div>
				</div>
				<div class="goods">
					<ul class="mui-table-view mgb-6">
						<li class="mui-table-view-cell mui-media" v-if="item.Amount>0" v-for="(item,index) in items">
							<div class="classfy-item__img flexbox">
								<img class="mui-media-object mui-pull-left" v-bind:src="item.DefaultPicURL">
							</div>
							<div class="mui-media-body classfy-item__body">
								<div class="mui-media-left">
									<div class="goods-name">{{item.GoodsName}}</div>
									<div class="goods-model">
										型号: {{item.GoodsModel}}
										&nbsp;&nbsp;{{item.GoodsAttributesName}}: {{item.GoodsAttributesValueName}}
									</div>
									<div class="mui-media-price text-red goods-all-price">￥{{(item.SalePrice * item.Amount).toFixed(2)}}</div>
								</div>
								<div class="mui-media-right">
									<p class="goods-price">￥{{(item.SalePrice*1).toFixed(2)}}</p>
									<p class="goods-old-price" v-if="item.UnifiedPrice*1 > item.SalePrice*1" >
										<s>￥{{(item.UnifiedPrice*1).toFixed(2)}}</s>
									</p>
									<p class="goods-old-price" v-if="item.SaleDiscount>0">
										9.4折
									</p>
									<p class="goods-num">X {{item.Amount}}</p>
								</div>
							</div>
						</li>
			
						<li class="mui-table-view-cell">
							<label>促销优惠</label>
							<span class="mui-view-cell-val">
								￥ {{(order.PromotionAmount*1).toFixed(2)}}
							</span>
						</li>
						<li class="mui-table-view-cell">
							<label>优&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;惠</label>
							<span class="mui-view-cell-val">
								￥ {{(order.CouponAmount*1).toFixed(2)}}
							</span>
						</li>
						<li class="mui-table-view-cell">
							<label>订单金额（含优惠）</label>
							<span class="mui-view-cell-val text-red">
								￥ {{(order.totalSalePrice*1).toFixed(2)}}
							</span>
						</li>
					</ul>
					<ul class="mui-table-view mgb-6">
						<li class="mui-table-view-cell">
							<label>商家名称</label>
							<span class="mui-view-cell-val">
								{{order.OrderUserCompanyName}}
							</span>
						</li>
						<li class="mui-table-view-cell">
							<label>下单时间</label>
							<span class="mui-view-cell-val">
								{{order.CreateTime}}
							</span>
						</li>
						<li class="mui-table-view-cell">
							<label>完成时间  {{order.PayStatu}} {{order.OrderStatu}}</label>
							<span class="mui-view-cell-val">
								{{order.FinishTime}}
							</span>
						</li>
					</ul>
					<ul class="mui-table-view mgb-6">
						<li class="mui-table-view-cell">
							<label>发票抬头</label>
							<a  class="mui-view-cell-val text-blue">
								XXX解决问题
							</a>
						</li>
						<li class="mui-table-view-cell">
							<label>发票类型</label>
							<span class="mui-view-cell-val">
								个人发票
							</span>
						</li>
					</ul>
				</div>
				<div id="bottom_btn" class="mui-bar mui-bar-tab mui-text-right pdlr-15" >
					<a href="#btn-select" style="margin-left: 10px;" class="mui-btn mui-btn-danger mui-btn-outlined btn-confirm">取消订单</a>
					<button v-on:tap="pay()" style="margin-left: 10px;" class="mui-btn mui-btn-danger" type="button">立即付款</button>
					<button v-on:tap="confirmReceive()"style="margin-left: 10px;" class="mui-btn mui-btn-danger" type="button">确认收货</button>
				</div>
			
			</div>
			<!-- 底部弹窗 -->
			<div id="btn-select" class="box mui-popover mui-popover-action mui-popover-bottom">
				<div class="mui-popover-wrapper" style="height: 380px;">
					<div class="mui-popover-head">
						<h3 class="mui-popover-title"  style="font-weight:bold;">
							取消订单
							<span v-on:tap="close" class="mui-icon mui-icon-closeempty icon-close" style="right: 8px;" ></span>
						</h3>
					</div>
					<div class="mui-popover-body">
						<div class="mui-scroll-wrapper">
							<div class="mui-scroll" >
								<div class="mui-popover-body" >
									<h5 style="font-weight:bold;">请选择取消订单的原因（必选）</h5>
									<div class="mui-input-group pdtb-10"  style="padding-bottom: 1px !important;">
										<div class="mui-input-row mui-radio noAfter">
											<label>我不想要了</label>
											<input name="reason-radio" style="right: 8px;"  type="radio" value="0">
										</div>
										<div class="mui-input-row mui-radio noAfter">
											<label>信息填写错误</label>
											<input name="reason-radio" style="right: 8px;" type="radio" value="1">
										</div>
										<div class="mui-input-row mui-radio noAfter">
											<label>其他原因</label>
											<input name="reason-radio" style="right: 8px;" type="radio" value="2">
										</div>
										<textarea id="cancelReason" style="display: none;" class="mgl-15" style="width: 6.83rem;margin-bottom: 0px;" name=""></textarea>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<a v-on:tap="cancelOrder()" class="mui-bar mui-bar-tab bg-red text-white bottom-fixed-block">提交</a>
			</div>
		</template>
	</div>
</template>

<script>
	var _self = {};
	module.exports = {
		name: 'shop_order_detail',
		template: '#shop_order_detail',
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
				order: {},
				items: [], //列表信息流数据
			} //retrun
		}, //data
		computed: { //计算属性
			//多对一或一对一，支持缓存，不支持异步，只有依赖数据发生改变，才会重新进行计算
			// fname: function() {return null;}
			PayStatusClass:function(){
					//支付状态: 0：未收款 1：部分收款 2：已收款 ,
					if(_self.order.PayStatus==0){
						return "icon-m-e1";
					}else if(_self.order.PayStatus==1){
						return "icon-m-a1";
					}else if(_self.order.PayStatus==2){
						return "icon-m-k1";
					}else{
						return "icon-m-e1";
					}
			},
			PayStatusName:function(){
					//支付状态: 0：未收款 1：部分收款 2：已收款 ,
					if(_self.order.PayStatus==0){
						return "未付款";
					}else if(_self.order.PayStatus==1){
						return "部分付款";
					}else if(_self.order.PayStatus==2){
						return "已付款";
					}else{
						return "";
					}
			}
		}, //computed
		watch: {
			
		}, //watch
		filters: { //自定义过滤函数

		}, //filters
		methods: {
			/**
			 * 取消订单
			 */
			getOrderDetail: function() {
				var files = ['../assets/data/json/orderDetailModel.json'],
					orderDetailByCache = "";
				$.getJSON(files[0], function(odlMdata){
					orderDetailByCache = odlMdata;
				});
				var t0 = setTimeout(function() {
					var data = orderDetailByCache;
					var totalSalePrice = 0;
					data.OrderDetailList.forEach(function(item) {
						totalSalePrice += (item.SalePrice * item.Amount);
					});
					_self.order = data.Order;
					_self.order.totalSalePrice = totalSalePrice;
					_self.items = data.OrderDetailList;
				}.bind(_self), 500);
			},
			updateOrderList: function(){
				var opener = plus.webview.getWebviewById("shop_MyOrderList.html");
				mui.fire(opener,"refrash");
			},
			cancelOrder: function() {
				mui('#btn-select').popover('hide');
				mui.toast("取消成功！");
			},
			/**
			 * 确认收货
			 */
			confirmReceive: function() {
				mui.toast("确认收货");
			},
			/**
			 * 立即付款
			 */
			pay: function() {
				var extras = {
					OrderID: _self.order.OrderID,
				}
				UIAPI.openWindow("./shop_payment.html", "shop_payment.html",  extras);
			},
			close:function() {
				$('#btn-select').removeClass('mui-active');
				$('.mui-backdrop').remove();
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
				_self.getOrderDetail();
				
				window.addEventListener('refrash', function(e) {
					_self.updateOrderList();
					_self.getOrderDetail();
				})
			});
			
			_self.$nextTick(function() {
				alert(JSON.stringify(_self.order));
			});
		}, //created
		beforeMount: function() {
			// alert('Before Mount');
			// $(document).ready(function() {});
		}, //beforeMount
		mounted: function() {
			/**
			 * MUI框架初始化
			 */
			mui.init({}); //其他组件已经初始化过mui.init({});以内容最多的为主
			
			/**
			 * 所有动态获取的控件初始化需在mui.ready(function(){});内执行
			 */
			mui.ready(function(){
				//监听单选框状态变化
				$('input[name="reason-radio"]').on('change', function () {
					if ($(this).val() == "2"){
						$("#cancelReason").css("width","6.83rem");
						$("#cancelReason").show();
					}else{
						$("#cancelReason").css("width","6.83rem");
						$("#cancelReason").hide();
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
	.classfy-item__body{
		min-height: 100px;height:auto;
	}
	.mui-media-left{
	float: left;width: 75%;padding-bottom:30px;
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
	float: right;width: 25%;text-align: right;
	}
	.goods-price{font-size: 13px;line-height:22px;color: #717071;
	}
	.goods-old-price{
	font-size: 13px;line-height:22px;margin-top: 4px;
	}
	.goods-num{
	margin-top: 4px;font-size: 13px;
	}
</style>
