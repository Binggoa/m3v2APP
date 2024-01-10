Vue.use(Vuex); // 在创建Vue实例之前

window.createPersistedState();

/**
 * 初始化secure-ls加密缓存
 */
var secure_ls = new SecureLS({
	encodingType: 'base64',	// 加密类型 base64（默认） / aes / des / rabbit / rc4 /
	isCompression: false,
	encryptionSecret: 's3cr3t$@1'	// PBKDF2值
});
/**
 * test1
 * 此model不缓存
 */
const test1 = {
	// 当namespaced=true 时, vuex, 将会自动给各自module 添加访问路径名。 方便区分moduel
	namespaced: true,
	state:{ // 这里是根vuex状态,存放组件之间共享的数据,唯一数据源,我理解为声明全局变量,数据仓库1
		num: 0
	},
	mutations:{ // 显式的更改state里的数据,逻辑处理,但Mutation 必须是同步函数
		increment: function(state){
			state.num = 1;
		},
		decrement: function(state){
			state.num = 0;
		}
	},
	actions:{
		// 如果不使用命名空间, 那么view 指向actions 的该方法时,会执行所有与指定action名相同的函数（即:这里module A,B 中该action都会执行）
	},
	getters:{//获取数据的方法,针对state数据的过滤,getters 只会依赖 state 中的成员去更新
		
	},
};

/**
 * test2
 * 此model使用缓存
 */
