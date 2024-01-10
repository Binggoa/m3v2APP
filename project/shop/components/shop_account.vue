<template>
	<div id="shop_account" v-clock>
		<template>
			<!--使用render函数与createElement函数创建外部文件链接DOM-->
			<remote-js src=""></remote-js>
			<remote-css href=""></remote-css>
		</template>
		<template class="mui-fullscreen">
			<div class="mui-page-content">
				<div class="mui-scroll-wrapper">
					<div class="mui-scroll">
						<ul class="mui-table-view">
							<li class="mui-table-view-cell" v-on:tap="updateHeader">
								<label id="head" class="mui-navigate-right">
									头&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;像
									<span class="mui-pull-right head">
										<img class="head-img mui-action-preview" id="head-img1" v-bind:src="User.HeadImageUrl" />
									</span>
								</label>
							</li>
							<li class="mui-table-view-cell">
								<label>用&nbsp;&nbsp;户&nbsp;&nbsp;名</label>
								<span class="mui-pull-right">{{User.UserNo}}</span>
							</li>
							<li class="mui-table-view-cell">
								<label>公司名称</label>
								<span class="mui-pull-right">上海轧空科技有限公司</span>
							</li>
							<li class="mui-table-view-cell">
								<label class="" style="width: 35%;">
									门店地址
								</label>
								<div style="margin-right: -5px;display: inline-block;text-align: left;float:right;max-width: 65%;word-wrap: break-word;overflow: hidden;word-break:break-all;">
									上海市 闸北区 共和新路 229号楼403室
								</div>
							</li>
							<li class="mui-table-view-cell">
								<label>公司性质</label>
								<span class="mui-pull-right">私营企业</span>
							</li>
							<li class="mui-table-view-cell">
								<label>联&nbsp;&nbsp;系&nbsp;&nbsp;人</label>
								<span class="mui-pull-right">张DX</span>
							</li>
							<li class="mui-table-view-cell">
								<label>手机号码</label>
								<span class="mui-pull-right">16364758670</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
	var _self = {};
	module.exports = {
		name: 'shop_account',
		template: '#shop_account',
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
				User: {},
				CustomerEnter: {}
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
			 * 更换头像
			 */
			updateHeader: function() {
				qiao.h.sheet('选择照片', ['拍照', '相册'], function(e) {
					var index = e.index;
					if (index == 1) {_self.$options.methods.choiceCamera();}
					if (index == 2) {_self.$options.methods.choicePic();}
				});
			},
			getAccountDetail: function() {
				var user = StorageAPI.getUser();
				_self.User = user;
			},
			/**
			 * 选择拍照
			 */
			choiceCamera: function() {
				var cmr = plus.camera.getCamera();
				cmr.captureImage(function(p) {
					plus.io.resolveLocalFileSystemURL(p, function(entry) {
						_self.$options.methods.setImg(entry.toLocalURL());
					}, function(e) {});
				}, function(e) {}, {
					index: 1,
					filename: "_doc/camera/"
				});
			},
			/**
			 * 选择相册
			 */
			choicePic: function() {
				plus.gallery.pick(function(path) {
					_self.$options.methods.setImg(path);
				}, function(e) {}, {
					filter: 'image'
				});
			},
			/**
			 * 设置头像图片
			 * @param {Object} src
			 */
			setImg: function(src) {
				NetAPI.uploadImage(src, "employees", 500, 500, function(isSuccess, serverPath) {
					if (isSuccess) {
						//修改用户头像
						_self.User.HeadImageUrl = serverPath;
					}
				});
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
				_self.getAccountDetail();
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
					var main = plus.webview.getWebviewById('shop_my.html');
					mui.fire(main, 'refresh_my');
					//返回true,继续页面关闭逻辑
					return true;
				}
			});
			
			/**
			 * 所有动态获取的控件初始化需在mui.ready(function(){});内执行
			 */
			mui.ready(function() {
				
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
	
</style>
