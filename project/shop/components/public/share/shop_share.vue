<template>
	<div id="shop_share" v-clock>
		<template>
			<!--使用render函数与createElement函数创建外部文件链接DOM-->
			<remote-js src=""></remote-js>
			<remote-css href=""></remote-css>
		</template>
		<template v-on:tap="closeShare();">
			<div class="mui-content">
				<img id="pic" src="../../../assets/images/img/share/add.png" style="display: none;" />
			</div>
			<footer style="position: absolute;bottom: 50px; width:100%;background: white;">
				<div style="height: 30px; line-height: 30px;font-weight: bold;font-family: '微软雅黑'; margin-left: 10px;">分享到</div>
				<ul class="mui-table-view mui-grid-view mui-grid-9">
					<li v-on:tap="shareHref(0);" class="mui-table-view-cell mui-media mui-col-xs-4">
						<img class="mui-media-object" src="../../../assets/images/img/share/share_to_icon_weibo.png">
						<div class="mui-media-body">微博</div>
					</li>
					<li v-on:tap="shareHref(0);" class="mui-table-view-cell mui-media mui-col-xs-4">
						<img class="mui-media-object" src="../../../assets/images/img/share/share_to_icon_wx.png">
						<div class="mui-media-body">微信</div>
					</li>
					<li v-on:tap="shareHref(1);" class="mui-table-view-cell mui-media mui-col-xs-4">
						<img class="mui-media-object" src="../../../assets/images/img/share/share_to_icon_wxq.png">
						<div class="mui-media-body">朋友圈</div>
					</li>
				</ul>
				<ul class="mui-table-view mui-grid-view mui-grid-9" style="margin-top: 20px;">
					<li v-on:tap="shareHref(1);" class="mui-table-view-cell mui-media mui-col-xs-4">
						<img class="mui-media-object" src="../../../assets/images/img/share/share_to_icon_mail.png">
						<div class="mui-media-body">邮件</div>
					</li>
					<li v-on:tap="shareSystem();" class="mui-table-view-cell mui-media mui-col-xs-4">
						<img class="mui-media-object" src="../../../assets/images/img/share/share_to_icon_qq.png">
						<div class="mui-media-body">QQ</div>
					</li>
					<li v-on:tap="shareSystem();" class="mui-table-view-cell mui-media mui-col-xs-4">
						<img class="mui-media-object" src="../../../assets/images/img/share/share_to_icon_qzone.png">
						<div class="mui-media-body">QQ空间</div>
					</li>
				</ul>
			</footer>
			<input id="sharehref" style="display: none;" class="sharehref" type="url" value="http://www.dcloud.io/" placeholder="请输入要分享的链接地址" />
			<input id="sharehrefTitle" style="display: none;" class="sharehref" type="text" value="DCloud HBuilder-做最好的HTML5开发工具"
			 placeholder="请输入要分享的链接标题" />
			<input id="sharehrefDes" style="display: none;" class="sharehref" type="text" value="我正在使用HBuilder+HTML5开发移动应用，赶紧跟我一起来体验！"
			 placeholder="请输入要分享的链接描述" />
		</template>
	</div>
</template>

