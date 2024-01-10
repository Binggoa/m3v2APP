var app = {}; // APP信息
app.config = {}; // APP配置信息
app.config.debug = true; // APP配置是否开启本地调试
app.config.URL = "http://api.xxxxx.cn/api/MobileAccess/GetData"; // APP配置数据调试URL



(function(doc, win) {
	var w = document.documentElement.clientWidth;
	if (w > 750) {
		w = 750
	} else if (w < 320) {
		w = 320
	}
	var f = w / 750 * 100 + "px";
	document.documentElement.style.fontSize = f;
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function() {
			var clientWidth = docEl.clientWidth > 750 ? 750 : docEl.clientWidth;
			if (clientWidth > 750) {
				clientWidth = 750
			} else if (clientWidth < 320) {
				clientWidth = 320
			}
			if (!clientWidth) return;
			docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
		};

	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);

	window.onload = function() {
		addScriptTag( // 百度万年历API
			'https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?query=ip&co=&resource_id=6006&t=1562124098965&ie=utf8&oe=gbk&cb=foo&format=json&tn=baidu'
			// 百度万年历API返回数据
			// /**/foo(
			// {"status":"0",
			// "t":"1562124098965",
			// "set_cache_time":"",
			// "data":[
			// 	{"location":"广西壮族自治区钦州市 电信",
			// 	"titlecont":"IP地址查询",
			// 	"origip":"222.218.107.178",
			// 	"origipquery":"222.218.107.178",
			// 	"specialSearch":"1",
			// 	"showlamp":"1",
			// 	"showLikeShare":1,
			// 	"shareImage":1,
			// 	"ExtendedLocation":"",
			// 	"OriginQuery":"ip",
			// 	"tplt":"ip",
			// 	"resourceid":"6006",
			// 	"fetchkey":"222.218.107.178",
			// 	"appinfo":"",
			// 	"role_id":1,
			// 	"disp_type":0},
			// 	],
			// }
			// );
		);
	}
	if (app.config.debug) {
		app.config.URL = "http://192.168.1.213:8061/api/MobileAccess/GetData"; // APP配置数据调试URL
	}
})(document, window);



/**
 * 链接外部JS文件
 */
function addScriptTag(src) {
	var script = document.createElement('script');
	script.setAttribute("type", "text/javascript");
	script.src = src;
	document.body.appendChild(script);
}



/**
 * IP信息格式化
 */
var IPInfo; // IP信息
function foo(data) {
	try {
		var json = data.data[0];
		if (json) {
			IPInfo = json;
		}
	} catch (err) {
		log("error:>>>>>>>>>" + err)
	}
};



/**
 * APP调试日志
 */
function log(data) {
	if (app.config.debug) {
		// typeof(data) typeof 太耗时了
		// if(typeof(data) === "object") {
		// 	console.log(JSON.stringify(data));
		// } else {
		console.log(data);
		// }
	}
}



/**
 * 服务端通讯
 */
var NetAPI = {
	/**
	 * 获取向服务端发起请求时传递的参数
	 * 
	 * 调用：NetAPI.getRequestParams();
	 */
	getRequestParams: function() {
		var request = {
			RequestKey: "",
			UserID: "0",
			UserName: "",
			Sign: "",
			RequestTime: "",
			ClientIP: "127.0.0.1",
			LogType: "",
		}

		var user = StorageAPI.getUser();
		if (user !== null) {
			request.UserName = user.UserNo;
			request.UserID = user.UserAccountID;
		}
		if (IPInfo) {
			request.ClientIP = IPInfo.origip;
		}
		request.RequestTime = UtilsAPI.getNowFormatDate();
		request.RequestKey = UtilsAPI.guid(); // js生成guid（唯一标识码）
		return request;
	},
	/**
	 * api接口安全--签名/授权码(sign:参数加密后生成的签名)与登录(token)验证
	 * 
	 * @param {Object} Control	参数1 需调用的后端接口类名
	 * @param {Object} Action	参数2 需调用的后端接口类名下的某方法名
	 * @param {Object} param	参数3 传递的参数
	 * @param {Object} callback	参数4 回调函数
	 * 
	 * 调用：
		var parms = {};
		NetAPI.callSignApi(Control, Action, parms, function(){});
	 */
	callSignApi: function(Control, Action, param, callback) {
		log(Control + "/" + Action + ">>>>>>>>>" + JSON.stringify(param));
		var request = this.getRequestParams();
		request.Data = param;
		request.LogType = Control + "/" + Action;
		mui.ajax(URL, {
			data: request,
			dataType: 'json',
			type: 'post',
			timeout: 10000,
			async: true,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			success: function(data) {
				if (data.IsSuccess) {
					callback(true, data.Data, "", data.Message);
				} else {
					callback(false, null, data.ErrMsg, data.ErrCode);
					mui.toast(data.ErrMsg);
				}
			},
			error: function(xhr, type, errorThrown) {
				var msg = "系统异常，请联系客服";
				if ("timeout" === type) {
					msg = "网络连接超时";
				} else if ("abort" === type) {
					msg = "网络请求失败，请检查您的网络设置";
				}
				mui.toast(msg);
				log(Control + "/" + Action + JSON.stringify(xhr));
				callback(false, null, msg);
			}
		});
	},
	/**
	 * 上传图片
	 * 
	 * 参数1 图片路径	path(base64格式)
	 * 参数2 路径		secondDir
	 * 参数3 图片宽度	w
	 * 参数4 图片高度	h
	 * 参数5 回调函数	callback（isSuccess,data）
	 * 
	 * 调用：
		
		NetAPI.uploadImage('aaa.jpg', secondDir, 100px, 100px, function(){});
	 */
	uploadImage: function(path, secondDir, w, h, callback) {
		UIAPI.showWaiting();
		UtilsAPI.dealImage(path, {
			width: w,
			width: h,
		}, function(base64) {
			base64 = base64.slice(base64.indexOf("base64,") + "base64,".length);
			UIAPI.closeWaiting();
			//上传图片
			callback(true, path);
			// var task = plus.uploader.createUpload(UploadUrl, {
			// 		method: "POST"
			// 	},
			// 	function(t, status) { //上传完成
			// 		wd.close();
			// 		if (status === 200) {
			// 			log(t.responseText);
			// 			callback(true, t.responseText);
			// 		} else {
			// 			log("上传失败：" + status);
			// 			callback(false, "上传失败：" + status);
			// 			mui.toast("上传失败：" + status);
			// 		}
			// 	}
			// );
			// //参数
			// task.addData('upload', base64);
			// task.addData('secondDir', secondDir);
			// task.addData('ext', "JPG");
			// task.start();
		})
	},
}



/**
 * 图片操作
 */
var UtilsAPI = {
	/**
	 * js生成guid（唯一标识码）
	 * 在使用postman对接口进行测试的时候，有时候接口日志会要求写入随机标识码，这里我们可以使用js来生成。
	 * 
	 * 调用：UtilsAPI.guid(); // 在服务端通讯时会用到
	 */
	guid: function() {
		// Generate four random hex digits.
		function S4() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		}
		// Generate a pseudo-GUID by concatenating random hexadecimal.
		return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
	},
	/**
	 * 图片压缩，默认同比例压缩
	 * 
	 * 参数1 图片路径 pc端传入的路径可以为相对路径，但是在移动端上必须传入的路径是照相图片储存的绝对路径
	 * 参数2 obj 对象 有 width， height， quality(0-1)
	 * 参数3 回调函数有一个参数，base64的字符串数据
	 * 
	 * 调用：
		var dlImg = {width: '100px', height: '100px', quality: '1'}
		UtilsAPI.dealImage('aaa.jpg', dlImg, function(){});
	 */
	dealImage: function(path, obj, callback) {
		var img = new Image();
		img.src = path;
		img.onload = function() {
			var that = this;
			// 默认按比例压缩
			var w = that.width,
				h = that.height,
				scale = w / h;
			w = obj.width || w;
			h = obj.height || (w / scale);
			var quality = 0.7; // 默认图片质量为0.7
			//生成canvas
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			// 创建属性节点
			var anw = document.createAttribute("width");
			anw.nodeValue = w;
			var anh = document.createAttribute("height");
			anh.nodeValue = h;
			canvas.setAttributeNode(anw);
			canvas.setAttributeNode(anh);
			ctx.drawImage(that, 0, 0, w, h);
			// 图像质量
			if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
				quality = obj.quality;
			}
			// quality值越小，所绘制出的图像越模糊
			log("quality===" + quality);
			var base64 = canvas.toDataURL('image/jpeg', quality);
			// 回调函数返回base64的值
			callback(base64);
		}
	},
	/**
	 * 转化为base64
	 * 
	 * 调用：
		UtilsAPI.getBase64Image('aaa.jpg');
	 */
	getBase64Image: function(img) {
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, img.width, img.height);
		var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
		var dataURL = canvas.toDataURL("image/" + ext);
		return dataURL;
	}

}



/**
 * 本地存储
 */
