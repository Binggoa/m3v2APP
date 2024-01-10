<template>
	<div id="shop_login" v-clock>
		<template>
			<!--使用render函数与createElement函数创建外部文件链接DOM-->
			<remote-js src=""></remote-js>
			<remote-css href=""></remote-css>
		</template>
		<template id="body" class="bg-white">
			<div id="login-box" class="login-wrapper">
				<header class="mui-bar mui-bar-nav bg-linear noShadow">
					<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left text-white"></a>
					<h1 class="mui-title">登录</h1>
				</header>
			
				<div class="mui-content bg-white" style="margin-top: -2px;">
			
					<div class="logo">
						<img src="../assets/images/img/mall_code.png">
					</div>
			
					<div class="w80-pst mgauto mgtb-50 mui-input-group noBefore noAfter login-form">
						<div class="mui-input-row noAfter border border-radius mgb-025">
							<i class="iconfont icon-m-n"></i>
							<input type="number" oninput="value=value.replace(/[^\d]/g,'')" class="mui-input-clear" v-model="LoginName"
							 placeholder="请输入您的手机号">
						</div>
						<div class="mui-input-row noAfter border border-radius mgb-025">
							<i class="iconfont icon-m-j"></i>
							<input type="password" class="mui-input-password" v-model="Password" placeholder="请输入您的密码">
						</div>
						<div class="mgb-025 pdlr-01 mui-clearfix">
							<div class="mui-pull-left">
								<label class="login-form__label">
									<input id="remember" v-bind:checked="isRemember" v-model="isRemember" type="checkbox" class="input__remember mui-icon mui-icon-checkmarkempty">
									<span class="label__text">
										记住密码
									</span>
								</label>
							</div>
							<div class="mui-pull-right">
								<a class="link__forgetpwd">忘记密码？</a>
							</div>
						</div>
						<button type="submit" v-bind:disabled="!LoginName || LoginName.length!=11 || !Password" class="mui-btn mui-btn-block btn-submit bg-red text-white h72"
						 data-loading-text="提交中" data-loading-icon-position="right">登录</button>
			
						<div class="mui-text-center mgt-08 text-small">
							还没有商城账号？<a class="text-red link__register">立即注册</a>
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
		name: 'shop_login',
		template: '#shop_login',
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
				LoginName: "15221355690",
				Password: "123456",
				isRemember: true,
				userInfoByCache: null
			} //retrun
		}, //data
		computed: { //计算属性
			//多对一或一对一，支持缓存，不支持异步，只有依赖数据发生改变，才会重新进行计算
			// fname: function() {return null;}
			//记住密码
			
		}, //computed
		watch: {
			
		}, //watch
		filters: { //自定义过滤函数

		}, //filters
		methods: {
			/**
			 * 后退方法重构
			 */
			back: function() {
				var ws = plus.webview.currentWebview();
				if (ws.isLogoutOpr == 1) {
					var shop_setting = plus.webview.getWebviewById("shop_setting.html");
					if (shop_setting) {
						plus.webview.close(shop_setting, "none");
					}
					var noticeArr = ['shop_home.html','shop_mine.html','shop_cart.html']; // 通知多个id为数组
					dongyi.sendNotice(noticeArr, 'refrash_loginData', {});
					// var shop_home = plus.webview.getWebviewById('shop_home.html');
					// if(shop_home){
					// 	mui.fire(shop_home, 'refrash_homeData');
					// }
					
					// var shop_cart = plus.webview.getWebviewById('shop_cart.html');
					// if(shop_cart){
					// 	mui.fire(shop_cart, 'loadData');
					// }
					
					// var shop_mine = plus.webview.getWebviewById('shop_mine.html');
					// if(shop_mine){
					// 	mui.fire(shop_mine, 'refresh_mine');
					// }
					
				}
				ws.close();
				return true;
			}, //end
			/**
			 * 登录
			 * @param {Object} self
			 * @param {Object} that
			 */
			login: function(self, that) {
				if (!_self.LoginName) {
					mui.toast("请输入手机号码");
					return false;
				}
				if (!_self.Password) {
					mui.toast("请输入密码");
					return false;
				}
				mui(that).button('loading');
				//模拟登陆
				var files = ['../assets/data/json/userModel.json'];
				$.getJSON(files[0], function(usMdata){
					_self.userInfoByCache = usMdata;
					console.log("userInfoByCache:" + JSON.stringify(_self.userInfoByCache));
				});
				var t1 = window.setTimeout(function(){
					mui(that).button('reset');
					document.activeElement.blur(); //隐藏软键盘  
					_self.$store.commit('test2/setLoginState', {isLogin:1}); //同步 执行shop_store中数据仓库test2的mutations中定义的setLoginState方法实例
					// _self.$store.dispatch('test2/updateLoginState'); // 异步
					// alert("login:" + _self.$store.state.test2.isLogin)
					// _eventHub.$options.methods.StorageAPI_setStorage("user-test", userInfoByCache);
					_self.$store.commit('test2/setLoginState', {userInfo:_self.userInfoByCache});
					// StorageAPI.setStorage("user-test", userInfoByCache);
					//记住密码
					if (_self.isRemember) {
						// StorageAPI.setStorage("isRemember", 1);
						// StorageAPI.setStorage("LoginName", _self.LoginName);
						// StorageAPI.setStorage("Password", _self.Password);
						
						// _eventHub.$options.methods.StorageAPI_setStorage("isRemember", 1);
						_self.$store.commit('test2/setLoginState', {isRemember:1});
						// _eventHub.$options.methods.StorageAPI_setStorage("LoginName", _self.LoginName);
						_self.$store.commit('test2/setLoginState', {LoginName:_self.LoginName});
						// _eventHub.$options.methods.StorageAPI_setStorage("Password", _self.Password);
						_self.$store.commit('test2/setLoginState', {Password:_self.Password});
					} else {
						// StorageAPI.setStorage("isRemember", 0);
						// _eventHub.$options.methods.StorageAPI_setStorage("isRemember", 0);
						_self.$store.commit('test2/setLoginState', {isRemember:0});
						// var storage = window.localStorage;
						// storage.removeItem('LoginName');
						// storage.removeItem('Password');
						
						// _eventHub.$options.methods.StorageAPI_reStorage('LoginName');
						_self.$store.commit('test2/setLoginState', {LoginName:null});
						// _eventHub.$options.methods.StorageAPI_reStorage('Password');
						_self.$store.commit('test2/setLoginState', {Password:null});
					}
					
					var shop_setting = plus.webview.getWebviewById("shop_setting.html");
					if (shop_setting) {
						plus.webview.close(shop_setting, "none");
					}
					
					var noticeArr = ['shop_home.html','shop_mine.html','shop_cart.html']; // 通知多个id为数组
					dongyi.sendNotice(noticeArr, 'refrash_loginData', {});
					// var shop_home = plus.webview.getWebviewById('shop_home.html');
					// if(shop_home){
					// 	mui.fire(shop_home, 'refrash_homeData');
					// }
					
					// var shop_mine = plus.webview.getWebviewById('shop_mine.html');
					// if(shop_mine){
					// 	mui.fire(shop_mine, 'refresh_mine');
					// }
					
					// var shop_cart = plus.webview.getWebviewById('shop_cart.html');
					// if(shop_cart){
					// 	mui.fire(shop_cart, 'loadData');
					// }
					
					var shop_login = plus.webview.getWebviewById("shop_login.html");
					if (shop_login) {
						plus.webview.close(shop_login, "none");
					}
				}.bind(_self), 1000);
			} //end
		}, //methods
		beforeCreate: function() {
			_self = this;
			_self.$nextTick(function() {
				// 更新缓存
				_self.$store.dispatch('test2/updateLoginState');
				// if (StorageAPI.getStorage('isRemember') == 1) {
				// 	_self.LoginName = StorageAPI.getStorage("LoginName");
				// 	_self.Password = StorageAPI.getStorage("Password");
				// }
				// if(_eventHub.$options.methods.StorageAPI_getStorage("isRemember") == 1){
				if(_self.$store.state.test2.isRemember == 1){
					// _self.LoginName = _eventHub.$options.methods.StorageAPI_getStorage("LoginName");
					_self.LoginName = _self.$store.state.test2.LoginName;
					// _self.Password = _eventHub.$options.methods.StorageAPI_getStorage("Password");
					_self.Password = _self.$store.state.test2.Password;
				}
			});
		}, //beforeCreate
		created: function() {
			/**
			 * HTML5+API准备就绪
			 */
			mui.plusReady(function() {
				var _submit = document.querySelector('.btn-submit');
				//监听点击事件
				_submit.addEventListener("tap", function() {
					_self.isLogout = true;
					var ws = plus.webview.currentWebview();
					_self.login(ws, this)
				});
				// var shop_mine = plus.webview.getWebviewById('shop_mine.html');
				// console.log(shop_mine);
			});
			
			// if(window.plus){
			//     // 在这里调用5+ API
			// }else{// 兼容老版本的plusready事件
			//     document.addEventListener('plusready',function () {
			//         // 在这里调用5+ API
			//     },false);
			// }
			_self.$nextTick(function() {
				// localStorage.clear();
			});
		}, //created
		beforeMount: function() {
			
		}, //beforeMount
		mounted: function() {
			/**
			 * MUI框架初始化
			 */
			mui.init({
				beforeback: _self.back
			}); //其他组件已经初始化过mui.init({});以内容最多的为主
			
			/**
			 * 所有动态获取的控件初始化需在mui.ready(function(){});内执行
			 */
			mui.ready(function(){
				
			});
		
			_self.$nextTick(function() { // console.log("执行顺序:9");
		
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