<script>
	var _self = {};
	var shares = null,
		bhref = false;
	var Intent = null,
		File = null,
		Uri = null,
		main = null;
	//来源页面
	var pageSourceId;
	module.exports = {
		name: 'shop_share',
		template: '#shop_share',
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
				
			} //retrun
		}, //data
		computed: { //计算属性
			//多对一或一对一，支持缓存，不支持异步，只有依赖数据发生改变，才会重新进行计算
			// fname(){return null;}
			
		}, //computed
		watch: {
			
		}, //watch
		filters: { //自定义过滤函数

		}, //filters
		methods: {
			aaa: function() {
				alert("GetMallGoodsList");
			}, //end
			/**
			 * 更新分享服务
			 */
			updateSerivces: function() {
				plus.share.getServices(function(s) {
					shares = {};
					for (var i in s) {
						var t = s[i];
						shares[t.id] = t;
					}
				}, function(e) {
					outSet("获取分享服务列表失败：" + e.message);
				});
			},
			/**
			 * 调用系统分享
			 */
			shareSystem: function() {
				if (plus.os.name !== "Android") {
					plus.nativeUI.alert("此平台暂不支持系统分享功能!");
					return;
				}
				var intent = new Intent(Intent.ACTION_SEND);
				var p = "";
				if (pic && pic.realUrl) {
					p = pic.realUrl;
					if (p.substr(0, 7) === "file://") {
						p = p.substr(7);
					} else if (p.sub(0) !== "/") {
						p = plus.io.convertLocalFileSystemURL(p);
					}
				}
				var f = new File(p);
				var uri = Uri.fromFile(f);
				if (f.exists() && f.isFile()) {
					console.log("image/*");
					intent.setType("image/*");
					intent.putExtra(Intent.EXTRA_STREAM, uri);
				} else {
					console.log("text/plain");
					intent.setType("text/plain");
				}
				intent.putExtra(Intent.EXTRA_SUBJECT, "洛阳世界名木树雕博览园");
				intent.putExtra(Intent.EXTRA_TEXT, sharehrefDes.value + "-" + sharehref.value);
				intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
				main.startActivity(Intent.createChooser(intent, "系统分享"));
			}, //end
			/**
			 * 分享操作
			 * @param {String} id
			 */
			shareAction: function(id, ex) {
				var s = null;
				console.log("分享操作：");
				if (!id || !(s = shares[id])) {
					console.log("无效的分享服务！");
					return;
				}
				if (s.authenticated) {
					console.log("---已授权---");
					_self.$options.methods.shareMessage(s, ex);
				} else {
					console.log("---未授权---");
					s.authorize(function() {
						_self.$options.methods.shareMessage(s, ex);
					}, function(e) {
						console.log("认证授权失败：" + e.code + " - " + e.message);
					});
				}
			}, //end
			/**
			 * 发送分享消息
			 * @param {plus.share.ShareService} s
			 */
			shareMessage: function(s, ex) {
				var msg = {
					content: sharehrefDes.value,
					extra: {
						scene: ex
					}
				};
				console.log("bhref:" + bhref);
				if (bhref) {
					msg.href = sharehref.value;
					if (sharehrefTitle && sharehrefTitle.value != "") {
						msg.title = sharehrefTitle.value;
					}
					if (sharehrefDes && sharehrefDes.value != "") {
						msg.content = sharehrefDes.value;
					}
					msg.thumbs = ["_www/logo.png"];
				} else {
					if (pic && pic.realUrl) {
						msg.pictures = [pic.realUrl];
					}
				}
				console.log(JSON.stringify(msg));
				s.send(msg, function() {
					console.log("分享到\"" + s.description + "\"成功！ ");
				}, function(e) {
					console.log("分享到\"" + s.description + "\"失败: " + e.code + " - " + e.message);
				});
			}, //end
			/**
			 * 打开分享
			 */
			shareShow: function() {
				bhref = false;
				var ids = [{
						id: "weixin",
						ex: "WXSceneSession"
					}, {
						id: "weixin",
						ex: "WXSceneTimeline"
					}, {
						id: "sinaweibo"
					}, {
						id: "tencentweibo"
					}],
					bts = [{
						title: "发送给微信好友"
					}, {
						title: "分享到微信朋友圈"
					}, {
						title: "分享到新浪微博"
					}, {
						title: "分享到腾讯微博"
					}];
				if (plus.os.name == "iOS") {
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
						if (i > 0) {
							_self.$options.methods.shareAction(ids[i - 1].id, ids[i - 1].ex);
						}
					}
				);
			}, //end
			/**
			 * 分析链接
			 * @param {Object} index
			 */
			shareHref: function(index) {
				bhref = true;
				var ids = [{
						id: "weixin",
						ex: "WXSceneSession"
					}, {
						id: "weixin",
						ex: "WXSceneTimeline"
					}],
					bts = [{
						title: "发送给微信好友"
					}, {
						title: "分享到微信朋友圈"
					}];
				if (plus.os.name == "iOS") {
					ids.push({
						id: "qq"
					});
					bts.push({
						title: "分享到QQ"
					});
				}
				_self.$options.methods.shareAction(ids[index].id, ids[index].ex);
			}, //end
			/**
			 * 取消分享
			 */
			closeShare: function() {
				console.log("e:" + event.target.name);
			}, //end
			/**
			 * 关闭遮罩
			 */
			closeMask: function () {
				var sharew;
				var ws = plus.webview.currentWebview().opener();
				ws.setStyle({
					mask: "none"
				});
				//避免出现特殊情况，确保分享页面在初始化时关闭   
				if (!sharew) {
					sharew = plus.webview.getWebviewById("shop_share.html");
				}
				if (sharew) {
					sharew.close();
					
					sharew = null;
				}
			}, //end
		}, //methods
		beforeCreate: function() {
			_self = this;
		}, //beforeCreate
		created: function() {
			/**
			 * HTML5+API准备就绪
			 */
			mui.plusReady(function() {
				_self.updateSerivces();
				if (plus.os.name == "Android") {
					Intent = plus.android.importClass("android.content.Intent");
					File = plus.android.importClass("java.io.File");
					Uri = plus.android.importClass("android.net.Uri");
					main = plus.android.runtimeMainActivity();
				}
				var shareInfo = plus.webview.currentWebview().shareInfo;
				sharehref.value = shareInfo.href;
				sharehrefTitle.value = shareInfo.title;
				sharehrefDes.value = shareInfo.content;
				pageSourceId = shareInfo.pageSourceId;
				console.log("pageSource:" + pageSourceId);
			});
			// plus.webview.getWebviewById(pageSourceId).addEventListener("maskClick", _self.closeMask(), false);
			
			_self.$nextTick(function() {
				
			});
		}, //created
		beforeMount: function() {
			
		}, //beforeMount
		mounted: function() {
			/**
			 * MUI框架初始化
			 */
			mui.init({});
			
			/**
			 * 所有动态获取的控件初始化需在mui.ready(function(){});内执行
			 */
			mui.ready(function() {
				mui.back = function() {
					var sourcePage = plus.webview.getWebviewById(pageSourceId);
					if (sourcePage) {
						// sourcePage.evalJS("closeMask()");
						_self.closeMask();
					}
				};
			});
			
			_self.$nextTick(function() {
				
			});
		}, //mounted
		beforeUpdate: function() {
			
		}, //beforeUpdate
		updated: function() {
			
		}, //updated
		beforeDestroy: function() {
			
		}, //beforeDestroy
		destroyed: function() {
			
		} //destroyed
	}
</script>

<style scoped> /* scoped属性：私有属性，样式只对此组件内元素生效，不影响其他组件*/
	.mui-grid-9 {
		background: white !important;
	}

	li {
		border-left: none !important;
	}

	img {
		width: 50px !important;
	}

	body {
		background: transparent !important;
	}

	.mui-content {
		background: white;
		text-align: center;
	}
</style>