var StorageAPI = {
	/**
	 * 获取缓存的用户信息
	 * 
	 * 调用：StorageAPI.getUser();
	 */
	getUser: function() {
		var user = null;
		if (!window.localStorage) {
			alert("浏览器不支持localstorage");
		} else {
			var storage = window.localStorage;
			var str = storage.getItem("user-test");
			if (str !== null || str !== undefined) {
				user = JSON.parse(str);
			} else {
				user = null;
			}
		}
		return user;
	},
	/**
	 * 设置缓存(键值对形式)
	 * 
	 * 参数1 缓存id名
	 * 参数2 缓存内容
	 * 
	 * 调用：
		var key = 'userInfo',
			data = {userID: '', userName: ''};
		StorageAPI.setStorage(key, data);
	 */
	setStorage: function(key, data) {
		if (!window.localStorage) {
			alert("浏览器不支持localstorage");
		} else {
			var storage = window.localStorage;
			var jsonStr = JSON.stringify(data); // 转换成JSON字符串
			storage.setItem(key, jsonStr);
		}
	},
	/**
	 * 读取缓存
	 * 
	 * 参数1 缓存id名
	 * 
	 * 调用：StorageAPI.getStorage('userInfo');
	 */
	getStorage: function(key) {
		var data = null;
		if (!window.localStorage) {
			alert("浏览器不支持localstorage");
		} else {
			var storage = window.localStorage;
			var str = storage.getItem(key);
			data = JSON.parse(str);
		}
		return data;
	}
}



/**
 * 日期格式化
 */
var DateAPI = {
	/**
	 * 获取当前日期并格式化
	 * 
	 * 调用：DateAPI.getNowFormatDate();
	 */
	getNowFormatDate: function() {
		var date = new Date();
		var seperator1 = "-";
		var seperator2 = ":";
		var month = date.getMonth() + 1;
		var strDate = date.getDate();
		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
			" " + date.getHours() + seperator2 + date.getMinutes() +
			seperator2 + date.getSeconds();
		return currentdate;
	},
	/**
	 * 获取日期
	 * 
	 * 调用 :DateAPI.getDay();
	 */
	getDay: function() {
		var date = new Date();
		var seperator1 = "-";
		var seperator2 = ":";
		var month = date.getMonth() + 1;
		var strDate = date.getDate();
		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
		return currentdate;
	}
}



/**
 * webviewUI相关操作
 */
var UIAPI = {
	/**
	 * 显示加载框
	 * 
	 * 参数 加载框显示内容
	 * 
	 * 调用：UIAPI.showWaiting('正在加载中……');
	 */
	showWaiting: function(msg) {
		plus.nativeUI.showWaiting(msg || "加载中...");
	},
	/**
	 * 关闭加载框
	 * 
	 * 调用：UIAPI.closeWaiting();
	 */
	closeWaiting: function() {
		plus.nativeUI.closeWaiting()
	},
	/**
	 * 字符串转dom
	 * 
	 * 调用：UIAPI.parseDom("<div>"+GoodsDesc+"</div>");
	 */
	parseDom: function(arg) {
		var objE = document.createElement("div");
		objE.innerHTML = arg;
		return objE.childNodes;
	},
	/**
	 * dom转字符串
	 * 
	 * 调用：UIAPI.nodeToString(node);
	 */
	nodeToString: function(node) {
		var tmpNode = document.createElement("div");
		tmpNode.appendChild(node);
		var str = tmpNode.innerHTML;
		tmpNode = node = null; // prevent memory leaks in IE  
		return str;
	},
	/**
	 * 批量关闭页面
	 * 
	 * 参数 页面ID(数组)
	 * 
	 * 调用：
		var pageIDs = ['a.html','b.html','c.html']; // 创建webview时没有设置ID默认为url
		UIAPI.closePages(pageIDs);
	 */
	closePages: function(pageIDs) {
		for (var i = 0; i < pageIDs.length; i++) {
			var page = plus.webview.getWebviewById(pageIDs[i]);
			if (page) {
				plus.webview.close(page, "none");
			}
		}
	},
	/**
	 * 打开有标题页面
	 * 
	 * 参数1 页面路径
	 * 参数2 页面ID
	 * 参数3 标题
	 * 参数4 传递的参数
	 * 
	 * 调用：
		var extras = {a:'1',b:'2',c:'3'};
		UIAPI.openWindowWithTitle('a.html', 'a.html', '标题', extras);
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
					autoBackButton: true
				}
			},
			waiting: {
				autoShow: true, //自动显示等待框，默认为true
				//title: '正在加载...' //等待对话框上显示的提示内容
			}
		})
	},
	/**
	 * 打开无标题页面
	 * 
	 * 参数1 页面路径,
	 * 参数2 页面ID
	 * 参数3 传递的参数
	 * 
	 * 调用：
		var extras = {a:'1',b:'2',c:'3'};
		UIAPI.openWindow('a.html', 'a.html', extras);
	 */
	openWindow: function(url, id, extras) {
		mui.openWindow(url, id, {
			extras: extras,
			show: {
				event: "loaded" //在当前页面加载,加载完在跳转
			},
			waiting: {
				autoShow: true, //自动显示等待框，默认为true
				//title: '正在加载...' //等待对话框上显示的提示内容
			}
		})
	},
	/**
	 * 打开商品详情页
	 * 
	 * 参数1 商品详情页路径
	 * 参数2 商品ID
	 * 
	 * 调用：UIAPI.openGoodsDetail('goods_detail.html','goods_detail.html');
	 */
	openGoodsDetail: function(path, goodsId) {
		mui.openWindow(path, "shop_goodsDetail.html", {
			extras: {
				goodsId: goodsId
			},
			styles: {
				"titleNView": {
					backgroundColor: '#E60021',
					titleText: '商品详情',
					titleColor: '#FFFFFF',
					type: 'transparent',
					autoBackButton: true,
					splitLine: {
						color: '#E60021'
					}
				}
			},
			show: {
				event: "loaded", //在当前页面加载,加载完在跳转
			},
			waiting: {
				autoShow: true, //自动显示等待框，默认为true
				//title: '正在加载...' //等待对话框上显示的提示内容
			}
		})
	},
	/**
	 * 跳转登录页面
	 * 
	 * 参数1 登录页面地址
	 * 参数2 
	 * 参数3 
	 * 参数4 
	 * 
	 * 调用：UIAPI.goLogin();
	 */
	goLogin: function(loginPath, toView, toViewID, extras) {
		var param = {
			toView: toView,
			toViewID: toViewID,
			extras: extras
		}
		this.openWindow(loginPath, "shop_login.html", param)
	}

}



/**
 * 常规JS函数封装
 */
