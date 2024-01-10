<template>
	<div id="native_bottom_tab" class="bg-gray" v-clock>
		<template>
			<!--使用render函数与createElement函数创建外部文件链接DOM-->
			<!-- <remote-js src="../assets/js/shop_share.js"></remote-js> -->
			<remote-css href=""></remote-css>
		</template>
		<template>
		<nav class="mui-bar mui-bar-tab mui-bar-tab_tb">
			<a v-for="(item,index) in tabbar" v-bind:key="index" class="mui-tab-item" v-bind:class="{'mui-active': index === initIndex}"
			 v-bind:href="item.url" v-on:tap="tab(item,index)">
				<span class="mui-icon iconfont " v-bind:class="'icon-' + item.icon "></span>
				<span class="mui-tab-label">{{item.title}}</span>
			</a>
		</nav>
		</template>
	</div>
</template>

<script>
	var _self = {};
	module.exports = {
		name: 'native_bottom_tab',
		template: '#native_bottom_tab',
		components: {
			'remote-js': {
				render(createElement) {return createElement('script', {attrs: { type: 'text/javascript', src: this.src }})},
				props: {src: {type: String, required: true}}
			},
			'remote-css': {
				render(createElement) {return createElement('link', {attrs: {rel: 'stylesheet', type: 'text/css', href: this.href}})},
				props: {href: {type: String, required: true }}
			}
		}, //components
		store: shop_store,
		router: shop_router,
		props: { //通过 Prop 向子组件传递数据，不支持驼峰命名，使用 v-bind 来动态传递 prop：<blog-post v-for="post in posts" v-bind:key="post.id" v-bind:title="post.title"></blog-post>
			// Tname: {type: Array,default: () => []},
			// activeName: {type: String,default: ''}
			// 接收父组件传过来的值
			title: { type: String },
			activetab: { type: String },
			tabbar: { type: Array }
		}, //props
		data: function() {
			return { //这里不要忘记return
				//这里可以定义初始的变量
				initIndex: 0, //[初始化参数]
				//其余初始化参数由父组件data定义并在子组件标签内v-bind绑定，子组件props接收传值，
				// props的优先级 > data中的优先级 > menthods中的优先级
				// 如果在这个key值在props中出现，那么data中的key值就不能定义了。
				subStyle: {
					top: '45px',
					bottom: '51px'
				},
				currentIndex: _self.$props.activetab, //currentIndex接收父组件传来的activeTab值；
				isLogin: _self.$store.state.test2.isLogin
			} //retrun
		}, //data
		computed: { //计算属性
			
		}, //computed
		watch: {
			
		}, //watch
		filters: { //自定义过滤函数

		}, //filters
		methods: {
			/**
			 * 选项卡点击事件
			 * @param {Object} index
			 */
			tab: function(item, index) {
				mui.plusReady(function(){
					//获取标题
					var targetTab = _self.tabbar[index].url,
						activeTab = _self.activeTab,
						title = _self.title,
						aniShow = {},
						temp = {},
						// self = plus.currentWebview(),
						// sub = plus.webview.create(targetTab);
						// 标题切换 title.innerHTML = _self.querySelector('.mui-tab-label').innerHTML;
						title = _self.tabbar[index].title;
					// 子页内容切换
					if (targetTab[0] == activeTab) {
						return;
					}
					//显示目标选项卡
					//若为iOS平台或非首次显示，则直接显示
					if (mui.os.plus || aniShow[targetTab]) {
						// 显示目标webview
						plus.webview.show(targetTab);
					} else {
						//否则，使用fade-in动画，且保存变量
						temp[targetTab] = "true";
						mui.extend(aniShow, temp);
						plus.webview.show(targetTab, "fade-in", 300);
						//self.append(sub);
					}
					// 隐藏当前webview
					plus.webview.hide(_self.activeTab);
					// 更改当前活跃的选项卡
					_self.currentIndex = targetTab;
				});
			}, //end
			/**
			 * 打开分享窗口
			 */
			openShare: function() {
				_self.$options.methods.shareWebview();
			}, //end
			/**
			 * 分享窗口  
			 */
			shareWebview: function() {
				mui.plusReady(function(){
					var sharew;
					var ws = null;
					ws = plus.webview.currentWebview();
					if (sharew) { // 避免快速多次点击创建多个窗口  
						return;
					}
					var top = plus.display.resolutionHeight - 330;
					var href = "./public/share/shop_share.html";
					sharew = plus.webview.create(href, "public/share/shop_share.html", {
						width: '100%',
						height: '330',
						top: top,
						scrollIndicator: 'none',
						scalable: false,
						popGesture: 'none'
					}, {
						shareInfo: {
							"url": "test",
							"title": "测试",
							"content": "测试",
							"pageSourceId": ws.id
						}
					});
					sharew.addEventListener("loaded", function() {
						sharew.show('slide-in-bottom', 300);
					}, false);
					// 显示遮罩层    
					ws.setStyle({
						mask: "rgba(0,0,0,0.5)"
					});
					// 点击关闭遮罩层  // ws.addEventListener("maskClick", _self.$options.methods.closeMask(), false);
					ws.addEventListener("maskClick", function() {
						_self.$options.methods.closeMask();
					}, false);
				});
			}, //end
			/**
			 * 关闭遮罩
			 */
			closeMask: function() {
				mui.plusReady(function(){
					var sharew;
					sharew = plus.webview.getWebviewById("public/share/shop_share.html");
					// var wg = plus.webview.getWebviewById("shop_share.html").opener();
					ws =  plus.webview.currentWebview(); // 当前webview
					ws.setStyle({
						mask: "none"
					});
					//避免出现特殊情况，确保分享页面在初始化时关闭   
					if (!sharew) {
						sharew = plus.webview.getWebviewById("public/share/shop_share.html");
					}
					if (sharew) {
						// mui.fire(sharew, 'click'); // 执行页面关闭动画,使得页面关闭不会显得突兀
						setTimeout(function() {
							sharew.close();
							setTimeout(function() {
								sharew = null; // 等页面关闭后再重置变量的值,否则报错Cannot read property 'close' of null
							}, 100);
						}, 200);
					}
				});
			} //end
		}, //methods
		beforeCreate: function() {
			_self = this; 
		}, //beforeCreate
		created: function() {
			//跳转页面
			var subpages = [_self.tabbar[0].url, _self.tabbar[1].url, _self.tabbar[2].url, _self.tabbar[3].url, _self.tabbar[4].url];
			var ids = subpages;
			var aniShow = {};
			//当前激活选项
			var activeTab = ids[0];
			//创建子页面，首个选项卡页面显示，其它均隐藏；
			mui.plusReady(function() {
				//从本地缓存中获取用户令牌信息，通过令牌可以获取用户信息
				var userToken = window.localStorage.getItem("userToken");
				if (userToken == null || userToken == "" || userToken.length == 0) {
					// goToLogin();
				};

				var wsself = plus.webview.currentWebview(), // 初始化首页tab窗口为首次显示
					leftPos = Math.ceil((window.innerWidth - 60) / 2); // 设置凸起大图标为水平居中
				/**	
				 * drawNativeIcon 绘制带边框的半圆，
				 * 实现原理：
				 *   id为bg的tag 创建带边框的圆
				 *   id为bg2的tag 创建白色矩形遮住圆下半部分，只显示凸起带边框部分
				 * 	 id为iconBg的红色背景图
				 *   id为icon的字体图标
				 *   注意创建先后顺序，创建越晚的层级越高
				 */
				var drawNativeIcon = util.drawNative('icon', {
					bottom: '5px',
					left: leftPos + 'px',
					width: '60px',
					height: '60px'
				}, [{
					tag: 'rect',
					id: 'bg',
					position: {
						top: '1px',
						left: '0px',
						width: '100%',
						height: '100%'
					},
					rectStyles: {
						color: '#FFFFFF',
						radius: '50%',
						borderColor: '#ccc', //凸起圆球顶部外边框颜色
						borderWidth: '1px'
					}
				}, {
					tag: 'rect',
					id: 'bg2',
					position: {
						bottom: '-0.5px',
						left: '0px',
						width: '100%',
						height: '45px'
					},
					rectStyles: {
						color: '#f7f7f7' //凸起圆球外层底色，原版#FFFFFF
					}
				}, {
					tag: 'rect',
					id: 'iconBg',
					position: {
						top: '5px',
						left: '5px',
						width: '50px',
						height: '50px'
					},
					rectStyles: {
						color: '#d74b28',
						radius: '50%'
					}
				}, {
					tag: 'font',
					id: 'icon',
					text: '\ue600', //此为字体图标Unicode码'\e600'转换为'\ue600'
					position: {
						top: '0px',
						left: '5px',
						width: '50px',
						height: '100%'
					},
					textStyles: {
						fontSrc: '../assets/fonts/lib/iconfont.ttf',
						align: 'center',
						color: '#FFFFFF',
						size: '30px'
					}
				}]);
				// append 到父webview中，------此步骤很重要
				wsself.append(drawNativeIcon);


				//自定义监听图标点击事件
				var active_color = '#FFFFFF';
				drawNativeIcon.addEventListener('click', function(e) {
					// mui.alert('你点击了图标，你在此可以打开摄像头或者新窗口等自定义点击事件。', '悬浮球点击事件');
					_self.openShare();	
					
					// 重绘字体颜色
					if (active_color == '#FFFFFF') {
						drawNativeIcon.drawText('\ue600', {}, {
							fontSrc: '../assets/fonts/iconfont.ttf',
							align: 'center',
							color: '#FFFFFF', //原版#000
							size: '30px'
						}, 'icon');
						active_color = '#000';
					} else {
						drawNativeIcon.drawText('\ue600', {}, {
							fontSrc: '../assets/fonts/iconfont.ttf',
							align: 'center',
							color: '#FFFFFF',
							size: '30px'
						}, 'icon');
						active_color = '#FFFFFF';
					}

				});
				// 中间凸起图标绘制及监听点击完毕



				plus.screen.lockOrientation("portrait-primary");
				var subpage_style = {
					top: '0px',
					bottom: '51px'
				};

				//设置bottom绝对位置
				//iphoneX中出现遮挡底部tab现象,采用js判断屏幕大小方式改变bottom值
				//isIPhoneX() 要在plusReady后调用
				if (isIPhoneX()) {
					subpage_style = {
						top: '0px',
						bottom: '88px',
						styles: {
							"render": "always", //一直渲染
						}
					};
				}
				// var self = plus.webview.currentWebview();
				try {
					for (var i = 0; i < subpages.length; i++) {
						if (subpages[i]) {
							var temp = {};
							var sub = plus.webview.create(subpages[i], ids[i], subpage_style);
							if (i > 0) {
								sub.hide();
							} else {
								temp[ids[i]] = "true";
								mui.extend(aniShow, temp);
							}
							wsself.append(sub);
						}
					}
				} catch (e) {
					console.log(e);
				}

				// 获取本地应用资源版本号
				plus.runtime.getProperty(plus.runtime.appid, function(inf) {

					wgtVer = inf.version;
					console.log("当前应用版本：" + wgtVer);
				});
				plus.webview.show(activeTab, "fade-in", 300);
				
			});
			// mui(document.body).off("tap"); // 绑定前先注销事件，防止多次注册on事件
			// mui('body').on('tap', '#shop_share', function() {
			 //    var wg = plus.webview.getWebviewById("shop_share.html");
				// wg.addEventListener('maskClick', function() {
				// 	_self.closeMask();
				// },false);
			// });
			// document.querySelector('body').addEventListener('tap', function(e) {
			// 	var backdrop = document.querySelector('.mui-backdrop');
			// 	if (backdrop) {
			// 		console.log('hello');
			// 	}
			// 	e.preventDefault();
			// 	e.stopPropagation();
			// }, true)
			_self.$nextTick(function() {
				
			});
		}, //created
		beforeMount: function() {
			_self.$nextTick(function() {
			
			});
		}, //beforeMount
		mounted: function() {
			/**
			 * MUI框架初始化
			 */
			mui.init({
				gestureConfig:{
					doubletap:true
				}
			});
			// console.log("store:"+_self.$store.state.loginstate);
			// console.log("store1:"+_self.$store.state.test1.loginState);
			// console.log("store2:"+_self.$store.state.test2.loginState);
			// console.log("store3:"+_self.$store.state.test2.isLogin);
			// alert(_self.isLogin);
			
			/**
			 * 所有动态获取的控件初始化需在mui.ready(function(){});内执行
			 */
			mui.ready(function(){
				//获取原始窗口的高度
				var originalHeight = document.documentElement.clientHeight || document.body.clientHeight;
				window.onresize = function() {
					//判断目前显示的页面  只有登录界面才重新计算窗口高度
					var topWebView = plus.webview.getTopWebview();
					console.log("topWebView_shop:" + topWebView);
					if(topWebView.id == "HBuilder"){  // 只有当此页面为主程序入口时为HBuilder，
					    //软键盘弹起与隐藏  都会引起窗口的高度发生变化  
					    var resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;  
					
					    if (resizeHeight * 1 < originalHeight * 1) { //resizeHeight<originalHeight证明窗口被挤压了  
					
					        plus.webview.currentWebview().setStyle({  
					            height: originalHeight  
					        });  
					
					    }  
					}
				}
			});
			_self.$nextTick(function() {
				
			});
			// alert(333);
		}, //mounted
		beforeUpdate: function() {
			_self.$nextTick(function() {
				
			});
		}, //beforeUpdate
		updated: function() {
			_self.$nextTick(function() {
				
			});
		}, //updated
		beforeDestroy: function() {
			
		}, //beforeDestroy
		destroyed: function() {
			
		} //destroyed
	}
</script>

<style scoped> /* scoped属性：私有属性，样式只对此组件内元素生效，不影响其他组件*/
	html,
	body {
		background-color: #efeff4;
	}

	* {
		touch-action: none;
	}

	.title {
		margin: 10px 15px 10px;
		color: #6d6d72;
		font-size: 15px;
		padding-bottom: 51px;
	}

	.mui-bar-tab_tb {
		border-top: 0.6px solid rgba(200, 200, 200, 0.25);
		/*thick double #ccc;*/
	}
	/* .mui-bar-nav ~ .mui-content .mui-pull-top-pocket{
		top: 80px !important;
	} */
</style>