const test2 = {
	// 当namespaced=true 时, vuex, 将会自动给各自module 添加访问路径名。方便区分moduel
	namespaced: true,
	strict: true,	// 开启严格模式,无论何时发生了状态变更且不是由 mutation 函数引起的,将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到。
	state:{ // 这里是根vuex状态,存放组件之间共享的数据,唯一数据源,我理解为声明全局变量,数据仓库2
		lauchFlag: 0, // 引导页 0为未展示,1为已展示【必要：因为使用的VUEX缓存持久化，第一次初始化的时候使用】
		isLogin: 0, // 是否登录 0为未登录,1为已登录
		loginState: 0, // 登录状态:0为离线,1为在线,2为隐身......
		userInfo: null,	// 用户信息
		LoginName: null, // 登录账户名
		Password: null,	// 登录账户密码
		isRemember: 0,	// 是否记住密码 0为不记住,1为已记住
	},
	mutations:{
		/**
		 * 批量设置State
		 * @param {Object} state
		 * @param {Object} opt
		 * 使用:
				this.$store.commit('方法名',{
				字段名1:值1,
				字段名2:值2
				})
		 */
		setLoginState: function(state, opt){
			// 先做非空判断
			if(opt){
				for(var i in state){
					console.log("state[i]:" + i)
					for(var [key,val] of Object.entries(opt)){
						// console.log(`${key}: ${val}`);
						console.log("state.${key}:" + `state.${key}`);
						// console.log("state[i]:" + state[i]);
						if(i == `${key}`){
							console.log("传入的变量如果在State里已定义则set新值")
							// console.log("state[i]:" + i);
							// console.log("state.${key}:" + `state.${key}`);
							state[key] = val; // 或Vue.set(state, key, val);
						}
					}
				}
			}else{
				alert("无法修改未定义变量！");
			}
		},
		/**
		 * 批量把缓存更新到State
		 * @param {Object} state
		 * @param {Object} value
		 */
		updateLoginState: function(state, value){
			// alert(JSON.stringify(value))
			// 获取State里所有的全局变量
			for(var i in state){
				// if(Object.prototype.toString.call(state[i]) === '[object Object]'){
				// 	// JSON.stringify(state[i])
				// }
				// console.log('key:' + i + '  value:' + JSON.stringify(state[i]) );
				// 获取所有vuex-persistedstate缓存的键值
				for(var j in value){
					// if(Object.prototype.toString.call(value[j]) === '[object Object]'){
					// 	// JSON.stringify(value[i])
					// }
					// console.log('key:' + i + '  value:' + JSON.stringify(value[j]) );
					// 把State里所有的全局变量的值全部更新为vuex-persistedstate缓存的值
					// console.log("i:" + i + "  j:" +j)
					if(i == j){
						state[i] = value[j]; // 或 Vue.set(state, i, value[j]);
					}
				}
			}
			
		}
	},
	actions:{
		/**
		 * 调用：_self.$store.dispatch('模块名/方法名', {参数1:'值1', 参数2:'值2'});
		 */
		myActions: function ({ commit, state }, {参数1, 参数2}) {
			// Do something with 参数1 and 参数2
			commit('mutations中定义的方法', 处理好的数据);
		},
		/**
		 * 调用：_self.$store.dispatch('模块名/方法名');
		 */
		updateLoginState: function({ commit }){
			// 获取vuex-persistedstate缓存的State全局变量及对应的值
			// let lsStatus = JSON.parse(decodeURIComponent(secure_ls.get('encryptionStore_shopStore_test2')));
			/**
			 * 因为使用的VUEX缓存持久化，在第一次启动APP的时候需要先在state里存一个值，使持久化插件生效，否则涉及到刷新缓存的页面均无法正常加载
			 */
			// alert(secure_ls.get('encryptionStore_shopStore_test2')); // 第一次启动为空值，JSON.parse()空值会报错 JSON input
			let shopStore_test2 = secure_ls.get('encryptionStore_shopStore_test2');
			// 先判断非空
			if(shopStore_test2){
				// let lsStatus = JSON.parse(secure_ls.get('encryptionStore_shopStore_test2'));
				let lsStatus = JSON.parse(shopStore_test2);
				// alert(JSON.stringify(lsStatus))
				commit('updateLoginState', lsStatus);
			}else{ // 缓存被清理，提示登录过期，从服务器重新获取用户信息
				console.log("登录过期，请重新登录！");
				commit('setLoginState', {lauchFlag: 0});
			}
		}
	},
	getters:{//获取数据的方法,针对state数据的过滤,getters 只会依赖 state 中的成员去更新
		loadIslogin: function(state){
			// alert(state.isLogin)
			// 获取缓存中的登录状态,如果有值,则返回缓存的状态值,如果没值,则返回state.isLogin
			// let loginStatus = JSON.parse(secure_ls.get('encryptionStore_shopStore_test2'))['test2']['isLogin'];
			// if(loginStatus){
				// return loginStatus
			// }else{
				return state.isLogin
			// }
		},
		/**
		 * @param {Object} state
		 * 
		 调用：_self.$store.getters['模块名/方法名']('state中定义的字段名');
		 */
		getLoginState: function(state){
			// alert("111")
			//返回一个函数用于接收传进来的参数
			return function (key) {
				// console.log(JSON.stringify(key));
				// 判断非空
				if(key){
					for(var i in state){
						console.log("[i]:" + i)
						console.log("state[i]:" + state[i]);
						if(i == key){
							console.log("传入的变量如果在State里已定义则get变量的值");
							// console.log("state[i]:" + i);
							// console.log("state.${key}:" + `state.${key}`);
							// state[key] = val;
							// console.log(state[key])
							return state[key];
						}
						else{
							console.log("传入的变量未在State里定义");
						}
					}
				}
				else{
					alert("请传入参数！");
				}
				
			    
			}
		}
	},
};

/**
 * 定义项目公共数据仓库
 */
