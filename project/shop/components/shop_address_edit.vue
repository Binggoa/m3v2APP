<template>
	<div id="shop_address_edit" v-clock>
		<template>
			<!--使用render函数与createElement函数创建外部文件链接DOM-->
			<remote-js src=""></remote-js>
			<remote-css href=""></remote-css>
		</template>
		<template class="mui-fullscreen">
			<div class="mui-page-content">
				<div class="mui-input-group mgb-6" >
					<div class="mui-input-row">
						<label>
							<i class="input-label-warning">*</i> 收&nbsp;货&nbsp;人
						</label>
						<input id="RecieveName" v-bind:value="RecieveAddress.RecieveName" type="text" class="mui-input-text mui-text-right mui-text-right"
						 placeholder="请输入收货人姓名">
					</div>
					<div class="mui-input-row">
						<label>
							<i class="input-label-warning">*</i> 手机号码
						</label>
						<input type="text" id="MobilePhone" v-bind:value="RecieveAddress.MobilePhone" class="mui-input-text mui-text-right mui-text-right"
						 placeholder="请输入手机号码">
					</div>
					<div class="mui-input-row">
						<label>
							<i class="input-label-warning">*</i> 所在地区
						</label>
						<input id="showCityPicker" v-bind:value="RecieveAddress.RecieverProvinceName + RecieveAddress.RecieverCityName +RecieveAddress.RecieverCountyName"
						 v-bind:data-provinceid="RecieveAddress.RecieverProvinceID" v-bind:data-cityid="RecieveAddress.RecieverCityID" v-bind:data-countyid="RecieveAddress.RecieverCountyID"
						 readonly="true" type="text" class="mui-input-text mui-text-right mui-text-right" placeholder="请选择所在地区">
					</div>
					<div class="mui-input-row">
						<label>
							<i class="input-label-warning">*</i> 详细地址
						</label>
						<input type="text" id="RecieverAddress" v-bind:value="RecieveAddress.RecieverAddress" class="mui-input-text mui-text-right"
						 placeholder="请输入详细地址">
					</div>
					<div class="mui-input-row mgb-6">
						<label><i class="input-label-transparent">*</i> 邮政编码</label>
						<input type="text" id="PostCode" v-bind:value="RecieveAddress.PostCode" class="mui-input-text mui-text-right"
						 placeholder="请输入邮政编码">
					</div>
				</div>
				<div class="mui-input-group mgb-6">
					<div class="mui-input-row">
						<label><i class="input-label-transparent">*</i> 设为默认地址</label>
						<div id="mySwitch" style="height: 24px;top: 3px;" v-bind:class="{'mui-active':RecieveAddress.IsDefault=='1'}" class="mui-switch mui-switch-mini">
							<div class="mui-switch-handle" style="height: 22px;width: 22px;" ></div>
						</div>
					</div>
				</div>
			</div>
			<a v-on:tap="saveAddressData()" class="mui-bar mui-bar-tab bg-red text-white bottom-fixed-block">保存</a>
			</div>
		</template>
	</div>
</template>

<script>
	var _self = {};
	module.exports = {
		name: 'shop_address_edit',
		template: '#shop_address_edit',
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
				RecieveAddress: {},
				title: "编辑收货地址",
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
			saveAddressData:function() {
				mui.toast(_self.RecieveAddress != null ? "修改成功" : "新增成功");
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
				if (mui.os.android) {
						var height = (plus.display.resolutionHeight+0.5) + "px";
						plus.webview.currentWebview().setStyle({
							height: height
						});
					}
					var ws = plus.webview.currentWebview();
					_self.RecieveAddress = ws.editAddress;
					console.log(JSON.stringify(_self.RecieveAddress))
					var _getParam = function(obj, param) {
						return obj[param] || '';
					};
					var cityPicker = new mui.PopPicker({
						layer: 3
					});
					cityPicker.setData(cityData);
					if(_self.RecieveAddress){
						// 设定省初始值  
						cityPicker.pickers[0].setSelectedValue(_self.RecieveAddress.RecieverProvinceID, 0, function() {
							// 设定市初始值  
							cityPicker.pickers[1].setSelectedValue(_self.RecieveAddress.RecieverCityID, 0, function() {
								// 设定区初始值  
								cityPicker.pickers[2].setSelectedValue(_self.RecieveAddress.RecieverCountyID);
							});
						});
					}
					var showCityPicker = document.getElementById('showCityPicker');
				
					showCityPicker.addEventListener('tap', function(event) {
						document.activeElement.blur(); //隐藏软键盘  
						cityPicker.show(function(items) {
							showCityPicker.value = _getParam(items[0], 'text') + " " + _getParam(items[1], 'text') + " " + _getParam(
								items[2], 'text');
							showCityPicker.setAttribute("data-provinceID", _getParam(items[0], 'value'));
							showCityPicker.setAttribute("data-cityID", _getParam(items[1], 'value'));
							showCityPicker.setAttribute("data-countyID", _getParam(items[2], 'value'));
							//返回 false 可以阻止选择框的关闭
							//return false;
						});
					}, false);
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
				mui('.mui-switch')['switch']().toggle(); // 初始化 mui-switch 控件
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