var Hezc = {
	/**
	 * 1. 禁止非开发人员T打开控制台和查d看元素,在href上添加?debug可打开
	 * 
	 * 调用：window.doNotOpenTheConsole();
	 */
	doNotOpenTheConsole: function(mox) {
		var stiac = mox || false;
		var windowHref = window.location.href;
		document.oncontextmenu = function(event) {
			var e = event || window.event || arguments.callee.caller.arguments[0];
			if (e.button === 2 && windowHref.indexOf('debug') === -1) {
				return false;
			}
		};
		document.onkeydown = function(e) {
			var currKey = 0,
				evt = e || window.event;
			currKey = evt.keyCode || evt.which || evt.charCode;
			if ((currKey === 123 || currKey === 16 || currKey === 17 || currKey === 73 || currKey === 74) && windowHref.indexOf(
					'debug') === -1) {
				return false
			}
		}
		isConsole();
		window.onresize = function isConsoles() {
			isConsole()
		};

		function isConsole() {
			var contWidth = window.innerWidth;
			var contHeight = window.innerHeight;
			var outWidth = window.outerWidth;
			var outHeight = window.outerHeight;
			var browser = {
				versions: function() {
					var u = navigator.userAgent,
						app = navigator.appVersion;
					return {
						mobile: !!u.match(/AppleWebKit.*Mobile.*/),
					};
				}(),
			}
			if ((outWidth - contWidth > 120 || outHeight - contHeight > 200) && windowHref.indexOf('debug') === -1) {
				document.body.innerHTML = '请关闭控制台后刷新页面';
			}
			/* else if (browser.versions.mobile) {
			    document.body.innerHTML = '移动端模式不支持打开本页面'
			} */
		}
		//禁止新开窗口打开--start--超严格模式，包阔失焦该页面
		if (stiac) {
			var isOnFocus = true;
			window.onblur = function() {
				isOnFocus = false;
				console.log(isOnFocus);
				isNewWindow();
			}
			window.onfocus = function() {
				isOnFocus = true;
				console.log(isOnFocus);
				isNewWindow()
			}

			function isNewWindow() {
				!isOnFocus ? document.body.innerHTML = '点击当前页面重新加载' : window.location = window.location
			}
		}
	},
	/**
	 * 2.禁止拖拽图片
	 * 
	 * 调用：Hezc.doNotSaveImage();
	 */
	doNotSaveImage: function() {
		for (var i in document.images) {
			document.images[i].ondragstart = function() {
				return false;
			};
		}
	},
	/**
	 * 3.禁止右键
	 * 
	 * 调用：Hezc.doNotOncontextmenu();
	 */
	doNotOncontextmenu: function() {
		document.oncontextmenu = function() {
			return false;
		}
	},
	/**
	 * 4.禁用指定键(可多个)
	 * 
	 * 调用：Hezc.doNotKeyDown(2, 6)
	 */
	doNotKeyDown: function(arr) {
		arr = Array(arr);
		document.onkeydown = function(e) {
			var currKey = 0,
				evt = e || window.event;
			currKey = evt.keyCode || evt.which || evt.charCode;
			for (var i = 0; i < arr.length; i++) {
				if (currKey = arr[i] && windowHref.indexOf('debug') === -1) {
					return false
				}
			}
		}
	},
	/**
	 * 5.图片懒加载(根据屏幕可视范围)
	 * 
	 * 调用：Hezc.imglazyload();
	 */
	imglazyload: function() {
		function getTop(e) {
			return e.offsetTop;
		}
		Hezc.addEvent(window, 'scroll', function() {
			Hezc.throttle(lazyload(), 200)
		})
		lazyload();

		function lazyload() {
			imgs = document.querySelectorAll('img[data-src]');
			var h = window.innerHeight;
			var s = document.documentElement.scrollTop || document.body.scrollTop;
			for (var i = 0; i < imgs.length; i++) {
				if ((h + s) > getTop(imgs[i])) {
					(function(img) {
						var temp = new Image();
						var src = img.getAttribute('data-src');
						temp.src = src
						temp.onload = function() {
							img.src = src
							img.removeAttribute('data-src')
						}
						temp.onerror = function() {
							img.removeAttribute('data-src')
						}
					})(imgs[i])
				}
			}
		}
	},
	/**
	 * 6.1复制到粘贴板
	 * 
	 * 参数1 需要复制的内容
	 * 
	 * 调用：
		<div class="als">复制11111111111</div>
		document.querySelector('.als').addEventListener('click', copy);
		function copy() {
		    var text = document.querySelector('.cont').innerHTML;
		    Hezc.copyText(text);
		}
	 */
	copyText: function(text) {
		var input = document.createElement('input');
		input.setAttribute('readonly', 'readonly'); // 防止手机上弹出软键盘
		input.setAttribute('value', text);
		document.body.appendChild(input);
		input.select();
		var res = document.execCommand('copy');
		document.body.removeChild(input);
		return res;
	},
	/**
	 * 6.2文本复制功能
	 * 
	 * 参数1 需要复制的内容
	 * 参数2 回调函数
	 * 
	 * 调用：
		<div class="als2">复制2222222222</div>
		document.querySelector('.als2').addEventListener('click', copy2);
		function copy2() {
		    var text2 = document.querySelector('.cont2').innerHTML;
		    Hezc.copyTxt2(text2);
		}
	 */
	copyTxt2: function(text, fn) {
		if (typeof document.execCommand !== 'function') {
			console.log('复制失败，请长按复制')
			return
		}
		var dom = document.createElement('textarea');
		dom.value = text;
		dom.setAttribute('style', 'display: block; width: 1px; height: 1px;');
		document.body.appendChild(dom);
		dom.select();
		var result = document.execCommand('copy');
		document.body.removeChild(dom);
		if (result) {
			console.log('复制成功');
			typeof fn === 'function' && fn();
			return
		}
		if (typeof document.createRange !== 'function') {
			console.log('复制失败，请长按复制');
			return
		}
		var range = document.createRange();
		var div = document.createElement('div');
		div.innerHTML = text;
		div.setAttribute('style', 'height: 1px; font-size: 1px; overflow: hidden;');
		document.body.appendChild(div);
		range.selectNode(div);
		var selection = window.getSelection();
		console.log(selection);
		if (selection.rangeCount > 0) {
			selection.removeAllRanges();
		}
		selection.addRange(range);
		document.execCommand('copy');
		typeof fn === 'function' && fn();
		console.log('复制成功');
	},
	/**
	 * 7.用户检测
	 * 
	 * 调用：Hezc.userDetection('iPhone');
	 */
	userDetection: function(txt) {
		var engine = {
			ie: 0,
			gecko: 0,
			webkit: 0,
			khtml: 0,
			opera: 0,
			ver: null
		};
		var browser = {
			ie: 0,
			firefox: 0,
			safari: 0,
			konq: 0,
			opera: 0,
			chrome: 0,
			ver: null
		};
		var system = {
			win: false,
			mac: false,
			x11: false,
			iphone: false,
			ipod: false,
			ipad: false,
			ios: false,
			android: false,
			nokiaN: false,
			winMobile: false,
			wii: false,
			ps: false
		};
		var paramer = false;
		var ua = navigator.userAgent;
		if (window.opera) {
			engine.ver = browser.ver = window.opera.version();
			engine.opera = browser.opera = parseFloat(engine.ver);
		} else if (/AppleWebKit\/(\S+)/.test(ua)) {
			engine.ver = RegExp["$1"];
			engine.webkit = parseFloat(engine.ver);
			if (/Chrome\/(\S+)/.test(ua)) {
				browser.ver = RegExp["$1"];
				browser.chrome = parseFloat(browser.ver);
			} else if (/Version\/(\S+)/.test(ua)) {
				browser.ver = RegExp["$1"];
				browser.safari = parseFloat(browser.ver);
			} else {
				var safariVersion = 1;
				if (engine.webkit < 100) {
					safariVersion = 1;
				} else if (engine.webkit < 312) {
					safariVersion = 1.2;
				} else if (engine.webkit < 412) {
					safariVersion = 1.3;
				} else {
					safariVersion = 2;
				}
				browser.safari = browser.ver = safariVersion;
			}
		} else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
			engine.ver = browser.ver = RegExp["$1"];
			engine.khtml = browser.konq = parseFloat(engine.ver);
		} else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
			engine.ver = RegExp["$1"];
			engine.gecko = parseFloat(engine.ver);
			if (/Firefox\/(\S+)/.test(ua)) {
				browser.ver = RegExp["$1"];
				browser.firefox = parseFloat(browser.ver);
			}
		} else if (/MSIE ([^;]+)/.test(ua)) {
			engine.ver = browser.ver = RegExp["$1"];
			engine.ie = browser.ie = parseFloat(engine.ver);
		}
		browser.ie = engine.ie;
		browser.opera = engine.opera;
		var p = navigator.platform;
		system.win = p.indexOf("Win") === 0;
		system.mac = p.indexOf("Mac") === 0;
		system.x11 = (p === "X11") || (p.indexOf("Linux") === 0);
		if (system.win) {
			if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
				if (RegExp["$1"] === "NT") {
					switch (RegExp["$2"]) {
						case "5.0":
							system.win = "2000";
							break;
						case "5.1":
							system.win = "XP";
							break;
						case "6.0":
							system.win = "Vista";
							break;
						case "6.1":
							system.win = "7";
							break;
						default:
							system.win = "NT";
							break;
					}
				} else if (RegExp["$1"] === "9x") {
					system.win = "ME";
				} else {
					system.win = RegExp["$1"];
				}
			}
		}
		system.iphone = ua.indexOf("iPhone") > -1;
		system.ipod = ua.indexOf("iPod") > -1;
		system.ipad = ua.indexOf("iPad") > -1;
		system.nokiaN = ua.indexOf("NokiaN") > -1;
		if (system.win === "CE") {
			system.winMobile = system.win;
		} else if (system.win === "Ph") {
			if (/Windows Phone OS (\d+.\d+)/.test(ua)) {;
				system.win = "Phone";
				system.winMobile = parseFloat(RegExp["$1"]);
			}
		}
		if (system.mac && ua.indexOf("Mobile") > -1) {
			if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)) {
				system.ios = parseFloat(RegExp.$1.replace("_", "."));
			} else {
				system.ios = 2; //ֻܲ²  
			}
		}
		if (/Android (\d+\.\d+)/.test(ua)) {
			system.android = parseFloat(RegExp.$1);
		}
		system.wii = ua.indexOf("Wii") > -1;
		system.ps = /playstation/i.test(ua);
		paramer = ua.indexOf(txt) > -1;
		return {
			engine: engine,
			browser: browser,
			system: system,
			paramer: paramer
		};
	},
	/**
	 * 8.获取当前url中某参数的值
	 * 
	 * 参数 当前url中的某参数名
	 * 
	 * 调用：Hezc.getQueryString('a');
	 */
	getQueryString: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
		if (r !== null) return unescape(r[2]);
		return null;
	},
	/**
	 * 9.获取hash参数
	 * 
	 * 调用：Hezc.getUrlHash('a');
	 */
	getUrlHash: function() {
		var reg = new RegExp("(^|&|#)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		var r = window.location.hash.substr(1).match(reg); //匹配目标参数
		if (r !== null) return unescape(r[2]);
		return null; //返回参数值
	},
	/**
	 * 10.获取url参数列表
	 * 
	 * 参数 url
	 * 
	 * 调用：
		var url = window.location.search; // 当前页面url
		Hezc.getUrlParams(url);
	 */
	getUrlParams: function(url) {
		// let url = window.location.search;
		let index = url.indexOf('?')
		let obj = {}
		if (index !== -1) {
			let str = url.substr(1)
			let arr = str.split('&')
			for (let i = 0; i < arr.length; i++) {
				obj[arr[i].split('=')[0]] = arr[i].split('=')[1]
			}
		}
		return obj
	},
	/**
	 * 11.获取元素位置信息和页面尺寸信息
	 * 
	 * 调用：
		var als = document.querySelector('.als');
		Hezc.getDomClOf(als);
	 */
	getDomClOf: function(element) {
		if (!element) {
			return '参数为dom节点必传'
		}
		var positionAll = {
			// 内高度、内宽度： 内边距 + 内容框
			clientWidth: element.clientWidth,
			clientHeight: element.clientHeight,
			//外高度，外宽度： 边框 + 内边距 + 内容框
			offsetWidth: element.offsetWidth,
			offsetHeight: element.offsetHeight,
			//上边框、左边框
			clientTop: element.clientTop,
			clientLeft: element.clientLeft,
			//元素的大小及其相对于视口的位置
			sizePosition: element.getBoundingClientRect(),
			//上边偏移量，左边的偏移量
			offsetTop: element.offsetTop,
			offsetLest: element.offsetLest,
			//可视区域的大小
			lookClientWidth: document.documentElement.clientWidth,
			lookClientHeight: document.documentElement.clientHeight,
			//页面的实际大小
			scrollWidth: document.documentElement.scrollWidth,
			scrollHeight: document.documentElement.scrollHeight,
			// 窗口左上角 与 屏幕左上角的 距离
			screenX: window.screenX,
			screenY: window.screenY,
			//屏幕宽高
			screenW: window.screen.width,
			screenH: window.screen.height,
			//屏幕可用宽高（去除任务栏）
			availWidth: window.screen.availWidth,
			availHeight: window.screen.availHeight,
			//窗口的内高度、内宽度（文档显示区域+滚动条）
			innerWidth: window.innerWidth,
			innerHeight: window.innerHeight,
			// 窗口的外高度、外宽度
			outerWidth: window.outerWidth,
			outerHeiht: window.outerHeiht
		}
		return positionAll;
	},
	/**
	 * 12.数组去重
	 * 
	 * 调用：
		var arr1 = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6];
		Hezc.unique(arr1);
	 */
	unique: function(arr) {
		if (!arr) {
			return '参数为数组必传'
		}
		for (var i = 0; i < arr.length; i++) {
			for (var j = i + 1; j < arr.length; j++) {
				if (arr[i] === arr[j]) {
					arr.splice(j, 1);
					j--
				}
			}
		}
		return arr
	},
	/**
	 * 13.判断是否为邮箱地址
	 * 
	 * 参数 邮箱地址
	 * 
	 * 调用：Hezc.isEmail('1@m');
	 */
	isEmail: function(emailStr) {
		var reg = /^[a-zA-Z0-9]+([._-]*[a-zA-Z0-9]*)*@[a-zA-Z0-9]+.[a-zA-Z0-9{2,5}$]/;
		var result = reg.test(emailStr);
		if (result) {
			return true
		} else {
			return false
		}
	},
	/**
	 * 14.判断是否是手机号
	 * 
	 * 参数 号码
	 * 
	 * 调用：Hezc.isMobilePhone(17828020593);
	 */
	isMobilePhone: function(phone) {
		var reg = /^1\d{10}$/;
		if (reg.test(phone)) {
			return true
		} else {
			return false
		}
	},
	/**
	 * 15.判断是否是同一天,返回true或false
	 * 
	 * 参数1 日期1
	 * 参数2 日期2
	 * 
	 * 调用：Hezc.isSameDay('2020/9/20', '2020/9/20');
	 */
	isSameDay: function(time1, time2) {
		const startTimeMs = new Date(time1).setHours(0, 0, 0, 0);
		const endTimeMs = new Date(time2).setHours(0, 0, 0, 0);
		return startTimeMs === endTimeMs ? true : false
	},
	/**
	 * 16.生成指定范围内的正整数随机数
	 * 
	 * 参数1 值N
	 * 参数2 值M
	 * 
	 * 调用：Hezc.getNumRandom(10, 30);
	 */
	getNumRandom: function(n, m) {
		if (n > m) { // 如果值N大于值M,则M为最小值,N为最大值
			return parseInt(m + Math.random() * (n - m + 1));
		} else {
			return parseInt(n + Math.random() * (m - n + 1));
		}
	},
	/**
	 * 17.获取图片尺寸 （根据url）
	 * 
	 * 参数 图片url
	 * 
	 * 调用：
		Hezc.getImageSizeByUrl('https://fanyiapp.cdn.bcebos.com/cms/image/15f2894dfc2bc238454e2c4a7f5ab0a4.jpg').then(function (v) { console.log(v, '获取图片大小') });
	 */
	getImageSizeByUrl: function(url) {
		return new Promise(function(resolve) {
			let img = new Image();
			img.src = url + '?_=' + Date.parse(new Date());
			var check = function() {
				if (img.width > 0 && img.height > 0) {
					clearInterval(set);
					resolve({
						width: img.width,
						height: img.height,
					});
				}
			}
			var set = setInterval(check, 50);
		});
	},
	/**
	 * 18.1时间戳转日期
	 * 
	 * 参数 时间戳
	 * 
	 * 调用：Hezc.getLocalTime(+new Date());
	 */
	getLocalTime: function(nS) {
		var date = new Date(nS);
		var Y = date.getFullYear() + '/';
		var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
		var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
		var h = date.getHours() + ':';
		var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ' ';
		return Y + M + D + h + m;
	},
	/**
	 * 18.2时间格式化【'yyyy-MM-dd hh:mm:ss',时间】
	 * 
	 * 调用：Hezc.formatDate('yyyy/MM/dd hh:mm:ss','时间戳格式数据');
	 */
	formatDate: function(fmt, date) {
		if (typeof date !== 'object') {
			date = !date ? new Date() : new Date(date);
		}
		var o = {
			'M+': date.getMonth() + 1, // 月份
			'd+': date.getDate(), // 日
			'h+': date.getHours(), // 时
			'm+': date.getMinutes(), // 分
			's+': date.getSeconds(), // 秒
			'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
			'S': date.getMilliseconds() // 毫秒
		}
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (new RegExp('(' + k + ')').test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
			}
		}
		return fmt;
	},
	/**
	 * 19. 判断数据类型
	 * 
	 * 参数 数据
	 * 
	 * 调用：Hezc.getDataType("98");
	 */
	getDataType: function(elem) {
		if (elem === null) {
			return elem + '';
		}
		return toString.call(elem).replace(/[\[\]]/g, '').split(' ')[1].toLowerCase();
	},
	/**
	 * 20.节流
	 * 
	 * 参数 fn:回调函数，wait：时间
	 * 
	 * 调用：
		Hezc.throttle(logs, 100);
		function logs() {
		    console.log();
		}
	 */
	throttle: function(fn, wait) {
		let flag = false;
		return function() {
			if (flag) return;
			flag = true;
			fn.apply(this, arguments);
			setTimeout(function() {
				flag = false;
			}, wait);
		}
	},
	/**
	 * 21.防抖
	 * 
	 * 参数 fn:回调函数，delay：时间
	 * 
	 * 调用：
		<input id="inp" type="text" oninput="inputs(this)">
		var inputs = Hezc.debounce(logs, 100);
		function logs() {
		    var inp = document.getElementById('inp').value;
		    console.log(inp);
		}
	 */
	debounce: function(fn, delay) {
		let timer = null;
		return function() {
			let context = this;
			let args = arguments;
			timer && clearTimeout(timer);
			timer = setTimeout(function() {
				fn.apply(context, args);
				timer = null;
			}, delay);
		}
	},
	/**
	 * 22.事件委派/监听函数
	 * 
	 * 参数1 监听对象
	 * 参数2 监听事件名
	 * 参数3 事件触发时执行的方法
	 * 
	 * 调用：
		Hezc.addEvent(window, 'scroll', Hezc.debounce(showTop, 200))
		function showTop() {
		    let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		    console.log('滚动条位置：' + scrollTop);
		}
	 */
	addEvent: function(obj, type, fn) {
		if (obj.attachEvent) { //ie
			obj.attachEvent('on' + type, function() {
				fn.call(obj);
			})
		} else {
			obj.addEventListener(type, fn, false);
		}
	},
	/**
	 * 23.深拷贝
	 * 浅拷贝：以下代码b复制了a，然后修改数组a，数组b也跟着变。深拷贝则不受源数据影响
		let a=[0,1,2,3,4],
		    b=a;
		console.log(a===b);
		a[0]=1;
		console.log(a,b);
	 * 
	 * JSON.parse(JSON.stringify(obj))我们一般用来深拷贝，其过程说白了 就是
	 * 利用JSON.stringify 将js对象序列化（JSON字符串），
	 * 再使用JSON.parse来反序列化(还原)js对象
	 * 序列化的作用是存储(对象本身存储的只是一个地址映射，如果断电，对象将不复存在，
	 * 因此需将对象的内容转换成字符串的形式再保存在磁盘上 )和传输
	 * （例如 如果请求的Content-Type是 application/x-www-form-urlencoded，
	 * 则前端这边需要使用qs.stringify(data)来序列化参数再传给后端，否则后端接受不到 
	 * ps: Content-Type 为 application/json;charset=UTF-8或者 multipart/form-data 则可以不需要 ）。
	 * 
	 * 参数1 拷贝对象
	 * 
	 * 调用：
		var arrObj = [{ age: 18 }, { age: 20 }];
		var newarrObj = Hezc.cloneObj(arrObj);
		console.log(arrObj);
	 */
	cloneObj: function(data) {
		// var _obj = JSON.stringify(obj), // 将js对象序列化(转换)成JSON字符串
		//     objClone = JSON.parse(_obj); // 反序列化(还原)成js对象
		const type = this.judgeType(data);
		// const type = Hezc.judgeType(data);
		let obj = null;
		if (type === 'array') {
			obj = [];
			for (let i = 0; i < data.length; i++) {
				obj.push(this.cloneObj(data[i]));
			}
		} else if (type === 'object') {
			obj = {}
			for (let key in data) {
				if (data.hasOwnProperty(key)) {
					obj[key] = this.cloneObj(data[key]);
				}
			}
		} else {
			return data;
		}
		return obj;
	},
	judgeType: function(obj) {
		// tostring会返回对应不同的标签的构造函数
		const toString = Object.prototype.toString;
		const map = {
			'[object Boolean]': 'boolean',
			'[object Number]': 'number',
			'[object String]': 'string',
			'[object Function]': 'function',
			'[object Array]': 'array',
			'[object Date]': 'date',
			'[object RegExp]': 'regExp',
			'[object Undefined]': 'undefined',
			'[object Null]': 'null',
			'[object Object]': 'object',
		};
		if (obj instanceof Element) {
			return 'element';
		}
		return map[toString.call(obj)];
	},
	/**
	 * 24.判断设备是否是移动端
	 * 
	 * 调用：Hezc.isPhone();
	 */
	isPhone: function() {
		var sUserAgent = navigator.userAgent.toLowerCase();
		var bIsIpad = sUserAgent.match(/ipad/i) === "ipad";
		var bIsIphoneOs = sUserAgent.match(/iphone os/i) === "iphone os";
		var bIsMidp = sUserAgent.match(/midp/i) === "midp";
		var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) === "rv:1.2.3.4";
		var bIsUc = sUserAgent.match(/ucweb/i) === "ucweb";
		var bIsAndroid = sUserAgent.match(/android/i) === "android";
		var bIsCE = sUserAgent.match(/windows ce/i) === "windows ce";
		var bIsWM = sUserAgent.match(/windows mobile/i) === "windows mobile";
		if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
			return true;
		} else {
			return false;
		}
	},
	/**
	 * 25.判断两个节点是否是上下级关系
	 * 
	 * 参数1 父节点
	 * 参数2 子节点
	 * 
	 * 调用：
		<div id="father">
		    <div><div id="son"></div></div>
		</div>
		Hezc.contains(document.getElementById('father'), document.getElementById('son'));
	 */
	contains: function(father, son) {
		var node = son.parentNode;
		do {
			if (node === father) {
				return true;
			} else {
				node = node.parentNode;
			}
		} while (node !== null);
		return false;
	},
	/**
	 * 26.加载js、css、style
	 * 
	 * 参数1 加载文件路径链接
	 * 参数2 加载文件类型
	 * 参数3 回调函数(js加载完成后执行某方法等操作)
	 * 
	 * 调用：Hezc.loadRes('lrtk.js', javascript ,function(){});
	 */
	loadRes: function(name, type, fn) {
		let ref;
		if (type === 'js' || type === 'javascript') { // 外部js
			ref = document.createElement('script');
			ref.setAttribute('type', 'text/JavaScript');
			ref.setAttribute('src', name);
		} else if (type === 'css') { // 外部css
			ref = document.createElement('link');
			ref.setAttribute('rel', 'stylesheet');
			ref.setAttribute('type', 'text/css');
			ref.setAttribute('href', name);
		} else if (type === 'style') { // style
			ref = document.createElement('style');
			ref.innerHTML = name;
		}
		if (typeof ref !== 'undefined') {
			document.getElementsByTagName('head')[0].appendChild(ref);
			ref.onload = function() { // 加载完成执行
				typeof fn === 'function' && fn();
			}
		}
	},
	/**
	 * 27.获取url的参数
	 * 
	 * 参数 url
	 * 
	 * 调用：
		var url = 'https://www.aaa.com/a?id=1&b?name=2';
		Hezc.getUrlParam(url);
	 */
	getUrlParam: function(url) {
		let reg = new RegExp('(^|&?)' + url + '=([^&]*)(&|$)', 'i');
		let r = window.location.href.substr(1).match(reg);
		if (r !== null) {
			return decodeURI(r[2]);
		}
		return undefined;
	},
	/**
	 * 28.JS获取元素样式【支持内联】
	 * 
	 * 参数1 元素名
	 * 参数2 样式名
	 * 
	 * 调用：Hezc.getRealStyle(img, src);
	 */
	getRealStyle: function(obj, styleName) {
		var realStyle = null;
		if (obj.currentStyle) {
			realStyle = obj.currentStyle[styleName];
		} else if (window.getComputedStyle) {
			realStyle = window.getComputedStyle(obj, null)[styleName];
		}
		return realStyle;
	},
	/**  
	 * 29.封装HashMap
	 * 
	 * 接口：
	 * size() 获取MAP元素个数 
	 * isEmpty() 判断MAP是否为空 
	 * clear() 删除MAP所有元素 
	 * put(key, value) 向MAP中增加元素（key, value) 
	 * remove(key) 删除指定KEY的元素，成功返回True，失败返回False 
	 * get(key) 获取指定KEY的元素值VALUE，失败返回NULL 
	 * element(index) 获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL 
	 * containsKey(key) 判断MAP中是否含有指定KEY的元素 
	 * containsValue(value) 判断MAP中是否含有指定VALUE的元素 
	 * values() 获取MAP中所有VALUE的数组（ARRAY） 
	 * keys() 获取MAP中所有KEY的数组（ARRAY） 
	 * 
	 * 调用：
	 		Map map=new Hezc.ObjectMap();
			map.put("a",“student”);
			var value=map.get("a");
			console.log(value);
	 */
	ObjectMap: function() {
		
		this.elements = new Array();
	
		this.size = function() {
			return this.elements.length;
		}
	
		this.isEmpty = function() {
			return (this.elements.length < 1);
		}
	
		this.clear = function() {
			this.elements = new Array();
		}
	
		this.put = function(_key, _value) {
			this.elements.push( {
				key : _key,
				value : _value
			});
		}
	
		this.remove = function(_key) {
			var bln = false;
	
			try {
				for (i = 0; i < this.elements.length; i++) {
					if (this.elements[i].key === _key) {
						this.elements.splice(i, 1);
						return true;
					}
				}
			} catch (e) {
				bln = false;
			}
			return bln;
		}
	
		this.get = function(_key) {
			try {
				for (i = 0; i < this.elements.length; i++) {
					if (this.elements[i].key === _key) {
						return this.elements[i].value;
					}
				}
			} catch (e) {
				return null;
			}
		}
	
		this.element = function(_index) {
			if (_index < 0 || _index >= this.elements.length) {
				return null;
			}
			return this.elements[_index];
		}
	
		this.containsKey = function(_key) {
			var bln = false;
			try {
				for (i = 0; i < this.elements.length; i++) {
					if (this.elements[i].key === _key) {
						bln = true;
					}
				}
			} catch (e) {
				bln = false;
			}
			return bln;
		}
	
		this.containsValue = function(_value) {
			var bln = false;
			try {
				for (i = 0; i < this.elements.length; i++) {
					if (this.elements[i].value === _value) {
						bln = true;
					}
				}
			} catch (e) {
				bln = false;
			}
			return bln;
		}
	
		this.values = function() {
			var arr = new Array();
			for (i = 0; i < this.elements.length; i++) {
				arr.push(this.elements[i].value);
			}
			return arr;
		}
	
		this.keys = function() {
			var arr = new Array();
			for (i = 0; i < this.elements.length; i++) {
				arr.push(this.elements[i].key);
			}
			return arr;
		}
	},
	/**
	 * 30.自定义map集合
	 * 
	 * 调用：
			Map map=new Hezc.ArrayMap();
			map.put("a",“student”);
			var value=map.get("a");
			console.log(value);
	 */
	ArrayMap: function() {   
	    /** 存放键的数组(遍历用到) */  
	    this.keys = new Array();   
	    /** 存放数据 */  
	    this.data = new Object();   
	       
	    /**  
	     * 放入一个键值对  
	     * @param {String} key  
	     * @param {Object} value  
	     */  
	    this.put = function(key, value) {   
	        if(this.data[key] === null){   
	            this.keys.push(key);   
	        }   
	        this.data[key] = value;   
	    };   
	       
	    /**  
	     * 获取某键对应的值  
	     * @param {String} key  
	     * @return {Object} value  
	     */  
	    this.get = function(key) {   
	        return this.data[key];   
	    };   
	       
	    /**  
	     * 删除一个键值对  
	     * @param {String} key  
	     */  
	    this.remove = function(key) {   
	        this.keys.remove(key);   
	        this.data[key] = null;   
	    };   
	       
	    /**  
	     * 遍历Map,执行处理函数  
	     *   
	     * @param {Function} 回调函数 function(key,value,index){..}  
	     */  
	    this.each = function(fn){   
	        if(typeof fn !== 'function'){   
	            return;   
	        }   
	        var len = this.keys.length;   
	        for(var i=0;i<len;i++){   
	            var k = this.keys[i];   
	            fn(k,this.data[k],i);   
	        }   
	    };   
	       
	    /**  
	     * 获取键值数组(类似Java的entrySet())  
	     * @return 键值对象{key,value}的数组  
	     */  
	    this.entrys = function() {   
	        var len = this.keys.length;   
	        var entrys = new Array(len);   
	        for (var i = 0; i < len; i++) {   
	            entrys[i] = {   
	                key : this.keys[i],   
	                value : this.data[i]   
	            };   
	        }   
	        return entrys;   
	    };   
	       
	    /**  
	     * 判断Map是否为空  
	     */  
	    this.isEmpty = function() {   
	        return this.keys.length === 0;   
	    };   
	       
	    /**  
	     * 获取键值对数量  
	     */  
	    this.size = function(){   
	        return this.keys.length;   
	    };   
	       
	    /**  
	     * 重写toString   
	     */  
	    this.toString = function(){   
	        var s = "{";   
	        for(var i=0;i<this.keys.length;i++,s+=','){   
	            var k = this.keys[i];   
	            s += k+"="+this.data[k];   
	        }   
	        s+="}";   
	        return s;   
	    };   
	},
	/**
	 * 31.生成自定义纯字母随机数
	 * 
	 * 参数len：随机数长度
	 * 
	 * 调用：
			let len = 16;
			Hezc.randStr(len);
	 */
	randStr: function(len = 32) {
	    let strPol = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
	    let strPolLen = strPol.length;
	    let str = "";
	    for (let i = 0; i < len; i++) {
			str += strPol.charAt(Math.floor(Math.random() * strPolLen));
		};
	    return str
	},
	/**
	 * 32.
	 */
}