var shop_store = new Vuex.Store({
	namespaced: true, // 为了解决不同模块命名冲突的问题
	state:{ // 这里是根vuex状态,存放组件之间共享的数据,唯一数据源,我理解为声明全局变量,数据仓库0
		count: 0
	},
	mutations:{ // 显式的更改state里的数据,逻辑处理,但Mutation 必须是同步函数
		// 调用Mutation中的方法：
		// this.$store.commit('mutation函数名',发送到mutation中的数据/参数);
		increment: function(state){
			state.count = 1;
		},
		decrement: function(state){
			state.count = 0;
		},
		countadd: function(state){
			state.count++
		}
		
	},
	actions:{ //Action 类似于 mutation,Action 提交的是 mutation,而不是直接变更状态;Action 可以包含任意异步操作.
		// 如果不使用命名空间,那么view 指向actions 的该方法时,会执行所有与指定action名相同的函数（即:这里module A,B 中该action都会执行）
		// 调用action中的方法：
		// this.$store.dispatch('action中的函数名',发送到action中的数据/参数);
		countadd: function(context){ //官方给出的指定对象, 此处context可以理解为store对象
			// context.commit('countadd',value);//此处value可以是对象,可以是固定值等
			context.commit('countadd');
		}
	},
	getters:{//获取数据的方法,针对state数据的过滤,getters 只会依赖 state 中的成员去更新
		LoginStatus111: function(state){
			// alert(state.loginstate)
			return state.loginstate
		}
	},
	modules:{
		// 这里的路径名: test1, test2, 在view 中 通过 mapActions('test1', [actionName]) 使用并区分需要使用的module
		test1, // 数据仓库1（不缓存）
		test2 // 数据仓库2（缓存）
	},
	// plugins: [createPersistedState()]
	plugins: [
		createPersistedState({
			// 存储数据的键名，通过localStorage.getItem('key名')获取
			// 经过secure-ls加密后不能通过localStorage.getItem('key名')获取,只能通过secure_ls.get('key名')获取
			key: 'encryptionStore_shopStore_test2',
			// 存储方式：localStorage、sessionStorage、cookies，如果不写默认存储到localStorage
			storage: {
				// 以下使用secure-ls加密
				getItem: function(key) {secure_ls.get(key)} ,
				setItem: function(key, value) {secure_ls.set(key, value)},
				removeItem: function(key) {secure_ls.remove(key)},
			},
			// 要储存的数据
			reducer(val) {
				// return val	// 全部缓存
				return val.test2	// 缓存modules的test2模块中state全部字段
				// return {
				// 	/** 只储存modules的test2模块中state的isLogin、userInfo字段 */
				// 	test2: {
				// 		//  val表示整个vuex数据外层
				// 		//  test2表示当前vuex模块
				// 		//  isLogin、userInfo...表示当前vuex模块的state数据
				// 		isLogin: val.test2.isLogin,
				// 		userInfo: val.test2.userInfo,
				// 		isRemember: val.test2.isRemember,
				// 		LoginName: val.test2.LoginName,
				// 		Password: val.test2.Password
				// 	}
				// }
			}
		})
	]
});

/**
 * 定义项目公共方法的方式一(方式二的优先级大于方式一，调用：_self.方法名(参数);)
 */
/**
* 批量更新data里缓存参数的值(要求data里定义的变量名和store.state.test2中定义的变量名一致)
* @param {Object} data // 传入当前组件的data
*/
Vue.prototype.refrash_loginData = function (data){
	alert("111")
	var _self = this;
	// console.log(Object.keys(_self.$data).length);
	for(var i=0; i<Object.keys(_self.$data).length; i++) {
		// console.log(Object.keys(_self.$data)[i]);
		Object.keys(_self.$data).map(function(data_key){
			// console.log("$data:" + _self.$data[data_key]);
			// console.log("$data:" + Object.keys(_self.$data)[i]);
			// return key
			// console.log(key)
			for(var j=0; j<Object.keys(_self.$store.state.test2).length; j++) {
				Object.keys(_self.$store.state.test2).map(function(store_state_test2_key){
					// console.log("$store:" + _self.$store.state.test2[store_state_test2_key]);
					// console.log("$store:" + Object.keys(_self.$store.state.test2)[j]);
					if(Object.keys(_self.$data)[i] == Object.keys(_self.$store.state.test2)[j]) {
						// data_key[key] = store_state_test2_key[key]
						// console.log(Object.keys(_self.$data)[i])
						_self.$data[data_key] = _self.$store.state.test2[store_state_test2_key];
					}
				});
			}
		});
	}
}

