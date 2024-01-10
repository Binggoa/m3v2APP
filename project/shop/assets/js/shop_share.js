function openShare() {
	shareWebview();
};

mui.plusReady(function() {
	var ws = plus.webview.currentWebview();
	//关闭splash页面；  
	plus.navigator.closeSplashscreen();

});
var sharew;
var ws = null;
/**  
 *分享窗口  
 */
function shareWebview() {
	ws = plus.webview.currentWebview();
	if (sharew) { // 避免快速多次点击创建多个窗口  
		return;
	}
	var top = plus.display.resolutionHeight - 330;
	var href = "./shop_share.html";
	sharew = plus.webview.create(href, "shop_share.html", {
		width: '100%',
		height: '330',
		top: top,
		scrollIndicator: 'none',
		scalable: false,
		popGesture: 'none',
		backgroundColorBottom: '#efeff4',
		opacity:"0.9"
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
	// 点击关闭遮罩层  
	ws.addEventListener("maskClick", closeMask, false);
}

function closeMask() {
	sharew = plus.webview.getWebviewById("shop_share.html");
	
	// ws = plus.webview.getWebviewById("shop_share.html").opener();
	ws =  plus.webview.currentWebview(); // 当前webview
	
	ws.setStyle({
		mask: "none"
	});
	//避免出现特殊情况，确保分享页面在初始化时关闭   
	if (!sharew) {
		sharew = plus.webview.getWebviewById("shop_share.html");
	}
	if (sharew) {
		// mui.fire(sharew, 'click'); // 执行页面关闭动画,使得页面关闭不会显得突兀
		var t0 = setTimeout(function() {
			sharew.close();
			var t1 = setTimeout(function() {
				sharew = null; // 等页面关闭后再重置变量的值,否则报错Cannot read property 'close' of null
			}, 100);
		}, 200);
	}
};