/**
 * 本地存储localStorage
 */
const store = {
	/**
	 * 设置本地存储localStorage
	 * 
	 * @param {Object} name		参数1 存储名
	 * @param {Object} value	参数2 存储值
	 * @param {Object} day		参数3 存储过期时间(天),默认存储1天
	 * 
	 * 调用：
		var user = {userID: '', userName: ''};
		store.set('userInfo', user, 7);
	 */
	set: function(name, value, day) {
		let d = new Date();
		let time = 0;
		day = (typeof(day) === 'undefined' || !day) ? 1 : day // 时间，默认存储1天
		time = d.setHours(d.getHours() + (24 * day)) // 毫秒
		localStorage.setItem(name, JSON.stringify({
			data: value,
			time: time
		}))
	},
	/**
	 * 获取本地存储localStorage
	 * 
	 * @param {Object} name	参数 存储名
	 * 
	 * 调用：store.get('userInfo');
	 */
	get: function(name) { // 获取
		let data = localStorage.getItem(name);
		if (!data) {
			return null;
		}
		let obj = JSON.parse(data);
		if (new Date().getTime() > obj.time) { // 过期
			localStorage.removeItem(name);
			return null;
		} else {
			return obj.data;
		}
	},
	/**
	 * 清除本地存储localStorage
	 * 
	 * @param {Object} name	参数 存储名(不设置则清空全部)
	 * 
	 * 调用：store.clear('userInfo');
	 */
	clear: function(name) { // 清空
		if (name) { // 删除键为name的缓存
			localStorage.removeItem(name);
		} else { // 清空全部
			localStorage.clear();
		}
	}
}