/**
 * 定义项目公共方法的方式二(方式二的优先级大于方式一，调用：_self.方法名(参数);)
 */
const myPlugin = {
	install(Vue) {
		Vue.mixin({
			methods: {
				/**
				 * 批量更新data里缓存参数的值(要求data里定义的变量名和store.state.test2中定义的变量名一致)
				 * @param {Object} data // 传入当前组件的data
				 */
				refrash_loginData: function (data) {
					alert("222")
					var _self = this;
					// console.log(Object.keys(data).length);
					for(var i=0; i<Object.keys(data).length; i++) {
						// console.log(Object.keys(data)[i]);
						Object.keys(data).map(function(data_key){
							// console.log("$data:" + data[data_key]);
							// console.log("$data:" + Object.keys(data)[i]);
							// return key
							// console.log(key)
							for(var j=0; j<Object.keys(_self.$store.state.test2).length; j++) {
								Object.keys(_self.$store.state.test2).map(function(store_state_test2_key){
									// console.log("$store:" + _self.$store.state.test2[store_state_test2_key]);
									// console.log("$store:" + Object.keys(_self.$store.state.test2)[j]);
									if(Object.keys(data)[i] == Object.keys(_self.$store.state.test2)[j]) {
										// data_key[key] = store_state_test2_key[key]
										// console.log(Object.keys(data)[i])
										data[data_key] = _self.$store.state.test2[store_state_test2_key];
									}
								});
							}
						});
					}
				},
				formatDate(date) {
					// 日期格式化逻辑
				},
				truncate(str, length) {
					// 字符串截取逻辑
				},
				formatNumber(num) {
					// 数字格式化逻辑
				},
			}, // methods
		}) // Vue.mixin
	}, // install(Vue)
}
Vue.use(myPlugin);

