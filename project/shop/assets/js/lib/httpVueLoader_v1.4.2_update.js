/**
 * 重写XmlHttpRequest
 * ios下读取本地文件
 * 
 * 引用
   var oxhr = jQuery.ajaxSettings.xhr;  
    var plusXhr = function() {  
         try {  
            return new plus.net.XMLHttpRequest();  
        } catch ( e ) {}  
    };  

    var myXhr = function() {  
        try {  
            return new MyXmlHttpRequest();  
        } catch ( e ) {}  
    };  

    jQuery.ajaxSettings.xhr = plusXhr; //默认使用plus的XMLHttpRequest  

    var _ajax = $.ajax;  
    $.ajax = function(url, options) {//重写ajax方法  
        var urlx = url;  
        if (typeof url === 'object' && url !== null) {  
            urlx = url.url;  
        }  

        if (urlx.indexOf('http') !== 0) {  
            jQuery.ajaxSettings.xhr = myXhr; //本地文件，file协议或相对路径时使用本地xhr  
        } else {  
           jQuery.ajaxSettings.xhr = plusXhr; //还原成plus自带的  
       }  
        return _ajax(url, options);  
    }
 */
(function() {

    function MyXmlHttpRequest() {
        this._listeners = [];
    }
    
    MyXmlHttpRequest.UNSENT            = 0;
    MyXmlHttpRequest.OPENED            = 1;
    MyXmlHttpRequest.HEADERS_RECEIVED  = 2;
    MyXmlHttpRequest.LOADING           = 3;
    MyXmlHttpRequest.DONE              = 4;

    // Interface level constants
    MyXmlHttpRequest.prototype.UNSENT            = MyXmlHttpRequest.UNSENT;
    MyXmlHttpRequest.prototype.OPENED            = MyXmlHttpRequest.OPENED;
    MyXmlHttpRequest.prototype.HEADERS_RECEIVED  = MyXmlHttpRequest.HEADERS_RECEIVED;
    MyXmlHttpRequest.prototype.LOADING           = MyXmlHttpRequest.LOADING;
    MyXmlHttpRequest.prototype.DONE              = MyXmlHttpRequest.DONE;

    // Public Properties
    MyXmlHttpRequest.prototype.readyState    = MyXmlHttpRequest.UNSENT;
    MyXmlHttpRequest.prototype.responseText  = '';
    MyXmlHttpRequest.prototype.responseXML   = null;
    MyXmlHttpRequest.prototype.status        = 0;
    MyXmlHttpRequest.prototype.statusText    = '';

    // Priority proposal
    MyXmlHttpRequest.prototype.priority    = "NORMAL";

    MyXmlHttpRequest.prototype.method = '';
    MyXmlHttpRequest.prototype.url = '';
    MyXmlHttpRequest.prototype.async = true;
    MyXmlHttpRequest.prototype.user = '';
    MyXmlHttpRequest.prototype.password = '';

    // Instance-level Events Handlers
    MyXmlHttpRequest.prototype.onreadystatechange  = null;

    // Class-level Events Handlers
    MyXmlHttpRequest.onreadystatechange  = null;
    MyXmlHttpRequest.onopen              = null;
    MyXmlHttpRequest.onsend              = null;
    MyXmlHttpRequest.onabort             = null;
    MyXmlHttpRequest.onload              = null;
    MyXmlHttpRequest.onerror             = null;

    // Public Methods
    MyXmlHttpRequest.prototype.open  = function(sMethod, sUrl, bAsync, sUser, sPassword) {
        // http://www.w3.org/TR/XMLHttpRequest/#the-open-method
        var sLowerCaseMethod = sMethod.toLowerCase();
        if (sLowerCaseMethod === "connect" || sLowerCaseMethod === "trace" || sLowerCaseMethod === "track") {
            throw new Error(18);
        }

        delete this._headers;

        this.method   = sMethod;
        this.url      = sUrl;
        this.async    = bAsync;
        this.user     = sUser;
        this.password = sPassword;

        if (MyXmlHttpRequest.onopen) {
            MyXmlHttpRequest.onopen.apply(this, arguments);
        }

        this.readyState = MyXmlHttpRequest.OPENED;
        fReadyStateChange(this);
    };

    MyXmlHttpRequest.prototype.send = function(vData) {
        // Add method sniffer
        if (MyXmlHttpRequest.onsend) {
            MyXmlHttpRequest.onsend.apply(this, arguments);
        }

        if (!arguments.length) {
            vData = null;
        }

        if (vData && vData.nodeType) {
            vData = window.XMLSerializer ? new window.XMLSerializer().serializeToString(vData) : vData.xml;
            if (!this._headers["Content-Type"]) {
                this.setRequestHeader("Content-Type", "application/xml");
            }
        }

        this._data = vData;

        fXMLHttpRequest_send(this);
    };

    MyXmlHttpRequest.prototype.abort = function() {
        if (MyXmlHttpRequest.onabort) {
            MyXmlHttpRequest.onabort.apply(this, arguments);
        }

        if (this.readyState > MyXmlHttpRequest.UNSENT) {
            this._aborted = true;
        }

        fCleanTransport(this);

        this.readyState = MyXmlHttpRequest.UNSENT;
        delete this._data;
    };

    MyXmlHttpRequest.prototype.getAllResponseHeaders = function() {
        return null;
    };

    MyXmlHttpRequest.prototype.getResponseHeader = function(sName) {
        return null;
    };

    MyXmlHttpRequest.prototype.setRequestHeader  = function(sName, sValue) {
        if (!this._headers) {
            this._headers = {};
        }

        this._headers[sName]  = sValue;
    };

    MyXmlHttpRequest.prototype.addEventListener  = function(sName, fHandler, bUseCapture) {
        for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++) {
            if (oListener[0] === sName && oListener[1] === fHandler && oListener[2] === bUseCapture) {
                return;
            }
        }

        // Add listener
        this._listeners.push([sName, fHandler, bUseCapture]);
    };

    MyXmlHttpRequest.prototype.removeEventListener = function(sName, fHandler, bUseCapture) {
        for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++) {
            if (oListener[0] === sName && oListener[1] === fHandler && oListener[2] === bUseCapture) {
                break;
            }
        }

        // Remove listener
        if (oListener) {
            this._listeners.splice(nIndex, 1);
        }
    };

    MyXmlHttpRequest.prototype.dispatchEvent = function(oEvent) {
        var oEventPseudo  = {
            'type':             oEvent.type,
            'target':           this,
            'currentTarget':    this,
            'eventPhase':       2,
            'bubbles':          oEvent.bubbles,
            'cancelable':       oEvent.cancelable,
            'timeStamp':        oEvent.timeStamp,
            'stopPropagation':  function() {},  // There is no flow
            'preventDefault':   function() {},  // There is no default action
            'initEvent':        function() {}   // Original event object should be initialized
        };

        // Execute onreadystatechange
        if (oEventPseudo.type === "readystatechange" && this.onreadystatechange) {
            (this.onreadystatechange.handleEvent || this.onreadystatechange).apply(this, [oEventPseudo]);
        }


        // Execute listeners
        for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++) {
            if (oListener[0] === oEventPseudo.type && !oListener[2]) {
                (oListener[1].handleEvent || oListener[1]).apply(this, [oEventPseudo]);
            }
        }

    };

    MyXmlHttpRequest.prototype.toString  = function() {
        return '[' + "object" + ' ' + "MyXmlHttpRequest" + ']';
    };

    MyXmlHttpRequest.toString  = function() {
        return '[' + "MyXmlHttpRequest" + ']';
    };

    MyXmlHttpRequest.prototype.fChangeValues = function(responseText, responseXML, status, statusText) {
        this.responseText = responseText;
        this.responseXML  = responseXML;
        this.status       = status;
        this.statusText   = statusText;
    }

    // Helper function
    function fXMLHttpRequest_send(oRequest) {
        oRequest.readyState = MyXmlHttpRequest.OPENED;
        plus.io.resolveLocalFileSystemURL(oRequest.url, function(entry) {
            entry.file( function(file) {
                console.log("getFile: " + JSON.stringify(file));

                var fileReader = new plus.io.FileReader();
                fileReader.readAsText(file, 'utf-8');
                fileReader.onloadend = function(evt) {
                    //console.log("evt.target.result: " + evt.target.result);
                    
                    oRequest.readyState = 4;
                    var responseText = evt.target.result;
                    var parser = new DOMParser();
                    var responseXML = parser.parseFromString(responseText, 'text/xml');
                    //console.log('responseText: ' + responseText);
                    oRequest.fChangeValues(responseText, responseXML, 200, 'success');
                    if (oRequest.onload) {
                        console.log('xmlhttprequest callback onload');
                        oRequest.onload();
                    }
                    fReadyStateChange(oRequest);
                }
            });
            
        }, function (e) {
            console.log("Resolve file URL failed: " + e.message);
            
            oRequest.readyState = 4;
            oRequest.fChangeValues('', null, 404, 'error');

            if (oRequest.onerror) {
                console.log('xmlhttprequest callback onerror');
                oRequest.onerror();
            }

            fReadyStateChange(oRequest);
        }); 
    }

    function fReadyStateChange(oRequest) {
        // Sniffing code
        if (MyXmlHttpRequest.onreadystatechange){
            MyXmlHttpRequest.onreadystatechange.apply(oRequest);
        }

        // Fake event
        oRequest.dispatchEvent({
            'type':       "readystatechange",
            'bubbles':    false,
            'cancelable': false,
            'timeStamp':  new Date().getTime()
        });
    }

    function fCleanTransport(oRequest) {
        //
    }

    if (!window.Function.prototype.apply) {
        window.Function.prototype.apply = function(oRequest, oArguments) {
            if (!oArguments) {
                oArguments  = [];
            }
            oRequest.__func = this;
            oRequest.__func(oArguments[0], oArguments[1], oArguments[2], oArguments[3], oArguments[4]);
            delete oRequest.__func;
        };
    }

    window.MyXmlHttpRequest = MyXmlHttpRequest;

})();