/**
 * H5+本地存储localStorage(需先加载mui.js且在mui.plusReady(function(){//内使用});)
 */
const storeplus = {
	/**
	 * 设置H5+本地存储localStorage
	 * 
	 * @param {Object} name		参数1 存储名
	 * @param {Object} value	参数2 存储值
	 * @param {Object} day		参数3 存储过期时间(天),默认存储1天
	 * 
	 * 调用：
		var user = {userID: '', userName: ''};
		storeplus.set('userInfo', user, 7);
	 */
	set: function(name, value, day) {
		// mui.plusReady(function(){ //此处初始化plusReady会导致参数内容被清空
			// 在这里调用plus api
			let d = new Date();
			let time = 0;
			day = (typeof(day) === 'undefined' || !day) ? 1 : day // 时间，默认存储1天
			time = d.setHours(d.getHours() + (24 * day)) // 毫秒
			plus.storage.setItem(name, JSON.stringify({
				data: value,
				time: time
			}))
		// });
	},
	/**
	 * 获取H5+本地存储localStorage
	 * 
	 * @param {Object} name	参数 存储名
	 * 
	 * 调用：storeplus.get('userInfo');
	 */
	get: function(name) { // 获取
		// mui.plusReady(function(){ //此处初始化plusReady会导致参数内容被清空
			// 在这里调用plus api
			let data = plus.storage.getItem(name);
			if (!data) {
				return null;
			}
			let obj = JSON.parse(data);
			if (new Date().getTime() > obj.time) { // 过期
				plus.storage.removeItem(name);
				return null;
			} else {
				return obj.data;
			}
		// });
	},
	/**
	 * 清除H5+本地存储localStorage
	 * 
	 * @param {Object} name	参数 存储名(不设置则清空全部)
	 * 
	 * 调用：storeplus.clear('userInfo');
	 */
	clear: function(name) { // 清空
		// mui.plusReady(function(){ //此处初始化plusReady会导致参数内容被清空
			// 在这里调用plus api
			if (name) { // 删除键为name的缓存
				plus.storage.removeItem(name);
			} else { // 清空全部
				plus.storage.clear();
			}
		// });
	}
}