var _event = {};
// 定义项目公共方法的方式三(独立于方式一和方式二，便于区分是否调用了公共方法，调用：_eventHub.方法名(参数);)
var _eventHub = new Vue({
	// el: '#app',
	store: shop_store,
	// router: shop_router, //这里不需要使用路由
	data: {
		eventHub: new Vue(),
	},
	methods: {
		/**
		 * 批量更新data里缓存参数的值(要求data里定义的变量名和store.state.test2中定义的变量名一致)
		 * @param {Object} data // 传入当前组件的data
		 */
		refrash_loginData: function (data) {
			// alert("333")
			var _self = this;
			// console.log(Object.keys(data).length);
			for(var i=0; i<Object.keys(data).length; i++) {
				// console.log(Object.keys(data)[i]);
				Object.keys(data).map(function(data_key){
					// console.log("$data:" + data[data_key]);
					// console.log("$data:" + Object.keys(data)[i]);
					// return key
					// console.log(key)
					for(var j=0; j<Object.keys(_self.$store.state.test2).length; j++) {
						Object.keys(_self.$store.state.test2).map(function(store_state_test2_key){
							// console.log("$store:" + _self.$store.state.test2[store_state_test2_key]);
							// console.log("$store:" + Object.keys(_self.$store.state.test2)[j]);
							if(Object.keys(data)[i] == Object.keys(_self.$store.state.test2)[j]) {
								// data_key[key] = store_state_test2_key[key]
								// console.log(Object.keys(data)[i])
								data[data_key] = _self.$store.state.test2[store_state_test2_key];
							}
						});
					}
				});
			}
		},
		xianshi: function(){
			alert("666");
		},
		onLogin: function(isLogin){
			_self.$store.commit('test2/markIsLogin', {isLogin: 1}); // 执行 数据仓库test2中mutations定义的markIsLogin方法
		},
		// mui.fire()批量通知封装
		GetMuiFire:function(wgids){
			// var wgids = [
			// 	{
			// 		"id": "",
			// 		"incident": "",
			// 		"parm": {}
			// 	},
			// 	{
			// 		"id": "",
			// 		"incident": "",
			// 		"parm": ""
			// 	},
			// 	{
			// 		"id": "",
			// 		"incident": "",
			// 		"parm": {}
			// 	},
			// 	{
			// 		"id": "",
			// 		"incident": "",
			// 		"parm": {}
			// 	}
			// ];
			var wg = wgids,
				tempW,
				temp;
			if(wg[0].id == "GetWebviewAll"){
				// 获取所有Webview窗口
				// var wvs = plus.webview.all();
				var wvs = [
					"",
					"",
					"",
					"",
					"",
					"",
					"",
					"",
					"",
					"",
					"",
				];
				
				for(var i=0; wvs.length; i++){
					// console.log("webview"+ i +": "+wvs[i].getURL());
					// console.log("webview"+ i +": "+wvs[i].id);
					tempW = wvs[i].id;
					temp = {
						"id": "",
						"incident": wg[0].incident,
						"parm": {}
					};
					if(tempW){
						// mui.fire(tempW, "refrash_" + temp.incident, temp.parm);
					}
				}
			}else{
				
				for (var i=0; i<wg.length; i++)
				{
					temp = wg[i];
					//获取需要触发事件的webview
					tempW = plus.webview.getWebviewById(temp.id);
					if(tempW){
						mui.fire(tempW, temp.incident, temp.parm);
					}
				    document.write(wg[i] + "<br>");
				}
			}
		}, // end GetMuiFire
		// 批量关闭除了入口和首页以外的所有webview
		CloseOrdersWebview: function(){
			var wvs = plus.webview.all();
			// wvs.forEach(function(wvs, wvs.index){
			for(let i=0; i<wvs.length; i++){
			    console.log("all：" + i + "：" + wvs.id);//log1  
			
			    if(i != 0 && wvs.id != "shop_home.html"){  
			        console.log("close：" + i + "：" + wvs.id);//log2 
					var wcv = plus.webview.currentWebview(); // 获取当前Webview窗口
					if(wvs.id != wcv){ // 先关闭除了入口和首页以外的其他窗口
						plus.webview.getWebviewById(wvs.id).close("none");
						if(wvs.length <= 3){ // 当除了入口和首页以外的其他窗口关闭后再关闭当前窗口
							wcv.close("none");
						}
					}
			    }
			};
			// });
		},
		StorageAPI_getUser: function(){
			var user = null;
			if (!window.localStorage) {
				alert("浏览器不支持localstorage");
			} else {
				var storage = window.localStorage;
				var str = storage.getItem("user-test");
				if(str!=null || str!=undefined){
					// user = JSON.parse(decodeURIComponent(str));
					user = JSON.parse(str);
				}else{
					user = null;
				}
			}
			// this.$store.dispatch('test2/loadLoginStatus'); // 执行shop_store中数据仓库test2的actions中定义的loadLoginStatus方法实例
			return user;
			
		},
		StorageAPI_getStorage: function(key){
			if (!window.localStorage) {
				alert("浏览器不支持localstorage");
			} else {
				var storage = window.localStorage;
				var str = storage.getItem(key);
				if(str!=null || str!=undefined){
					// itme = JSON.parse(decodeURIComponent(str));
					itme = JSON.parse(str);
				}else{
					itme = null;
				}
			}
			return itme;
			// this.$store.dispatch('test2/loadLoginStatus'); // 执行shop_store中数据仓库test2的actions中定义的loadLoginStatus方法实例
		},
		StorageAPI_setStorage: function(key, data){
			if (!window.localStorage) {
				alert("浏览器不支持localstorage");
			} else {
				var storage = window.localStorage;
				// var jsonStr = encodeURIComponent(JSON.stringify(data));
				var jsonStr = JSON.stringify(data);
				storage.setItem(key, jsonStr);
			}
		},
		StorageAPI_reStorage: function(key){
			if (!window.localStorage) {
				alert("浏览器不支持localstorage");
			} else {
				var storage = window.localStorage;
				storage.removeItem(key);
			}
		}
	},
});
