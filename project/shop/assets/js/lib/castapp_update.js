/**
 * 东翌学院CASTAPP.JS
 */
(function() {

	/**
	 * Dongyi.js
	 * 版本: 1.0.9 修改时间2016-10-19
	 * 2016.1.1 更名为 CastApp.js
	 * 东翌@版权所有 
	 * 东翌学院是国内第一跨平台APP开发培训机构!
	 * http://www.dongyixueyuan.com
	 * CastApp 让app开发更简单!
	 * http://www.castapp.cn
	 * 作者QQ: 2195138852
	 * 
	 */

	var gP,
		gM,
		gObject,
		topBarType,
		gRuntime,
		gOs,
		gPackage;

	window.dongyi = window.dj = window.castapp = window.ca = {

		/**
		 * 初始化
		 * CAST.JS初始化方法 每个页面必须进行初始化
		 * 自动化处理了ios端 头部tar颜色和导航统一的问题
		 * 参数：true 为 头部tar字体颜色为深(黑)色， false为浅色 默认是浅(白)色
		 * 
		 * 调用：ca.init(true); // ca.init();等同于ca.init(false);
		 */
		init: function(BarType, packageName) {
			/**
			 * true 深色  | false 浅色
			 */
			if (BarType) {
				topBarType = 'UIStatusBarStyleDefault';
			} else {
				topBarType = 'UIStatusBarStyleBlackOpaque';
			}
			var topBar = dongyi.tagName('header')['0'];
			mui.plusReady(function() {
				gP = plus;
				gOs = plus.os;
				gRuntime = plus.runtime;

				if (packageName) {
					localStorage.setItem('packageName', packageName);
					gPackage = packageName;
				} else {
					gPackage = localStorage.getItem('packageName');
					if (gPackage === null) {
						gPackage = dongyi.getRuntime('appid');
					}
				}
				if (topBar) {
					var topBarColor = getComputedStyle(topBar, false)['backgroundColor'];
					if (mui.os.ios) {
						plus.navigator.setStatusBarStyle(topBarType);
						plus.navigator.setStatusBarBackground(topBarColor);
					}
				}

			});
		},
		/**
		 * 通过ID获取元素
		 * id_element 为id名
		 * @param {Object} id_data
		 * 
		 * 调用：var object = ca.id('id值');
		 */
		id: function(id_element) {
			return document.getElementById(id_element);
		},
		/**
		 * 通过Class获取元素
		 * classElement 为class名
		 * @param {Object} parentElement 父级元素
		 * @param {Object} classElement
		 * 
		 * 调用：var object = ca.className('class值');
		 */
		className: function(parentElement, classElement) {
			if (classElement === undefined) {
				return document.getElementsByClassName(parentElement);
			}
			return parentElement.getElementsByClassName(classElement);
		},
		/**
		 * 通过标签获取元素
		 * tagElement 为元素名
		 * @param {Object} parentElement 父级元素
		 * @param {Object} tagElement
		 * 
		 * 调用：var object = ca.tagName('tag值');
		 */
		tagName: function(parentElement, tagElement) {
			if (tagElement === undefined) {
				return document.getElementsByTagName(parentElement);
			}
			return parentElement.getElementsByTagName(tagElement);
		},
		/**
		 * 获得屏幕的高度
		 * @param {Object} element
		 * 
		 * 调用：
		 */
		getScreenInfo: function(element) {
			if (element === 'width') {
				return document.documentElement.clientWidth || document.body.clientWidth;
			} else {
				return document.documentElement.clientHeight || document.body.clientHeigth;
			}
		},
		/**
		 * 获得当前时间
		 * 
		 * 调用：
		 */
		getCurrentTime: function() {
			var oDate = new Date();
			var aDate = [];
			aDate.push(oDate.getFullYear());
			aDate.push(oDate.getMonth() + 1);
			aDate.push(oDate.getDate());
			aDate.push(oDate.getHours());
			aDate.push(oDate.getMinutes());
			aDate.push(oDate.getSeconds());
			aDate.push(oDate.getDay());
			aDate.push(oDate.getTime());
			return aDate;
		},
		/**
		 * 单击事件
		 * @param {Object} element 元素
		 * @param {Object} succfn  成功的回调
		 * 
		 * 调用：
		 * // 通过id或class获取元素
			ca.click(object, function(){
				alert(JSON.stringify(object));
			});
			// 通过标签获取元素
			ca.click(object[下标], function(){
				alert(JSON.stringify(object));
			});
		 */
		click: function(elementData, succfn) {
			elementData.addEventListener('tap', function() {
				succfn(this);
			});
		},
		/**
		 * 打开有标题页面
		 * 
		 * @param {Object} url 页面路径
		 * @param {Object} id 页面ID
		 * @param {Object} title 页面标题
		 * @param {Object} extras 传递的参数
		 * 
		 * 调用：
			var extras = {a:'1', b:'2', c:'3'};
			ca.openWindowWithTitle('a.html', 'a.html', '标题', extras);
		 */
		openWindowWithTitle: function(url, id, title, extras) {
			mui.openWindow(url, id, {
				extras: extras,
				show: {
					event: "loaded", //在当前页面加载,加载完在跳转
				},
				styles: {
					titleNView: { // 窗口的标题栏控件
						titleText: title, // 标题栏文字,当不设置此属性时，默认加载当前页面的标题，并自动更新页面的标题
						titleColor: "#FFFFFF", // 字体颜色,颜色值格式为"#RRGGBB",默认值为"#000000"
						// backgroundColor: "#E60012", // 控件背景颜色,颜色值格式为"#RRGGBB",默认值为"#F7F7F7"
						// backgroundColor: "#31c27d",
						backgroundColor: "#4eabe8",
						autoBackButton: true,
					}
				},
				waiting: {
					autoShow: true, //自动显示等待框，默认为true
					//title: '正在加载...' //等待对话框上显示的提示内容
				}
			})
		},
		/**
		 * 打开新页面(如:点击打开筛选界面)
		 * @param {Object} jsonData
		 * 
		 * 参数为json格式
		 * 
		 * url: 	 新页面的url
		 * id：		 新页面的id
		 * styles：	 新页面的css样式 (top bottom width height) 可不设置或者设置为空
		 * showType: 打开新页面的方式 (zoom-fade-out)中心放大
		 * showTime: 打开新页面用时(毫秒)通常200-400之间
		 * 
		 * 调用：
			ca.openWindow({
				url：'child.html',
				id: 'child',
				style: {
					top: '0px',
					bottom: '',
					width: '100%',
					height: 'calc(100vh)' 
					//calc()动态计算长度值。vw viewpoint width，视窗宽度，1vw=视窗宽度的1%，
					//vh viewpoint height，视窗高度，1vh=视窗高度的1%。calc()函数支持 "+", "-", "*", "/" 运算；
					//需要注意的是，运算符前后都需要保留一个空格，例如：width: calc(100% - 10px)；
				},
				showType: 'zoom-fade-out',
				showTime: 200
			});
		 */
		openWindow: function(jsonData) {
			if (jsonData.styles === undefined) {
				var styles = {};
				styles.top = '0px';
				styles.bottom = '0px';
				styles.width = '100%';
				styles.height = '100%';
				// styles.backgroundColor = '#4eabe8';
				jsonData.styles = styles;
			} else {
				if (jsonData.styles.top === undefined) {
					jsonData.styles.top = "0px";
				}
				if (jsonData.styles.bottom === undefined) {
					jsonData.styles.bottom = "0px";
				} else {
					jsonData.styles.height = dongyi.getScreenInfo('height') - parseInt(jsonData.styles
						.bottom) + 'px';
				}
				if (jsonData.styles.width === undefined) {
					jsonData.styles.width = "100%";
				}
				if (jsonData.styles.height === undefined) {
					jsonData.styles.height = "100%";
				}
			}
			if (jsonData.show === undefined) {
				jsonData.show = true;
			}
			if (jsonData.showType === undefined) {
				//			jsonData.showType = 'zoom-fade-out';
				jsonData.showType = 'pop-in';
			}
			if (jsonData.showTime === undefined) {
				jsonData.showTime = 200;
			}
			if (jsonData.waiting === undefined) {
				jsonData.waiting = false;
			}
			mui.openWindow({
				url: jsonData.url,
				id: jsonData.id,
				styles: {
					top: jsonData.styles.top,
					bottom: jsonData.styles.bottom,
					width: jsonData.styles.width,
					height: jsonData.styles.height,
					// backgroundColor: jsonData.styles.backgroundColor;
					backgroundColor: '#4eabe8',
				},
				show: {
					autoShow: jsonData.show,
					aniShow: jsonData.showType,
					duration: jsonData.showTime
				},
				waiting: {
					autoShow: jsonData.waiting,
				}
			});
		},
		/**	
		 * 关闭当前界面
		 * 
		 * 调用：
			ca.closeCurrentInterface();
		 */
		closeCurrentInterface: function() {
			mui.back();
		},
		/**
		 * 底部导航
		 * @param {Object} arrayData Url数组
		 * 
		 * 调用：
			// 创建底部导航
			var pathArray = ['one.html', 'two.html', 'three.html'];
			ca.tabBar(pathArray);
		 */
		tabBar: function(arrayData) {
			var subpage_style = {
				top: '0px',
				bottom: '50px',
				scrollIndicator: "none",
			};
			mui.plusReady(function() {
				dongyi.getCurrentInterface(function(self) {
					for (var i = 0; i < arrayData.length; i++) {
						var subpage = arrayData[i];
						var suff = subpage.indexOf('.');
						var objectName = subpage.substring(0, suff);
						var sub = plus.webview.create(arrayData[i], objectName,
							subpage_style);
						if (i > 0) {
							sub.hide();
						}
						self.append(sub);
					}
				});
			});
			var activeTab = arrayData[0];
			mui('.mui-bar-tab').on('tap', 'a', function(e) {
				var targetTab = this.getAttribute('href');
				if (targetTab === activeTab) {
					return;
				}
				var suff = targetTab.indexOf('.');
				targetTab = targetTab.substring(0, suff);
				plus.webview.show(targetTab);
				plus.webview.hide(activeTab);
				activeTab = targetTab + '.html';
			});

			dongyi.receiveNotice('gohome', function() {
				goHome();
			});

			document.addEventListener('gohome', goHome);

			function goHome() {
				var defaultTab = document.getElementById("defaultTab");
				mui.trigger(defaultTab, 'tap');
				var current = document.querySelector(".mui-bar-tab>.mui-tab-item.mui-active");
				if (defaultTab !== current) {
					current.classList.remove('mui-active');
					defaultTab.classList.add('mui-active');
				}

			}
		},
		/**
		 * 初始化底部导航 / goHome(从个人中心退出登录后返回首页)
		 * @param {Object} isRoot 
		 * @param {Object} interfaceId
		 * 
		 * 参数1 底部导航是否为起始页(不一定为底部导航首页) true 是 false 否
		 * 参数2 如底部导航不是起始页(不一定为底部导航首页) 传入跳转界面id
		 * 
		 * 调用：
			// 在three.html内写
			ca.tabBarInit(true, ''); // ca.tabBarInit(false, 'two');
		 */
		tabBarInit: function(isRoot, interfaceId) {
			if (isRoot === true) {
				var objectId = 'root';
			} else {
				var objectId = interfaceId;
			}


			dongyi.sendNotice(objectId, 'gohome', {});
		},
		/**
		 * 上拉刷新和下拉加载
		 * @param {Object} element 容器的ID
		 * @param {Object} downFn  下拉刷新的回调
		 * @param {Object} upFn    上拉加载的回调
		 * 
		 * 参数1 容器id
		 * 参数2 下拉回调 回调参数 clearLoad 移除加载信息
		 * 参数3 上拉回调 回调参数 dataState 监听数据情况 true 为没有新数据 false 为有更多新数据、
		 * 
		 * 调用：
			ca.refreshLoad('pullrefresh', function(clearLoad){
				alert('下拉刷新');
				setTimeout(function(){
					clearLoad();
				},2000);
			}, function(dataState){
				alert('上拉加载');
				dataState(true);
			});
		 */
		refreshLoad: function(element, downFn, upFn) {
			mui.init({
				pullRefresh: {
					container: '#' + element,
					down: {
						contentdown: "下拉可以刷新",
						contentover: "释放立即刷新",
						contentrefresh: "正在刷新...",
						callback: down
					},
					up: {
						contentrefresh: '正在加载...',
						callback: up
					}
				}
			});

			function down() {
				downFn(function() {
					mui('#' + element).pullRefresh().endPulldownToRefresh();
				});
			}

			function up() {
				var _this = this;
				/**
				 * true 为没有数据
				 * false 为有更多数据
				 */
				upFn(function(state) {
					_this.endPullupToRefresh(state);
				});
			}
		},
		/**
		 * Ajax - get 请求
		 * @param {Object} url 请求Url
		 * @param {Object} data   参数-Json格式
		 * @param {Object} succFn	  回调
		 * 测试地址: http://test.dongyixueyuan.com/index.php/link_app/get?state=index
		 * 
		 * 参数 json
		 * url：		请求服务器地址
		 * data:		参数
		 * succFn:	成功回调 返回数据
		 * 
		 * 调用：
			ca.get({
				url: '',
				data: {
					'state' : '',
					'num' : ''
				},
				succFn: function(data){
					alert(JSON.stringify(data));
				}
			});
		 */
		get: function(jsonData) {
			dongyi.ajax({
				url: jsonData.url,
				data: jsonData.data,
				succFn: jsonData.succFn,
				type: 'get'
			});
		},
		/**
		 * Ajax - post 请求
		 * @param {Object} url 请求Url
		 * @param {Object} data   参数-Json格式
		 * @param {Object} succFn	  回调
		 * 测试地址: http://test.dongyixueyuan.com/index.php/link_app/post?state=index
		 * 
		 * 参数 json
		 * url：		请求服务器地址
		 * data:		参数
		 * succFn:	成功回调 返回数据
		 * 
		 * 调用：
			ca.post({
				url: '',
				data: {
					'state' : '',
					'num' : ''
				},
				succFn: function(data){
					alert(JSON.stringify(data));
				}
			});
		 */
		post: function(jsonData) {
			dongyi.ajax({
				url: jsonData.url,
				data: jsonData.data,
				succFn: jsonData.succFn,
				type: 'post'
			});
		},
		/**
		 * Ajax 完整版
		 * @param {Object} json
		 * 
		 * 参数 json
		 * url：		请求服务器地址
		 * data:		参数
		 * succFn:	成功回调 返回数据
		 * errFn:	失败回调 返回失败http请求码
		 * 
		 * 
		 * 调用：
		 	var oU = ca.id('需要加载数据的ul列表的id');
		 	ca.ajax({
		 		url: 'http://服务器地址/接口?state=index&name=ca&num=0',
		 		data: {
		 			'state' : 'index',
		 			'name' : 'ca'
		 		},
		 		succFn: function(data){
		 			alert(typeof data);
		 			//解析json字符串转换json数组对象
		 			var jsonInfo = eval('(' + data + ')');
		 			alert(typeof jsonInfo);
		 			for(var a in jsonInfo){
		 				oU.innerHTML += '<li class="mui-table-view-cell">' + jsonInfo[a].字段 + '</li>'
		 			}
		 		},
		 		errFn: function(error){
		 			alert(error);
		 		}
		 	});
		 */
		ajax: function(json) {
			var timer = null;
			json = json || {};
			if (!json.url) {
				dongyi.prompt('请求url不存在');
				return;
			}
			json.type = json.type || 'get';
			json.time = json.time || 10;
			json.data = json.data || {};
			if (window.XMLHttpRequest) {
				var oAjax = new XMLHttpRequest();
			} else {
				var oAjax = new ActiveXObject('Microsoft.XMLHTTP');
			}
			switch (json.type.toLowerCase()) {
				case 'get':
					oAjax.open('GET', json.url + '?' + json2url(json.data), true);
					//				alert(json.url+'?'+json2url(json.data));

					console.log(json.url + '?' + json2url(json.data));
					oAjax.send();
					break;
				case 'post':
					oAjax.open('POST', json.url, true);
					oAjax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					oAjax.send(json2url(json.data));
					break;
			}
			oAjax.onreadystatechange = function() {
				if (oAjax.readyState === 4) {
					if (oAjax.status >= 200 && oAjax.status < 300 || oAjax.status === 304) {
						clearTimeout(timer);
						json.succFn && json.succFn(oAjax.responseText);
					} else {
						clearTimeout(timer);
						json.errFn && json.errFn(oAjax.status);
					}
				}
			}
			timer = setTimeout(function() {
				dongyi.prompt('网络超时');
				oAjax.onreadystatechange = null;
			}, json.time * 1000);

			function json2url(json) {
				json.t = Math.random();
				json.package_name_data = gPackage;
				var arr = [];
				for (var name in json) {
					arr.push(name + '=' + json[name]);
				}
				return arr.join('&');
			}
		},
		/**
		 * 获得起始页对象或者首页(如:从列表内容页直接返回首页)
		 * @param {Object} 
		 * 
		 * 参数 回调函数 返回值为 对象
		 * 
		 * 调用：
			ca.getStartInterface(function(startObject){
				alert(startObject.getURL());
			});
		 */
		getStartInterface: function(callback) {
			try {
				// mui.plusReady(function() {
				if (window.plus) {
					// 在这里调用5+ API
					callback && callback(plus.webview.getLaunchWebview());
					// mui.plusReady();
				} else { // 兼容老版本的plusready事件
					document.addEventListener('plusready', function() {
						// 在这里调用5+ API
						callback && callback(plus.webview.getLaunchWebview());
					}, false);
				};
				// });
			} catch (e) {
				if (e instanceof TypeError) {
					alert("type error");
				} else if ( e instanceof error) {
					alert("error_message:" + e.message);
				} else {
					alert("error:" + e);
				}
				
			} finally {
				
			}
		},
		/**
		 * 获得当前页对象 
		 * @param {Object} 
		 * 
		 * 参数 回调函数 返回值为 对象
		 * 
		 * 调用：
			ca.getCurrentInterface(function(currentObject){
				alert(currentObject.getURL());
			});
		 */
		getCurrentInterface: function(callback) {
			try {
				// mui.plusReady(function() {
				if (window.plus) {
					// 在这里调用5+ API
					callback && callback(plus.webview.currentWebview());
					// mui.plusReady();
				} else { // 兼容老版本的plusready事件
					document.addEventListener('plusready', function() {
						// 在这里调用5+ API
						callback && callback(plus.webview.currentWebview());
					}, false);
				};
				// });
			} catch (e) {
				if (e instanceof TypeError) {
					alert("type error");
				} else if ( e instanceof error) {
					alert("error_message:" + e.message);
				} else {
					alert("error:" + e);
				}
				
			} finally {
				
			}
		},
		/**
		 * 获得目标页对象(如:在设置内修改昵称，然后个人中心内显示昵称的地方可以替换成新昵称)
		 * @param {Object} 
		 * 
		 * 参数1 目标页面id
		 * 参数2 回调函数 返回值 对象
		 * 
		 * 调用：
			ca.getTargetInterface('one', function(targetObject){
				alert(targetObject.getURL());
			});
		 */
		getTargetInterface: function(targetInterface, callback) {
			try {
				// mui.plusReady(function() { // mui.plusReady()中的代码不执行：plusReady事件仅在webview首次创建时触发，使用mui.openWindow方法多次打开已存在的同样id的webview时，是不会重复触发plusReady事件的； 因此若业务写在plusReady事件中，可能会出现执行结果和预期不一致的情况；此时可通过自定义事件触发
				// var plusReady = function (callback) {
				//     if (window.plus) {
				//         callback();
				//     } else {  
				//         document.addEventListener('plusready', callback);
				//     }
				// };
				if (window.plus) {
					// 在这里调用5+ API
					callback && callback(plus.webview.getWebviewById(targetInterface));
					// mui.plusReady();
				} else { // 兼容老版本的plusready事件
					document.addEventListener('plusready', function() {
						// 在这里调用5+ API
						callback && callback(plus.webview.getWebviewById(targetInterface));
					}, false);
				};
				// });
			} catch (e) {
				if (e instanceof TypeError) {
					alert("type error");
				} else if ( e instanceof error) {
					alert("error_message:" + e.message);
				} else {
					alert("error:" + e);
				}
				
			} finally {
				
			}
		},
		/**
		 * 发送通知/mui页面传值:mui.fire();
		 * (如：用户点击个人中心，判断用户是否登录，如果没有登录则提示跳转至登录界面，登录成功后回到个人中心，并刷新当前登录用户的信息)
		 * @param {Object} targetId     通知对象 & 可单个id也可批量通知idArr = ['a','b'] , *注意: root 为根(起始页)
		 * @param {Object} fnName		频道号或者通知号
		 * @param {Object} jsonData		参数
		 * 
		 * 参数1 通知对象 & 可单个id也可批量通知idArr = ['a','b']; 注意root为根(起始页)
		 * 参数2 频道号或者通知号/监听的事件名
		 * 参数3 传递的参数 json格式
		 * 
		 * 调用：
			var noticeArr = ['root', 'first', 'second']; // 通知多个id为数组
			var notice = 'root'; // 通知单个id为字符串
			ca.sendNotice(noticeArr, 'channel', {
				name: '666',
				orders: '2333'
			});
		 */
		sendNotice: function(targetId, fnName, jsonData) {
			if (targetId.constructor === Array) {
				for (var i = 0; i < targetId.length; i++) {
					if (targetId[i] === 'root') {
						dongyi.getStartInterface(function(targetObject) {
							mui.fire(targetObject, fnName, jsonData);
						});
					} else {
						dongyi.getTargetInterface(targetId[i], function(targetObject) {
							mui.fire(targetObject, fnName, jsonData);
						});
					}
				}
			} else {

				if (targetId === 'root') {
					dongyi.getStartInterface(function(targetObject) {
						mui.fire(targetObject, fnName, jsonData);
					});
				} else {
					dongyi.getTargetInterface(targetId, function(targetObject) {
						mui.fire(targetObject, fnName, jsonData);
					});
				}
			}
		},
		/**
		 * 接收通知
		 * @param {Object} fnName 函数名称
		 * @param {Object} fn	  回调
		 * 
		 * 参数1 频道号或者通知号/监听的事件名
		 * 参数2 执行函数 event.detail 内为通知方传的参数
		 * 
		 * 调用：
			ca.receeiveNotice('channel', function(event){
				var name = event.detail.name;
				alert(name);
			});
		 */
		receiveNotice: function(fnName, fn) {
			document.addEventListener(fnName, function(event) {
				fn(event);
			});
		},
		/**
		 * 预加载
		 * @param {Object} arrayData
		 * @param {Object} fn
		 * 
		 * 参数1 被加载的页面地址和对象 格式:json数组
		 * 参数2 加载界面后,返回被加载界面的对象 类型:数组
		 * 
		 * 调用 :
			var arrayData = [{'url':'first.html', 'id':'first'}, {'url':'second.html', 'id':'second'}];
			ca.preLoad(arrayData, function(data){
				alert(data);
			});
		 */
		preLoad: function(arrayData, fn) {
			var array = [];
			mui.plusReady(function() {
				for (var a = 0; a < arrayData.length; a++) {
					var productView = mui.preload({
						url: arrayData[a].url,
						id: arrayData[a].id,
					});
					array.push(productView);
				}
				fn && fn(array)
			});
		},
		/**
		 * 弹出框/警告框
		 * @param {Object} jsonData
		 * 
		 * 调用：
			ca.alert({
				title: '标题',
				content： '内容',
				callback： function(){
					alert('已点击');
				}
			});
		 */
		alert: function(jsonData) {
			mui.alert(jsonData.content, jsonData.title, function() {
				jsonData.callback && jsonData.callback();
			});
		},
		/**
		 * 确认提示框
		 * @param {Object} jsonData
		 * 
		 * 调用：
			ca.confirm({
				title: '标题',
				content：'内容',
				callback：function(data){
					alert(data);
				}
			});
		 */
		confirm: function(jsonData) {
			var btnArray = ['是', '否'];
			gM.confirm(jsonData.content, jsonData.title, btnArray, function(e) {
				if (e.index === 0) {
					jsonData.callback && jsonData.callback(true);
				} else {
					jsonData.callback && jsonData.callback(false);
				}
			});
		},
		/**
		 * 输入提示框
		 * @param {Object} jsonData
		 * 
		 * 调用：
			ca.inputPrompt({
				title: '标题',
				content：'内容',
				callback：function(data){
					alert(data);
				}
			});
		 */
		inputPrompt: function(jsonData) {
			var btnArray = ['确定', '取消'];
			mui.prompt(jsonData.content, '', jsonData.title, btnArray, function(e) {
				if (e.index === 0) {
					jsonData.callback && jsonData.callback(e.value);
				} else {
					jsonData.callback && jsonData.callback(false);
				}
			});
		},
		/**
		 * 日期选择框
		 * @param {Object} jsonData
		 * 
		 * 调用：
			ca.dateSelect({
				defaultTime: '1999-1-1',
				minTime: '1999-1-1',
				maxTime: '2021-4-1',
				callback：function(data){
					alert(data);
				}
			});
		 */
		dateSelect: function(jsonData) {
			var dDate = new Date();
			dDate.setFullYear(jsonData.defaultTime.split('-')['0'], jsonData.defaultTime.split('-')['1'] -
				1, jsonData.defaultTime.split('-')['2']);
			var minDate = new Date();
			minDate.setFullYear(jsonData.minTime.split('-')['0'], jsonData.minTime.split('-')['1'] - 1,
				jsonData.minTime.split('-')['2']);
			var maxDate = new Date();
			maxDate.setFullYear(jsonData.maxTime.split('-')['0'], jsonData.maxTime.split('-')['1'] - 1,
				jsonData.maxTime.split('-')['2']);
			mui.plusReady(function() {
				plus.nativeUI.pickDate(function(e) {
					var d = e.date;
					if (d.getDate() < 10) {
						var day = '0' + d.getDate();
					} else {
						var day = d.getDate();
					}
					jsonData.callback && jsonData.callback(d.getFullYear() + "-" + (d
						.getMonth() + 1) + "-" + day);
				}, function(e) {
					jsonData.callback && jsonData.callback(false);
				}, {
					title: "请选择日期",
					date: dDate,
					minDate: minDate,
					maxDate: maxDate
				});
			});
		},
		/**
		 * 时间选择框
		 * @param {Object} jsonData
		 * 
		 * 调用：
			ca.timeSelect({
				defaultTime: '10:00',
				callback：function(data){
					alert(data);
				}
			});
		 */
		timeSelect: function(jsonData) {
			var dTime = new Date();
			dTime.setHours(jsonData.defaultTime.split(':')['0'], jsonData.defaultTime.split(':')['1']);
			mui.plusReady(function() {
				plus.nativeUI.pickTime(function(e) {
					var d = e.date;
					if (d.getHours() < 10) {
						var h = '0' + d.getHours();
					} else {
						var h = d.getHours();
					}
					if (d.getMinutes() < 10) {
						var m = '0' + d.getMinutes();
					} else {
						var m = d.getMinutes();
					}
					jsonData.callback && jsonData.callback(h + ":" + m);
				}, function(e) {
					jsonData.callback && jsonData.callback(false);
				}, {
					title: "请选择时间",
					is24Hour: true,
					time: dTime
				});
			});
		},
		/**
		 * 自动消失提示框/消息框
		 * @param {Object} m 提示信息
		 * 
		 * 调用：ca.prompt('提示信息');
		 */
		prompt: function(m) {
			mui.toast(m);
		},
		/**
		 * 原生actionSheet 
		 * @param {Object} arrayData
		 * @param {Object} jsonData & isUpload | uploadUrl
		 * 
		 * arr里面的title为要弹出的选项内容
		 * 
		 * 参数为 json
		 * 
		 * succFn 成功回调
		 * 
		 * errFn 失败回调
		 *
		 * 调用：
			var arr = [{'title':'打开相册'},{'title':'打开相机'}];
			ca.actionSheet(arr,{
				succFn: function(data){
					// alert(data); //data为arr数组下标
				},
				errFn: function(data){
					// alert(data);
				}
			});
		 */
		/*例
		var arr = [{'title':'打开相册'},{'title':'打开相机'}];
		ca.actionSheet(arr,{
			succFn: function(data){
				// alert(data); //data为arr数组下标
				if(data === 0){ //打开相册
					ca.album({
						succFn: function(path){
							// alert(path);
							var request_url = 'http://www.12306xx.com/upload_file.php';
							var src = path;
							ca.uploadFiles({
								request_url,
								path,
								function(newPath){
									// alert(newPath);
									// 更新页面图片相对路径
								}
							});
						},
						errFn: function(error){
							// alert(error);
						}
					});
				}else if(data === 1){ //打开相机
					ca.camera({
						succFn: function(path, name){
							// alert(path); // 图片路径
							// alert(name); // 图片名称
							var request_url = 'http://www.12306xx.com/upload_file.php';
							var src = path;
							ca.uploadFiles({
								request_url,
								path,
								function(newPath){
									// alert(newPath);
									// 更新页面图片相对路径
								}
							});
						},
						errFn: function(error){
							// alert(error);
						}
					});
				}
			},
			errFn: function(data){
				// alert(data);
			}
		});
		*/
		actionSheet: function(arrayData, jsonData) {
			if (arrayData[0].title === undefined) {
				var transferArr = [];
				for (var a = 0; a < arrayData.length; a++) {
					var json = {
						'title': arrayData[a]
					};
					transferArr.push(json);
				}
				arrayData = transferArr;
			}

			if (!jsonData.title) {
				jsonData.title = "请选择";
			}

			mui.plusReady(function() {
				plus.nativeUI.actionSheet({
						title: jsonData.title,
						cancel: "取消",
						buttons: arrayData
					},
					function(e) {
						var index = e.index;
						if (index === 0) {
							return;
						}
						index--;
						if (arrayData[index].title === '照相机') {
							dongyi.camera({
								succFn: function(path, name) {
									if (jsonData && jsonData.isUpload) {
										dongyi.uploadFiles(jsonData.uploadUrl, path,
											function(imgPath) {
												jsonData.succFn(imgPath);
											},
											function(error) {
												jsonData.errFn && jsonData
													.errFn(error);
											});
									} else {
										jsonData.succFn(path, name)
									}
								}
							});
						} else if (arrayData[index].title === '相册') {
							dongyi.album({
								succFn: function(path) {
									if (jsonData && jsonData.isUpload) {
										dongyi.uploadFiles(jsonData.uploadUrl, path,
											function(imgPath) {
												jsonData.succFn(imgPath);
											},
											function(error) {
												jsonData.errFn && jsonData
													.errFn(error);
											});
									} else {
										jsonData.succFn(path);
									}
								}
							});
						} else {
							jsonData.succFn(index);
						}
					});
			});
		},
		/**
		 * 手势
		 * @param {Object} element 
		 * @param {Object} event
		 * @param {Object} fn
		 * 
		 * 参数1 目标对象
		 * 
		 * 参数2 事件
		 * tap 			单击屏幕
		 * doubletap 	双击屏幕
		 * longtap		长按屏幕
		 * hold			按住屏幕
		 * release		离开屏幕
		 * swipeleft		向左滑动
		 * swiperight	向右滑动
		 * swipeup		向上滑动
		 * swipedown		向下滑动
		 * dragstart		开始拖动
		 * drag			拖动中
		 * dragend		拖动结束
		 * 
		 * 参数3 回调函数
		 * 
		 * 调用：
			ca.gesture(object, '事件名', function(){
				alert('666');
			});
		 */
		gesture: function(element, event, fn) {
			mui.init({
				gestureConfig: {
					tap: true,
					doubletap: true,
					longtap: true,
					swipe: true,
					drag: true,
					hold: true,
					release: true
				}
			});
			element.addEventListener(event, function() {
				fn();
			});
		},
		/**
		 * 遮罩
		 * @param {Object} callback
		 * * @param {Object} closeId 关闭的id
		 * 
		 * 参数 回调函数(可为空)
		 * 
		 * 调用：
			ca.showMask(function(){
				alert('你点击了遮罩层');
			});
		 */
		showMask: function(callback, closeId) {
			var mask = mui.createMask(callback);
			mask.show();
			var closeId = dongyi.id(closeId);
			closeId.addEventListener('tap', function() {
				mask.close();
			});
		},
		/**
		 * 图片轮播
		 * @param {Object} callback
		 * @param {Object} isAutoScroll
		 * @param {Object} scrollTime
		 * 
		 * 参数为json格式
		 * callback 回调 回调参数 pictureNumber 返回当前浏览的第几张图片
		 * isAutoScroll 是否滚动 true 滚动 false 不滚动
		 * scrollTime 滚动时差(秒)
		 * 
		 * 调用：
			ca.pictureScroll({
				callback: function(pictureNumber){
					console.log(pictureNumber);
				},
				isAutoScroll: true,
				scrollTime: 2
			});
		 */
		pictureScroll: function(jsonData) {
			var gallery = mui('.mui-slider');
			if (jsonData.isAutoScroll) {
				gallery.slider({
					interval: jsonData.scrollTime * 1000
				});
			}
			document.querySelector('.mui-slider').addEventListener('slide', function(event) {
				jsonData.callback && jsonData.callback(event.detail.slideNumber + 1);
			});
		},
		/**
		 * 创建子页面
		 * @param {Object} jsonData
		 * 
		 * 参数为json格式
		 * url：	新页面的url
		 * id：		新页面的id
		 * styles：	新页面的css样式 (top bottom width height) 可不设置或者设置为空
		 * 
		 * 调用：
			ca.createChildInterface({
				url: 'child.html',
				id: 'child',
				style: {
					top: '45px',
					bottom: '',
					width: '100%',
					height: 'calc(100vh)' 
					//calc()动态计算长度值。vw viewpoint width，视窗宽度，1vw=视窗宽度的1%，
					//vh viewpoint height，视窗高度，1vh=视窗高度的1%。calc()函数支持 "+", "-", "*", "/" 运算；
					//需要注意的是，运算符前后都需要保留一个空格，例如：width: calc(100% - 10px)；
				}
			});
		 */
		createChildInterface: function(jsonData) {
			var styles = {};
			if (jsonData.styles === undefined) {
				styles.top = '0px';
				styles.bottom = '0px';
				styles.width = '100%';
				styles.height = '100%';
				jsonData.styles = styles;
			} else {
				if (jsonData.styles.top === undefined) {
					jsonData.styles.top = "0px";
				}
				if (jsonData.styles.bottom === undefined) {
					jsonData.styles.bottom = "0px";
				} else {
					jsonData.styles.height = dongyi.getScreenInfo('height') - parseInt(jsonData.styles
						.bottom) - parseInt(jsonData.styles.top) + 'px';
				}
				if (jsonData.styles.width === undefined) {
					jsonData.styles.width = "100%";
				}
				if (jsonData.styles.height === undefined) {
					jsonData.styles.height = "100%";
				}
			}
			mui.init({
				subpages: [{
					url: jsonData.url,
					id: jsonData.id,
					styles: {
						top: jsonData.styles.top,
						bottom: jsonData.styles.bottom,
						width: jsonData.styles.width,
						height: jsonData.styles.height,
					},
				}]
			});
		},
		/**
		 * 显示等待框
		 * @param {Object} watingPrompt
		 * 
		 * 参数 等待提示语 可为空
		 * 
		 * 调用：
			ca.showWaiting('正在加载...');
		 */
		showWaiting: function(watingPrompt) {
			mui.plusReady(function() {
				plus.nativeUI.showWaiting(watingPrompt || "加载中...");
			});
		},
		/**
		 * 关闭等待框
		 * 
		 * 调用：
			// 延迟跳转
			var t0 = setTimeout(function(){
				ca.closeWaiting();
				ca.openUrl('跳转地址(绝对地址:home.html 相对地址:http://www.baidu.com)');
			},3000);
		 */
		closeWaiting: function() {
			mui.plusReady(function() {
				plus.nativeUI.closeWaiting();
			});
		},
		/**	
		 * 照相机 
		 * @param {Object} succFn
		 * @param {Object} errFn
		 * 参数为json
		 * 
		 * succFn 成功回调 path = 图片路径 name = 图片名称
		 * errFn 失败回调 error = 错误信息
		 * 
		 * 调用：
			ca.camera({
				succFn: function(path, name){
					alert(path); // 图片路径
					alert(name); // 图片名称
				},
				errFn: function(error){
					alert(error);
				}
			});
		 */
		camera: function(jsonData) {
			mui.plusReady(function() {
				var cmr = plus.camera.getCamera();
				cmr.captureImage(function(p) {
					plus.io.resolveLocalFileSystemURL(p, function(entry) {
						var img_name = entry.name;
						var img_path = entry.toLocalURL();
						jsonData.succFn && jsonData.succFn(img_path, img_name);
					}, function(e) {
						jsonData.errFn && jsonData.errFn(e.message);
					});
				}, function(e) {
					jsonData.errFn && jsonData.errFn(e.message);
				}, {
					filename: '_doc/camera/',
					index: 1
				});
			});
		},
		/**
		 * 相册
		 * @param {Object} succFn
		 * @param {Object} errFn
		 * @param {Object} isMultiple 是否为选
		 * 
		 * 参数为json
		 * 
		 * succFn 成功回调 path = 图片路径
		 * errFn 失败回调 error = 错误信息
		 *
		 * 调用：
			ca.album({
				succFn: function(path){
					alert(path);
				},
				errFn: function(error){
					alert(error);
				}
			});
		 */
		album: function(jsonData, isMultiple) {
			if (!isMultiple) {
				var Ddata = false;
			} else {
				var Ddata = true;
			}
			mui.plusReady(function() {
				plus.gallery.pick(function(path) {
					jsonData.succFn && jsonData.succFn(path);
				}, function(e) {
					jsonData.errFn && jsonData.errFn(e.message);
				}, {
					filter: "image",
					multiple: Ddata,
					system: false
				});
			});
		},
		/**
		 * 相册多选
		 * @param {Object} succFn
		 * @param {Object} errFn
		 */
		galleryImgs: function(jsonData) {
			dongyi.album({
				succFn: function(data) {
					jsonData.succFn && jsonData.succFn(data['files']);
				},
				errFn: function(error) {
					jsonData.errFn && jsonData.errFn(error);
				}
			}, true)
		},
		/**
		 * 蜂鸣
		 * 
		 * 调用：ca.beep();
		 */
		beep: function() {
			mui.plusReady(function() {
				switch (plus.os.name) {
					case "iOS":
						if (plus.device.model.indexOf("iPhone") >= 0) {
							plus.device.beep();
						} else {
							dongyi.prompt('此设备不支持蜂鸣');
						}
						break;
					default:
						plus.device.beep();
						break;
				}
			});
		},
		/**	
		 * 手机震动
		 * 
		 * 调用：ca.vibrate();
		 */
		vibrate: function() {
			mui.plusReady(function() {
				switch (plus.os.name) {
					case "iOS":
						if (plus.device.model.indexOf("iPhone") >= 0) {
							plus.device.vibrate();
						} else {
							dongyi.prompt('此设备不支持震动');
						}
						break;
					default:
						plus.device.vibrate();
						break;
				}
			});
		},
		/**
		 * 设备信息
		 * @param {Object} callback
		 * 
		 * 参数1 回调函数 返回设备信息
		 * 
		 * model 设备型号
		 * vendor 生产厂商
		 * IMEI 国际移动设备身份码(苹果拒绝应用访问获取不到)
		 * UUID 设备的唯一标识
		 * IMSI 国际移动设备识别码(苹果拒绝应用访问获取不到)
		 * resolution 分辨率
		 * pixel DPI 每英寸像素数
		 * 
		 * 调用：
			ca.getDeviceInfo(function(json){
				for(var a in json){
					console.log(a + '=' + json[a]);
				};
			});
		 */
		getDeviceInfo: function(callback) {
			mui.plusReady(function() {
				var json = {};
				json.model = plus.device.model;
				json.vendor = plus.device.vendor;
				json.imei = plus.device.imei;
				json.uuid = plus.device.uuid;
				var str = '';
				for (i = 0; i < plus.device.imsi.length; i++) {
					str += plus.device.imsi[i];
				}
				json.imsi = str;
				json.resolution = plus.screen.resolutionWidth * plus.screen.scale + " x " + plus
					.screen.resolutionHeight * plus.screen.scale;
				json.pixel = plus.screen.dpiX + " x " + plus.screen.dpiY;
				callback(json);
			});
		},
		/**
		 * 手机信息 
		 * @param {Object} callback
		 * 
		 * 参数 回调函数 返回手机信息
		 * 
		 * name		名称
		 * version	版本
		 * language	语言
		 * vendor	厂商
		 * network	网络
		 * 
		 * 调用：
			ca.getMachineInfo(function(json){
				for(var a in json){
					console.log(a + '=' + json[a]);
				};
			});
		 */
		getMachineInfo: function(callback) {
			mui.plusReady(function() {
				var json = {};
				json.name = plus.os.name;
				json.version = plus.os.version;
				json.language = plus.os.language;
				json.vendor = plus.os.vendor;
				var types = {};
				types[plus.networkinfo.CONNECTION_UNKNOW] = "未知";
				types[plus.networkinfo.CONNECTION_NONE] = "未连接网络";
				types[plus.networkinfo.CONNECTION_ETHERNET] = "有线网络";
				types[plus.networkinfo.CONNECTION_WIFI] = "WiFi网络";
				types[plus.networkinfo.CONNECTION_CELL2G] = "2G蜂窝网络";
				types[plus.networkinfo.CONNECTION_CELL3G] = "3G蜂窝网络";
				types[plus.networkinfo.CONNECTION_CELL4G] = "4G蜂窝网络";
				json.network = types[plus.networkinfo.getCurrentType()];
				callback(json);
			});
		},
		/**
		 * 发送短信
		 * @param {Object} sendPhone
		 * @param {Object} sendContent
		 * 
		 * 参数1 目标手机号码 类型:数组
		 * 参数2 短息内容
		 * 
		 * 调用：
			var targetPhone = ['13800138000','13800138001'];
			ca.sendSms(targetPhone, '短信内容');
		 */
		sendSms: function(sendPhone, sendContent) {
			var msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);
			msg.to = sendPhone;
			msg.body = sendContent;
			plus.messaging.sendMessage(msg);
		},
		/**
		 * 拨打电话
		 * @param {Object} phone
		 * 
		 * 参数为 目标号码
		 * 
		 * 调用：ca.callPhone('13800138000');
		 */
		callPhone: function(targetPhone) {
			plus.device.dial(targetPhone, false);
		},
		/**	
		 * 邮件
		 * @param {Object} targetEmail
		 * 
		 * 参数 目标邮件地址
		 * 
		 * 调用：ca.sendEmail('12306@163.com');
		 */
		sendEmail: function(targetEmail) {
			location.href = "mailto:" + targetEmail;
		},
		/**
		 * 图片/文件上传
		 * @param {Object} uploadUrl 上传地址
		 * @param {Object} filePath  文件路径
		 * @param {Object} succFn 	   成功回调
		 * @param {Object} errFn     失败回调
		 * 
		 * 参数1 请求地址
		 * 参数2 文件路径
		 * 参数3 成功回调 返回上传后的文件路径
		 * 参数4 失败回调
		 * 
		 * 调用：
			var request_url = 'http://www.12306xx.com/upload_file.php';
			var src = path(本地文件路径,通过打开文件管理器选取后回调获取);
			ca.uploadFiles({
				request_url,
				src,
				function(newPath){
					alert(newPath);
				}
			});
		 */
		uploadFiles: function(uploadUrl, filePath, succFn, errFn) {
			var files = [];
			var n = filePath.substr(filePath.lastIndexOf('/') + 1);
			files.push({
				name: "uploadkey",
				path: filePath
			});
			if (files.length <= 0) {
				this.prompt("没有添加上传文件");
				return;
			}
			dongyi.showWaiting('上传中...');
			var task = plus.uploader.createUpload(uploadUrl, {
					method: "POST"
				},
				function(t, status) {

					if (status === 200) {
						var responseText = t.responseText;
						var json = eval('(' + responseText + ')');
						var files = json.files;
						var img_url = files.uploadkey.url;
						succFn(img_url);
						dongyi.closeWaiting();
					} else {
						errFn && errFn(status);
						dongyi.closeWaiting();
					}
				});
			task.addData("client", "");
			task.addData("uid", Math.floor(Math.random() * 100000000 + 10000000).toString());
			for (var i = 0; i < files.length; i++) {
				var f = files[i];
				task.addFile(f.path, {
					key: f.name
				});
			}
			task.start();
		},
		/**
		 * 地理位置 - 获得当前位置
		 * @param {Object} succFn 成功回调
		 * @param {Object} errFn  失败回调
		 * 
		 * 参数 json
		 * 
		 * succFn 成功回调 data 位置信息
		 * errFn	失败回调 error 错误信息
		 * 
		 * 调用：
			ca.getCurrentPosition({
				succFn: function(data){
					alert(data);
				},
				errFn: function(){
					alert(error);
				}
			});
		 */
		getCurrentPosition: function(jsonData) {
			mui.plusReady(function() {
				plus.geolocation.getCurrentPosition(function(position) {
					var timeflag = position.timestamp;
					var codns = position.coords;
					var lat = codns.latitude;
					var longt = codns.longitude;
					var alt = codns.altitude;
					var accu = codns.accuracy;
					var altAcc = codns.altitudeAccuracy;
					var head = codns.heading;
					var sped = codns.speed;
					var baidu_map =
						"http://api.map.baidu.com/geocoder/v2/?output=json&ak=BFd9490df8a776482552006c538d6b27&location=" +
						lat + ',' + longt;
					dongyi.ajax({
						url: baidu_map,
						data: {},
						succFn: function(data) {
							jsonData.succFn && jsonData.succFn(data);
						}
					});
				}, function(e) {
					jsonData.errFn && jsonData.errFn(e.message);
				});
			})
		},
		/**
		 * 浏览器打开网页
		 * @param {Object} targetUrl
		 * 
		 * 参数 链接地址
		 * 
		 * 调用：ca.openUrl('http://www.baidu.com');
		 */
		openUrl: function(targetUrl) {
			dongyi.getRuntime().openURL(targetUrl);
		},
		/**
		 * 设置完手动关闭启动页 manifest.json -> 启动图片 -> 选择手动关闭启动界面
		 * 关闭启动页(启动页广告,给内容页加载的时间防止首次进入白屏或转圈)
		 * 
		 * 调用：
			var t0 = setTimeout(function(){
				ca.closeStartPage();
			},3000);
		 */
		closeStartPage: function() {
			mui.plusReady(function() {
				plus.navigator.closeSplashscreen();
			});
		},
		/**
		 * 设置首次启动引导轮播页面(APP更新新特性展示)
		 * @param {Object} jsonData 
		 * url 预加载URL
		 * id  预加载ID
		 * 
		 * 调用：
			ca.setStartpage({
				url: 'index.html',
				id: 'index'
			});
		 */
		/*
		// HTML代码
		<div id="slider" class="mui-slider">
			<div class="mui-slider-group">
				<div calss="mui-slider-item"><img src="0.jpg"/></div>
				<div calss="mui-slider-item"><img src="1.jpg"/></div>
				<div calss="mui-slider-item"><img src="2.jpg"/></div>
				<div calss="mui-slider-item"><img src="3.jpg"/><span id="go_enter">立即进入</span></div>
			</div>
			<div class="mui-slider-indicator">
				<div class="mui-indicator mui-active"></div>
				<div class="mui-indicator"></div>
				<div class="mui-indicator"></div>
				<div class="mui-indicator"></div>
			</div>
		</div>
		*/
		setStartpage: function(jsonData) {
			mui.init({
				swipeBack: true,
				scrollIndicator: "none"
			});
			var vH = dongyi.getScreenInfo('height');
			var slider = document.getElementById('slider');
			slider.style.height = vH + 'px';
			var img = slider.getElementsByTagName('img');
			for (var a = 0; a < img.length; a++) {
				img[a].style.height = vH + 'px';
			}

			//判断是否为第一次登录
			var appWelcome = localStorage.getItem('appWelcome');
			if (appWelcome) {
				mui.plusReady(function() {
					var terger_path = plus.webview.create(jsonData.url, jsonData.id, '');
					terger_path.show();
					setTimeout(function() {
						dongyi.closeStartPage();
					}, 500);

				});
			} else {
				//预加载
				mui.plusReady(function() {
					dongyi.closeStartPage();
					dongyi.preLoad([{
						url: jsonData.url,
						id: jsonData.id
					}], function(data) {
						var productView = data['0'];
						if (productView) {
							clickEvent(productView);
						}
					});
				});

				function clickEvent(productView) {
					var dy_enter = dongyi.id('dy_enter');
					dy_enter.onclick = function() {
						localStorage.setItem('appWelcome', true);
						productView.show("pop-in", 300);
					}
				}
			}
			dongyi.dblclickExit();
		},
		/**
		 * 双击返回键退出APP(仅支持安卓端)
		 * 
		 * 调用：
			ca.dblclickExit();
		 */
		dblclickExit: function() {
			var first = null;
			mui.back = function() {
				if (!first) {
					first = new Date().getTime();
					dongyi.prompt('再按一次退出应用');
					setTimeout(function() {
						dongyi.dblclickExit();
					}, 1000);
				} else {
					if (new Date().getTime() - first < 1000) {
						plus.runtime.quit();
					}
				}
			}
		},
		/**
		 * 隐藏界面滚动条
		 * 
		 * 调用：ca.hiddenScroll();
		 */
		hiddenScroll: function() {
			mui.plusReady(function() {
				var self = plus.webview.currentWebview();
				self.setStyle({
					scrollIndicator: 'none'
				});
			});
		},
		/**
		 * 禁止界面弹动
		 */
		stopBounce: function() {
			var self = plus.webview.currentWebview();
			self.setStyle({
				setBounce: 'none'
			});
		},
		/**
		 * 获得N位随机数(N>=4)随机数验证码
		 * length 为验证码长度
		 * 
		 * 调用：var code = ca.getIdCode('N');
		 */
		getIdCode: function(length) {
			if (length === undefined) {
				length = 4;
			}
			var pow = Math.pow(10, length);
			var code = Math.floor(Math.random() * pow + pow / 10).toString();
			return code.substr(0, length);
		},
		/**
		 * 侧滑导航
		 * @param {Object} type main-move 主界面和导航滑动  menu-move 导航滑动 main-move-scalable 仿QQ效果
		 * @param {Object} showObjId 展示侧滑数组
		 * @param {Object} closeObjId 关闭侧滑数组
		 */
		sideslipNav: function(type, showObjId, closeObjId) {
			var offCanvasWrapper = mui('#offCanvasWrapper');
			var offCanvasInner = offCanvasWrapper[0].querySelector('.mui-inner-wrap');
			var offCanvasSide = dongyi.id("offCanvasSide");
			var classList = offCanvasWrapper[0].classList;
			offCanvasSide.classList.remove('mui-transitioning');
			offCanvasSide.setAttribute('style', '');
			classList.remove('mui-slide-in');
			classList.remove('mui-scalable');
			switch (type) {
				case 'main-move':
					offCanvasWrapper[0].insertBefore(offCanvasSide, offCanvasWrapper[0].firstElementChild);
					break;
				case 'main-move-scalable':
					offCanvasWrapper[0].insertBefore(offCanvasSide, offCanvasWrapper[0].firstElementChild);
					classList.add('mui-scalable');
					break;
				case 'menu-move':
					classList.add('mui-slide-in');
					break;
			}
			offCanvasWrapper.offCanvas().refresh();
			for (var a = 0; a < showObjId.length; a++) {
				var showObj = dongyi.id(showObjId[a]);
				showObj.addEventListener('tap', function() {
					offCanvasWrapper.offCanvas('show');
				});
			}
			for (var a = 0; a < closeObjId.length; a++) {
				var closeObj = dongyi.id(closeObjId[a]);
				closeObj.addEventListener('tap', function() {
					offCanvasWrapper.offCanvas('close');
				});
			}
			mui('#offCanvasSideScroll').scroll();
			mui('#offCanvasContentScroll').scroll();
			if (mui.os.plus && mui.os.ios) {
				mui.plusReady(function() { //5+ iOS暂时无法屏蔽popGesture时传递touch事件，故该demo直接屏蔽popGesture功能
					plus.webview.currentWebview().setStyle({
						'popGesture': 'none'
					});
				});
			}
		},
		/**
		 * 索引列表
		 */
		indexes: function() {
			var header = dongyi.tagName('header')['0'];
			var list = dongyi.id('list');
			list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
			window.indexedList = new mui.IndexedList(list);
		},
		/**
		 * 滑动九宫格
		 */
		gridPagination: function() {
			var slider = document.getElementById('Gallery');
			var group = slider.querySelector('.mui-slider-group');
			var items = mui('.mui-slider-item', group);
			var first = items[0].cloneNode(true);
			first.classList.add('mui-slider-item-duplicate');
			var last = items[items.length - 1].cloneNode(true);
			last.classList.add('mui-slider-item-duplicate');
			var sliderApi = mui(slider).slider();

			function toggleLoop(loop) {
				if (loop) {
					group.classList.add('mui-slider-loop');
					group.insertBefore(last, group.firstChild);
					group.appendChild(first);
					sliderApi.refresh();
					sliderApi.gotoItem(0);
				} else {
					group.classList.remove('mui-slider-loop');
					group.removeChild(first);
					group.removeChild(last);
					sliderApi.refresh();
					sliderApi.gotoItem(0);
				}
			}
			document.getElementById('Gallery_Toggle').addEventListener('toggle', function(e) {
				var loop = e.detail.isActive;
				toggleLoop(loop);
			});
		},
		/**
		 * 图片预览
		 */
		imageViewer: function() {
			mui.previewImage();
		},
		/**
		 * 左右滑动导航
		 * @param {Object} fn 
		 */
		slideNav: function(fn) {
			var dongyi_nav = document.getElementById('dongyi_nav');
			var dongyi_nav_ul = document.getElementById('dongyi_nav_ul');
			var dongyi_nav_li = dongyi_nav.getElementsByTagName('li');
			var oWidth = dongyi_nav_li['0'].offsetWidth;
			var oLeft = dongyi_nav_li['0'].offsetLeft;
			var down_line = document.getElementById('down_line');
			var ulWidth = (oWidth * dongyi_nav_li.length) + (oLeft * 2);
			dongyi_nav_ul.style.width = ulWidth + 'px';
			down_line.style.width = oWidth + 'px';
			var slide_data = 0;
			var screenWidth = 0;
			var target = 0;
			dongyi_nav_ul.ontouchstart = function(ev) {
				var vW = window.innerWidth || document.documentElement.clientWidth || document.body
					.clientWidth;
				var touch = ev.touches['0'];
				var oldX = touch.clientX;
				var oldLeft = dongyi_nav_ul.offsetLeft;
				dongyi_nav_ul.ontouchmove = function(ev) {
					var touch = ev.touches['0'];
					var newX = touch.clientX;
					target = newX - oldX;
					var currentLeft = parseInt(dongyi_nav_ul.offsetLeft);
					if (target > 0 && currentLeft >= 0) {
						dongyi_nav_ul.style.left = 0 + 'px';
						return;
					} else {
						if (-currentLeft >= ulWidth - vW && target < 0) {
							dongyi_nav_ul.style.left = vW - ulWidth + 'px';
						} else {
							dongyi_nav_ul.style.left = oldLeft + target + 'px';
						}
					}
					ev.preventDefault();
				}
			}
			for (var a = 0; a < dongyi_nav_li.length; a++) {
				(function(index) {
					dongyi_nav_li[a].onclick = function() {
						for (var s = 0; s < dongyi_nav_li.length; s++) {
							dongyi_nav_li[s].className = '';
						}
						this.className = "default";
						fn && fn(index, this.innerHTML);
						dongyi_Move(this, index);
					}
				})(a);
			}
			var timer = null;

			function dongyi_Move(obj, index) {
				clearInterval(timer);
				var count = Math.floor(500 / 30);
				var start = down_line.offsetLeft;
				var dis = obj.offsetLeft - start - oLeft;
				var num = 0;
				timer = setInterval(function() {
					num++;
					var s = 1 - num / count;
					var data = start + dis * (1 - s * s * s);
					down_line.style.left = data + "px";
					if (num === count) {
						clearInterval(timer);
					}
				}, 30)
			}
		},
		////////////////////////////////////////*功能模块*///////////////////////////////////////////////////////
		/**
		 * 支付 @ 需配合服务器端完成
		 * @param {Object} json
		 * name         支付名称
		 * json.url     请求支付地址
		 * json.type    支付类型 alipay&weixin
		 * josn.money   支付金额
		 * json.succFn  支付成功回调
		 * json.errFn   支付失败回调
		 * 
		 * 首先配置服务器端支付文件
		 * 
		 * 参数 json
		 * json.requestUrl	请求支付地址
		 * json.payType		支付类型 Alipay/Weixin
		 * json.payMoney		支付金额
		 * json.suucFn		支付成功回调
		 * json.errFn		支付失败回调
		 * 
		 * 调用：
			ca.pay({
				requestUrl: 'http://www.12306xx.com/pay.php',
				payType: 'alipay',
				payMoney: '2',
				succFn: function(){
					alert('支付成功');
				},
				errFn: function(error){
					alert(error);
				}
			});
		 */
		pay: function(json) {
			mui.ready(function() {
				var pays = {};
				plus.payment.getChannels(function(channels) {
					for (var i in channels) {
						var channel = channels[i];
						pays[channel.id] = channel;
					}
				}, function(e) {
					dongyi.prompt("获取支付通道失败：" + e.message);
				});
				var url = '';
				if (json.type === 'alipay' || json.type === 'wxpay') {
					if (json.type === 'wxpay') {
						url = 'http://aigougou.tianzhengtong.com/weixin_pay/index.php?payid=alipay';
					} else {
						url = 'http://aigougou.tianzhengtong.com/alipay.php?payid=wxpay';
					}
				} else {
					dongyi.prompt("不支持此支付通道！");
					return;
				}
				url += '&appid=dongyijs&total=';
				mui.plusReady(function() {
					dongyi.showWaiting();
				});
				var amount = json.money;
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					switch (xhr.readyState) {
						case 4:
							if (xhr.status === 200) {
								mui.plusReady(function() {
									dongyi.closeWaiting();
								});
								var order = xhr.responseText;
								if (json.url === undefined || json.url === '') {
									if (order === '-1') {
										dongyi.prompt('连接服务器错误');
										return;
									} else if (order === '-2') {
										dongyi.prompt('应用配置信息错误');
										return;
									}
								}
								plus.payment.request(pays[json.type], order, function(result) {
									json.succFn && json.succFn();
								}, function(e) {
									json.errFn && json.errFn(e.code + e.message);
								});
							} else {
								json.errFn && json.errFn(xhr.status);
							}
							break;
						default:
							break;
					}
				}
				console.log(url + amount);
				xhr.open('GET', url + amount);
				xhr.send();
			});
		},
		/**
		 * 第三方分享
		 * @param {Object} jsonData
		 * 
		 * 首页 manifest.json 内设置分享平台的key
		 * 
		 * 参数
		 * shareTitle: 		分享标题
		 * shareContent:	分享内容
		 * shareImg:		分享图片(如新浪微博,需申请高级权限,或者分享本机图片)
		 * shareLink:		分享链接
		 * 
		 * 调用：
			ca.share({
				shareTitle: '分享标题',
				shareContent: '分享内容',
				shareImg: '分享图片相对/绝对路径',
				shareLink: '分享链接'
			});
		 */
		share: function(jsonData) {
			var shares = null,
				bhref = false;
			var Intent = null,
				File = null,
				Uri = null,
				main = null;

			/**
			 * 更新分享服务
			 */
			function updateSerivces() {
				plus.share.getServices(function(s) {
					shares = {};
					for (var i in s) {
						var t = s[i];
						shares[t.id] = t;
					}
				}, function(e) {
					dongyi.closeWaiting();
					dongyi.prompt("获取分享服务列表失败：" + e.message);
				});
			}
			mui.ready(function() {

				updateSerivces();
				if (plus.os.name === "Android") {
					Intent = plus.android.importClass("android.content.Intent");
					File = plus.android.importClass("java.io.File");
					Uri = plus.android.importClass("android.net.Uri");
					main = plus.android.runtimeMainActivity();
				}
				/**
				 * 分享操作
				 * @param {String} id
				 */
				function shareAction(id, ex) {
					var s = null;

					if (!id || !(s = shares[id])) {
						dongyi.prompt("无效的分享服务！");
						return;
					}
					if (s.authenticated) {
						console.log("---已授权---");
						shareMessage(s, ex);
					} else {
						console.log("---未授权---");
						s.authorize(function() {
							shareMessage(s, ex);
						}, function(e) {
							dongyi.prompt("认证授权失败：" + e.code + " - " + e.message);
						});
					}

				}
				/**
				 * 发送分享消息
				 * @param {plus.share.ShareService}
				 */
				function shareMessage(s, ex) {
					var msg = {
						content: jsonData.shareContent,
						extra: {
							scene: ex
						}
					};
					var pic = jsonData.shareImg;
					if (jsonData.shareLink) {
						msg.href = jsonData.shareLink;
						if (jsonData.shareTitle) {
							msg.title = jsonData.shareTitle;
						}
						if (jsonData.shareContent) {
							msg.content = jsonData.shareContent;
						}
						if (jsonData.shareImg) {
							msg.thumbs = [jsonData.shareImg];
							msg.pictures = msg.thumbs = [jsonData.shareImg];
						}
					} else {
						if (jsonData.shareImg) {
							msg.pictures = msg.thumbs = [jsonData.shareImg];
						}
					}
					console.log(JSON.stringify(msg));
					s.send(msg, function() {
						dongyi.closeWaiting();
						dongyi.prompt("分享成功");
					}, function(e) {
						dongyi.closeWaiting();
						dongyi.prompt("分享取消");
					});
				}
				var ids = [{
						id: "weixin",
						ex: "WXSceneSession"
					}, {
						id: "weixin",
						ex: "WXSceneTimeline"
					}, {
						id: "sinaweibo"
					}],
					bts = [{
						title: "发送给微信好友"
					}, {
						title: "分享到微信朋友圈"
					}, {
						title: "分享到新浪微博"
					}];
				if (plus.os.name === "iOS") {
					ids.push({
						id: "qq"
					});
					bts.push({
						title: "分享到QQ"
					});
				}
				plus.nativeUI.actionSheet({
						cancel: "取消",
						buttons: bts
					},
					function(e) {
						var i = e.index;
						if (i === 0) {
							return;
						}
						if (i > 0) {
							shareAction(ids[i - 1].id, ids[i - 1].ex);
						}
						dongyi.showWaiting();
						setTimeout(function() {
							dongyi.closeWaiting();
						}, 1000);
					}
				);
			});
		},
		/**
		 * 获得通讯录
		 * type     为获取类型 phone 为本机通讯录 其他 为本机sim通讯录
		 * callbacl 回调函数
		 * 
		 * 参数1 本机通讯录是phone 其他(不填)就是SIM卡
		 * 参数2 回调参数 arr_list 数据(json数组) length 总数
		 * 
		 * 调用：
			ca.getAddressBook('phone', function(arr_list, length){
				console.log(arr_list); console.log(length);
				for(var a =0; a < arr_list.length; a++){
					var json = JSON.Parse(arr_list[a]);
					var name = json.name;
					var phone = json.phone;
					var firstLetter = json.firstLetter;
				}
			});
		 */
		getAddressBook: function(type, callback) {
			mui.plusReady(function() {
				var listLength = 0;
				if (type === 'phone') {
					var getType = 'plus.contacts.ADDRESSBOOK_PHONE';
				} else {
					var getType = 'plus.contacts.ADDRESSBOOK_SIM';
				}
				plus.contacts.getAddressBook(getType, function(addressbook) {
					addressbook.find(null, function(contacts) {
						dongyi.showWaiting();
						if (contacts.length < 1) {
							dongyi.prompt('没有发现通讯录内容');
							dongyi.closeWaiting();
						} else {
							listLength = contacts.length;
							listFilter(contacts);
						}
					}, function(e) {}, {
						multi: true
					});
				});

				function listFilter(arr) {
					var backArr = [];
					for (var i = 0; i < arr.length; i++) {
						if (mui.os.ios) {
							var data = arr[i];
							var json = JSON.stringify(data);
							var datas = eval('(' + json + ')');
							var ios_name = datas['name'];
							if (ios_name['familyName'] !== null) {
								if (ios_name['givenName'] !== null) {
									var name = ios_name['familyName'] + ios_name['givenName'];
								} else {
									var name = ios_name['familyName'];
								}
							} else {

								if (ios_name['givenName'] !== null) {
									var name = ios_name['givenName'];
								} else {
									var name = '#';
								}
							}
							var ios_phone = datas['phoneNumbers'];
							var phone = '';
							var telephone = '';
							for (var a in ios_phone) {
								var data = ios_phone[a];
								if (data['type'] === 'home') {
									telephone = ios_phone[a].value;
								}
								if (data['type'] === 'mobile') {
									phone = ios_phone[a].value;
								}
								if (phone === '') {
									if (data['type'] === 'other') {
										phone = ios_phone[a].value;
									}
								}
							}
							//email
							var ios_emails = datas['emails'];
							var email = '';
							for (var b in ios_emails) {
								email = ios_emails[b].value;
							}

							var company = '';

						} else {
							if (arr[i].displayName) {
								var name = arr[i].displayName;
							}
							if (arr[i].phoneNumbers[0]) {
								var phone = arr[i].phoneNumbers[0].value;
							}
						}


						if (/^[\u4e00-\u9fa5]+$/.test(name)) { //是中文
							var first = dongyi.getFirstLetter(name);
						} else {
							//判断是否为特殊字符
							if (name) {
								var s = name.substring(0, 1);
								if (/^[A-Za-z]+$/.test(s)) { //判断是否为英文名称
									var first = s.toUpperCase();
								} else { // 判断是否为特殊字符
									if (!/^[0-9]+$/.test(s)) { //判断如果不是数字				
										var containSpecial = RegExp(
											/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/
											);
										if (!containSpecial.test(s)) {
											name = escape(name);
										}
									}
									var first = '#';
								}
							} else {
								var first = '#';
							}
						}

						if (phone.length !== '11') {

							var s = phone.substring(0, 5);
							if (s === '17951' || s === '12593') {
								phone = phone.substring(5, 16);
							}

						}
						phone = phone.replace('+86', "");
						phone = phone.replace('/ /g', "");
						phone = phone.replace(/-/g, "");


						var str = '{"name":"' + name + '","phone":"' + phone + '","firstLetter":"' +
							first.toUpperCase() + '"}';
						backArr.push(str);
						dongyi.closeWaiting();
					}
					callback(backArr, listLength);
				}
			});
		},
		/**
		 * 获得Runtime信息
		 */
		getRuntime: function(path) {
			if (path) {
				return plus.runtime[path];
			} else {
				return plus.runtime;
			}
		},
		/**
		 * 获得Os
		 * 
		 */
		getOs: function(path) {
			if (path) {
				return plus.os[path];
			} else {
				return plus.os;
			}
		},
		/**
		 * 获得中文字拼音首字母
		 */
		getFirstLetter: function(data) {
			var val = data.substr(0, 1);
			var name = arraySearch(val);
			if (name) {
				var first = name.substr(0, 1);
			} else {
				var first = '#';
			}
			return first.toUpperCase();

			function arraySearch(l1) {
				for (var name in PinYin) {
					if (PinYin[name].indexOf(l1) !== -1) {
						return name;
						break;
					}
				}
				return false;
			}
		},
		/**
		 * 多级组合选择 支持1,2,3级组合(仿糗事百科中有应用到)
		 * selectNumber 选择数
		 * data         数据
		 * callback     回调
		 * 
		 * 本方法必须配合其他css和js一起使用,相关css和js放置本节课代码中的 combinationSelect 目录下
		 * 
		 * 参数1 组合数1,2,3
		 * 参数2 数据
		 * 参数3 返回值
		 * 
		 * 调用：
			// 1级组合
			var data = ['张三','李四','王五','赵六','田七'];
			ca.combinationSelect(1, data, function(arr){
				alert(arr);
			});
			
			// 2级组合 如: 北京市-海淀区
			// cityData 数据在 city.data.js中
			ca.combinationSelect(2, cityData, function(arr){
				alert(arr);
			});
			
			// 3级组合 如: 河北省-石家庄市-长安区
			// cityData 数据在 city.data-3.js中
			ca.combinationSelect(3, cityData3, function(arr){
				alert(arr);
			});
		 */
		combinationSelect: function(selectNumber, data, callback) {
			if (!selectNumber) {
				selectNumber = 1
			};
			var selector = new mui.PopPicker({
				layer: selectNumber
			});
			if (!selectNumber || selectNumber === 1) {
				var transferArr = [];
				for (var a = 0; a < data.length; a++) {
					var datajson = {
						text: data[a]
					};
					transferArr.push(datajson);
				};
				data = transferArr;
			}
			selector.setData(data);
			selector.show(function(items) {
				var backArr = [];
				if (selectNumber === 1) {
					backArr = [items[0].text];
				} else if (selectNumber === 2) {
					backArr = [items[0].text, items[1].text];
				} else if (selectNumber === 3) {
					backArr = [(items[0] || {}).text, (items[1] || {}).text, (items[2] || {}).text];
				}
				callback && callback(backArr);
			});
		},
		/**
		 * 
		 */

	}
})();
