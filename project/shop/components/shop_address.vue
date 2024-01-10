<template>
	<div id="shop_address" v-clock>
		<template>
			<!--使用render函数与createElement函数创建外部文件链接DOM-->
			<remote-js src=""></remote-js>
			<remote-css href=""></remote-css>
		</template>
		<template class="mui-fullscreen">
			<div class="mui-page-content">
				<div class="state-container" v-if="RecieveAddressList.length==0">
					<div class="state-icon state-nodata"></div>
					<div class="state-title">
						还未添加收货地址
					</div>
					<a v-on:tap="addNewAdress" type="button" class="mui-btn mui-btn-danger">添加地址</a>
				</div>
				<div class="mui-scroll-wrapper" v-if="RecieveAddressList.length!=0" style="bottom: 50px;">
					<div class="mui-scroll">
						<div class="adressM-panel mgb-6"  v-for="(address,index) in RecieveAddressList">
							<div v-on:tap="selectResAddress(index)">
								<div class="adressM-panel__head" style="font-size: 14px;">
									{{address.RecieveName}}&nbsp;&nbsp;&nbsp;&nbsp;{{address.MobilePhone}}
								</div>
								<div class="adressM-panel__body beforeline"  style="font-size: 13px;">
									{{address.RecieverProvinceName}}{{address.RecieverCityName}}{{address.RecieverCountyName}}{{address.RecieverAddress}}
									<template v-if="address.PostCode">
										({{address.PostCode}})
									</template>
								</div>
							</div>
							<div class="adressM-panel__opt flexbox align-items-center" >
								<div class="mui-input-row mui-checkbox mui-left" style="top: 5px;">
									<label v-if="address.IsDefault==1" style="font-size: 13px;">默认地址</label>
									<label v-if="address.IsDefault!=1" style="font-size: 13px;">设为默认</label>
									<input name="checkbox"  type="checkbox" v-on:click="setDefault(address,index)" v-bind:checked="address.IsDefault==1">
								</div>
								<a v-on:tap='editAddress(index)' class="btn-opt btn-edit"  style="font-size: 13px;">
									<span class="mui-icon mui-icon-compose"></span>
									编辑
								</a>
								<a v-on:tap='deleteAddress(address.RecieveAddressID)' class="btn-opt btn-remove" style="font-size: 13px;">
									<span class="mui-icon mui-icon-trash" style="size: 1px;"></span>
									删除
								</a>
							</div>
						</div>
					</div>
					
				</div>
				<a v-on:tap="addNewAdress" v-if="RecieveAddressList.length!=0" class="mui-bar mui-bar-tab bg-red text-white bottom-fixed-block">添加新地址</a>
			</div>
		</template>
	</div>
</template>

<script>
	var _self = {};
	module.exports = {
		name: 'shop_address',
		template: '#shop_address',
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
				RecieveAddressList: []
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
			 * 获取地址列表
			 */
			GetReceAddressList: function() {
				var files = ['../assets/data/json/addressModel.json'],
					addressByCache = "";
				$.getJSON(files[0], function(addMdata){
					addressByCache = addMdata;
				});
				var t0 = setTimeout(function() {
					var data = addressByCache;
					_self.RecieveAddressList = data.RecieveAddressList;
					_self.$nextTick(function(){
						mui('.mui-scroll-wrapper').scroll();
					})
				}.bind(_self), 500);
			}, //end
			/**
			 * 订单里面选择收货地址
			 * @param {Object} index
			 */
			selectResAddress: function(index) {
				var ws = plus.webview.currentWebview();
				if (ws.selectOneAddress) {
					var settlement = plus.webview.getWebviewById('settlement.html');
					if(settlement){
						mui.fire(settlement, 'initAddress', {
							address: _self.RecieveAddressList[index]
						});
					}
					mui.back();
				}
			},
			/**
			 * 新增收货地址
			 */
			addNewAdress: function(){
				var param = {
					title: "新增收货地址"
				}
				UIAPI.openWindowWithTitle("shop_address_edit.html", "shop_address_edit.html","新增收货地址");
			},
			/**
			 * 编辑收货地址
			 * @param {Object} index
			 */
			editAddress: function(index){
				var param = {
					editAddress: _self.RecieveAddressList[index],
					title: "编辑收货地址"
				}
				UIAPI.openWindowWithTitle("shop_address_edit.html", "shop_address_edit.html","编辑收货地址", param);
			},
			/**
			 * 删除收货地址
			 * @param {Object} RecieveAddressID
			 */
			deleteAddress: function(RecieveAddressID){
				var btnArray = ['否', '是'];
				mui.confirm('确定把该地址删除？', '', btnArray, function(e) {
					if (e.index == 1) {
						mui.toast("删除成功");
					}
				})
			},
			setDefault: function(address,i){
				var k = 0
				$("input[name='checkbox']").each(function() {
					this.checked = false;
					if(i==k){
						this.checked = true;
					}
					k++;
				});
				
				if(address.IsDefault == 1){
					return false;
				}
				mui.each(this.RecieveAddressList,function(index,item){
					item.IsDefault = 0;
					if(item.RecieveAddressID==address.RecieveAddressID){
						item.IsDefault = 1;
						mui.toast("设置成功");
					}
				})
			},
			/**
			 * 重写back
			 */
			back: function() {
				//判断是否需要选择收货地址
				var ws = plus.webview.currentWebview();
				if (ws.selectOneAddress) {
					if (_self.RecieveAddressList.length == 0) {
						var settlement = plus.webview.getWebviewById('shop_settlement.html');
						if(settlement){
							mui.fire(settlement, 'initAddress', {
								address: null
							});
						}
					}
				}
				ws.close();
				//返回true,继续页面关闭逻辑
				return true;
			} //end
		}, //methods
		beforeCreate: function() {
			_self = this;
		}, //beforeCreate
		created: function() {
			/**
			 * HTML5+API准备就绪
			 */
			mui.plusReady(function() {
				_self.$options.methods.GetReceAddressList();
			});
			window.addEventListener('loadData', function(e) { //执行刷新
				_self.GetReceAddressList();
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
				beforeback: _self.back
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
	.adressM-panel__opt .mui-checkbox input[type="checkbox"]::before{ font-size: 18px;}
</style>