/**
 * 判断当前设备类型
 */
var browser = {
		versions: function() {
			var u = navigator.userAgent,
				app = navigator.appVersion;
			return {
				trident: u.indexOf('Trident') > -1, //IE内核
				presto: u.indexOf('Presto') > -1, //opera内核
				webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
				gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, //火狐内核
				mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
				ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
				android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
				iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
				iPad: u.indexOf('iPad') > -1, //是否iPad
				webApp: u.indexOf('Safari') === -1 //是否web应该程序，没有头部与底部
			};
		}(),
		language: (navigator.browserLanguage || navigator.language).toLowerCase()
	}
	if (browser.versions.mobile) { //判断是否是移动设备打开。browser代码在下面
		// alert(111)
	} else {
		// alert(222)
	}
var os = function (){ 
　　var ua = navigator.userAgent, 
　　isWindowsPhone = /(?:Windows Phone)/.test(ua), 
　　isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone, 
　　isAndroid = /(?:Android)/.test(ua), 
　　isFireFox = /(?:Firefox)/.test(ua), 
　　isChrome = /(?:Chrome|CriOS)/.test(ua), 
　　isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)), 
　　isPhone = /(?:iPhone)/.test(ua) && !isTablet, 
　　isPc = !isPhone && !isAndroid && !isSymbian; 
　　return { 
　　　　isTablet: isTablet, 
　　　　isPhone: isPhone, 
　　　　isAndroid: isAndroid, 
　　　　isPc: isPc 
　　}; 
}();

