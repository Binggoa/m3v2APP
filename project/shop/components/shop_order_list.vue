<template>
	<div id="shop_order_list" v-clock>
		<template>
			<!--使用render函数与createElement函数创建外部文件链接DOM-->
			<remote-js src=""></remote-js> <!-- 这里js文件相对路径，取决于引用此自定义组件的html页面 -->
			<remote-css href=""></remote-css>
		</template>
		<template>
			<header class="mui-bar mui-bar-nav bg-red noShadow">
				<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left text-white"></a>
				<h1 class="mui-title text-white">我的订单</h1>
			</header>
			<div class="order-nav flexbox align-items-center beforeline" style="position: fixed;width: 100%;margin-top: 64px;left: 0px;">
				<div class="order-nav-item" v-bind:class="{'active':Status==''}" data-id="">
					全部
				</div>
				<div class="order-nav-item PayStatus" v-bind:class="{'active':Status=='0'}" data-id="0">
					未付款
				</div>
				<div class="order-nav-item OrderStatus" v-bind:class="{'active':Status=='1'}" data-id="10">
					已受理
				</div>
				<div class="order-nav-item OrderStatus" v-bind:class="{'active':Status=='2'}" data-id="30">
					已发货
				</div>
				<div id="btn-open" class="order-nav-item btn-open">
					<span class="mui-icon mui-icon-arrowdown btn-open-icon"></span>
				</div>
			</div>
			<div id="wrapper" style="top: 104px;">
				<div id="scroller">
					<div id="pullDown">
						<span class="pullDownLabel">下拉刷新</span>
					</div>
					<div class="mgb-6" v-if="orderList.length!=0" v-for="(item,index) in orderList" >
						<ul class="mui-table-view " v-on:tap="toOrderDetail(item.OrderID)">
							<li class="mui-table-view-cell mui-active-link ">
								<a class="mui-navigate-right">
									{{item.OrderNo}}
									<span class="mui-badge" v-bind:class="getStyleByStatus(item.OrderStatus)">
										{{item.PayStatusName}} 
										{{item.OrderStatusName}} 
										<template v-if="item.OrderReturnStatusName || item.CancelStatus==1?'部分取消':(item.CancelStatus==2?'全部取消':'')">
											...
										</template>
									</span>
								</a>
							</li>
							<li class="mui-table-view-cell">
								<label>类型：</label>{{item.OrderTypeName}}
								<span class="mui-view-cell-val">
									<label>合计：</label> <span class="text-red">￥ {{item.TotalAmount}}</span>
								</span>
							</li>
						</ul>
						<div class="mui-input-group mui-text-right beforeline pdtb-10">
							<a v-on:tap="showCancleBox(item.OrderID)" v-if="item.OrderStatus === 0 && item.PayStatus===0" style="right: 15px;" class="btn-cancle mui-btn mui-btn-danger mui-btn-outlined mg-0">取消订单</a>
							<button v-if="item.PayStatus < 2 && item.OrderStatus<60" v-on:tap="toPayment(item.OrderID,item.IsInvoice)" style="right: 5px;" type="button" class="mui-btn mui-btn-danger">立即付款</button>
						</div>
					</div>
					<div id="pullUp">
						<span class="pullUpLabel">上拉加载更多</span>
					</div>
					<div class="state-container" v-if="orderList.length==0" style="margin-top: 40px;">
						<div class="state-icon state-nodata"></div>
						<div class="state-title">
							暂无数据！
						</div>
					</div>
				</div>
			</div>
			<!-- 弹出层--分类面板 -->
			<div class="collapse-panel collapse-panel-1" style="margin-top: 20px;">
				<h4 class="collapse-panel__title" style="font-size: .28rem;">订单状态</h4>
				<div class="collapse-panel__body">
					<div class="btns-group flexbox align-items-center">
						<button type="button" class="mui-btn btns-item filter_orderStatus" style="padding:8px 0px;" data-id="0">已提交</button>
						<button type="button" class="mui-btn btns-item filter_orderStatus" style="padding:8px 0px;" data-id="20">部分已发货</button>
						<button type="button" class="mui-btn btns-item filter_orderStatus" style="padding:8px 0px;" v-bind:class="{'active':Status=='30'}" data-id="30">已发货</button>
					</div>
					<div class="btns-group flexbox align-items-center">
						<button type="button" class="mui-btn mui-btn-grey btns-item filter_orderStatus" style="padding:8px 0px;" data-id="40">已收货</button>
						<button type="button" class="mui-btn mui-btn-grey btns-item filter_orderStatus" style="padding:8px 0px;" v-bind:class="{'active':Status=='10'}"
						 data-id="10">已受理</button>
						<button type="button" class="mui-btn mui-btn-grey btns-item filter_orderStatus" style="padding:8px 0px;" data-id="50">交易完成</button>
					</div>
					<div class="btns-group flexbox align-items-center">
						<button type="button" class="mui-btn mui-btn-grey btns-item filter_orderStatus" style="padding:8px 0px;" data-id="60">交易关闭</button>
					</div>
				</div>
			
				<h4 class="collapse-panel__title" style="font-size: .28rem;">付款状态</h4>
				<div class="collapse-panel__body">
					<div class="btns-group flexbox align-items-center">
						<button type="button" class="mui-btn btns-item filter_payStatus" v-bind:class="{'active':Status=='0'}" style="padding:8px 0px;" data-id="0">未付款</button>
						<button type="button" class="mui-btn btns-item filter_payStatus" style="padding:8px 0px;" data-id="1">部分已付款</button>
						<button type="button" class="mui-btn btns-item filter_payStatus" style="padding:8px 0px;" data-id="2">已付款</button>
					</div>
				</div>
				<h4 class="collapse-panel__title" style="font-size: .28rem;">退货/退款状态</h4>
				<div class="collapse-panel__body">
					<div class="btns-group flexbox align-items-center">
						<button type="button" class="mui-btn btns-item OrderReturnStatus" style="padding:8px 0px;" data-id="1">退货/退款中</button>
						<button type="button" class="mui-btn btns-item OrderReturnStatus" style="padding:8px 0px;" data-id="2">已退货/退款</button>
						<button type="button" class="mui-btn btns-item OrderReturnStatus" style="padding:8px 0px;visibility:hidden"></button>
					</div>
				</div>
			</div>
			
			<div id="btn-select" class="box mui-popover mui-popover-action mui-popover-bottom">
				<div  class="mui-popover-wrapper" style="height: 380px;">
					<div class="mui-popover-head">
						<h3 class="mui-popover-title" style="font-weight:bold;">
							取消订单
							<span v-on:tap="close" class="mui-icon mui-icon-closeempty icon-close" style="right: 8px;" ></span>
						</h3>
					</div>
					<div class="mui-popover-body" style="padding-top: 2px;">
						<div class="mui-scroll-wrapper pdb-50">
							<div class="mui-scroll">
								<div class="mui-popover-body" >
									<h5 style="font-weight:bold;">请选择取消订单的原因（必选）</h5>
									<div class="mui-input-group pdtb-10">
										<div class="mui-input-row mui-radio noAfter">
											<label>我不想要了</label>
											<input name="reason-radio" style="right: 8px;" type="radio" value="0">
										</div>
										<div class="mui-input-row mui-radio noAfter">
											<label>信息填写错误</label>
											<input name="reason-radio" style="right: 8px;" type="radio" value="1">
										</div>
										<div class="mui-input-row mui-radio noAfter">
											<label>其他原因</label>
											<input name="reason-radio" style="right: 8px;" type="radio" value="2">
										</div>
										<textarea id="cancelReason" style="display: none;" class="mgl-15" style="width: 6.83rem;height: 2.5rem;" name=""></textarea>
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
	var PageIndex = 0;
	var PageSize = 10;
	var myScroll, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset, generatedCount = 0;
	module.exports = {
		name: 'shop_order_list',
		template: '#shop_order_list',
		components: {
			'remote-js': {
				render(createElement) {
					return createElement('script', {attrs: {type: 'text/javascript', src: this.src}})},
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
				orderList: [],
				Status: "",
				OrderID: ""
			} //retrun
		}, //data
		computed: { //计算属性
			//多对一或一对一，支持缓存，不支持异步，只有依赖数据发生改变，才会重新进行计算
			// fname: function() {return null;}
			//根据状态返回样式名称（订单状态 0 已提交 10商家已受理 20部分已发货 30 已发货 40已收货 50交易完成 60交易关闭）
			getStyleByStatus:function() {
				return function(status){
					 switch (status) {
					    case 0:
					        return "badge-lightYellow";
					    case 10:
					    case 20:
					    case 30:
					    case 40:
					        return "badge-lightGreen";
					    case 50:
					        return "badge-lightPurple";
					    default:
					        return "badge-lightGray";
					}
				}
			}
		}, //computed
		watch: {
			
		}, //watch
		filters: { //自定义过滤函数

		}, //filters
		methods: {
			toOrderDetail: function(OrderID) {
				var extras = {
					OrderID: OrderID
				}
				UIAPI.openWindowWithTitle("./shop_order_detail.html", "shop_order_detail.html","订单详情", extras)
			},
			
			toPayment: function(OrderID) {
				var extras = {
					OrderID: OrderID,
				}
				UIAPI.openWindow("./shop_payment.html", "shop_payment.html",  extras);
			},
			
			showCancleBox: function(OrderID) {
				_self.OrderID = OrderID;
				mui('#btn-select').popover('show');
			},
			//取消订单
			cancelOrder: function() {
				mui('#btn-select').popover('hide');
				mui.toast("取消成功！");
			},
			close:function() {
				$('#btn-select').removeClass('mui-active');
				$('.mui-backdrop').remove();
			},
			/**
			 * 第一次加载数据，View还没有初始化
			 * 参数是从上个页面带过来的
			 */
			loadAction: function() {
				var files = ['../assets/data/json/orderListModel.json'],
					orderListByCache = "";
				$.getJSON(files[0], function(ordlMdata){
					orderListByCache = ordlMdata;
				});
				var t0 = setTimeout(function() {
					var data = orderListByCache[0];
					_self.orderList = data;
					PageIndex++;
					
					if(_self.orderList.length==0){
						pullUpEl.style.display="none"
					}else{
						pullUpEl.style.display="block"
					}
					if (data.length < PageSize) {
						pullUpEl.style.display="none"
					}
					
					_self.$nextTick(function() {
						myScroll.refresh();
						_self.$options.methods.init();
					})
					
				}.bind(_self), 500);
			}, //end
			//加载类型0=下拉刷新 1=上拉加载
			pullAction: function(pullType) {
				var files = ['../assets/data/json/orderListModel.json'],
					orderListByCache = "";
				$.getJSON(files[0], function(ordlMdata){
					orderListByCache = ordlMdata;
				});
				if(pullType==0){
					PageIndex = 0;
				}else{
					if(pullUpEl.style.display=="none"){
						return false;
					}
				}
				if(PageIndex===orderListByCache.length){
					pullUpEl.style.display="none"
					return false;
				}
				var t0 = setTimeout(function() {
					var data = orderListByCache[PageIndex];
					if (pullType == 0) {
						_self.orderList = data;
					} else {
						_self.orderList = _self.orderList.concat(data);
					}
					PageIndex++;
					if(_self.orderList.length==0){
						pullUpEl.style.display="none"
					}else{
						pullUpEl.style.display="block"
					}
					if (data.length < PageSize) {
						pullUpEl.style.display="none"
					}
					_self.$nextTick(function() {
						myScroll.refresh();
					})
					
				}.bind(_self), 500);
			}, //end
			init: function() {
				var event_f = function(e){e.preventDefault();}
				//监听箭头点击事件弹出分类面板
				$('#btn-open').on('tap', function() {
					if (!$(this).hasClass('show')) {
						var top_value = $(document).scrollTop()||document.documentElement.scrollTop || document.body.scrollTop;
						$('.collapse-panel-1').css("margin-top",top_value+20);
						
						$(this).addClass('show'); //改变按钮状态
						$('.collapse-panel-1').addClass('show'); //改变面板状态
						$('.btn-open-icon').addClass('reverse'); //改变按钮图标位置
						$('<div class="collapse-fixed collapse-fixed-1"></div>').appendTo('body'); //添加遮罩层
						//禁止页面滚动
						document.body.addEventListener('touchmove', event_f, { passive: false });
					} else {
						$(this).removeClass('show'); //改变按钮状态
						$('.collapse-panel-1').removeClass('show'); //改变面板状态
						$('.btn-open-icon').removeClass('reverse'); //改变按钮图标位置
						$('.collapse-fixed-1').remove();
						//删除 禁止页面滚动
						document.body.removeEventListener('touchmove', event_f, { passive: false });
					}
				})
				$('body').on('tap', '.collapse-fixed-1', function() {
					$('#btn-open').removeClass('show'); //改变按钮状态
					$('.collapse-panel-1').removeClass('show'); //改变面板状态
					$('.btn-open-icon').removeClass('reverse'); //改变按钮图标位置
					$(this).remove();
					document.body.removeEventListener('touchmove', event_f, { passive: false });
					document.activeElement.blur(); //隐藏软键盘  
				})
			
				// 监听订单状态分类面板 按钮选择事件
				$('.collapse-panel__body').each(function(index, el) {
					$(el).on('tap', '.btns-item', function() {
						scrollTo(0,0);
						var top_value = $(document).scrollTop()||document.documentElement.scrollTop || document.body.scrollTop;
						console.log(top_value);
						$('.collapse-panel-1').css("margin-top",top_value+20);
						
						if (!$(this).hasClass('active')) {
							$(el).find('.btns-item.active').removeClass('active');
							$(this).addClass('active');
						} else {
							$(this).removeClass('active');
						}
						$('.order-nav-item.active').removeClass('active');
						_self.$options.methods.pullAction(0);
						// _self.$options.methods.closePop();
					})
				})
			
				// 监听分类导航栏目选中事件
				$('.order-nav').on('tap', '.order-nav-item', function() {
					if (!$(this).hasClass('active') && !$(this).hasClass('btn-open')) {
						$('.order-nav-item.active').removeClass('active');
						$(this).addClass('active');
						//弹出层 设置非选中
						$('.collapse-panel__body').each(function(index, el) {
							$(el).find('.btns-item.active').removeClass('active');
						})
						_self.$options.methods.pullAction(0);
						_self.$options.methods.closePop();
					}
				})
				//监听单选框状态变化
				$('input[name="reason-radio"]').on('change', function () {
					if ($(this).val() == "2"){
						$("#cancelReason").css("width","6.83rem");
						$("#cancelReason").show();
					}else{
						$("#cancelReason").css("width","6.83rem");
						$("#cancelReason").hide();
					}
				})
				window.addEventListener('tap', function(e) {
					 e.target.className == 'mui-backdrop mui-active' && e.stopPropagation();
			    },true);
			}, //end
			closePop: function(){
				if($('#btn-open').hasClass('show')){
					var t0 = window.setTimeout(function(){
						var btn = document.getElementById("btn-open");
						mui.trigger(btn, 'tap');
					}.bind(_self), 500); 
					// window.clearTimeout(t1); //去掉定时器 
				}
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
				//动画部分
				pullDownEl = document.getElementById('pullDown');
				pullDownOffset = pullDownEl.offsetHeight;
				pullUpEl = document.getElementById('pullUp');
				pullUpOffset = pullUpEl.offsetHeight;
				myScroll = new iScroll('wrapper', {
					useTransition: true,
					topOffset: pullDownOffset,
					scrollbarClass: 'myScrollbar',
					hScrollbar: false,
					vScroll: true,
					hideScrollbar: false ,//是否隐藏滚动条  
					onRefresh: function() {
						if (pullDownEl.className.match('loading')) {
							pullDownEl.className = '';
							pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';
						} else if (pullUpEl.className.match('loading')) {
							pullUpEl.className = '';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';
						}
					},
					onScrollMove: function() {
						document.activeElement.blur(); //隐藏软键盘  
						if (this.y > 5 && !pullDownEl.className.match('flip')) {
							pullDownEl.className = 'flip';
							pullDownEl.querySelector('.pullDownLabel').innerHTML = '释放刷新';
							this.minScrollY = 0;
						} else if (this.y < 5 && pullDownEl.className.match('flip')) {
							pullDownEl.className = '';
							pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
							this.minScrollY = -pullDownOffset;
						} else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
							pullUpEl.className = 'flip';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = '释放刷新';
							this.maxScrollY = this.maxScrollY;
						} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
							pullUpEl.className = '';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
							this.maxScrollY = pullUpOffset;
						}
					},
					onScrollEnd: function() {
						if (pullDownEl.className.match('flip')) {
							pullDownEl.className = 'loading';
							pullDownEl.querySelector('.pullDownLabel').innerHTML = ''; //加载中
							_self.pullAction(0);
						} else if (pullUpEl.className.match('flip')) {
							pullUpEl.className = 'loading';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = ''; //加载中
							_self.pullAction(1);
						}
					}
				});
				var ws = plus.webview.currentWebview();
				_self.Status = ws.Status;
				_self.loadAction();
			});
			window.addEventListener('refrash', function(e) {
				_self.orderList = [];
				_self.pullAction(0);
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
				beforeback: function() {
					if($('#btn-open').hasClass('show')){
						var t1 = window.setTimeout(function(){
							var btn = document.getElementById("btn-open");
							mui.trigger(btn, 'tap');
						}, 100); 
						return false;
					}else {
						return true;
					}
				},
			}); //其他组件已经初始化过mui.init({});以内容最多的为主
			
			/**
			 * 所有动态获取的控件初始化需在mui.ready(function(){});内执行
			 */
			mui.ready(function() {
				var event_f = function(e){e.preventDefault();}
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
	
</style>