/**
 * cookie操作【设置、获取、删除】
 * (Google 将在2020年2月4号发布的 Chrome 80 版本中默认屏蔽所有第三方 Cookie，
 * 即默认为所有 Cookie 加上 SameSite=Lax 属性，
 * 并且拒绝非Secure的Cookie设为 SameSite=None，此举是为了从源头屏蔽 CSRF 漏洞)
 */
const cookie = { // cookie操作【set、get、del】
	/**
	 * 设置cookie
	 * 
	 * @param {Object} name		参数1 cookie名
	 * @param {Object} value	参数2 cookie值
	 * @param {Object} day		参数3 cookie过期时间(天),默认30天
	 * 
	 * 调用：
		var user = {userID: '', userName: ''};
		cookie.set('userInfo', user, 7);
	 */
	set: function(name, value, day) {
		let oDate = new Date();
		oDate.setDate(oDate.getDate() + (day || 30));
		document.cookie = name + '=' + value + ';expires=' + oDate + "; path=/;";
	},
	/**
	 * 获取cookie
	 * 
	 * @param {Object} name 参数 cookie名
	 * 
	 * 调用：cookie.get('userInfo');
	 */
	get: function(name) {
		let str = document.cookie;
		let arr = str.split('; ');
		for (let i = 0; i < arr.length; i++) {
			let newArr = arr[i].split('=');
			if (newArr[0] === name) {
				return newArr[1];
			}
		}
	},
	/**
	 * 删除cookie
	 * 
	 * @param {Object} name 参数 cookie名
	 * 
	 * 调用：cookie.del();
	 */
	del: function(name) {
		this.set(name, '', -1);
	}
}



/**
 * 新增属性 JavaScript中扩展Array contains方法实例
 */
Array.prototype.contains = function(obj) {
	// console.log('11' + this.length)
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
}



/**
 * Web SQL
 */
