<template>
	<div id="shop_setting" v-clock>
		<template>
			<!--使用render函数与createElement函数创建外部文件链接DOM-->
			<remote-js src=""></remote-js>
			<remote-css href=""></remote-css>
		</template>
		<template class="mui-fullscreen">
			<header class="mui-bar mui-bar-nav bg-red noShadow">
				<a  class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left text-white"></a>
				<h1 class="mui-title text-white">账户设置</h1>
			</header>
			
			<!--页面主内容区开始-->
			<div class="mui-page-content" style="margin-top: 64px;">
				<div class="mui-scroll-wrapper">
					<!--头像，菜单列表-->
					<div class="mui-scroll">
						<!--头像，菜单列表-->
						<ul class="mui-table-view mui-table-view-chevron mgb-6">
							<li class="mui-table-view-cell mui-media">
								<a data-login="1" class="mui-navigate-right headImg-link"  href="./shop_account.html" title="基本信息">
									<img v-if="userInfo!=null" v-bind:src="userInfo.HeadImageUrl" class="mui-media-object head-img" id="head-img">
									<img v-if="userInfo==null" src="../assets/images/img/missing-face.png" class="mui-media-object head-img" id="head-img">
									<div class="mui-media-body" v-if="userInfo!=null">
									    <span>{{userInfo.userNo}}</span>
										<p class="mui-ellipsis">{{userInfo.Phone}}</p>
									</div>
									<p v-if="userInfo==null" v-on:tap="login()">
										登录/注册
									</p>
								</a>
							</li>
						</ul>
						<!-- 菜单列表 -->
						<ul class="mui-table-view mui-table-view-chevron mgb-6">
							<li class="mui-table-view-cell">
								<a data-login="1" title="收货地址管理" data-wid="./shop_address.html" href="./shop_address.html" class="mui-navigate-right">
								    <img src="../assets/images/img/SetShippingAddress.png" class="mean-img">
								    <span>收货地址管理</span>
								</a>
							</li>
							<li class="mui-table-view-cell" >
								<a data-login="1" title="设置支付密码" href="./shop_setPayPwd.html" class="mui-navigate-right">
								    <img src="../assets/images/img/SetPayPassword.png" class="mean-img">
								    <span>设置支付密码</span>
								</a>
							</li>
							<li  class="mui-table-view-cell">
								<a data-login="1" title="重置登录密码" href="./shop_resetLoginPwd.html" class="mui-navigate-right">
								    <img src="../assets/images/img/SetResetLoginPassword.png" class="mean-img">
								    <sapn>重置登录密码</sapn>
								</a>
							</li>
							<li class="mui-table-view-cell">
								<a data-login="1" title="建议反馈" href="./shop_feedback.html" class="mui-navigate-right">
								    <img src="../assets/images/img/SetFeedback.png" class="mean-img">
								    <span>建议反馈</span>
								</a>
							</li>
							<li class="mui-table-view-cell">
								<a href="./shop_phone.html" class="mui-navigate-right">
								    <img src="../assets/images/img/SetCustomerService.png" class="mean-img">
								    <span>联系客服</span>
								</a>
							</li>
							<li class="mui-table-view-cell">
								 <a data-login="0"  title="关于" href="./shop_about.html" class="mui-navigate-right">
			                         <img src="../assets/images/img/SetAbout.png" class="mean-img">
			                         <span>关&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;于</span>
			                     </a>
							</li>
						</ul>
						<!--底部按钮-->
			            <div class="click-btn" >
			                <ul class="mui-table-view mui-table-view-chevron mgb-6">
			                    <li class="mui-table-view-cell">
			                        <!-- <a v-on:tap="logout()" class="mui-bar mui-bar-tab font-color-red">退出登录</a> -->
									<a v-if="userInfo!=null"  v-on:tap="logout()" class="mui-bar-tab font-color-red">退出登录</a>
									<a v-if="userInfo==null"  v-on:tap="login()" class="mui-bar-tab font-color-red">去 登 录</a>
			                    </li>
			                </ul>
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
		name: 'shop_setting',
		template: '#shop_setting',
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
				// isLogin: _self.$store.state.test2.isLogin, //是否已登录
				userInfo: null
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
			 * 退出登录
			 */
			logout:function() {
				if (!window.localStorage) {
					alert("浏览器支持localstorage");
				} else {
					// var storage = window.localStorage;
					
					_self.$store.commit('test2/setLoginState', {isLogin:0}); // 执行shop_store中数据仓库test2的mutations中定义的setLoginState方法实例
					// _self.$store.dispatch('test2/loadLoginStatus111', 0);
					// storage.removeItem('user-test');
					
					// _eventHub.$options.methods.StorageAPI_reStorage('user-test');
					_self.$store.commit('test2/setLoginState', {userInfo:null});
					// _eventHub.$options.methods.StorageAPI_reStorage('LoginName');
					_self.$store.commit('test2/setLoginState', {LoginName:null});
					// _eventHub.$options.methods.StorageAPI_reStorage('Password');
					_self.$store.commit('test2/setLoginState', {Password:null});
					// _eventHub.$options.methods.StorageAPI_reStorage('isRemember');
					_self.$store.commit('test2/setLoginState', {isRemember:0});
					var params = {
						isLogoutOpr: 1
					}
					// localStorage.clear();
					UIAPI.openWindow("./shop_login.html", "shop_login.html", params)
				}
			}, //end
			/**
			 * 登录
			 */
			login: function() {
				UIAPI.openWindow("./shop_login.html", "shop_login.html", {})
			} //end
		}, //methods
		beforeCreate: function() {
			// alert('Before Create');
			_self = this;
			_self.$nextTick(function() { // console.log("执行顺序:6");
				//更新缓存
				_self.$store.dispatch('test2/updateLoginState');
			});
		}, //beforeCreate
		created: function() { //页面加载完成前，vue实例创建完成之后
			//当我们的组件加载完成时，需要执行的内容.created是vuejs中的勾子函数之一
			//this.函数名();//函数的调用
			// alert('Created');
			/**
			 * mui.plusReady
			 */
			mui.plusReady(function() {
				// _self.userInfo = StorageAPI.getUser();
				_self.userInfo = _self.$store.state.test2.userInfo;
				//主列表点击事件
				mui('.mui-scroll').on('tap', 'a', function() {
					var href = this.getAttribute('href');
					
					if(href == "shop_phone.html"){
						var phone = "021-56559797-298";
						var btnArray=['取消','拨打'];
						mui.confirm('是否拨打 '+phone+' ?',' ',btnArray,function(e){
						    if(e.index == 1){
						        plus.device.dial(phone,false);
						    }
						},"div");
						return;
					}
					
					//非plus环境，直接走href跳转
					if (!mui.os.plus) {
						location.href = href;
						return;
					}
					var id = this.getAttribute("data-wid");
					if (!id) {
						id = href;
					}
					var title = this.getAttribute("title");
					if (href && ~href.indexOf('.html')) {
						var extras = {
							Status: ""
						}
						if (_self.userInfo) {
							//打开新窗口
							if(href.indexOf("address")>0){
								UIAPI.openWindowWithTitle(href, id,title, extras)
							}else{
								UIAPI.openWindowWithTitle(href, id,title, null)
							}
						} else {
							var islogin = this.getAttribute("data-login");
							if (islogin == 1) {
								UIAPI.goLogin("./shop_login.html", "shop_home.html", "shop_home.html", "", null)
							} else {
								UIAPI.openWindowWithTitle(href, id,title, null)
							}
						}
					}
				});
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
