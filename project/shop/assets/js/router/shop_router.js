// const User = Vue.extend({
 
// 	template: '<div>User {{ $route.params.id }}</div>',
 
// });
const routers2 = [
          {
            path: '/shop_settlement',
            name: 'shop_settlement',
            meta:{
				title: '确认订单',
				auth: true,
				requireAuth: true // 添加需要权限的标记
            },
            component:  httpVueLoader('../components/shop_settlement.vue')
          },
        ]
const routers3 = [
          {
            path: '/shop_payment',
            name: 'shop_payment',
            meta:{
				title: '订单支付',
				auth: true,
				requireAuth: true // 添加需要权限的标记
            },
            component:  httpVueLoader('../components/shop_payment.vue')
          },
        ]
var shop_router = new VueRouter({
	routes : [
		{ // 配置默认路由
			path:"/", // 路由地址
			redirect:"/login" // 重定向
		},
		{
			path: '/login', //路由显示
			name: 'login',
			component: httpVueLoader('../components/shop_login.vue') //此路径为:引用本js文件的,html页面与此组件的相对路径
			// props: true
		},
		{
			path: '/index1', //路由显示
			name: 'index1',
			component: httpVueLoader('../../666/components/index/index1.vue') //此路径为:引用本js文件的,html页面与此组件的相对路径
			// props: true
		},
		{
			path: '/user', //路由显示
			name: 'user',
			meta:{
				title: '购物车',
				auth: true,	// 设置当前路由需要校验,不需要校验的路由就不用写
				requireAuth: true // 添加需要权限的标记
			},
			component: httpVueLoader('../../666/components/index/User.vue'),
			beforeRouteEnter: function(to, from, next) {
			  // 注意,在路由进入之前,组件实例还未渲染,所以无法获取this实例,只能通过_eventHub（store里定义）来访问组件实例
			  next();
			},
			beforeRouteUpdate: function(to, from, next) {
			  // 同一页面,刷新不同数据时调用
			  next();
			},
			beforeRouteLeave: function(to, from, next) {
			  // 离开当前路由页面时调用
			  next();
			},
			children: routers2
		},
		{
			path: '/home', //路由显示
			name: 'home',
			component: httpVueLoader('../components/shop_home.vue')
		},
		{
			path: '/classify', //路由显示
			name: 'classify',
			component: httpVueLoader('../components/shop_classify.vue')
		},
		{
			path: '/cart', //路由显示
			name: 'cart',
			component: httpVueLoader('../components/shop_cart.vue')
		},
		{
			path: '/mine', //路由显示
			name: 'mine',
			component: httpVueLoader('../components/shop_mine.vue')
		},
		// {
			// path: '/',
			// name: 'index',
			// components: { //引用对应组件(懒加载)
			// 	index111 : httpVueLoader('components/index/index1.vue'), //此路径为:引用本js文件的,html页面与此组件的相对路径
			// 	index222 : httpVueLoader('components/index/index2.vue'),
			// 	User111 : httpVueLoader('components/index/User.vue')
			// }
		// },
		{
			path: '*',
			component: httpVueLoader('../components/public/NotFound.vue')
		},
	],
	mode:'hash',	// history or hash
	base:'/'
	
	
});

//在路由跳转前触发
shop_router.beforeEach(function(to, from, next) {
  // const isLogin = window.localStorage.getItem('main'); //获取本地存储的登陆信息
  const isLogin = _eventHub.$options.methods.StorageAPI_getUser(); //获取本地存储的登陆信息
  // var from = "";
  console.log("isLogin:" + isLogin)
  console.log("to:" + to.name) //进入到哪个路由去
  console.log("from:" + JSON.stringify(from)) //从哪个路由离开
  //next:路由的控制参数,常用的有next(true)和next(false)
  //next() 直接进to 所指路由
  //next('route') 跳转指定路由
  if (to.meta.auth) {//判断当前页面是否为拦截页面 如果是的话:
      if (isLogin) {  //判断是否登陆
        next();  //已登录,跳转首页
      } else {
        next({name:'login'});  //没登录,继续进入login页
      }
    }else{//如果不是要拦截页面,就放行。
      next();
    }
 
});

//在组件被解析后
shop_router.beforeResolve(function(to, from, next) {next();});

//在跳转之后判断
shop_router.afterEach(function(to, from) {});