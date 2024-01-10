/*
 * 接口封装
 * 
 * 时间：2016-08-11
 * 描述：app公用方法
 */
// if (window.Raven) {Raven.config('https://8e17a7c1ccb44b50991a96e8f56eb8e3@sentry.io/158100').install();}  //收集错误
!(function(mui) {
	'use strict';
	window.app = window.app || {};
	//配置
	app.config = {
		isDebug: true, //是否调试模式，发布时为false（发布时一定要改为false）
		imgDomain: '', //图片资源域名
		apiDomain: 'http://che.ijiashequ.cn:8088/api', //API服务器域名 "http://192.168.0.135:8080/jm_app'; //周旋公司服务
		IMG_IP: 'http://192.168.0.135:8080/sign_image/', //图片服务器路径
		IMG_HZ: '.jpg',
		flag: '9', //app身份标志,代表不同的客户
		dbName: 'comBirdshCheways', //本地存储数据库名称
		SMS: {
			upperlimit: 3, //找回密码短信发送次数上限
			seconds: 60 //发送间隔时间
		},
		alarm: {
			1: '超速报警',
			2: '终端主电源欠压',
			3: '终端主电源掉电',
			4: '移位报警',
			5: '震动报警',
			6: 'SOS报警',
			7: '鞍座报警',
			8: '碰撞告警',
			9: '喇叭告警',
			10: '终端主电源欠压',
			11: '动态侧翻',
			12: '静态侧翻',
			91: '电子围栏报警',
			99: '超级报警',
			100: '失窃报警',
			200: 'APP SOS报警',
		}
	};

	if(app.config.isDebug) {
		app.config.apiDomain = 'http://che.ijiashequ.cn:8010/loveApi';
		//app.config.apiDomain = 'http://che.ijiashequ.cn:8007/loveApi'; //API外网测试
		//app.config.apiDomain = 'http://192.168.33.241:8085/loveApi'; //API内网测试
		//app.config.apiDomain = 'http://192.168.33.81/loveApi'; //API吴长
		//app.config.apiDomain ='http://192.168.33.152:8088/api';//API刘本地
		//app.config.apiDomain ='http://192.168.33.93:8080/api';//API郑本地
		//app.config.apiDomain = 'http://192.168.33.77:8007/loveApi'; //API裴本地公版
		//app.config.apiDomain = 'http://192.168.33.114/api';//谢API本地
		//app.config.apiDomain = 'http://192.168.33.92:8080/api'; //张磊测试
	}
	
	//常用正则表达式
	app.Reg = {};
	app.Reg.MODULE_NAME = /([\w-]+)\.html/; //匹配模块名
	app.Reg.HTTP_URL = /^((https|http)?:\/\/)/; //校验http url
	app.Reg.IS_MOBILE = /^1[3|4|5|7|8]\d{9}$/; //手机号码
	app.Reg.EMAIL = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/; //邮箱
	
	//封装接口
	//所有api接口 http://192.168.33.8:7070/svnpro/weixin/car_guard/doc/车卫士通用版业务接口.doc
	app.api = {
		'getcaruserinfo': app.config.apiDomain + '/carguard/user/getCarUserInfo.php', //?name=030650611(车辆用户信息)
		'updatecaruserinfo': app.config.apiDomain + '/carguard/user/updateCarUserInfo.php', //?id=16775&num=15001914584&name=德忠
		'getcarusermap': app.config.apiDomain + '/carguard/user/getCarUserMapInfo.php', //?name=030619991(首页地理位置+幻灯片宣传信息)
		'getRealTimePosition': app.config.apiDomain + '/cheway/point/getRealTimePosition.php', //?cid=030650611(获取实时位置信息)
		'getcardaydistance': app.config.apiDomain + '/carguard/user/getCarTance.php', //?cid=030619991(今日历程<单位：千米>)
		'getlastwarninfo': app.config.apiDomain + '/carguard/warn/searchLastWarn.php', //?name=030619991(告警记录列表)
		'getwarninfo': app.config.apiDomain + '/carguard/warn/searchWarn.php', //?name=030619991&lastId=11111<告警最大内码>(告警记录列表)
		'setwarninfo': app.config.apiDomain + '/carguard/warn/setCarWarnByHaved.php', //?id=4907999(设置已读的告警记录)
		'getAlertsRecord': app.config.apiDomain + '/cheway/alert/getAlertsRecord.php', //获取一天的告警记录列表
		'saveSuperCare': app.config.apiDomain + '/carguard/other/saveSuperCare.php', //?cid=030619991&val=0<0 撤防 1 设防>(设置超级设防和撤防状态)
		'getSuperCare': app.config.apiDomain + '/carguard/other/getSuperCare.php', //?cid=030619991(獲取超级设防和撤防状态)
		'saveNormalCare': app.config.apiDomain + '/carguard/other/saveNormalCare.php', //?cid=030619991&type=0<0:设防,1:撤防>(设置设防和撤防状态)
		'getNormalCare': app.config.apiDomain + '/carguard/other/getNormalCare.php', //?cid=030619991(獲取设防和撤防状态)
		'getFances': app.config.apiDomain + '/cheway/fances/getFances.php', //根据设备id和类型获取电子围栏信息，参考接口.phpc
		'uadateFances': app.config.apiDomain + '/cheway/fances/saveOrUpdateFances.php', //编辑电子围栏，参考接口.phpc
		'getCarUserAddr': app.config.apiDomain + '/carguard/user/getCarAddrByPosition.php', //?lat=31.2486683708529&lng=121.414342818832
		'getCheList': app.config.apiDomain + '/carguard/user/cheList.php', //?name=上海业务
		// 'updatePassword': app.config.apiDomain + '/carguard/user/updateCarUserInfo.php',

		'validateByCodeForRes': app.config.apiDomain + '/cheway/mobibinding/validateByCodeForRes.php', //判断验证码是否失效信息
		'updateMobiValidateByMobi': app.config.apiDomain + '/cheway/mobibinding/updateMobiValidateByMobi.php', //生成手机验证码信息并验证手机号是否绑定设备
		'validateOper': app.config.apiDomain + '/cheway/device/validateOper.php', //手机激活操作
		'getDevicesByMobi': app.config.apiDomain + '/cheway/mobibinding/getDevicesByMobi.php', //根据手机号获取设备列表
		'updateMobiValidate': app.config.apiDomain + '/cheway/mobibinding/updateMobiValidate.php', //生成手机验证码信息
		'resetDevicePwd': app.config.apiDomain + '/cheway/device/updatePassword.php', //?device=030650637&pwd=1234567//重置密码操作

		'getWeather': app.config.apiDomain + '/cheway/login/getWeather.php', //?cityCode= 获取天气
		'getHomepageInfo': app.config.apiDomain + '/cheway/login/getHomepageInfo.php', //获取首页数据
		'postSafeTcpcmds': app.config.apiDomain + '/cheway/login/postSafeTcpcmds.php', //撤防设防 safeFlag 0表示撤防操作，1表示设防操作

		'getTrackOneDay': app.config.apiDomain + '/cheway/point/getDrivRecordOfOneDay.php', //参考接口文档8.6 根据日期获取某一天的历史轨迹(各条行驶记录)
		'getPointByRecord': app.config.apiDomain + '/cheway/point/getPointInfoByOneDrivRecord.php', //参考接口文档8.7 根据起点时间和终点时间，返回行使记录里详细的坐标点位信息
		'getLastRecord': app.config.apiDomain + '/cheway/point/getLastDrivRecord.php', //参考接口文档8.8 获取最新的行使轨迹
		//我的
		'getUserInfo': app.config.apiDomain + '/cheway/device/getUserInfo.php', //获取个人信息
		'updateInfo': app.config.apiDomain + '/cheway/device/updateInfo.php', //修改个人信息
		'addChewaysFeedbackInfo': app.config.apiDomain + '/cheway/feedback/addChewaysFeedbackInfo.php', //添加意见反馈
		'editPhoto': app.config.apiDomain + '/cheway/login/editPhoto.php', //修改头像
		'update': app.config.apiDomain + '/update/ty/'+localStorage.appId+'.json', //更新信息
		//服务
		'getParamsAll': app.config.apiDomain + '/cheway/params/getParamsAll.php', //获取设备参数
		'getParamsName': app.config.apiDomain + '/cheway/params/getParamsName.php', //获取设备参数
		'postTcpcmds': app.config.apiDomain + '/cheway/tcpcmds/postTcpcmds.php', //下发指令
		'postAndGetTcpcmds': app.config.apiDomain + '/cheway/tcpcmds/postAndGetTcpcmds.php', //下发指令并获取结果
		'getTcpcmds': app.config.apiDomain + '/cheway/tcpcmds/getTcpcmds.php', //根据id获取指令数据
		'getInsuranceinfo': app.config.apiDomain + '/carguard/user/getInsuranceInfo.php', //(获取保险列表信息)
		'getInsuranceDetailInfo': app.config.apiDomain + '/carguard/user/getInsuranceDetailInfo.php', //?insurancesId=10<提供保险id>(获取保险详细信息)		
		'getRepairStationinfo': app.config.apiDomain + '/carguard/user/getRepairStationInfo.php', //?stationFlag=标识 1:维修 2:安装 (不传查全部)&myLat=(传当前设备的纬度)&myLng=(传当前设备的经度) (获取维修站列表信息)

		//驾驶统计
		'getDriverCountNew': app.config.apiDomain + '/cheway/point/getDriverCountNew.php', //(获取保险列表信息)
		'getAppraisals': app.config.apiDomain + '/cheway/point/getAppraisalsTwo.php', //(获取驾驶测评结果)

		//告警记录
		'devicePush': app.config.apiDomain + '/cheway/push/carDevicePush.php',

		//v2
		'newValidate': app.config.apiDomain + '/cheway/device/newValidateOper.php', //管理员激活
		'sosAlert': app.config.apiDomain + '/cheway/alert/sosAlert.php', //sos
		'controlcar': app.config.apiDomain + '/cheway/newCmds/lock.php', //远程控车锁车
		'vibrationalarm': app.config.apiDomain + '/cheway/newCmds/shake.php', //远程控车震动报警
		'oil': app.config.apiDomain + '/cheway/newCmds/gas.php', //远程控车油路
		'getStatus': app.config.apiDomain + '/cheway/newCmds/getStatus.php', //远程初始
		'addMyCollect': app.config.apiDomain + '/cheway/collect/addMyCollect.php', //收藏维修点
		'queryCollectForPage': app.config.apiDomain + '/cheway/collect/queryCollectForPage.php', //查询收藏的维修点
		'deleteMyCollect': app.config.apiDomain + '/cheway/collect/deleteMyCollect.php', //取消收藏维修点
		'getCollectUniId': app.config.apiDomain + '/cheway/collect/getCollectUniIdByDev.php', //获取所有收藏点的id
		'login': app.config.apiDomain + '/cheway/login/setToken.php', //?name=030619991&pwd=123456(登录)
		'mineUpdatePassword': app.config.apiDomain + '/cheway/pwd/update.php', //个人信息修改密码
		'getAlertTypeSpeed': app.config.apiDomain + '/cheway/setalarm/getAlertTypeSpeed.php', //超速报警操作
		'getAlertTypeSpeeds': app.config.apiDomain + '/cheway/setalarm/getAlertTypeSpeeds.php', //显示超速预警操作
		'getDeviceCar': app.config.apiDomain + '/cheway/device/getDeviceCar.php', //获取车辆信息
		'getDevs': app.config.apiDomain + '/cheway/devPhone/getDevs.php', //根据手机号获取全部设备号
		'autoLogin': app.config.apiDomain + '/cheway/login/autoLogin.php', //自动登录接口
		'getValiNumByMobil': app.config.apiDomain + '/cheway/mobibinding/getValiNumByMobil.php', //获取验证码剩余次数
		'sendMobiValidate': app.config.apiDomain + '/cheway/mobibinding/sendMobiValidate.php', //获取验证码
		'mobinding': app.config.apiDomain + '/cheway/mobibinding/mobiPhoneBinding.php', //手机绑定
		'putBgPhoto': app.config.apiDomain + '/cheway/login/putBgPhoto.php', //背景图修改
		'switchDev': app.config.apiDomain + '/cheway/mobibinding/switchDev.php', //根据设备号切换设备
		'getSubDep': app.config.apiDomain + '/cheway/department/getSubDep.php', //根据车队名称获取该组织下的车队集合
		'getSubDepDevices': app.config.apiDomain + '/cheway/department/getSubDepDevices.php', //根据车队名称获取该组织下的车队集合以及设备集合
		'getHabit': app.config.apiDomain + '/cheway/loveCar/getHabit.php', //获得驾驶习惯
		'getLastMileage': app.config.apiDomain + '/cheway/loveCar/getLastMileage.php', //获得最新行程数据
		'getLastAutoTime': app.config.apiDomain + '/cheway/loveCar/getLastAutoTime.php', //获得实时监控数据
		'updatePush': app.config.apiDomain + '/cheway/alert/updatePush.php', //修改报警推送设置
		'getPush': app.config.apiDomain + '/cheway/alert/getPush.php', //获取报警推送设置
		'package': app.config.apiDomain + '/cheway/share/getshareByPlatform.php', //获取分享apk地址
		'decideGetPush': app.config.apiDomain + '/cheway/alert/decideGetPush.php', //判断设备是否有推送设置并修改
		'getCombo': app.config.apiDomain + '/cheway/setMeal/getMeal.php', //获取套餐
		'buildOrder': app.config.apiDomain + '/cheway/setMeal/buildOrder.php', //生成订单
		'online': app.config.apiDomain + '/cheway/online/online.php', //在线统计
		'findOrder': app.config.apiDomain + '/cheway/setMeal/findOrder.php', //获取交易记录
		'updateOrderNumCancle': app.config.apiDomain + '/cheway/setMeal/updateOrderNumCancle.php', //用户取消订单支付
		'saveDownloadMessage': app.config.apiDomain + '/cheway/download/saveDownloadMessage.php', //保存下载量信息
		'activationDate': app.config.apiDomain + '/cheway/login/activationDate.php', //接口试用期信息
		'calibrationMileage': app.config.apiDomain + '/cheway/auto/putAllCourseCount.php', //校准里程
		'famQuestion': app.config.apiDomain + '/cheway/question/queryQuestionForPage.php', //常见问题
		'typeQuestion': app.config.apiDomain + '/cheway/question/getQuestionType.php', //问题类型
		
		//注册
		'phoneRegister': app.config.apiDomain + '/cheway/phone/phoneRegister.php',
		'getVerCode': app.config.apiDomain + '/cheway/phone/getVerCode.php',
		'changePsd': app.config.apiDomain + '/cheway/phone/changePsd.php',

		//我的车库
		'getDeviceCars': app.config.apiDomain + '/cheway/device/getDeviceCars.php',
		'editDevAndPhoto': app.config.apiDomain + '/cheway/phone/editDevAndPhoto.php',
		'bindDevAndPhoto': app.config.apiDomain + '/cheway/phone/bindDevAndPhoto.php',
		
		//忘记密码/设备号
		'getFindPsd': app.config.apiDomain + '/cheway/phone/getFindPsd.php',
		
		//指令相关
		'getStatusThree': app.config.apiDomain + '/cheway/newCmds/getStatusThree.php',  //查询
		'commentTcpcmds': app.config.apiDomain + '/cheway/tcpcmds/commentTcpcmds.php',  //下发
		
		//用户信息
		'putChangePhone': app.config.apiDomain + '/cheway/phone/putChangePhone.php',  //修改绑定手机
		
		//其他
		'selectRoleIdByUserId': app.config.apiDomain + '/selectRoleIdByUserId.php',  //通过用户id查询角色
		'selectMenuByUserId': app.config.apiDomain + '/selectMenuByUserId.php',  //分配用户操作权限
		'sendCallBack': app.config.apiDomain + '/sendCallBack.php',  //待处理回告件
		'receiveSuperviseList': app.config.apiDomain + '/receiveSuperviseList.php',  //接收督办件，待收回告件
		'sendSuperviseList': app.config.apiDomain + '/sendSuperviseList.php',  //查询督办件信息
		'selectObjects': app.config.apiDomain + '/selectObjects.php',  //查询附件信息
		'signSendDocument': app.config.apiDomain + '/signSendDocument.php',  //会议签收
		'fileSendDocument': app.config.apiDomain + '/fileSendDocument.php',  //会议归档
		'signUpSendDocument': app.config.apiDomain + '/signUpSendDocument.php',  //会议报名
		'sendSendDocument': app.config.apiDomain + '/sendSendDocument.php',  //发送会议通知接口
		'issueSend': app.config.apiDomain + '/issueSend.php',  //保存签发会议通知接口
		// 'login': app.config.apiDomain + '/base_login.php',  //登陆接口
		'getTongji': app.config.apiDomain + '/message_getTongji.php',  //获取未读信息数量接口
		'toWorklist': app.config.apiDomain + '/oaMyTask_getResource.php',  //代办事项接口
		'toWorkDetail': app.config.apiDomain + '/selOneTask.php',  //代办事项详情接口
		'outAuditing': app.config.apiDomain + '/outAuditing.php',  //代办事审核签批
		'selectByRoleIdAndNumber': app.config.apiDomain + '/selectByRoleIdAndNumber.php',  //拟办意见权限判断
		'selectByRoleId': app.config.apiDomain + '/selectByRoleId.php',  //代办事审核签批权限判断
		'updateTaskToOver': app.config.apiDomain + '/updateTaskToOver.php',  //代办事办结
		'noticeList': app.config.apiDomain + '/oaPortalNotice_getResource.php',  //公告列表接口
		'noticeDetails': app.config.apiDomain + '/selectOnePortalNotice.php',  //公告详情接口
		'email_1': app.config.apiDomain + '/oaUserMail_getResource.php',  //收件箱接口
		'email_write': app.config.apiDomain + '/insertOaUserMail.php',  //发邮件接口
		'email_save': app.config.apiDomain + '/insertOaMailToSave.php',  //邮件保存至草稿箱
		'email_saveToSend': app.config.apiDomain + '/updateSaveToSend.php',  //草稿箱发送邮件
		'email_saveMail': app.config.apiDomain + '/selectToSave.php',  //草稿箱邮件查询
		'updateSaveToSend': app.config.apiDomain + '/updateSaveToSend.php',  //草稿箱邮件发送
		'email_sendMail': app.config.apiDomain + '/selectOaMailToSend.php',  //发件箱查询
		'email_deleteMail': app.config.apiDomain + '/deleteMail.php',  //删除邮件
		'email_deleteDraftMail': app.config.apiDomain + '/deleteMailByCaoGao.php',  //删除草稿箱邮件
		'email_mailByDelete': app.config.apiDomain + '/selectToMailByDelete.php',  //已收删除
		'email_updateToRead': app.config.apiDomain + '/updateToRead.php',  //修改邮件状态
		'email_oneOaUserMail': app.config.apiDomain + '/selectOneOaUserMail.php',  //查看邮件单条信息
		'officialDocument_publish': app.config.apiDomain + '/insertOaStdOut.php',  //发布公文
		'selectDocNumberByBurauCode': app.config.apiDomain + '/selectDocNumberByBurauCode.php',  //查询发文类型
		'selectDictByDictCode': app.config.apiDomain + '/selectDictByDictCode.php',  //查询紧急程度
		'selectUserByFlowNodeAndTask': app.config.apiDomain + '/selectUserByFlowNodeAndTask.php',  //根据流程节点id查询审批人员信息
		// 'outAuditing': app.config.apiDomain + '/outAuditing.php',  //发文送审单(规范性)签批完成
		'inAuditing': app.config.apiDomain + '/inAuditing.php',  //文电分发处理单签批完成
		'readAuditing': app.config.apiDomain + '/readAuditing.php',  //阅文签签批完成
		/******************************通讯录****************************************/
		'user_selectByDept': app.config.apiDomain + '/selectByDept.php',  //同部门信息
		//'selectByDeptUser': app.config.apiDomain + '/selectByDeptUser.php',  //文通讯录>部门分类
		//'selectBySuperGroupId': app.config.apiDomain + '/selectBySuperGroupId.php',  //文通讯录>部门分类
		'selectAddressListByGroupInfo': app.config.apiDomain + '/selectAddressListByGroupInfo.php',  //文通讯录>部门分类
		'selectAddressListUser': app.config.apiDomain + '/selectAddressListUser.php',  //文通讯录>部门分类>人员列表
		/**************************************************************/
		'selectByOaSendDociment_find': app.config.apiDomain + '/selectByOaSendDociment_find.php',  //发送公文
		'selectCollectNoSign': app.config.apiDomain + '/selectCollectNoSign.php',      //待签收公文
		// 'update_dutybackColSign': app.config.apiDomain + '/update_dutybackColSign.php',             //退回公文
		'OaSendDocimentInfo_find': app.config.apiDomain + '/OaSendDocimentInfo_find.php',  //发送公文>查看详情
		'OaSendDociment_update': app.config.apiDomain + '/OaSendDociment_update.php',  //发送公文>保存公文
		'SuperviseInfo_update': app.config.apiDomain + '/updateDocumentToSend.php',  //发送公文>转办理监督办
		'OaSendDociment_qianfaupdate': app.config.apiDomain + '/OaSendDociment_qianfaupdate.php',  //办理督办件>签发督办件
		'selectBySuperGroupInfo': app.config.apiDomain + '/selectBySuperGroupInfo.php',  //办理督办件>获取机构数据
		'selectByUserGroupInfo': app.config.apiDomain + '/selectByUserGroupInfo.php',  //办理督办件>获取机构数据>机构部门数据
		'UserGroupInfo_update': app.config.apiDomain + '/UserGroupInfo_update.php',  //办理督办件>获取机构数据>机构部门数据>提交
		// 'OaSendDocimentInfo_find': app.config.apiDomain + '/OaSendDocimentInfo_find.php',  //发送督办件>详情页
		'SuperviseInfoSend_update': app.config.apiDomain + '/SuperviseInfoSend_update.php',  //发送督办件>发送
		/*************************会议*****************************/
		'org_getList': app.config.apiDomain + '/selectByGroupId.php', //获取所有部门名称
		'huiyi_insert': app.config.apiDomain + '/insert_oaSendDocument.php', //签发会议
		'huiyishenpi_list': app.config.apiDomain + '/select_collectDocument_userId.php', //获取会议签收数据
		'huiyishenpi_id': app.config.apiDomain + '/select_oacollectId.php', //获取会议签收详细数据
		'selectOneSendDocument': app.config.apiDomain + '/selectOneSendDocument.php', //获取待签发会议详细数据
		'huiyishenpi': app.config.apiDomain + '/update_oacollectState.php', //执行会议签收操作
		'huiyishuliang': app.config.apiDomain + '/select_oacollectCount.php', //获取未签收会议数量
		'huiyibaoming': app.config.apiDomain + '/insert_reply.php', //会议报名
		'huiyiyifa': app.config.apiDomain + '/select_collectDocument_end.php', //获取已发会议
		'selectMeetinngByCondition': app.config.apiDomain + '/selectMeetinngByCondition.php', //会议报名
		/**********************************************************************/
		'send_duty_list': app.config.apiDomain + '/send_duty_list.php',	//发送应急值班
		'update_duty_status': app.config.apiDomain + '/update_duty_status.php',	//更改应急值班状态
		'Info_find_duty': app.config.apiDomain + '/Info_find_duty.php',	//查看应急值班详情
		'update_sendDuty': app.config.apiDomain + '/update_sendDuty.php',	//编辑应急值班详情
		'sendDuty': app.config.apiDomain + '/sendDuty.php',	//发送值班
		'send_reduty_list': app.config.apiDomain + '/send_reduty_list.php',	//待签收应急值班
		'update_dutyColToSign': app.config.apiDomain + '/update_dutyColToSign.php',	//签收公文
		'update_dutybackColSign': app.config.apiDomain + '/update_dutybackColSign.php',	//退回公文
		'select_sendSignBack': app.config.apiDomain + '/select_sendSignBack.php',	//查看公文法发送/签收/退回情况
		'withdrawDuty': app.config.apiDomain + '/withdrawDuty.php',	//撤回公文
		'countDuty': app.config.apiDomain + '/countDuty.php',	//统计公文  
		/************************************************************************/
		'insertGersture': app.config.apiDomain + '/insertGersture.php', //手势新增
		'selectByNameAndNumber': app.config.apiDomain + '/selectByNameAndNumber.php', //手势登录查询
		'deleteByUserId': app.config.apiDomain + '/deleteByUserId.php', //关闭手势   删除
		'updateGesture': app.config.apiDomain + '/updateGesture.php', //更改手势
		'selecGesturetByUserId': app.config.apiDomain + '/selecGesturetByUserId.php', //通过用户id查询手势信息
		'updatePassword': app.config.apiDomain + '/updatePassword.php', //更改密码
		/******************************************************************************/
		'selectAllWorkLog': app.config.apiDomain +'/selectAllWorkLog.php', //分页查看日志信息
		'insertWorkLog': app.config.apiDomain + '/insertWorkLog.php', // 新增日志信息
		'selectByPrimaryKey': app.config.apiDomain + '/selectByPrimaryKey.php', //根据logid查询日志信息
		'updateById': app.config.apiDomain + '/updateById.php', // 修改工作日志
		'deleteByPrimaryKey': app.config.apiDomain + '/deleteByPrimaryKey.php', //删除个人日志
		'document_upload': app.config.apiDomain + '/document_upload.php', // 根据服务器绝对路径 获取 站点路径 用于附件下载 
		'delete_document': app.config.apiDomain + '/delete_document.php', // 删除服务器临时下载文件
		/************************************************************************************/
		'selectByDateAndUserId': app.config.apiDomain + '/selectByDateAndUserId.php', //根据userid查询 日程数据
		'selectSuperior': app.config.apiDomain + '/selectSuperior.php', // 查询所有领导
		'insertOaSuperiorSchedule': app.config.apiDomain + '/insertOaSuperiorSchedule.php', // 新增日程
		'selectAllSuperiorSchedule': app.config.apiDomain + '/selectAllSuperiorSchedule.php', // 按条件查询日程 （维护使用） 
		'deleteSuperiorSchedule': app.config.apiDomain + '/deleteSuperiorSchedule.php', //根据id删除单条日程
		'updateByOaSuperiorSchedule': app.config.apiDomain + '/updateByOaSuperiorSchedule.php', // 修改日程
		/*************************************************************************************/
		'selectAllGovInfo': app.config.apiDomain + '/selectAllGovInfo.php', // 分页 查询 报送信息
		'selectGovInfo': app.config.apiDomain + '/selectGovInfo.php', //根据id查单条报送信息
		'updateSubmit': app.config.apiDomain + '/updateSubmit.php', // 政务信息上报
		'deleteByGovInfoId': app.config.apiDomain + '/deleteByGovInfoId.php', // 按id删除信息报送
		/*****************************************************************************************/
		// 'outAuditing': app.config.apiDomain + '/outAuditing.php', // 发文审批 退回
		'selectAllPublication': app.config.apiDomain + '/selectAllPublication.php', // 分页按条件查询刊物信息
		'updateBySended': app.config.apiDomain + '/updateBySended.php', //修改 （已上报）
		'insertPublication': app.config.apiDomain + '/insertPublication.php', //新增 刊物信息
		'selectPublicationById': app.config.apiDomain + '/selectPublicationById.php', //根据id查单条刊物信息
		'updateByPublication': app.config.apiDomain + '/updateByPublication.php', //修改刊物信息
		'deletePublication': app.config.apiDomain + '/deletePublication.php', //根据id删除刊物信息
		/***********************************************************************/
		'selectDzzwb': app.config.apiDomain + '/selectDzzwb.php', // 查询电子政务办所有人员
		'selOneTask': app.config.apiDomain + '/selOneTask.php', //查询智慧城市建设办公室阅文签
		/***********************************************************************/
		'insertSign': app.config.apiDomain + '/insertSign.php', //考勤签到
		'updateOaFlowTrailById': app.config.apiDomain + '/updateOaFlowTrailById.php', //修改签名的数据
		'selectCollectObject': app.config.apiDomain + '/selectCollectObject.php', //查询文件
		'selectGovInfoObject': app.config.apiDomain + '/selectGovInfoObject.php', //政务信息报送文件查询
		'selectMailObject': app.config.apiDomain + '/selectMailObject.php', //邮件查看附件
		/*************************************************************************/
		'selectCollectNoSignCount': app.config.apiDomain + '/selectCollectNoSignCount.php' // 查询电子公文条数
	};
	
	app.cmds = { //蓝牙指令
		lockCar: 'C9050108000008',
		unlockCar: 'C9050100000008',
		defenceCar: 'C9050101000001',
		undefenceCar: 'C9050100000001',
		accCar: 'C9050120000020',
		unaccCar: 'C9050100000020',
	};
	//若api接口不是以http或者https开头，则拼接配置中的apiDomain为开头
	for(var i in app.api) {
		if(!app.Reg.HTTP_URL.test(app.api[i])) app.api[i] = app.config.apiDomain + app.api[i];
	}
	//假json数据
	//	app.api['validateByCodeForRes']='http://192.168.33.53:8020/cheways_wechat/data/validateByCodeForRes.json';
	//	app.api['getDevicesByMobi']='http://192.168.33.53:8020/cheways_wechat/data/getDevicesByMobi.json';
	var skipAPI = [app.api['login'], app.api['validateOper'], app.api['updateMobiValidateByMobi'], app.api['resetDevicePwd'], app.api.switchDev, app.api.decideGetPush, app.api.newValidate].join(','); //ajax中不传cid参数的api

	/**
	 * 日志打印
	 */
	app.log = function() {
		if(app.config.isDebug && console) {
			for(var key in arguments) {
				if(mui.isObject(arguments[key])) {
					arguments[key] = JSON.stringify(arguments[key]);
				}
			}
			console.log.apply(console, arguments);
		}
	};

	/**
	 * 显示等待框
	 * @param {String} message
	 */
	app.Vwaiting = function(msg){
		var relMsg = msg?msg:''
		if(document.getElementById('loaderWrap')){
		document.getElementById('loaderWrap').style.display = 'block';
		document.querySelector('.msg-font').innerText = relMsg
		return;
		}
		var screen = document.createElement("div");
		screen.id = 'loaderWrap';
		screen.className = 'loader-wrap';
		screen.innerHTML = '<div class="loader-container"><div class="loader"></div><span class="msg-font">'+relMsg+'</span></div>';
		document.body.appendChild(screen);
	}
	app.Cwaiting = function(){
		console.log('进行了:'+document.getElementById('loaderWrap'))
		if(document.getElementById('loaderWrap')){
			document.getElementById('loaderWrap').style.display = 'none'
		}
	}
	app.showWaiting = function(message) {
		if(window.plus) {
			return plus.nativeUI.showWaiting(message || '请稍候...');
		}
	};
	/**
	 * 关闭等待框
	 */
	app.closeWaiting = function(waitingObj) {
		if(window.plus)(waitingObj && waitingObj.close()) || plus.nativeUI.closeWaiting();
	};
	//是否显示加载框，默认不显示
	mui.ajaxSettings.showWaiting = false;
	/**
	 * ajax方法
	 * @param {Object} setting
	 */
	app.ajax = function(setting) {
		var defaultSetting = {
			dataType: setting.dataType || 'json', //服务器返回json格式数据
			type: (setting.url.lastIndexOf('.json') > -1 ? 'get' : (setting.type || 'post')),
			timeout: setting.timeout || 15000, //超时时间设置为15秒；
			async: true,
			showWaiting: setting.showWaiting || false,
			success: function(resp, status, xhr) {
				app.log(/\/([\w\.]+)$/.exec(setting.url)[1] + '返回数据:' + JSON.stringify(resp));
				switch(resp.flag) {
					case '2000':
						mui.isFunction(setting.success) && setting.success(resp.result, resp.message);
						break;
					case '777': //token自动续期
						app.ajax({
							url: app.api['login'],
							data: JSON.parse(localStorage.lastLogin),
							success: function(data) {
								if(data.contents == '3') { //未激活
									localStorage.activateToken = data['access_token'];
									app.closeWaiting();
									mui.confirm('您的设备未激活', '', ['试用', '去激活'], function(e) {
										if(e.index == 0) {
											userLogin(data);
										} else if(e.index == 1) {
											vm.openWindow({ url: '../activate/activate.html', styles: { top: 0 } });
										}
									});
								} else if(data.contents == '4') {
									localStorage.activateToken = data['access_token'];
									app.closeWaiting();
									mui.alert('您的设备未激活', '', '去激活', function(e) {
										if(e.index == 0)
											vm.openWindow({ url: '../activate/activate.html', styles: { top: 0 } });
									});
								} else {
									userLogin(data);
								}

								function userLogin(data) {
									if(localStorage.adminToken != null)
										localStorage.adminToken = data['access_token'];
									else localStorage.token = data['access_token'];
									app.ajax(setting);
								}
							},
							error: function() {
								if (window.plus) mui.fire(plus.webview.getWebviewById('browser_main'), 'logout');
							}
						});
						break;
					case '401':
					case '200':
					case '204':
					case '400':
					case '404':
					case '429':
					case '500':
					default:
						if(resp.message != '访问过于频繁')
							mui.toast(resp.message);
						mui.isFunction(setting.error) && setting.error(resp.result);
						break;
				}
			},
			complete: function(xhr, status) {
				if(setting.showWaiting && setting.closeWaiting != false) {
					app.closeWaiting();
				}
				var resp = xhr.response;
				if(status === 'success' && defaultSetting.dataType.toLowerCase() === 'json') {
					resp = JSON.parse(resp);
				}
				if(typeof setting.complete == 'function') setting.complete(resp);
			},
			error: function(xhr, type, errorThrown) {
				var errorMsg = {
					'timeout': '请求超时，请稍后再试！',
					'error': '未知错误',
					'abort': '网络或服务器已断开',
					'parsererror': '解析错误'
				};
				if(type != 'abort') mui.toast((errorMsg[type] || 'ajax出错了'));
				if(typeof setting.error == 'function') setting.error(xhr, type, errorThrown);
			}
		};
		setting.beforeSend && (defaultSetting.beforeSend = setting.beforeSend);
		defaultSetting.data = setting.data || {};

		if(setting.url && skipAPI.indexOf(setting.url) == -1 && !defaultSetting.data.cid) {
			var user = app.getUser();
			user && (defaultSetting.data.cid = user.uid);
		}
		for (var i in defaultSetting.data) {
			if (defaultSetting.data[i]==null) delete defaultSetting.data[i];
		}
		defaultSetting.headers = {
			flag: app.config.flag,
		};
		if(localStorage.adminToken != null) {
			defaultSetting.headers.token = localStorage.adminToken;
		} else if(localStorage.token != null) {
			defaultSetting.headers.token = localStorage.token;
		}
		if(setting.headers) mui.extend(true, defaultSetting.headers, setting.headers);
		if(setting.showWaiting) app.showWaiting(typeof setting.showWaiting === 'string' ? setting.showWaiting : undefined);
		app.log('token:' + defaultSetting.headers.token);
		app.log('正在请求api:' + setting.url);
		app.log('发送数据:' + JSON.stringify(defaultSetting.data));
		mui.ajax(setting.url, defaultSetting);
	};

	/**
	 * 退出登录
	 */
	app.loginOut = function() {
		localStorage.removeItem('userData');
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		localStorage.removeItem('encrypt');
		localStorage.removeItem('avatarCache');
		localStorage.removeItem('homeCache');
		localStorage.removeItem('encrypt');
		localStorage.removeItem('adminToken');
		localStorage.removeItem('activateToken');
		localStorage.removeItem('lastCheckPay');
		mui.openWindow({
			url: '../login/login.html',
			id: 'login',
			styles: {
				'popGesture': 'none'
			}
		});
		//location.href = '../login/login.html';
		//mui.back();
	};
	app.hasNoDev = function() {  //是否未绑定车辆
		return app.getUser().role && !app.getUser().uid;
	}
	/**
	 * 获取User
	 */
	app.getUser = function() {
		return JSON.parse(localStorage.user || '{}');
	};

	/**
	 * 传入设备号,返回设置(不传入时默认获取)
	 * @param {String} uid
	 */
	app.getConfig = function(uid) {
		uid = (uid ? uid : app.getUser().uid);
		//var _Config = window.plus ? plus.storage.getItem("appConfig") : localStorage.appConfig,
		var _Config = window.plus ? plus.storage.getItem("appConfig") : localStorage.appConfig,
			defaultConfig = {
				"refresh_interval": "60",
				"alert_msg": {
					count: 0,
					data: {}
				},
				"wavealert_msg": []
			};
		if(!_Config) return defaultConfig;
		else {
			_Config = JSON.parse(decodeURIComponent(_Config));
			return _Config[uid] || defaultConfig;
		}
	}
	/**
	 * 传入设备号和设置对象,持久化到本地(可只传入设置对象)
	 * @param {String} uid
	 * @param {Object} config
	 */
	app.setConfig = function() {
		var uid = arguments[0],
			config = arguments[1];
		if(typeof uid === "object") {
			config = uid;
			uid = app.getUser().uid;
		}
		var _temp = app.getAllConfig();
		_temp[uid] = config;
		// window.plus ? plus.storage.setItem("appConfig", encodeURIComponent(JSON.stringify(_temp))) : (localStorage.appConfig = encodeURIComponent(JSON.stringify(_temp)));
		//window.plus ? plus.storage.setItem("appConfig", encodeURIComponent(JSON.stringify(_temp))) : (localStorage.appConfig = encodeURIComponent(JSON.stringify(_temp)));
	};
	app.getAllConfig = function() {
		var _AllConfig = plus.storage.getItem("appConfig");
		return _AllConfig ? JSON.parse(decodeURIComponent(_AllConfig)) : {};
	};
	/**
	 * 获取user头像src
	 */
	app.getUserIcon = function() {
		return localStorage.getItem('userIcon');
	};
	/**
	 * 设置user头像src
	 */
	app.setUserIcon = function(newIcon) {
		// localStorage.setItem('userIcon', newIcon);
	};
	//将Date转为日期字符串
	app.getDateString = function(d) {
		var month = String(d.getMonth() + 1);
		if(month.length == 1) month = '0' + month;
		var dt = String(d.getDate());
		if(dt.length == 1) dt = '0' + dt;
		return d.getFullYear() + '-' + month + '-' + dt;
	}
	//绑定pagebeforeshow事件（浏览器、app通用）
	app.pageBeforeShow = function(f) {
		if(mui.os.plus) {
			window.addEventListener('pagebeforeshow', f);
		} else {
			f();
		}
	}
	//仅当支持蓝牙并已连接时返回true，否则提示并返回false
	//noToast: 为true时禁用提示
	app.testBle = function(noToast) {
		if (localStorage.hasBle == 'false') {
			if (!noToast) mui.toast('您的设备不支持蓝牙');
			return false;
		} else if (localStorage.bleStatus == '4') {
			return true;
		} else {
			if (!noToast) mui.toast('蓝牙未成功连接');
			return false;
		}
	}
	//通过蓝牙发送数据给设备
	app.sendBle = function(s) {
		mui.fire(plus.webview.all()[0], 'bleSend', s);
	}

	Date.prototype.format = function(format) {
		var o = {
			'M+': this.getMonth() + 1, //month
			'd+': this.getDate(), //day
			'h+': this.getHours(), //hour
			'H+': this.getHours(), //hour
			'm+': this.getMinutes(), //minute
			's+': this.getSeconds(), //second
			'q+': Math.floor((this.getMonth() + 3) / 3), //quarter
			'S': this.getMilliseconds() //millisecond
		};
		if(/(y+)/.test(format)) format = format.replace(RegExp.$1,
			(this.getFullYear() + '').substr(4 - RegExp.$1.length));
		for(var k in o)
			if(new RegExp('(' + k + ')').test(format))
				format = format.replace(RegExp.$1,
					RegExp.$1.length == 1 ? o[k] :
					('00' + o[k]).substr(('' + o[k]).length));
		return format;
	};
	//方便读取配置
	Object.defineProperty(window, 'lsConfig', {
		get: function() {
			return JSON.parse(localStorage.config||'{}');
		}
	});

	if(typeof Vue !== 'undefined') {
		//Vue.config.debug = app.config.isDebug || false;
		Vue.prototype.openWindow = function(options) {
			if(typeof options == 'string') options = { url: options };
			if(!options || !options.url) {
				mui.alert('敬请期待');
				return;
			}
			//外部页面使用内置浏览器打开
			if(app.Reg.HTTP_URL.test(options.url)) {
				var browserMainWebview = plus.webview.getWebviewById('browser_main');
				var browserWebview = plus.webview.getWebviewById('browser');
				mui.fire(browserMainWebview, 'pagebeforeshow');
				browserWebview.loadURL(options.url);
				browserMainWebview.show('slide-in-bottom', 400);
				return;
			}
			if (app.hasNoDev() && options.url.indexOf('my-cars')==-1 && options.url.indexOf('edit-car')==-1 && options.url.indexOf('about')==-1 && options.url.indexOf('user-agreement')==-1) {  //未绑定车辆的用户
				mui.alert('请先绑定车辆');
				return;
			}
			options.styles = mui.extend({
				'popGesture': 'none',
				'top': parseFloat(localStorage.immersed),
				'bottom': 0,
			}, options.styles);
			options.id = options.id || options.url.match(app.Reg.MODULE_NAME)[1];
			options.show = {
				aniShow: 'slide-in-right'
			}
			console.log(JSON.stringify(options));
			mui.openWindow(options);
		}
		//获取数字的小数部分(两位)
		Vue.prototype.toFrac = function(d) {
			var f = d * 100 % 100;
			if(f < 10) return '.0' + f;
			else return '.' + f;
		}
		Vue.prototype.openModule = function(m) {
			Vue.prototype.openWindow({url: '../'+m+'/'+m+'.html'});
		}
	}

	//解决低端安卓mui-btn的视觉反馈会延迟300ms
	Vue.component('fast-button', {
		props: ['id', 'disabled', 'tap'],
		template: '<button :id="id||\'id\'+Math.floor(Math.random()*1000)" :disabled="disabled" @tap="tap" @touchstart="ts" @touchend="te" @touchcancel="te" class="mui-btn mui-btn-primary mui-btn-block"><slot></slot></button>',
		methods: {
			ts: function(e) {
				e.currentTarget.classList.add('mui-active');
			},
			te: function(e) {
				var t = e.currentTarget;
				setTimeout(function() {
					t.classList.remove('mui-active');
				}, 100);
			}
		}
	});
	//公共头部
	Vue.component('app-header', {
		template: '<header class="mui-bar mui-bar-nav"><a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a><h1 class="mui-title"><slot></slot></h1></header>',
	});
})(mui);
/**
 * 构造新用户
 * @param {string} uid 设备号
 * @param {string} role 普通用户为nomal,管理员为admin
 */
window.User = function (uid, role, clink) {
	this.uid = uid;
	this.role = role || 'normal';
	this.clink = clink || '';
}
User.prototype.toString = function() {
	return JSON.stringify(this);
}
//信鸽推送