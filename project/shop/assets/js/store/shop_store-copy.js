Vue.use(Vuex); // 在创建Vue实例之前

window.createPersistedState();

var ls = new SecureLS({
	encodingType: 'aes',	// 加密类型 base64（默认） / aes / des / rabbit / rc4 /
	isCompression: false,
	encryptionSecret: 's3cr3t$@1'	// PBKDF2值
});
const test1 = {
	// 当namespaced=true 时, vuex, 将会自动给各自module 添加访问路径名。 方便区分moduel
	namespaced: true,
	state:{ // 这里是根vuex状态,存放组件之间共享的数据,唯一数据源,我理解为声明全局变量,数据仓库1
		loginState: 0
	},
	mutations:{ // 显式的更改state里的数据,逻辑处理,但Mutation 必须是同步函数
		increment: function(state){
			state.loginState = 1;
		},
		decrement: function(state){
			state.loginState = 0;
		}
	},
	actions:{ //Action 类似于 mutation,Action 提交的是 mutation,而不是直接变更状态;Action 可以包含任意异步操作.
		// 如果不使用命名空间, 那么view 指向actions 的该方法时,会执行所有与指定action名相同的函数（即:这里module A,B 中该action都会执行）
	},
	getters:{//获取数据的方法,针对state数据的过滤,getters 只会依赖 state 中的成员去更新
		
	},
};

const test2 = {
	// 当namespaced=true 时, vuex, 将会自动给各自module 添加访问路径名。方便区分moduel
	namespaced: true,
	state:{ // 这里是根vuex状态,存放组件之间共享的数据,唯一数据源,我理解为声明全局变量,数据仓库2
		isLogin: false,
		user: {},
		// loginState: -1,
		// user: localStorage.getItem('user-test')
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
		markUser: function(state, userkey, value){
			if (!window.localStorage) {
				alert("浏览器不支持localstorage");
			} else {
				var storage = window.localStorage;
				var jsonStr = JSON.stringify(value);
				storage.setItem(userkey, jsonStr);
			}
			state.user = storage.getItem(userkey);
		},
	},
	actions:{ //Action 类似于 mutation,Action 提交的是 mutation,而不是直接变更状态;Action 可以包含任意异步操作.
		// 如果不使用命名空间, 那么view 指向actions 的该方法时,会执行所有与指定action名相同的函数（即:这里module A,B 中该action都会执行）
		loadLoginStatus: function(context){
			// 发送axios.get(...)
			let loginStatus = JSON.parse(window.localStorage.isLogin);
			// alert("actions:" + loginStatus)
			// let loginStatus = window.localStorage.isLogin;
			context.commit('setLoginStatus', loginStatus);
		},
		loadLoginStatus111: function({ commit }){
			// 发送axios.get(...)
			let loginStatus = JSON.parse(ls.get('encryptionStore'))['test2']['isLogin'];
			// let loginStatus = JSON.stringify(ls.get('encryptionStore'));
			// alert("actions:" + loginStatus)
			// let loginStatus = window.localStorage.isLogin;
			commit('setLoginStatus', loginStatus);
		}
	},
	getters:{//获取数据的方法,针对state数据的过滤,getters 只会依赖 state 中的成员去更新
		loadIslogin: function(state){
			alert(state.isLogin)
			return state.isLogin
		}
	},
};

// 定义项目公共数据仓库
var shop_store = new Vuex.Store({
	namespaced: true, // 为了解决不同模块命名冲突的问题
	state:{ // 这里是根vuex状态,存放组件之间共享的数据,唯一数据源,我理解为声明全局变量,数据仓库0
		loginstate: 3,
		count: 0
	},
	mutations:{ // 显式的更改state里的数据,逻辑处理,但Mutation 必须是同步函数
		// 调用Mutation中的方法：
		// this.$store.commit('mutation函数名',发送到mutation中的数据/参数);
		increment: function(state){
			state.loginstate = 1;
		},
		decrement: function(state){
			state.loginstate = 0;
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
		LoginStatus: function(state){
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
			key: 'encryptionStore',	// 以encryptionStore命名存储的localStorage经过secure-ls加密后不能通过localStorage.getItem('encryptionStore')获取,只能通过ls.get('encryptionStore')获取
			// paths: [test2],
			// storage: window.localStorage,
			// 以下使用secure-ls加密
			storage: {
				getItem: function(key) {ls.get(key)} ,
				setItem: function(key, value) {ls.set(key, value)},
				removeItem: function(key) {ls.remove(key)},
			},
			reducer(val) {
				console.log("createPersistedState:" + JSON.stringify(val));
				console.log("val.isLogin:" + val.test2.isLogin);
				return {
					/** 只储存state中test2的isLogin字段 */
					test2: {
						//  val表示整个vuex数据外层
						//  test2表示当前vuex模块
						//  isLogin表示当前vuex模块的state数据
						isLogin: val.test2.isLogin
					}
				}
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