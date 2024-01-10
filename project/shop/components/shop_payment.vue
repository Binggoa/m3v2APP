<template>
	<div id="shop_payment" v-clock>
		<template>
			<!--使用render函数与createElement函数创建外部文件链接DOM-->
			<remote-js src=""></remote-js> <!-- 这里js文件相对路径，取决于引用此自定义组件的html页面 -->
			<remote-css href=""></remote-css>
		</template>
		<template>
			<header class="mui-bar mui-bar-nav bg-red noShadow">
				<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left text-white"></a>
				<h1 class="mui-title text-white">订单支付</h1>
			</header>
			<div class="mui-content">
				<div class="notice-wrapper">
				<!-- <div class="notice-wrapper" v-if="user.CustomerType!=6"> -->
					<div class="notice flexbox">
						<span class="icon-notice"></span>
						<marquee class="notice-text">
							<!-- 好消息！下订单只要使用微信和支付宝支付货款，订单经确认并全部发货后，可获得金额计奖励金{{user.RewardAmountRate*100}}%。 -->
						</marquee>
					</div>
				</div>
				<ul class="mui-table-view">
					<li class="mui-table-view-cell">
						<label>订单编号</label>
						<span class="mui-view-cell-val">
							{{Order.OrderNo}}
						</span>
					</li>
					<li class="mui-table-view-cell">
						<label>订单金额</label>
						<span class="mui-view-cell-val">
							￥ {{Order.TotalAmount}}
						</span>
					</li>
					<li class="mui-table-view-cell">
						<label>待付金额</label>
						<span class="mui-view-cell-val text-red">
							￥ {{Order.payMoney}}
						</span>
					</li>
					<li class="mui-input-row beforeline">
						<label>支付金额</label>
						<input id="payMoney" v-bind:value="Order.payMoney" type="number" onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''"
						 class="mui-input-text mui-text-right" placeholder="请确认金额" readonly="true">
					</li>
				</ul>
			
				<div class="pay-method beforeline">支付方式</div>
				<ul class="mui-table-view">
					<li class="mui-input-row beforeline mui-radio pay pay-yue">
						<label data-pay="pay-yue">余额支付 <small>（当前账户余额{{AcountBalance.AcountBalance}}元）</small></label>
						<input name="radio-pay" type="radio" data-id="yue">
					</li>
					<li class="mui-input-row beforeline mui-radio pay pay-weixin">
						<label data-pay="pay-weixin">微信支付</label>
						<input name="radio-pay" type="radio" data-id="wxpay">
					</li>
					<li class="mui-input-row mui-radio pay pay-zhifubao">
						<label data-pay="pay-zhifubao">支付宝支付</label>
						<input name="radio-pay" type="radio" data-id="alipay">
					</li>
					<li class="mui-table-view-cell mui-radio pay pay-xianxia">
						<a class="mui-navigate-right" v-on:tap="goXianxiaPay()">
							<label data-pay="pay-xianxia">
								线下支付
							</label>
						</a>
					</li>
				</ul>
			</div>
			
			<a id="btn-confirmPay" class="mui-bar mui-bar-tab bg-red text-white bottom-fixed-block">支付</a>
			
			<!-- 底部弹窗 -->
			<div id="confirmPay" class="box mui-popover mui-popover-action mui-popover-bottom pay-container">
				<h3 class="mui-popover-title pay-title beforeline">
					输入支付密码
					<span class="mui-icon mui-icon-closeempty icon-close"></span>
				</h3>
				<div class="mui-popover-body pay-body">
					<div class="input-container">
						<input class="input-item" type="password" readonly>
						<input class="input-item" type="password" readonly>
						<input class="input-item" type="password" readonly>
						<input class="input-item" type="password" readonly>
						<input class="input-item" type="password" readonly>
						<input class="input-item" type="password" readonly>
					</div>
					<div class="forgetPwd-container">
						<a class="forgetPwd">忘记密码？</a>
					</div>
					<div class="key-container">
						<div class="key-item">1</div>
						<div class="key-item">2</div>
						<div class="key-item">3</div>
						<div class="key-item">4</div>
						<div class="key-item">5</div>
						<div class="key-item">6</div>
						<div class="key-item">7</div>
						<div class="key-item">8</div>
						<div class="key-item">9</div>
						<div class="empty"></div>
						<div class="key-item">0</div>
						<div class="key-item remove"></div>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
	var _self = {};
	//支付的URL
	var ALIPAYSERVER='http://demo.dcloud.net.cn/helloh5/payment/alipay.php?total=';    
	var WXPAYSERVER='http://demo.dcloud.net.cn/helloh5/payment/wxpay.php?total=';      
	var wxChannel = null; // 微信支付  
	var aliChannel = null; // 支付宝支付  
	var channel = null; //支付通道 
	var isPaySuccess = false;
	module.exports = {
		name: 'shop_payment',
		template: '#shop_payment',
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
		props: {
			title: {type: String}
		}, //props
		store: shop_store,
		router: shop_router,
		data: function() {
			return {
				Order: {
					OrderNo:"20193884958800001",
					TotalAmount:"23.78",
					payMoney:"12.45"
				},
				TotalMoney:0,
				AcountBalance: {
					AcountBalance:100,
					HasPassword:true
				},
				user:StorageAPI.getUser(),
			} //retrun
		}, //data
		filters: { //自定义过滤函数

		}, //filters
		methods: {
			goXianxiaPay: function() {
				var ws = plus.webview.currentWebview();
				var param = {
					PayAmount:$("#payMoney")[0].value,
					OrderID:_self.Order.OrderID,
					isInvoice:ws.isInvoice
				}
				UIAPI.openWindow("./shop_OfflineSelectAccount.html", "shop_OfflineSelectAccount.html", param)
			}, //end
			initEvent: function() {
				// 监听“支付方式”单选框状态变化
				$('input[name="radio-pay"]').on('change', function() {
					var label = $('input[name="radio-pay"]:checked').prev();
					if ($(label).attr('data-pay') === 'pay-yue') {
						$('#btn-confirmPay').attr('href', '#confirmPay')
					} else if ($(label).attr('data-pay') === 'pay-weixin') {
						$('#btn-confirmPay').removeAttr('href')
					} else if ($(label).attr('data-pay') === 'pay-zhifubao') {
						$('#btn-confirmPay').removeAttr('href')
					}
				})
				$("body").on('tap', '#btn-confirmPay', function(event) {
					document.activeElement.blur();
					//判断输入金额
					var payMoney = $("#payMoney")[0].value;
					if (!payMoney || payMoney <= 0) {
						mui.toast("请输入支付金额");
						return false;
					}
					if (parseFloat(payMoney) > _self.Order.payMoney) {
						mui.toast("支付金额不能大于未付款金额");
						return false;
					}
					//判断选择的支付方式
					var id = $("input[name='radio-pay']:checked").attr("data-id");
					if (!id) {
						mui.toast("请选择支付方式");
					} else {
						if (payMoney <= 0) {
							mui.toast("支付金额必须大于0");
							return false;
						}
						if(id=="yue"){
							if (_self.AcountBalance.AcountBalance < payMoney) {
								mui.toast("账户余额不足");
								return false;
							}
							//余额支付
							if(!_self.AcountBalance.HasPassword){
								var btnArray = ['否', '是'];
								mui.confirm('还没有支付密码，是否去设置？', ' ', btnArray, function(e) {
									if (e.index == 1) {
										UIAPI.openWindow("./shop_setPayPwd.html","shop_setPayPwd.html",{});
									} 
								},"div")
								return false;
							}
						}else{
							_self.$options.methods.ThirdPay(payMoney, id)
						}
					}
				}).on('tap', '.forgetPwd', function(event) {
					UIAPI.openWindow("./shop_setPayPwd.html","shop_setPayPwd.html",{});
				});
				//支付弹出层关闭按钮事件
				$('.icon-close').on('click', function() {
					$('#confirmPay').removeClass('mui-active');
					$('.mui-backdrop').remove();
					var inputItem = $('.input-item');
					for (var i = 0; i < inputItem.length; i++) {
						$(inputItem[i]).val('');
					}
					arr = [];
					num = 0;
				})
			
				var arr = [];
				var num = 0;
			
				//响应键盘事件
				$('.key-item').on('touchstart', function() {
					$(this).addClass('selected')
				})
				$('.key-item').on('touchend', function() {
					$(this).removeClass('selected')
				})
				//输入密码
				$('.key-item').on('tap', function() {
					var value = $(this).text();
					var inputItem = $('.input-item');
					if (!$(this).hasClass('remove')) {
						if (num < 6) {
							$(inputItem[num]).val(value);
							if (num == 5) {
								var arr = [];
								for (var i = 0; i < inputItem.length; i++) {
									arr.push(inputItem[i].value)
								}
								arr = parseInt(arr.join(''));
								// $(".icon-close").trigger("click");
								_self.$options.methods.payOrder(arr);
								num++;
								return false;
							}
							num++;
						}
					} else {
						if (num > 0) {
							num--;
							$(inputItem[num]).val('');
						}
					}
				})
			}, //end
			GoodsPayment: function() {
				var ws = plus.webview.currentWebview();
				var OrderID = ws.OrderID;
				alert("OrderID:"+OrderID);
				//获取数据
			}, //end
			//产生随机数函数
			RndNum: function(n) {
				var rnd = "";
				for (var i = 0; i < n; i++)
					rnd += Math.floor(Math.random() * 10);
				return rnd;
			}, //end
			//三方支付
			ThirdPay: function(payMoney, id) {
				
				// 从服务器请求支付订单  
				var PAYSERVER = '';
				if (id == 'alipay') {
					PAYSERVER = ALIPAYSERVER;
					channel = aliChannel;
				} else if (id == 'wxpay') {
					PAYSERVER = WXPAYSERVER;
					channel = wxChannel;
				} else {
					plus.nativeUI.alert("不支持此支付通道！", null, "捐赠");
					return;
				}
				var xhr = new XMLHttpRequest();
				var amount = 0.01;
				xhr.onreadystatechange = function() {
					switch (xhr.readyState) {
						case 4:
							if (xhr.status == 200) {
								//支付
								plus.payment.request(channel, xhr.responseText, function(result) {
									console.log(JSON.stringify(result));
									isPaySuccess = true;
									var param = {
										OrderID: _self.Order.OrderID,
										isSuccess: 1,
									}
									UIAPI.openWindow("./shop_pay_success.html", "shop_pay_success.html", param);
								}, function(error) {
									mui.alert('支付失败', ' ', function() {},"div");
								});
							} else {
								mui.alert('获取订单信息失败！', ' ', function() {},"div");
							}
							break;
						default:
							break;
					}
				}
				xhr.open('GET', PAYSERVER + amount);
				xhr.send();
			}, //end
			//余额支付
			payOrder: function(psd) {
				var param = {};
				var balanceAmout = _self.AcountBalance.AcountBalance;
				param.PayAmount = $("#payMoney")[0].value;;
				console.log(JSON.stringify(param));
				if (parseFloat(param.PayAmount) <= 0) {
					mui.toast("支付金额必须大于0");
					return false;
				}
			
				if (parseFloat(balanceAmout) < parseFloat(param.PayAmount)) {
					mui.toast("账户余额不足");
					return false;
				}
			
				if (param.PayPassword == "") {
					mui.toast("请输入密码");
					return false;
				}
				var param = {
					OrderID: _self.Order.OrderID,
					isSuccess: 1,
				}
				UIAPI.openWindow("./shop_pay_success.html", "shop_pay_success.html", param)
			} //end
		}, //methods
		computed: { //计算属性
			//多对一或一对一，支持缓存，不支持异步，只有依赖数据发生改变，才会重新进行计算
			// fname: function() {return null;}
			
		}, //computed
		watch: {
			
		}, //watch
		beforeCreate: function() {
			// alert('Before Create');
			_self = this;
		}, //beforeCreate
		created: function() {
			/**
			 * HTML5+API准备就绪
			 */
			mui.plusReady(function() {
				_self.initEvent();
				plus.payment.getChannels(function(channels) {
					for (var i in channels) {
						if (channels[i].id == "wxpay") {
							wxChannel = channels[i];
						} else {
							aliChannel = channels[i];
						}
					}
				}, function(e) {
					alert("获取支付通道失败：" + e.message);
				});
				_self.GoodsPayment();
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
				mui.back = function() {
					if (!isPaySuccess) {
						var btnArray = ['取消', '确定'];
						mui.confirm('确定要离开暂不支付订单吗？', ' ', btnArray, function(e) {
							if (e.index == 1) {
								//购物车 确认订单
								var SettlementCarGoods = plus.webview.getWebviewById("shop_SettlementCarGoods.html");
								if (SettlementCarGoods) {
									plus.webview.close(SettlementCarGoods, "none");
								}
								//建议订单 确认订单
								var suggestOrderSubmit = plus.webview.getWebviewById("shop_suggest_order_submit.html");
								if (suggestOrderSubmit) {
									plus.webview.close(suggestOrderSubmit, "none");
								}
								var ws = plus.webview.currentWebview();
								ws.close();
							}
						},"div")
					} else {
						var ws = plus.webview.currentWebview();
						ws.close();
					}
				};
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
