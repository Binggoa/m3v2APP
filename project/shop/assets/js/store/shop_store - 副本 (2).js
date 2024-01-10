/**

 * 初始化secure-ls加密缓存

 */

var secure_ls = new SecureLS({

	encodingType: 'aes', // 加密类型 base64（默认） / aes / des / rabbit / rc4 /

	isCompression: false,

	encryptionSecret: 's3cr3t$@1' // PBKDF2值

});

/**

 * test1

 * 此model不缓存

 */

const test1 = {

	namespaced: true,

	state: {

	},

	mutations: {

	},

	actions: {

	},

	getters: {

	},

};



/**

 * test2

 * 此model使用缓存

 */

const test2 = {

	namespaced: true,

	strict: true, // 开启严格模式,无论何时发生了状态变更且不是由 mutation 函数引起的,将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到。

	state: {

		isLogin: 0, // 是否登录 0为未登录,1为已登录

		loginstate: 0, // 登录状态:0为离线,1为在线,2为隐身......

		userInfo: {}, // 用户信息

		isRemember: 0, // 是否记住密码 0为不记住,1为已记住

		LoginName: {}, // 登录账户名

		Password: {}, // 登录账户密码

	},

	mutations: { // 显式的更改state里的数据,逻辑处理,但Mutation 必须是同步函数

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

		setLoginState: function(state, opt) {

			for (var i in state) {

				console.log("state[i]:" + i)

				for (var [key, val] of Object.entries(opt)) {

					console.log("state.${key}:" + `state.${key}`);

					if (i == `${key}`) {

						console.log("传入的变量如果在State里已定义则set新值")

						state[key] = val;

					}

				}

			}

		},

		/**

		* 批量把缓存更新到State

		* @param {Object} state

		* @param {Object} value

		*/

		updateLoginState: function(state, value) {

			// 获取State里所有的全局变量

			for (var i in state) {

				// console.log('key:' + i + '  value:' + JSON.stringify(state[i]) );

				// 获取所有vuex-persistedstate缓存的键值

				for (var j in value) {

					// console.log('key:' + i + '  value:' + JSON.stringify(value[j]) );

					// 把State里所有的全局变量的值全部更新为vuex-persistedstate缓存的值

					// console.log("i:" + i + "  j:" +j)

					if (i == j) {

						state[i] = value[j]

					}

				}

			}

		}

	},

	actions: {

		updateLoginState: function({
			commit
		}) {

			// 获取vuex-persistedstate缓存的State全局变量及对应的值

			let lsStatus = JSON.parse(secure_ls.get('encryptionStore_shopStore_test2'));

			// 先判断非空

			if (lsStatus) {

				commit('updateLoginState', lsStatus);

			} else { // 缓存被清理，提示登录过期，从服务器重新获取用户信息

				alert("登录过期，请重新登录！");

			}

		}

	},

	getters: { // 获取数据的方法,针对state数据的过滤,getters 只会依赖 state 中的成员去更新

		getLoginState: function(state) {

			//返回一个函数用于接收传进来的参数

			return function(key) {

				// console.log(JSON.stringify(key));

				// 判断非空

				if (key) {

					for (var i in state) {

						console.log("[i]:" + i)

						console.log("state[i]:" + state[i]);

						if (i == key) {

							console.log("传入的变量如果在State里已定义则get变量的值")

							return state[key];

						} else {

							console.log("传入的变量未在State里定义")

						}

					}

				} else {

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

	state: { // 声明全局变量

	},

	mutations: { // 显式的更改state里的数据,逻辑处理,但Mutation 必须是同步函数

		// 调用Mutation中的方法：

		// this.$store.commit('mutation函数名',发送到mutation中的数据/参数);

	},

	actions: { //Action 类似于 mutation,Action 提交的是 mutation,而不是直接变更状态;Action 可以包含任意异步操作.

		// 如果不使用命名空间,那么view 指向actions 的该方法时,会执行所有与指定action名相同的函数（即:这里module A,B 中该action都会执行）

		// 调用action中的方法：

		// this.$store.dispatch('action中的函数名',发送到action中的数据/参数);

	},

	getters: { // 获取数据的方法,针对state数据的过滤,getters 只会依赖 state 中的成员去更新



	},

	modules: {

		// 这里的路径名: test1, test2, 在view 中 通过 mapActions('test1', [actionName]) 使用并区分需要使用的module

		test1, // 数据仓库1（不缓存）

		test2 // 数据仓库2（缓存）

	},

	plugins: [

		createPersistedState({

			// 存储数据的键名，通过localStorage.getItem('key名')获取

			// 经过secure-ls加密后不能通过localStorage.getItem('key名')获取,只能通过secure_ls.get('key名')获取

			key: 'encryptionStore_shopStore_test2',

			// 存储方式：localStorage、sessionStorage、cookies，如果不写默认存储到localStorage

			storage: {

				// 以下使用secure-ls加密

				getItem: function(key) {
					secure_ls.get(key)
				},

				setItem: function(key, value) {
					secure_ls.set(key, value)
				},

				removeItem: function(key) {
					secure_ls.remove(key)
				},

			},

			// 要储存的数据

			reducer(val) {

				// return val	// 全部缓存

				return val.test2 // 缓存modules的test2模块中state全部字段

				// return {

				// /** 只储存modules的test2模块中state的isLogin、userInfo字段 */

				// test2: {

				// //  val表示整个vuex数据外层

				// //  test2表示当前vuex模块

				// //  isLogin、userInfo...表示当前vuex模块的state数据

				// isLogin: val.test2.isLogin,

				// userInfo: val.test2.userInfo,

				// isRemember: val.test2.isRemember,

				// LoginName: val.test2.LoginName,

				// Password: val.test2.Password

				// }

				// }

			}

		})

	]

});
/**

 * 初始化secure-ls加密缓存

 */

var secure_ls = new SecureLS({

	encodingType: 'aes', // 加密类型 base64（默认） / aes / des / rabbit / rc4 /

	isCompression: false,

	encryptionSecret: 's3cr3t$@1' // PBKDF2值

});

/**

 * test1

 * 此model不缓存

 */

const test1 = {

	namespaced: true,

	state: {

	},

	mutations: {

	},

	actions: {

	},

	getters: {

	},

};



/**

 * test2

 * 此model使用缓存

 */

const test2 = {

	namespaced: true,

	strict: true, // 开启严格模式,无论何时发生了状态变更且不是由 mutation 函数引起的,将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到。

	state: {

		isLogin: 0, // 是否登录 0为未登录,1为已登录

		loginstate: 0, // 登录状态:0为离线,1为在线,2为隐身......

		userInfo: {}, // 用户信息

		isRemember: 0, // 是否记住密码 0为不记住,1为已记住

		LoginName: {}, // 登录账户名

		Password: {}, // 登录账户密码

	},

	mutations: { // 显式的更改state里的数据,逻辑处理,但Mutation 必须是同步函数

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

		setLoginState: function(state, opt) {

			for (var i in state) {

				console.log("state[i]:" + i)

				for (var [key, val] of Object.entries(opt)) {

					console.log("state.${key}:" + `state.${key}`);

					if (i == `${key}`) {

						console.log("传入的变量如果在State里已定义则set新值")

						state[key] = val;

					}

				}

			}

		},

		/**

		* 批量把缓存更新到State

		* @param {Object} state

		* @param {Object} value

		*/

		updateLoginState: function(state, value) {

			// 获取State里所有的全局变量

			for (var i in state) {

				// console.log('key:' + i + '  value:' + JSON.stringify(state[i]) );

				// 获取所有vuex-persistedstate缓存的键值

				for (var j in value) {

					// console.log('key:' + i + '  value:' + JSON.stringify(value[j]) );

					// 把State里所有的全局变量的值全部更新为vuex-persistedstate缓存的值

					// console.log("i:" + i + "  j:" +j)

					if (i == j) {

						state[i] = value[j]

					}

				}

			}

		}

	},

	actions: {

		updateLoginState: function({
			commit
		}) {

			// 获取vuex-persistedstate缓存的State全局变量及对应的值

			let lsStatus = JSON.parse(secure_ls.get('encryptionStore_shopStore_test2'));

			// 先判断非空

			if (lsStatus) {

				commit('updateLoginState', lsStatus);

			} else { // 缓存被清理，提示登录过期，从服务器重新获取用户信息

				alert("登录过期，请重新登录！");

			}

		}

	},

	getters: { // 获取数据的方法,针对state数据的过滤,getters 只会依赖 state 中的成员去更新

		getLoginState: function(state) {

			//返回一个函数用于接收传进来的参数

			return function(key) {

				// console.log(JSON.stringify(key));

				// 判断非空

				if (key) {

					for (var i in state) {

						console.log("[i]:" + i)

						console.log("state[i]:" + state[i]);

						if (i == key) {

							console.log("传入的变量如果在State里已定义则get变量的值")

							return state[key];

						} else {

							console.log("传入的变量未在State里定义")

						}

					}

				} else {

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

	state: { // 声明全局变量

	},

	mutations: { // 显式的更改state里的数据,逻辑处理,但Mutation 必须是同步函数

		// 调用Mutation中的方法：

		// this.$store.commit('mutation函数名',发送到mutation中的数据/参数);

	},

	actions: { //Action 类似于 mutation,Action 提交的是 mutation,而不是直接变更状态;Action 可以包含任意异步操作.

		// 如果不使用命名空间,那么view 指向actions 的该方法时,会执行所有与指定action名相同的函数（即:这里module A,B 中该action都会执行）

		// 调用action中的方法：

		// this.$store.dispatch('action中的函数名',发送到action中的数据/参数);

	},

	getters: { // 获取数据的方法,针对state数据的过滤,getters 只会依赖 state 中的成员去更新



	},

	modules: {

		// 这里的路径名: test1, test2, 在view 中 通过 mapActions('test1', [actionName]) 使用并区分需要使用的module

		test1, // 数据仓库1（不缓存）

		test2 // 数据仓库2（缓存）

	},

	plugins: [

		createPersistedState({

			// 存储数据的键名，通过localStorage.getItem('key名')获取

			// 经过secure-ls加密后不能通过localStorage.getItem('key名')获取,只能通过secure_ls.get('key名')获取

			key: 'encryptionStore_shopStore_test2',

			// 存储方式：localStorage、sessionStorage、cookies，如果不写默认存储到localStorage

			storage: {

				// 以下使用secure-ls加密

				getItem: function(key) {
					secure_ls.get(key)
				},

				setItem: function(key, value) {
					secure_ls.set(key, value)
				},

				removeItem: function(key) {
					secure_ls.remove(key)
				},

			},

			// 要储存的数据

			reducer(val) {

				// return val	// 全部缓存

				return val.test2 // 缓存modules的test2模块中state全部字段

				// return {

				// /** 只储存modules的test2模块中state的isLogin、userInfo字段 */

				// test2: {

				// //  val表示整个vuex数据外层

				// //  test2表示当前vuex模块

				// //  isLogin、userInfo...表示当前vuex模块的state数据

				// isLogin: val.test2.isLogin,

				// userInfo: val.test2.userInfo,

				// isRemember: val.test2.isRemember,

				// LoginName: val.test2.LoginName,

				// Password: val.test2.Password

				// }

				// }

			}

		})

	]

});