(function(win) {
    function WebSql(options){
        options = options || {};
        this.database = null;
        this.DateBaseName = options.DateBaseName || 'MyDB';
        this.Version = options.Version || '1.0';
        this.Description = options.Description || 'TestDB';
        this.DataBaseSize = options.DataBaseSize || 2 * 1024 * 1024;
        this.init();
    }
    WebSql.prototype = {
		/*
			注：执行数据表操作先初始化数据库
		 *	调用：WebSql.init();
		 */
        init: function() {
            this.database = openDatabase(this.DateBaseName, this.Version, this.Description, this.DataBaseSize); //初始化数据库
        },
		/*
			批量添加含BLOB类型的字段
		    注 ： 数据里面的第一个key存储类型为BLOB
		    @param  tableName 表名
		    @param  arr 更新的数据    [{key1：value1 , key2 : value2 ...},{key1：value1 , key2 : value2 ...}]
		    @param  index BLOG字段所在的索引位置
		    @param  isFirst 是否是第一次创建表
		    @param  callback  回调
		 *
			调用：
			var arr = [{key1: value1, key2: value2}, {key1: value1, key2: value2}]
				isFirst = true; // true为第一次创建表，先Creat表再添加字段，false则不执行Creat直接添加字段，如果表不存在则添加失败
			WebSql.addBlob(tableName, arr, index, isFirst, function(){});
		 */
        addBlob: function (tableName, arr, index, isFirst, callback) {//批量添加字段
            if (arr === null) {
                return this;
            }
            callback = this.isFunction(callback) ? callback : new Function();
            var _me = this,
                _db = this.database,
                keyC = [],
                keyI = [],
                _key = '';
            arr = arr || [];
            if (arr && arr.constructor === Array) {
                for (var i in arr[0]) {
                    keyC.push(i);
                    keyI.push(i);
                }
                _key = keyI.join(",");
                index = index === undefined ? 0 : index;
                keyC[index] = keyC[index] + ' BLOB';
                _db.transaction(function (tx, result) {
                    //var csql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + keyC.join(",") + ')';
                    //console.log('csql:' + csql);
                    if (isFirst === true) {
                        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + keyC.join(",") + ')');
                    }
                    //var sql = "";
                    for (var s = 0, _len = arr.length; s < _len ; s++) {
                        var _value = _me.split(arr[s]);
                        //sql += 'INSERT INTO ' + tableName + ' (' + _key + ') VALUES (' + _value + ')';
                        //console.log("sql:" + sql);
                        tx.executeSql('INSERT INTO ' + tableName + ' (' + _key + ') VALUES (' + _value + ')',[],function (tx, result) {
                            callback(result.rowsAffected);
                            //console.log('添加成功'+result.rowsAffected);
                        },function (tx, error) {
                            console.error('添加失败');
                            callback(false);
                        });
                    }
                    _key = keyI = keyC = null;
                    callback();
                });
            }
            return this;
        },
		/*
			批量添加数据表行数据
		    注 ： 数据里面的第一个key 为主键
		    @param  tableName 表名
		    @param  arr 更新的数据    [{key1：value1 , key2 : value2 ...},{key1：value1 , key2 : value2 ...}]
		    @param  callback  回调
		    @param  noKey 第一个字段是否是主键（默认是）
		 *
			调用：
			var arr = [{key1: value1, key2: value2}, {key1: value1, key2: value2}]
				noKey = false;
			WebSql.add(tableName, arr, function(){}, noKey);
		 */
        add: function (tableName, arr, callback, noKey) {//批量添加字段
            if(arr==null){
                return this;
            }
            callback = this.isFunction(callback) ? callback : new Function();
            var _me = this,
                _db = this.database,
                keyC = [],
                keyI = [],
                _key = '';
            arr = arr || [];
            if (arr && arr.constructor === Array) {
                for(var i in arr[0]){
                    keyC.push(i);
                    keyI.push(i);
                }
                if (noKey === undefined) {
                    keyC[0] = keyC[0] + ' unique';
                }
                _key = keyI.join(",");
                _db.transaction(function (tx) {
                   ///var csql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + keyC.join(",") + ')';
                    // console.log('csql:' + csql);
                     tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + keyC.join(",") + ')');
                    //var sql = "";
                    for(var s = 0 , _len = arr.length; s < _len ; s++){
                        var _value = _me.split(arr[s]);
                        //sql += 'INSERT INTO ' + tableName + ' (' + _key + ') VALUES (' + _value + ')';
                        //console.log("sql:" + sql);
                        tx.executeSql('INSERT INTO '+tableName+' ('+_key+') VALUES ('+_value+')',[],function (tx, result) {
                            callback(result.rowsAffected);
                            //console.log('添加成功'+result.rowsAffected);
                        },function (tx, error) {
                            console.error('添加失败');
                            callback(false);
                        });
                    }
                    _key = keyI = keyC = null;
                    callback();
                });
            }
            return this;
        },
		/*
			更新符合key(查询的键)和value(对应键的值)的数据
		    @param  tableName 表名
		    @param  key 查询的键 
		    @param  value 对应键的值
		    @param  obj 更新的数据    {key1：value1 , key2 : value2 ...} 
		    @param  callback  回调  传递参数为真则查询成功 反之更新失败
		 *
			调用：
			var obj = {key1: value1, key2: value2};
			WebSql.update(tableName, key, value, obj, function(){});
		 */
        update : function(tableName, key, value, obj, callback){//更新指定数据
            callback = this.isFunction(callback) ? callback : new Function();
            var _db = this.database,
                _value = this.splitU(obj);
            _db.transaction(function (tx) {
                //console.log('sql:' + 'UPDATE ' + tableName + ' set ' + _value + ' where ' + key + '="' + value + '"')
                tx.executeSql('UPDATE '+tableName+' set '+_value+' where '+key+'="'+value+'"',[],function (tx, result) {
                    callback(result.rowsAffected);
                },function (tx, error) {
                    console.error('更新失败');
                    callback(false);
                });
            });
            return this;
        },
		/*
			更新符合某类条件的数据，where自定义
		    @param  tableName 表名
		    @param  where 查询条件 
		    @param  obj 更新的数据    {key1：value1 , key2 : value2 ...} 
		    @param  callback  回调  传递参数为真则查询成功 反之更新失败
		 *
			调用：
			var where = 'where name = "汪文君"'
				obj = {key1: value1, key2: value2};
			WebSql.updateWhere(tabelName, where, obj, function(){});
		 */
        updateWhere: function (tableName, where, obj, callback) {//更新指定数据
            callback = this.isFunction(callback) ? callback : new Function();
            var _db = this.database,
                _value = this.splitU(obj);
            _db.transaction(function (tx) {
                console.log('UPDATE ' + tableName + ' set ' + _value + ' where ' + where + '"')
                tx.executeSql('UPDATE ' + tableName + ' set ' + _value + ' where ' + where + '"', [], function (tx, result) {
                    callback(result.rowsAffected);
                }, function (tx, error) {
                    console.error('更新失败');
                    callback(false);
                });
            });
            return this;
        },
		/*
			查询数据
		    @param  tableName 表名
		    @param  condition 查询条件   'where name="汪文君"'
		    @param  callback  回调  传递参数为真则查询成功 反之查询失败
		 *
			调用：
			var condition = 'where name = "汪文君"';
			WebSql.read(tableName, condition, function(){});
		 */
        read : function(tableName,condition,callback){ //读取表数据
            var _condition = this.isString(condition) ? condition : '';
            var _callback = this.isFunction(condition) ? condition : this.isFunction(callback) ? callback : new Function;
            var _db = this.database,
                _me = this,
                _re = [];
                _db.transaction(function (tx) {
                    tx.executeSql('SELECT * FROM ' + tableName + ' ' + _condition + ' ', [], function (tx, results) {
                        if(results && results.rows){
                            _re =_me.toArray(results.rows);
                            _callback(_re);
                        }else{
                            _callback([]);
                        }
                    },function(tx,error){
                        _callback([]);
                        console.error('查询失败');
                    });
                });
                return this;
        },
		/*
			删除数据
		    @param  tableName 表名
		    @param  condition 查询条件   'where name="汪文君"'
		    @param  callback  回调  传递参数为真则删除成功 反之删除失败
		 *
			调用：
			condition = 'where name = "汪文君"';
			WebSql.remove(tableName, condition, function(){});
		 */
        remove:function(tableName,condition,callback){//删除数据
            var _me = this;
            var _condition = this.isString(condition) ? condition : '';
            var _callback = this.isFunction(condition) ? condition : this.isFunction(callback) ? callback : new Function;
            _me.database.transaction(function (tx) {
                tx.executeSql('DELETE FROM '+tableName+ ' '+ _condition+' ',[],function (tx, result) {
                    _callback(result.rowsAffected);
                },function (tx, error) {
                    _callback(false);
                    console.error('删除失败');
                });
            });
        },
		/*
			根据查询条件读取表记录数
		    @param  tableName 表名
		    @param  condition 查询条件   'where name="汪文君"'
		    @param  callback  回调  传递参数为真则查询成功 反之查询失败
		 *
			调用：
			var condition = 'where name = "汪文君"';
			WebSql.counts(tableName, condition, function(){});
		 */
        counts: function (tableName, condition, callback) { //读取表数据
            var _condition = this.isString(condition) ? condition : '';
            var _callback = this.isFunction(condition) ? condition : this.isFunction(callback) ? callback : new Function;
            var _db = this.database,
                _me = this,
                _re = [];
            if (mui.os.ios) { //ios下面特有的
                _db.transaction(function (tx) {
                    tx.executeSql('SELECT NO FROM ' + tableName + ' ' + _condition + ' ', [], function (tx, results) {// count (*) as num
                        if (results && results.rows) {
                            _re = _me.toArray(results.rows);
                            _callback(_re.length);
                        } else {
                            _callback(0);
                        }
                    }, function (tx, error) {
                        _callback(0);
                        console.error('查询失败');
                    });
                });
            } else {
                _db.transaction(function (tx) {
                    tx.executeSql('SELECT count (*) as num FROM ' + tableName + ' ' + _condition + ' ', [], function (tx, results) {// count (*) as num
                        if (results && results.rows) {
                            if (results.rows[0]) {
                                _callback(results.rows[0].num);
                            } else {
                                _callback(0);
                            }
                        } else {
                            _callback(0);
                        }
                    }, function (tx, error) {
                        _callback(0);
                        console.error('查询失败');
                    });
                });
            }
            return this;
        },
		/*
			@param  tableName 表名
			@param  callback  回调  传递参数为真则删除成功 反之删除失败
		 *
			调用：WebSql.delTable(tableName, function(){});
		 */
        delTable:function(tableName,callback){ //删除数据表
            callback = this.isFunction(callback) ? callback : new Function();
            this.database.transaction(function(tx){
                tx.executeSql('DROP TABLE IF EXISTS '+tableName,[],function(tx,res){
                    callback();
                },function(tx,err){
                    console.error(err);
                });
            });
            return this;
        },
        splitU: function(obj){//更新字符处理
            var _arr = [];
            for(var t in obj){
                _arr.push(t+'="'+obj[t]+'"');
            }
            return _arr.join(',');
        },
        split : function(obj){//添加字符处理
            var _arr = [];
            for(var m in obj){
                _arr.push("'"+obj[m]+"'");
            }
            return _arr.join(',');
        },
        isFunction : function(callback){
            return typeof callback !== 'undefined' && callback.constructor === Function ? true : false
        },
        isString : function(string){
            return typeof string === 'string' ? true : false
        },
        toArray : function(obj){
            var _arr = [],
                _len = obj.length;
                if(_len > 0){
                    for (var i = 0; i < _len; i++) {
                        _arr.push(obj.item(i));
                    };
                }
                return _arr;
        }
    }
    win.WebSql = WebSql;
}(window))