// window.Promise = ES6Promise.Promise;
// alert(Promise.toString().indexOf("[native code]"));

//原著:Copyright (c) 2017 Franck Freiburger
//https://github.com/FranckFreiburger/http-vue-loader
//https://www.npmjs.com/package/http-vue-loader

(function umd(root,factory){
	if(typeof module==='object' && typeof exports === 'object' )
		module.exports=factory()
	else if(typeof define==='function' && define.amd)
		define([],factory)
	else
		root.httpVueLoader=factory()
})(this,function factory() {
	'use strict';

	var scopeIndex = 0;

	StyleContext.prototype = {

		withBase: function(callback) {

			var tmpBaseElt;
			if ( this.component.baseURI ) {

				// firefox and chrome need the <base> to be set while inserting or modifying <style> in a document.
				tmpBaseElt = document.createElement('base');
				tmpBaseElt.href = this.component.baseURI;

				var headElt = this.component.getHead();
				headElt.insertBefore(tmpBaseElt, headElt.firstChild);
			}

			callback.call(this);

			if ( tmpBaseElt )
				this.component.getHead().removeChild(tmpBaseElt);
		},

		scopeStyles: function(styleElt, scopeName) {

			function process() {

				var sheet = styleElt.sheet;
				var rules = sheet.cssRules;

				for ( var i = 0; i < rules.length; ++i ) {

					var rule = rules[i];
					if ( rule.type !== 1 )
						continue;

					var scopedSelectors = [];

					rule.selectorText.split(/\s*,\s*/).forEach(function(sel) {

						scopedSelectors.push(scopeName+' '+sel);
						var segments = sel.match(/([^ :]+)(.+)?/);
						scopedSelectors.push(segments[1] + scopeName + (segments[2]||''));
					});

					var scopedRule = scopedSelectors.join(',') + rule.cssText.substr(rule.selectorText.length);
					sheet.deleteRule(i);
					sheet.insertRule(scopedRule, i);
				}
			}

			try {
				// firefox may fail sheet.cssRules with InvalidAccessError
				process();
			} catch (ex) {

				if ( ex instanceof DOMException && ex.code === DOMException.INVALID_ACCESS_ERR ) {

					styleElt.sheet.disabled = true;
					styleElt.addEventListener('load', function onStyleLoaded() {

						styleElt.removeEventListener('load', onStyleLoaded);

						// firefox need this timeout otherwise we have to use document.importNode(style, true)
						setTimeout(function() {

							process();
							styleElt.sheet.disabled = false;
						});
					});
					return;
				}

				throw ex;
			}
		},

		compile: function() {

			var hasTemplate = this.template !== null;

			var scoped = this.elt.hasAttribute('scoped');

			if ( scoped ) {

				// no template, no scopable style needed
				if ( !hasTemplate )
					return;

				// firefox does not tolerate this attribute
				this.elt.removeAttribute('scoped');
			}

			this.withBase(function() {

				this.component.getHead().appendChild(this.elt);
			});

			if ( scoped )
				this.scopeStyles(this.elt, '['+this.component.getScopeId()+']');

			return Promise.resolve();
		},

		getContent: function() {

			return this.elt.textContent;
		},

		setContent: function(content) {

			this.withBase(function() {

				this.elt.textContent = content;
			});
		}
	};

	function StyleContext(component, elt) {

		this.component = component;
		this.elt = elt;
	}


	ScriptContext.prototype = {

		getContent: function() {

			return this.elt.textContent;
		},

		setContent: function(content) {

			this.elt.textContent = content;
		},

		compile: function(module) {

			var childModuleRequire = function(childURL) {

				return httpVueLoader.require(resolveURL(this.component.baseURI, childURL));
			}.bind(this);

			var childLoader = function(childURL, childName) {

				return httpVueLoader(resolveURL(this.component.baseURI, childURL), childName);
			}.bind(this);

			try {
				Function('exports', 'require', 'httpVueLoader', 'module', this.getContent()).call(this.module.exports, this.module.exports, childModuleRequire, childLoader, this.module);
			} catch(ex) {

				if ( !('lineNumber' in ex) ) {

					return Promise.reject(ex);
				}
				var vueFileData = responseText.replace(/\r?\n/g, '\n');
				var lineNumber = vueFileData.substr(0, vueFileData.indexOf(script)).split('\n').length + ex.lineNumber - 1;
				throw new (ex.constructor)(ex.message, url, lineNumber);
			}

			return Promise.resolve(this.module.exports)
			.then(httpVueLoader.scriptExportsHandler.bind(this))
			.then(function(exports) {

				this.module.exports = exports;
			}.bind(this));
		}
	};

	function ScriptContext(component, elt) {

		this.component = component;
		this.elt = elt;
		this.module = { exports:{} };
	}


	TemplateContext.prototype = {

		getContent: function() {

			return this.elt.innerHTML;
		},

		setContent: function(content) {

			this.elt.innerHTML = content;
		},

		getRootElt: function() {

			var tplElt = this.elt.content || this.elt;

			if ( 'firstElementChild' in tplElt )
				return tplElt.firstElementChild;

			for ( tplElt = tplElt.firstChild; tplElt !== null; tplElt = tplElt.nextSibling )
				if ( tplElt.nodeType === Node.ELEMENT_NODE )
					return tplElt;

			return null;
		},

		compile: function() {

			return Promise.resolve();
		}
	};

	function TemplateContext(component, elt) {

		this.component = component;
		this.elt = elt;
	}



	Component.prototype = {

		getHead: function() {

			return document.head || document.getElementsByTagName('head')[0];
		},

		getScopeId: function() {

			if ( this._scopeId === '' ) {

				this._scopeId = 'data-s-' + (scopeIndex++).toString(36);
				this.template.getRootElt().setAttribute(this._scopeId, '');
			}
			return this._scopeId;
		},

		load: function(componentURL) {
			var vueContent = ''
			if (componentURL.indexOf('<template') !== -1 ||
				componentURL.indexOf('<script') !== -1) {
				vueContent = componentURL
			}
			
			return (vueContent ? Promise.resolve(vueContent) : httpVueLoader.httpRequest(componentURL))
			// return httpVueLoader.httpRequest(componentURL)
			.then(function(responseText) {

				this.baseURI = componentURL.substr(0, componentURL.lastIndexOf('/')+1);
				var doc = document.implementation.createHTMLDocument('');

				// IE requires the <base> to come with <style>
				doc.body.innerHTML = (this.baseURI ? '<base href="'+this.baseURI+'">' : '') + responseText;

				for ( var it = doc.body.firstChild; it; it = it.nextSibling ) {

					switch ( it.nodeName ) {
						case 'TEMPLATE':
							this.template = new TemplateContext(this, it);
							break;
						case 'SCRIPT':
							this.script = new ScriptContext(this, it);
							break;
						case 'STYLE':
							this.styles.push(new StyleContext(this, it));
							break;
					}
				}

				return this;
			}.bind(this));
		},

		_normalizeSection: function(eltCx) {

			var p;

			if ( eltCx === null || !eltCx.elt.hasAttribute('src') ) {

				p = Promise.resolve(null);
			} else {

				p = httpVueLoader.httpRequest(eltCx.elt.getAttribute('src'))
				.then(function(content) {

					eltCx.elt.removeAttribute('src');
					return content;
				});
			}

			return p
			.then(function(content) {

				if ( eltCx !== null && eltCx.elt.hasAttribute('lang') ) {

					var lang = eltCx.elt.getAttribute('lang');
					eltCx.elt.removeAttribute('lang');
					return httpVueLoader.langProcessor[lang.toLowerCase()].call(this, content === null ? eltCx.getContent() : content);
				}
				return content;
			}.bind(this))
			.then(function(content) {

				if ( content !== null )
					eltCx.setContent(content);
			});
		},

		normalize: function() {

			return Promise.all(Array.prototype.concat(
				this._normalizeSection(this.template),
				this._normalizeSection(this.script),
				this.styles.map(this._normalizeSection)
			))
			.then(function() {

				return this;
			}.bind(this));
		},

		compile: function() {

			return Promise.all(Array.prototype.concat(
				this.template && this.template.compile(),
				this.script && this.script.compile(),
				this.styles.map(function(style) { return style.compile(); })
			))
			.then(function() {

				return this;
			}.bind(this));
		}
	};

	function Component(name) {

		this.name = name;
		this.template = null;
		this.script = null;
		this.styles = [];
		this._scopeId = '';
	}

	function identity(value) {

		return value;
	}

	function parseComponentURL(url) {

		var comp = url.match(/(.*?)([^/]+?)\/?(\.vue)?(\?.*|#.*|$)/);
		return {
			name: comp[2],
			url: comp[1] + comp[2] + (comp[3] === undefined ? '/index.vue' : comp[3]) + comp[4]
		};
	}

	function resolveURL(baseURL, url) {

		if (url.substr(0, 2) === './' || url.substr(0, 3) === '../') {
			return baseURL + url;
		}
		return url;
	}


	httpVueLoader.load = function(url, name) {

		return function() {

			return new Component(name).load(url)
			.then(function(component) {

				return component.normalize();
			})
			.then(function(component) {

				return component.compile();
			})
			.then(function(component) {

				var exports = component.script !== null ? component.script.module.exports : {};

				if ( component.template !== null )
					exports.template = component.template.getContent();

				if ( exports.name === undefined )
					if ( component.name !== undefined )
						exports.name = component.name;

				exports._baseURI = component.baseURI;

				return exports;
			});
		};
	};


	httpVueLoader.register = function(Vue, url) {

		var comp = parseComponentURL(url);
		Vue.component(comp.name, httpVueLoader.load(comp.url));
	};

	httpVueLoader.install = function(Vue) {

		Vue.mixin({

			beforeCreate: function () {

				var components = this.$options.components;

				for ( var componentName in components ) {

					if ( typeof(components[componentName]) === 'string' && components[componentName].substr(0, 4) === 'url:' ) {

						var comp = parseComponentURL(components[componentName].substr(4));

						var componentURL = ('_baseURI' in this.$options) ? resolveURL(this.$options._baseURI, comp.url) : comp.url;

						if ( isNaN(componentName) )
							components[componentName] = httpVueLoader.load(componentURL, componentName);
						else
							components[componentName] = Vue.component(comp.name, httpVueLoader.load(componentURL, comp.name));
					}
				}
			}
		});
	};

	httpVueLoader.require = function(moduleName) {

		return window[moduleName];
	};

	httpVueLoader.httpRequest = function(url) {

		// return new Promise(function(resolve, reject) {
		
			if (os.isPhone || os.isTablet) { //WKWebview认为本地html通过js访问网络及本地文件都算跨域访问，ajax也不能访问本地文件，需使用5+ API（plus.io）读取本地文件
				// if(window.plus){alert("iPhone or pad_window.plus")};
			　　console.log("iPhone or pad" ); 
				
				return new Promise(function(resolve, reject) {
					
					// IOS 可以正常请求
					// var xhr = new plus.net.XMLHttpRequest();
					var xhr = new MyXmlHttpRequest();
					// IOS 转换本地绝对路径, 安卓 加上file:// 等协议, 或者跟$.ajax 一样,使用相对路径都会崩溃
					// mui.plusReady(function() {alert("mui_window.plus");});
					
					if(window.plus){
					    // 在这里调用5+ API
						// var path = plus.io.convertLocalFileSystemURL("file:" + url);
						// var path = plus.io.convertLocalFileSystemURL("_www/" + url);
						// var path = plus.io.convertLocalFileSystemURL(url);
						// var path = plus.io.convertLocalFileSystemURL("file:" + url).replace('','');
						// var path = plus.io.resolveLocalFileSystemURL("file:" + url);
					}else{// 兼容老版本的plusready事件
					    document.addEventListener('plusready',function () {
					        // 在这里调用5+ API
							// var path = plus.io.convertLocalFileSystemURL("file:" + url);
							// var path = plus.io.convertLocalFileSystemURL("_www/" + url);
							// var path = plus.io.convertLocalFileSystemURL(url);
							// var path = plus.io.convertLocalFileSystemURL("file:" + url).replace('','');
							// var path = plus.io.resolveLocalFileSystemURL("file:" + url);
					    },false);
					}
					var path = url;
					console.log(path);
					xhr.open('GET', path);
							xhr.responseType = 'text';
						
					xhr.onreadystatechange = function () {
						switch ( xhr.readyState ) {
							case 0:
								console.log( "xhr请求已初始化" );
							break;
							case 1:
								console.log( "xhr请求已打开" );
							break;
							case 2:
								console.log( "xhr请求已发送" );
							break;
							case 3:
								console.log( "xhr请求已响应");
								break;
							case 4:
								if ( xhr.status >= 200 && xhr.status < 300) {
									// console.log( "xhr请求成功："+xhr.responseText );
									console.log( "xhr请求成功：");
									resolve(xhr.responseText);
									
								} else {
									console.log( "xhr请求失败："+xhr.readyState );
									
									reject(xhr.status);
								}
								break;
							default :
								break;
						}
					}
					try{
						xhr.send(null);
					}catch(e){
						console.log(e);
					}
				}); //return new Promise(function(resolve, reject) {
			} else if(os.isAndroid) {
				// if(window.plus){alert("Android_window.plus")};
				console.log("Android" ); 
				
				return new Promise(function(resolve, reject) {
					
					// Android 可以正常请求
					var xhr = new XMLHttpRequest();
					xhr.open('GET', url);
							xhr.responseType = 'text';
					xhr.onreadystatechange = function () {
						switch ( xhr.readyState ) {
							case 0:
								console.log( "xhr请求已初始化" );
							break;
							case 1:
								console.log( "xhr请求已打开" );
							break;
							case 2:
								console.log( "xhr请求已发送" );
							break;
							case 3:
								console.log( "xhr请求已响应");
								break;
							case 4:
								if ( xhr.status >= 200 && xhr.status < 300) {
									// console.log( "xhr请求成功："+xhr.responseText );
									console.log( "xhr请求成功：");
									resolve(xhr.responseText);
										
								} else {
									console.log( "xhr请求失败："+xhr.readyState );
									
									reject(xhr.status);
								}
								break;
							default :
								break;
						}
						
					}
					try{
						xhr.send(null);
					}catch(e){
						console.log(e);
					}
						
				}); //return new Promise(function(resolve, reject) {
			} else if(os.isPc) {
				
				console.log("pc" ); 
				
				return new Promise(function(resolve, reject) {
					
					// PC 可以正常请求
					var xhr = new XMLHttpRequest();
					xhr.open('GET', url);
							xhr.responseType = 'text';
					xhr.onreadystatechange = function () {
						switch ( xhr.readyState ) {
							case 0:
								console.log( "xhr请求已初始化" );
							break;
							case 1:
								console.log( "xhr请求已打开" );
							break;
							case 2:
								console.log( "xhr请求已发送" );
							break;
							case 3:
								console.log( "xhr请求已响应");
								break;
							case 4:
								if ( xhr.status >= 200 && xhr.status < 300) {
									// console.log( "xhr请求成功："+xhr.responseText );
									console.log( "xhr请求成功：");
									resolve(xhr.responseText);
										
								} else {
									console.log( "xhr请求失败："+xhr.readyState );
									
									reject(xhr.status);
								}
								break;
							default :
								break;
						}
						
					}
					try{
						xhr.send(null);
					}catch(e){
						console.log(e);
					}
				
				});
			}
			
		// });
	};

	httpVueLoader.langProcessor = {
		html: identity,
		js: identity,
		css: identity
	};

	httpVueLoader.scriptExportsHandler = identity;

	function httpVueLoader(url, name) {

		var comp = parseComponentURL(url);
		return httpVueLoader.load(comp.url, name);
	}

	return httpVueLoader;
});


