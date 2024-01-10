Vue.use(Vuex); // 在创建Vue实例之前

// window.createPersistedState();

/**
 * 初始化secure-ls加密缓存
 */
var secure_ls = new SecureLS({
	encodingType: 'aes',	// 加密类型 base64（默认） / aes / des / rabbit / rc4 /
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
	actions:{ //Action 类似于 mutation,Action 提交的是 mutation,而不是直接变更状态;Action 可以包含任意异步操作.
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
		isLogin: 0, // 是否登录 0为未登录,1为已登录
		loginstate: 0,	// 登录状态:0为离线,1为在线,2为隐身......
		userInfo: {},
		isRemember: 0,	// 是否记住密码 0为不记住,1为已记住
		LoginName: {},	// 登录账户名
		Password: {},	// 登录账户密码
	},
	mutations:{ // 显式的更改state里的数据,逻辑处理,但Mutation 必须是同步函数
		increment: function(state){
			state.loginState = 1;
		},
		decrement: function(state){
			state.loginState = 0;
		},
		markIsLogin: function(state, isLogin){
			// 改变state
			state.isLogin = isLogin;
			// Vue.set(state.isLogin, 'name', '毛毛')
			// 设置storage
			// alert("mutations:" + JSON.stringify(state.isLogin));
			// window.localStorage.isLogin = JSON.stringify(isLogin);
			// alert("window.localStorage.isLogin:" + JSON.stringify(window.localStorage.isLogin));
		},
		setLoginStatus: function(state, loginStatus){
			// alert(JSON.stringify(loginStatus));
			// alert(loginStatus.test2)
			state.isLogin = loginStatus;
		},
		/**
		 * 批量设置State
		 * @param {Object} state
		 * @param {Object} opt
		 */
		setLoginState: function(state, opt){
			/**
			 * 使用:
				this.$store.commit('setState',{
					showLaser:false,
					showCamera:false,
					showPath:false,
				})
			 */
			// 先判断非空
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
							state[key] = val;
						}
					}
					
				}
			}
			else{
				alert("无法修改未定义变量！");
			}
			
			
		},
		// 批量把缓存更新到State
		updateLoginState: function(state, value){
			// alert(JSON.stringify(value))
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
						state[i] = value[j]
					}
				}
			}
			
		}
	},
	actions:{ //Action 类似于 mutation,Action 提交的是 mutation,而不是直接变更状态;Action 可以包含任意异步操作.
		// 如果不使用命名空间, 那么view 指向actions 的该方法时,会执行所有与指定action名相同的函数（即:这里module A,B 中该action都会执行）
		loadLoginStatus: function({ commit }){
			// 发送axios.get(...)
			// let loginStatus = JSON.parse(window.localStorage.isLogin);
			// 获取缓存中的登录状态,如果有值,则返回缓存的状态值,如果没值,则返回state.isLogin
			let loginStatus = JSON.parse(secure_ls.get('encryptionStore_shopStore_test2'))['isLogin'];
			// let loginStatus = JSON.parse(secure_ls.get('encryptionStore_shopStore_test2'))['test2']['isLogin'];
			// let loginStatus = JSON.stringify(secure_ls.get('encryptionStore_shopStore_test2'));
			// alert("actions:" + loginStatus)
			// let loginStatus = window.localStorage.isLogin;
			commit('setLoginStatus', loginStatus);
		},
		loadLoginStatus111: function(context, value){
			// context:{
			// 		state,   等同于store.$state，若在模块中则为局部状态
			// 		rootState,   等同于store.$state,只存在模块中
			// 		commit,   等同于store.$commit
			// 		dispatch,   等同于store.$dispatch
			// 		getters   等同于store.$getters
			// }
			
			// 常规写法调用的时候会使用context.commit，但更多的是使用es6的变量解构赋值，也就是直接在参数的
			// 位置写自己想要的属性，如：{commit}。
			
			
			// 发送axios.get(...)
			// 获取缓存中的登录状态,如果有值,则返回缓存的状态值,如果没值,则返回state.isLogin
			let loginStatus = value;
			// let loginStatus = JSON.stringify(secure_ls.get('encryptionStore_shopStore_test2'));
			// alert("actions:" + loginStatus)
			// let loginStatus = window.localStorage.isLogin;
			context.commit('markIsLogin', loginStatus);
		},
		updateLoginState: function({ commit }){
			// 获取vuex-persistedstate缓存的State全局变量及对应的值
			let lsStatus = JSON.parse(secure_ls.get('encryptionStore_shopStore_test2'));
			// alert(JSON.stringify(lsStatus))
			// 先判断非空
			if(lsStatus){
				commit('updateLoginState', lsStatus);
			}
			else{ // 缓存被清理，提示登录过期，从服务器重新获取用户信息
				alert("登录过期，请重新登录！");
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
		getLoginState: function(state){
			// alert("111")
			//返回一个函数用于接收传进来的参数
			return function (key) {
				// console.log(JSON.stringify(key));
				// 非空判断
				if(key){
					for(var i in state){
						console.log("[i]:" + i)
						console.log("state[i]:" + state[i]);
						if(i == key){
							console.log("传入的变量如果在State里已定义则get变量的值")
							// console.log("state[i]:" + i);
							// console.log("state.${key}:" + `state.${key}`);
							// state[key] = val;
							// console.log(state[key])
							return state[key];
						}
						else{
							console.log("传入的变量未在State里定义")
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
		// namespaced: true, 
		test1, // 数据仓库1
		test2 // 数据仓库2
	},
	// plugins: [createPersistedState()]
	plugins: [
		createPersistedState({
			// 存储数据的键名，通过localStorage.getItem('key名')获取
			// 经过secure-ls加密后不能通过localStorage.getItem('key名')获取,只能通过secure_ls.get('key名')获取
			key: 'encryptionStore_shopStore_test2',
			// paths: [test2],
			// 存储方式：localStorage、sessionStorage、cookies，如果不写默认存储到localStorage
			// storage: window.localStorage,
			storage: {
				// 以下使用secure-ls加密
				getItem: function(key) {secure_ls.get(key)} ,
				setItem: function(key, value) {secure_ls.set(key, value)},
				removeItem: function(key) {secure_ls.remove(key)},
			},
			// 要储存的数据
			reducer(val) {
				console.log("createPersistedState:" + JSON.stringify(val));
				console.log("val.isLogin:" + val.test2.isLogin);
				console.log("val.userInfo:" + JSON.stringify(val.test2.userInfo));
				// return val	// 全部缓存
				return val.test2	// 缓存modules的test2模块中state全部字段
				// return {
				// 			isLogin: val.test2.isLogin,
				// 			userInfo: val.test2.userInfo,
				// 			isRemember: val.test2.isRemember,
				// 			LoginName: val.test2.LoginName,
				// 			Password: val.test2.Password
				// }
				// return {
				// 	/** 只储存modules的test2模块中state的isLogin、userInfo字段 */
				// 	test2: {
				// 		//  val表示整个vuex数据外层
				// 		//  test2表示当前vuex模块
				// 		//  isLogin、user表示当前vuex模块的state数据
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

var _self = {};
// 定义项目公共方法
var _eventHub = new Vue({
	el: '#app',
	store: shop_store,
	// router: shop_router, //这里不需要使用路由
	data: {
		eventHub: new Vue(),
		isLogin: false,
		user: {}
	},
	methods: {
		xianshi: function(){
			alert("666");
		},
		onLogin: function(isLogin){
			_self.$store.commit('test2/markIsLogin', isLogin); // 执行 数据仓库test2中mutations定义的markIsLogin方法
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
			
			    if(i !== 0 && wvs.id !== "shop_home.html"){  
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
	beforeCreate: function(){
		_self = this;
	},
	created: function(){
		
	},
	beforeMount: function(){
		
	},
	mounted: function(){
		// _self.$store.dispatch('test2/loadLoginStatus');
		// _self.$store.dispatch('test2/loadLoginStatus'); // 执行 数据仓库test2中actions定义的loadLoginStatus方法
		_self.$nextTick(function(){
			
		});
	},
	beforeUpdate: function() {
		// alert('Before Update');
	}, //beforeUpdate
	updated: function() {
		// alert('Updated');
		
	}, //updated
	beforeDestroy: function() {
		// alert('Before Destroy');
	}, //beforeDestroy
	destroyed: function() {
		// alert('Destroyed');
	} //destroyed
});