/**
 * 判断当前设备类型
 * 
 调用：
 if (os.isAndroid) {
 
 　　alert("Android" ); 
 
 } else if (os.isPhone) {
 	
 	alert("iPhone" ); 
 	
 } else if (os.isTablet) {
 
 　　alert("pad" );
 
 } else if (os.isPc) {
 
 　　 alert("pc")
 }
 */
var os = function (){ 
　　var ua = navigator.userAgent, 
　　isWindowsPhone = /(?:Windows Phone)/.test(ua), 
　　isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone, 
　　isAndroid = /(?:Android)/.test(ua), 
　　isFireFox = /(?:Firefox)/.test(ua), 
　　isChrome = /(?:Chrome|CriOS)/.test(ua), 
　　isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)), 
　　isPhone = /(?:iPhone)/.test(ua) && !isTablet, 
　　isPc = !isPhone && !isAndroid && !isSymbian; 
　　return { 
　　　　isTablet: isTablet, 
　　　　isPhone: isPhone, 
　　　　isAndroid: isAndroid, 
　　　　isPc: isPc 
　　}; 
}();



/**
 * ES5扩展：localStorage设置过期时间
 调用：
 localStorage.setExpire('userId','zhangsan',5000);
 window.setInterval(function(){
     console.log(localStorage.getExpire("userId"));
 },1000)
 */
Storage.prototype.setExpire = function(key, value, expire) {
	let obj = {
	data: value,
	time: Date.now(),
	expire: expire
	};
	//localStorage 设置的值不能为对象,转为json字符串
	localStorage.setItem(key, JSON.stringify(obj));
}

Storage.prototype.getExpire = function(key) {
    let val = localStorage.getItem(key);
    if (!val) {
        return val;
    }
    val = JSON.parse(val);
    if (Date.now() - val.time > val.expire) {
        localStorage.removeItem(key);
        return null;
    }
    return val.data;
}

/**
 * 哈希表
 * 
 * 调用：
		let hastable = new HasMap();
		hastable.put("lipeng11", { age: "18", sex: "男" });
		hastable.put("chen", { age: "3", sex: "女" });
		console.log(hastable.remove("lipeng11"));
		console.log(hastable.get("lipeng11"));
 */
class HasMap {
  constructor() {
    //需要的属性
    //1.要一个储存哈希表内容的容器，
    this.storage = [];
    //2.要一个表示当前储存的数据量
    this.count = 0;
    //3.用于标记数组中一共可以存放的元素数量,这个数是用来对数组容量进行限制的。在哈希函数中起到缩小哈希化后的数字的作用，以保证哈希化后的数字能够压缩到合理的在 storage 范围内。
    this.limit = 7;
  }
  //需要一个哈希函数，把输入的数据进行哈希化,并压缩到数组范围内
  hasFunc(str) {
    //1.将字符串转换成较大的数字 hascode
    //注意！这里hascode可以是任意值，之所以写0，是因为数字比较小，计算更快。霍纳算法中，首次计算是从最高次数项开始的。所以开始的数字在一定程度可以减小后面数字的大小。
    
    let hascode = 0;
    //霍纳算法进行哈希化
    for (let i = 0; i < str.length; i++) {
      hascode = hascode * 37 + str.charCodeAt(i);
    }
    //2.把大的数字hascode压缩到数组范围之内，
    hascode = hascode % this.limit;
    return hascode;
  }
  isEmpty() {
    return !this.count;
  }
  //插入一个数据或者修改
  put(key, val) {
    //1.获取到 hascode 下标
    let hascode = this.hasFunc(key);
    //2.查询容器中该 hascode 下标位置是否有值

    //2.1 如果没有值，直接创建一个数组来储存第一个值，并返回true
    if (this.storage[hascode] === null) {
      this.storage[hascode] = [{ key, val }];
      this.count++;
      this.resize();
      return;
    }
    //2.2 如果改位置有值了，进行下一步
    //3 遍历hascode下标位置的数组，查找数组中每个对象，判断是否已经存在 key 
    let index = 0,
      chain = this.storage[hascode];
    // console.log(chain);
    while (index < chain.length) {
      //3.1 如果存在 key 替换该位置key所对应的对象。
      if (chain[index].key === key) {
        chain[index].val = val;
        return;
      }
      index++;
    }
    //3.2 如果没有存在 key 直接在后面数组最后插入一个对象。
    chain.push({ key, val });
    this.count++;
    this.resize();
  }
  //获取数据
  get(key) {
    //1.判断是否哈希表是否为空
    //1.1如果是空，直接返回-1
    if (this.isEmpty()) return -1;
    //1.2不为空直接下一步
    //2. 获取hascode
    let hascode = this.hasFunc(key);
    //3.通过 hascode 查询该位置是否为空
    //3.1如果为空，直接返回-1
    if (!this.storage[hascode]) return -1;
    //3.2如果不为空，下一步
    //4. 循环遍历hascode位置的数组，查询key是否存在
    let index = 0,
      chain = this.storage[hascode];

    while (index < chain.length) {
      //4.1如果存在直接返回对应的val
      if (chain[index].key === key) {
        return chain[index].val;
      }
      index++;
    }
    //4.2如果不存在，返回-1
    return -1;
  }
  //删除方法
  remove(key) {
    if (this.isEmpty()) return -1;
    let hascode = this.hasFunc(key);
    if (this.storage[hascode] === null) return -1;
    let index = 0;
    while (index < this.storage[hascode].length) {
      if (this.storage[hascode][index].key === key) {
        return this.storage[hascode].splice(index, 1);
      }
      index++;
    }
    return -1;
  }
  //哈希表扩容
  resize() {
    //1.如果当前 loadFactor 装载因子超过0.75 则对数组进行扩容 ,loadFactor 是  当前容纳的数列 count与 数组限制长度 limit之比 count/limit > 0.75
    //1.1 如果 loadFactor 小于0.75,直接return
    if (this.count / this.limit < 0.75) return;
    //1.2 如果大于 0.75 下一步
    //2. 对数组容纳量扩充约等于2倍，但是要求必须是质数倍
    this.limit = this.limit * 2 + 1;
    while (!this.isPrime(this.limit)) {
      this.limit++;
    }
    //3. 保存当前 storage 并把原来的 storage ，count 清空 //这里要重新初始化，并且重新插入所有数据，是因为 数组限制长度（limit）改变后，原来通过哈希函数获取的hascode已经不能在新的数组上对应了。因此要重新创建并插入
    let oldStorage = this.storage;
    this.storage = [];
    this.count = 0;
    //4.遍历旧的storage 并重新插入新的 storgae中。
    let index = 0;
    while (index < oldStorage.length) {
      if (oldStorage[index]) {
        let chainIndex = 0;
        while (chainIndex < oldStorage[index].length) {
          let obj = oldStorage[index][chainIndex];
          this.put(obj.key, obj.val);
          chainIndex++;
        }
      }
      index++;
    }
    console.log('重新插入成功,当前limit是：%d',this.limit);
  }
  //判断一个数是不是质数
  isPrime(num) {
    //1. 对这个数进行二分,得到一个较小的数.
    let newNum = parseInt( Math.sqrt(num) );
    //2. 循环遍历这个数，判断用输入的数 % 遍历的每个数
    for (let i = 2; i <= newNum; i++) {
      //2.1 如果取模后等于0，说明不是质数，返回fasle
      if (num % i === 0) {
        return false;
      }
    }
    //2.2 如果遍历完成没有发现等于0的，则返回true
    return true;
  }
}