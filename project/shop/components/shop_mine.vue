<template>
	<div id="shop_mine" v-clock>
		<template>
			<!--使用render函数与createElement函数创建外部文件链接DOM-->
			<remote-js src=""></remote-js>
			<remote-css href=""></remote-css>
		</template>
		<template style="margin: 0;max-width: 100%;">
			<header class="mui-bar mui-bar-nav noShadow personalCenter-header">
				<h1 class="mui-title text-white">登录状态:/ {{ isLogin1() }} / {{ isLogin2() }} / {{ isLogin3 }} /</h1>
				<span class="mui-icon iconfont icon-m-ag mui-pull-right text-white btn-set" v-on:tap="toSetting()"></span>
			</header>
			
			<div id="mui-content" class="mui-content personalCenter" style="padding-bottom: 0px;">
				<div class="personalCenter-header-bg"></div>
				<div class="header-panel" style="min-height: 125px;">
					<div class="header-panel__head">
						<img style="background-color: white;" v-if="userInfo" v-bind:src="userInfo.HeadImageUrl" >
						<img style="background-color: white;" v-if="!userInfo" src="../assets/images/img/missing-face.png">
						<!-- <a v-on:tap="aaa()">我丢</a> -->
						<div class="mui-pull-left  mg-t-5" v-if="userInfo">
							<h3 class="title">{{userInfo.UserNo}}</h3>
							<h4 class="subtitle" v-on:tap="dial(userInfo.PlantLandlineNumber)">
								<label>配送方：</label>{{userInfo.DepartmentName}}
								&nbsp;&nbsp;<i class="iconfont icon-m-n" v-if="userInfo.PlantLandlineNumber" style="font-size:11px;color: #5b8dff;"></i>
							</h4>
						</div>
						<div class="mui-pull-left" style="margin-top: 8px;" v-else v-on:tap="login()">
							<h3 class="title">登录/注册</h3>
						</div>
					</div>
					<div class="tag-phone" v-if="userInfo">
						<a v-if="userInfo.Salesman" v-on:tap="dial(userInfo.SalesmanTEL)" class="tag-phone-item">
							销售经理：{{userInfo.Salesman}}
							<i class="iconfont icon-m-n"></i>
						</a>
						<a v-if="userInfo.Salessuper && userInfo.Salessuper!=userInfo.Salesman" v-on:tap="dial(userInfo.SalessuperTEL)"
						 class="tag-phone-item">
							上级领导：{{userInfo.Salessuper}}
							<i class="iconfont icon-m-n"></i>
						</a>
					</div>
			
					<div class="header-panel__body flexbox" v-if="userInfo">
						<div class="flexbox-item">
							<p class="mgb-0 text-red text-bold">￥ 1487.92</p>
							<p>余额</p>
						</div>
						<div class="flexbox-item">
							<p class="mgb-0 text-red text-bold">￥ 14.92</p>
							<p>待还款</p>
						</div>
					</div>
				</div>
			
				<div class="panel my-order">
					<div class="panel__title flexbox beforeline">
						<div class="panel-title__text">我的订单</div>
						<a class="link-more"  v-on:tap="toOrder('')">
							全部订单
							<span class="mui-icon mui-icon-arrowright"></span>
						</a>
					</div>
					<div class="panel__body flexbox">
						<div class="link-item" v-on:tap="toOrder('0')">
							<span class="mui-icon iconfont icon-m-o1 block"></span>
							未付款
						</div>
						<div class="link-item" v-on:tap="toOrder('1')">
							<span class="mui-icon iconfont icon-m-z1 block"></span>
							已受理
						</div>
						<div class="link-item" v-on:tap="toOrder('2')">
							<span class="mui-icon iconfont icon-m-p1 block"></span>
							已发货
						</div>
						<div class="link-item" v-on:tap="toOrder('3')">
							<span class="mui-icon iconfont icon-m-n1 block"></span>
							退货/退款
						</div>
					</div>
				</div>
				<!-- 我的工具 -->
				<div class="panel my-tools" v-if="userInfo">
					<div class="panel__title flexbox beforeline">
						<div class="panel-title__text">我的工具</div>
					</div>
					<div class="panel__body flexbox">
						<div class="link-item" v-on:tap="toFunction('./shop_suggest.order.html')">
							<div class="link-item-bgblock bgblock-1"></div>
							建议订单
						</div>
						<div class="link-item" v-on:tap="toFunction('./shop_saleorder.list.html')">
							<div class="link-item-bgblock bgblock-2"></div>
							销售管理
						</div>
						<div class="link-item" v-on:tap="toFunction('./shop_custom.refundbill.html')">
							<div class="link-item-bgblock bgblock-3"></div>
							客户退单
						</div>
						<div class="link-item" v-on:tap="toFunction('./shop_stock.manage.html')">
							<div class="link-item-bgblock bgblock-4"></div>
							库存管理
						</div>
						<!-- CustomerType:4一般客户 -->
						<div class="link-item" v-on:tap="toFunction('./shop_reward.index.html')">
							<div class="link-item-bgblock bgblock-5"></div>
							我的奖励
						</div>
						<div class="link-item" v-on:tap="toFunction('./shop_bankaccount.index.html')">
							<div class="link-item-bgblock bgblock-6"></div>
							我的账单
						</div>
						<div class="link-item" v-on:tap="toFunction('./shop_visited.index.html')">
							<div class="link-item-bgblock bgblock-7"></div>
							被拜访记录
						</div>
						<div class="link-item" v-on:tap="toFunction('./shop_brand.figure.html')">
							<div class="link-item-bgblock bgblock-8"></div>
							广告形象
						</div>
						<div class="link-item" v-on:tap="toFunction('./shop_contract.manage.html')">
							<div class="link-item-bgblock bgblock-9"></div>
							合同管理
						</div>
						<div class="link-item" v-on:tap="toFunction('./shop_invoice.index.html')">
							<div class="link-item-bgblock bgblock-10"></div>
							发票管理
						</div>
						<div class="link-item" v-on:tap="toFunction('./shop_goodsprice.index.html')">
							<div class="link-item-bgblock bgblock-11"></div>
							客户商品价格管理
						</div>
						<div class="link-item" v-on:tap="toFunction('./shop_shop_cardvoucher.index.html')">
							<div class="link-item-bgblock bgblock-12"></div>
							我的卡券
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
		name: 'shop_mine',
		template: '#shop_mine',
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
				// userInfo: StorageAPI.getUser()
				// userInfo: _eventHub.$options.methods.StorageAPI_getUser()
				// userInfo: _self.$store.state.test2.userInfo
				isLogin: _self.$store.getters['test2/getLoginState']('isLogin'), //是否已登录
				userInfo: _self.$store.state.test2.userInfo,
			} //retrun
		}, //data
		computed: { //计算属性
			//多对一或一对一，支持缓存，不支持异步，只有依赖数据发生改变，才会重新进行计算
			// fname: function() {return null;}
			isLogin3: function() {
				return _self.$store.getters['test2/getLoginState']('isLogin');	// 重复登录退出操作只更新一次
				// return _self.$store.state.test2.isLogin;
				// return window.localStorage.isLogin;
			},
			login3: function() {
				return _self.$store.state.test2.isLogin;
			},
			userInfo: function() {
				return _self.$store.state.test2.userInfo;
			}
		}, //computed
		watch: {
			userInfo: function(newVal, oldVal){
				_self.$data.userInfo = _self.$store.state.test2.userInfo;
				console.log("watchuserInfo: "+JSON.stringify(newVal), JSON.stringify(oldVal));
			},
			isLogin: function(newVal, oldVal){
				// _self.$data.isLogin = _self.$store.state.test2.isLogin;
				console.log("watchisLogin: "+JSON.stringify(newVal), JSON.stringify(oldVal));
			}
		}, //watch
		filters: { //自定义过滤函数

		}, //filters
		methods: {
			/**
			 * 跳转到设置页面
			 */
			toSetting:function(){
				UIAPI.openWindow("./shop_setting.html", "shop_setting.html", "账户设置", null);
			},
			/**
			 * 未登录时去登录
			 */
			login: function() {
				UIAPI.goLogin("./shop_login.html", "shop_home.html", "shop_home.html", null)
			},
			/**
			 * 跳转到订单
			 * @param {Object} status 订单状态
			 */
			toOrder: function(status) {
				var extras = {
					Status: status
				}
				if (!_self.userInfo) {
					UIAPI.goLogin("./shop_login.html", "", "", extras)
					return false;
				}
				UIAPI.openWindow("./shop_order_list.html", "shop_order_list.html", extras);
			},
			/**
			 * @param {Object} href
			 * @param {Object} title
			 */
			toFunction: function(href, title) {
				var extras = {
					Status: ""
				}
				if (!_self.userInfo) {
					var id = href;
					UIAPI.goLogin("./shop_login.html", href, id, extras)
					return false;
				}
				mui.toast("跳转...")
			},
			/**
			 * 打电话
			 * @param {Object} phone
			 */
			dial: function(phone) {
				if(!phone){
					mui.toast("电话号码不能为空")
					return false;
				}
				var btnArray=['取消','拨打'];
			    mui.confirm('是否拨打 '+phone+' ?',' ',btnArray,function(e){
			        if(e.index == 1){
			            plus.device.dial(phone,false);
			        }
			    },"div");
			}, //end
			isLogin1: function(){
				return _self.$store.state.test2.isLogin;
			},
			isLogin2: function(){
				return _self.$store.getters['test2/getLoginState']('isLogin');
				// return _self.$store.state.test2.isLogin;
			},
			aaa: function(){
				// _self.$store.commit('test2/setLoginState', {isLogin: 666});
				// _self.$store.dispatch('test2/updateLoginState');
				// alert(_self.$store.getters['test2/loadIslogin'])；
				// _self.$store.getters['test2/loadIslogin'];
				// _self.$store.getters.LoginStatus;
				// _eventHub.$options.methods.StorageAPI_reStorage('encryptionStore');
				// alert(JSON.stringify(_self.$store.state.test2));
				// alert(JSON.stringify(_self.$store.state.test2.isLogin));
				// alert(JSON.stringify(_eventHub.$options.methods.StorageAPI_getStorage('encryptionStore')));
				/**
				 * 获取所有localstorage
				 */
				for (var i = 0; i < localStorage.length; i++)   {
				    alert(localStorage.key(i) +"=[" + localStorage.getItem(localStorage.key(i)) +"]");
					// if(localStorage.key(i)=='_secure__ls__metadata'){
					//	// localStorage.removeItem(localStorage.key(i));
					// 	alert(localStorage.getItem(localStorage.key('_secure__ls__metadata')));
						
					// }
				}
				// localStorage.removeItem('paly');
				// alert(ls.get('encryptionStore'));
				var lsStatus = JSON.parse(secure_ls.get('encryptionStore_shopStore_test2'));
				// var lsStatus1 = JSON.parse(secure_ls.get('encryptionStore_test2'));
				// 获取vuex-persistedstate缓存的State全局变量及对应的值
				alert(JSON.stringify(lsStatus));
				// alert(localStorage.getItem('_secure__ls__metadata'));
				// secure_ls.remove('encryptionStore');
				// localStorage.removeItem('_secure__ls__metadata');
				// alert(JSON.stringify(lsStatus1));
				// var lsStatusArry = [];
				// lsStatusArry.push(lsStatus);
				
				// _self.$store.getters['test2/getLoginState']('aaa');
			}
		}, //methods
		beforeCreate: function() { // console.log("执行顺序:1");
			_self = this;
			_self.$nextTick(function() { // console.log("执行顺序:6");
				
			});
		}, //beforeCreate
		created: function() { // console.log("执行顺序:2");
			// 更新缓存
			// _self.$set(_self.isLogin, _self.$store.state.test2.isLogin);
			// _self.isLogin = window.localStorage.isLogin;
			
			// _self.$store.dispatch('test2/loadLoginStatus'); //更新当前储存在store里isLogin的状态
			_self.$store.dispatch('test2/updateLoginState');
			// _self.isLogin = _self.$store.state.test2.isLogin; //把更新的isLogin状态赋值
			// // _self.isLogin = _self.isLogin1();
			// // _self.userInfo = _eventHub.$options.methods.StorageAPI_getUser();
			// _self.userInfo = _self.$store.state.test2.userInfo; //把更新的isLogin状态赋值
			// // alert("_self.isLogin:" + JSON.stringify(_self.isLogin));
			/**
			 * HTML5+API准备就绪
			 */
			mui.plusReady(function() {
				// _self.userInfo = StorageAPI.getUser();
				// _self.userInfo = _eventHub.$options.methods.StorageAPI_getUser();
				// alert(ls.get('encryptionStore'));
				// _self.userInfo = _self.$store.state.test2.userInfo;
				
			});
			
			window.addEventListener('refrash_loginData', function(event) { //执行刷新
				console.log("shop_mine收到!");
				// _self.userInfo = {};
				// _self.userInfo = StorageAPI.getUser();
				_self.$store.dispatch('test2/updateLoginState'); // 刷新缓存
				_eventHub.refrash_loginData(_self.$data); // 或 _self.refrash_loginData(_self.$data);
				/**
				 * 批量更新data里缓存参数的值(要求data里定义的变量名和store.state.test2中定义的变量名一致)
				 */
				// console.log(Object.keys(_self.$data).length);
				// for(var i=0; i<Object.keys(_self.$data).length; i++) {
				// 	// console.log(Object.keys(_self.$data)[i]);
				// 	Object.keys(_self.$data).map(function(data_key){
				// 		// console.log("$data:" + _self.$data[data_key]);
				// 		// console.log("$data:" + Object.keys(_self.$data)[i]);
				// 		// return key
				// 		// console.log(key)
				// 		for(var j=0; j<Object.keys(_self.$store.state.test2).length; j++) {
				// 			Object.keys(_self.$store.state.test2).map(function(store_state_test2_key){
				// 				// console.log("$store:" + _self.$store.state.test2[store_state_test2_key]);
				// 				// console.log("$store:" + Object.keys(_self.$store.state.test2)[j]);
				// 				if(Object.keys(_self.$data)[i] == Object.keys(_self.$store.state.test2)[j]) {
				// 					// data_key[key] = store_state_test2_key[key]
				// 					// console.log(Object.keys(_self.$data)[i])
				// 					_self.$data[data_key] = _self.$store.state.test2[store_state_test2_key];
				// 				}
				// 			});
				// 		}
				// 	});
				// }
				// // _self.$store.dispatch('test2/loadLoginStatus'); //更新当前储存在store里isLogin的状态
				// _self.isLogin = _self.$store.state.test2.isLogin; //把更新的isLogin状态重新赋值 1
				// // _self.userInfo = _eventHub.$options.methods.StorageAPI_getUser();
				// _self.userInfo = _self.$store.state.test2.userInfo; //把更新的userInfo状态重新赋值 2
				// // _self.isLogin = window.localStorage.isLogin;
				// // alert("mine:" + _self.$store.state.test2.isLogin);
				// // alert("refrash_loginData:" + window.localStorage.isLogin);
				// // alert(JSON.stringify());
			});
			_self.$nextTick(function() {
				_self.$forceUpdate();
			});
		}, //created
		beforeMount: function() {
			_self.$nextTick(function() {
				// localStorage.clear();
			});
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
				// _self.$store.dispatch('test2/loadLoginStatus'); // 执行shop_store中数据仓库test2的actions中定义的loadLoginStatus方法实例
				var wgids = [
					{
						"id": "GetWebviewAll",
						"incident": "isLogin",
						"parm": {}
					}
				]
				_eventHub.$options.methods.GetMuiFire(wgids);
			});
			_self.$nextTick(function() {
				// _self.$store.commit('test2/markIsLogin'); // 执行shop_store中数据仓库test2的mutations中定义的markIsLogin方法实例
				// localStorage.clear(); // 清除所有localStorage缓存
				// _self.$store.dispatch('test2/loadLoginStatus'); // 执行shop_store中数据仓库test2的actions中定义的loadLoginStatus方法实例
				// _eventHub.$options.methods.xianshi(); // 执行_event vue实例的methods中定义的xianshi方法实例
				// _eventHub.$options.methods.onLogin(); // 执行_event vue实例的methods中定义的onLogin方法实例
				/**************************************
				// 给_event vue实例的data中定义的new Vue()对象添加xianshi1方法实例
				_eventHub.eventHub.$on('xianshi1', function(){
					alert("666");
				});
				// 触发_event vue实例的data中定义的new Vue()对象添加的xianshi1方法实例
				_eventHub.eventHub.$emit('xianshi1');
				****************************************/
				// localStorage.clear();
				// alert(JSON.stringify(StorageAPI.getUser()));
				// _self.$store.commit.mapActions('test2', [markIsLogin]);
				// _self.$store.dispatch('test2/loadLoginStatus');
			});
		}, //mounted
		beforeUpdate: function() {
			
		}, //beforeUpdate
		updated: function() {
			// alert("mine:" + _self.$store.state.test2.isLogin);
			// _self.$store.dispatch('test2/loadLoginStatus'); //获取当前储存在store里isLogin的状态
			// _self.isLogin = _self.$store.state.test2.isLogin; //把获取到的isLogin状态赋值
		}, //updated
		beforeDestroy: function() {
			
		}, //beforeDestroy
		destroyed: function() {
			
		} //destroyed
	}
</script>

<style scoped> /* scoped属性：私有属性，样式只对此组件内元素生效，不影响其他组件*/
	
</style>
