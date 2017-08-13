// OMApp
// Version: 2.0.0

/* OMAppPage 页面类型枚举定义 */
if (!window.OMAppPage) {
	var _OMAppPage = (function() {
	    var _object = {};
		Object.defineProperties(_object, {
			mall: 			{ get: function() { return "mall";			} },
			task: 			{ get: function() { return "task";			} },
			newsList: 		{ get: function() { return "newsList";		} },
			newsDetail: 	{ get: function() { return "newsDetail";	} },
			videoList: 		{ get: function() { return "videoList";		} },
			videoDetail: 	{ get: function() { return "videoDetail";	} }                  
		});
		return _object;
	})();
	Object.defineProperties(window, {
		OMAppPage: { get: function() { return _OMAppPage; } }
	});
	if ("function"==typeof define && define.amd) {
		define("OMAppPage",[],function(){
			return window.OMAppPage;
		});
	}
}

/* OMAppUserType 用户类型枚举定义 */
if (!window.OMAppUserType) {
	var _OMAppUserType = (function() {
	    var _object = {};
		Object.defineProperties(_object, {
			visitor: 	{ get: function() { return "visitor"; 	} },
			google: 	{ get: function() { return "google";	} },
			facebook: 	{ get: function() { return "facebook";	} },
			twitter: 	{ get: function() { return "twitter";	} }                 
		});
		return _object;
	})();
	Object.defineProperties(window, {
		OMAppUserType: { get: function() {return _OMAppUserType;} }
	});
	if ("function"==typeof define && define.amd) {
		define("OMAppUserType",[],function(){
			return window.OMAppUserType;
		});
	}
};


/* OMAppTheme 主题类型枚举定义 */
if (!window.OMAppTheme) {
	var _OMAppTheme = (function(){
		var _object = {};
		Object.defineProperties(_object, {
			day: 	{ get: function() { return "day"; 	} },
			night: 	{ get: function() { return "night";	} }                  
		});
		return _object;
	})();
	Object.defineProperties(window, {
		OMAppTheme: { get: function() {return _OMAppTheme;} }
	});
	if ("function"==typeof define && define.amd) {
		define("OMAppTheme",[],function(){
			return window.OMAppTheme;
		});
	}
};

/* OMAppNetworkType 网路类型 */
if (!window.OMAppNetworkType) {
	var _OMAppNetworkType = (function(){
		var _OMAppNetworkTypeObject = {};
		Object.defineProperties(_OMAppNetworkTypeObject, {
			none: 			{ get: function() { return "none"; 			} },
			WiFi: 			{ get: function() { return "WiFi";			} },
			WWan2G: 		{ get: function() { return "2G";			} },
			WWan3G: 		{ get: function() { return "3G";			} },
			WWan4G: 		{ get: function() { return "4G";			} },
			unknown: 		{ get: function() { return "unknown";		} } 
		});
		return _OMAppNetworkTypeObject;
	})();
	Object.defineProperties(window, {
		OMAppNetworkType: { get: function() {return _OMAppNetworkType;} }
	});
	if ("function"==typeof define && define.amd) {
		define("OMAppNetworkType",[],function(){
			return window.OMAppNetworkType;
		});
	}
};


/* omApp 接口定义 */
if (!window.omApp) {
	var _omApp = (function() {
		var _omAppObject = {};

		var _isApp = /Onemena/.test(window.navigator.userAgent);

		// 在控制台打印方法废弃的消息。
		function _deprecate(oldMethod, newMethod) {
			console.log("[OMApp] " + oldMethod + " 已废弃，请使用 " + newMethod + " 代替！");
		}

		// _callbackManager 负责管理所有回调函数。
		// 主要方法: 
		// - 1，push 保存一个回调函数并返回其ID。
		// - 2，pop 通过 ID 取出一个回调函数。
		var _callbackManager = (function(){
			var _store 	= {}; // 所有已保存的回调
			var _id 	= 0;

			function _push(callback) {
				_id += 1;
				var callbackID = "om_" + _id;
				_store[callbackID] = callback;
				return callbackID;
			}

			function _pop(callbackID) {
				var callback = _store[callbackID];
				_store[callbackID] = null;
				return callback;
			}

			var _callbackManagerObject = {};
			Object.defineProperties(_callbackManagerObject, {
				push: { get: function() { return _push; } },
				pop:  { get: function() { return _pop;  } }
			});
			return _callbackManagerObject;
		})();

		// _OMAppMessage 定义了所有消息类型。
		var _OMAppMessage = {
			documentIsReady: "documentisready",
			navigation: {
				pop: 	"navigation.pop",
				popTo: 	"navigation.popto",
				push: 	"navigation.push",
				bar: 	"navigation.bar"
			},
			open: 				"open",
			login: 				"login",
			currentTheme: 		"currenttheme",
			http: 				"http",
			alert: 				"alert",
			analytics: {
				track: "analytics.track"
			}			
		};

		// 向 App 发送消息：（消息类型，消息参数，回调）。
		function _OMAppMessageSend(message, parameters, callback) {
	        if (!message) { return; }
	        var url = 'app://' + message;
	        
	        var query = null; // ? 以后的部分，不包括 ?
	        var callbackID = null;
	        if (callback) {
	        	callbackID = _callbackManager.push(callback);
		        query = "callbackID=" + callbackID;
	        }

	        // value 不能为空。
	        function toQueryValue(value) {
	        	if (typeof value == 'string') {
	        		return value;
	        	} else if (typeof value == 'object') {
	        		return JSON.stringify(value);
	        	}
	        	return value.toString();
	        }

	        for (key in parameters) {
	        	var value = parameters[key];
	        	var string = key;
	        	if (value) {
	        		string = key + "=" + toQueryValue(value);
	        	}
	        	if (query) {
	        		query = query + "&" + string;
	        	} else {
	        		query = string;
	        	}
	        }

	        if (query) {
	        	url += ("?" + query)
	        }

	        var iframe = document.createElement('iframe');
	        iframe.style.display = 'none';
	        iframe.setAttribute('src', url);
	        document.body.appendChild(iframe);
	        setTimeout(function() {
	        	document.body.removeChild(iframe);
	        }, 1000);

	        return callbackID;
	    }

	 	// 0.0 _readyHandlers，数组。用于保存 omApp.ready 方法传递的所有函数，并且在 app ready 后依次执行。
	 	var _readyHandlers = null;
	 	function _addReadyHander(callback) {
	 		if (typeof callback != 'function') { 
	 			return; 
	 		}
	 		// 如果文档已加载，异步执行。
 			if (document.readyState === 'complete') {
 				setTimeout(callback);
			} else {
				if (!_readyHandlers) {
					_readyHandlers = [callback];
				} else {
					_readyHandlers.push(callback);
				}
			}
	 	}
	 	Object.defineProperty(_omAppObject, 'ready', {
	 		get: function() { 
	 			return _addReadyHander;
	 		}
	 	});

		// 0.1
	 	var _isReady = false; // 标识 omApp 是否初始化完成
	 	Object.defineProperty(_omAppObject, 'isReady', { 
	 		get: function() { return _isReady; },
	 	});

	 	// 0.2 向 App 发送消息，HTML 页面准备完成，可以初始化 omApp 对象了。
	 	function _documentIsReady() {
	 		if (omApp.isReady) { return; };
	 		if (!_isApp) {
	 			setTimeout(omApp.didFinishLoading());
	 			return;
	 		};
	 		_OMAppMessageSend(_OMAppMessage.documentIsReady, null, null);
	 	}
	 	Object.defineProperty(_omAppObject, 'documentIsReady', { get: function() { return _documentIsReady; }});

	 	// 0.3 App 在完成初始化 omApp 后调用此方法，告诉 HTML 初始化已完成。
	 	function _didFinishLoading() {
	 		if (!_readyHandlers) {
	 			console.log('[OMApp] 为了保证 omApp 在使用时已完成初始化，请将操作放在 omApp.ready(function(){/*代码*/}) 中。'); 
	 			return;
	 		};
	 		for (var i = _readyHandlers.length - 1; i >= 0; i--) {
	 			(_readyHandlers.pop())();
	 		};
	 		_isReady = true;
	 	}
	 	Object.defineProperty(_omAppObject, 'didFinishLoading', { get: function() { return _didFinishLoading; }});

		// 1.1 HTML 调用原生的登录。
		function _login(callback) {
			if (!_isApp) {
				setTimeout(callback(confirm('点击按钮确定登陆！ \n[确定] -> 登录成功 \n[取消] -> 登录失败')));
				return;
			}
			return _OMAppMessageSend(_OMAppMessage.login, null, callback);
		}
		Object.defineProperty(_omAppObject, 'login', { get: function() { return _login; }});

		// 1.2 原生通知JS登录已完成。
		function _didFinishLogin(callbackID, success) {
		 	var callback = _callbackManager.pop(callbackID);
		 	if (callback) {
		 		callback(success);
		 	}
		}
	 	Object.defineProperty(_omAppObject, 'didFinishLogin', { get: function() { return _didFinishLogin; }});

		// 2. 打开指定页面(页面名称，参数)
		function _open(page, parameters) {
			if (!_isApp) {
				window.open(page + "[" + parameters + "]");
				return;
			}
			var param = { "page": page };
			if (parameters) { param.parameters = parameters; }
			return _OMAppMessageSend(_OMAppMessage.open, param);
		}
		Object.defineProperty(_omAppObject, 'open', { get: function() { return _open; }});

		// 3. navigation
		var _navigation = (function() {
			// 3.1 进入下级页面。
			var _push = function (url, animated) {
				// 不是以 http、https 开头的，被视作为相对路径。
	   			if (url.search(/(http|https|file):\/\//i) != 0) {
	   				url = window.location.protocol + "//" + window.location.host + url;
	   			}
	   			if (!_isApp) {
					window.location.href = url;
					return;
				}
				if (typeof animated != 'boolean') {
					animated = true;
				};
	   		 	return _OMAppMessageSend(_OMAppMessage.navigation.push, {"url": url, "animated": animated});
			}

			// 3.2 推出当前页面，使栈内页面数量 -1。
			var _pop = function (animated) {
				if (!_isApp) {
					window.history.back();
					return;
				};
				if (typeof animated != 'boolean') {
					animated = true;
				};
				return _OMAppMessageSend(_OMAppMessage.navigation.pop, {"animated": animated});
			}

			// 3.3 移除栈内索引大于 index 的所有页面，即将 index 页面所显示的内容展示出来。
			var _popTo = function (index, animated) {
				if (!_isApp) {
					var i = index - window.history.length + 1;
					window.history.go(i);
					return;
				};
				if (typeof animated != 'boolean') {
					animated = true;
				};
				return _OMAppMessageSend(_OMAppMessage.navigation.popTo, {"index": index, "animated": animated});
			}

			// 3.4 Bar
			var _bar = (function() {
				var _title			 = "Onemena";
				var _titleColor		 = "#000000";
				var _backgroundColor = "#FFFFFF";
				var _isHidden		 = false;

				var _navigationBarObject = {};
				Object.defineProperties(_navigationBarObject, {
					title: {
						get: function() { return _title; },
						set: function(newValue) { _title = newValue; _OMAppMessageSend(_OMAppMessage.navigation.bar, {"title": newValue}); }
					},
					titleColor: {
						get: function() { return _titleColor; },
						set: function(newValue) { _titleColor = newValue; _OMAppMessageSend(_OMAppMessage.navigation.bar, {"titleColor": newValue}) }
					},
					backgroundColor: {
						get: function() { return _backgroundColor; },
						set: function(newValue) { _backgroundColor = newValue; _OMAppMessageSend(_OMAppMessage.navigation.bar, {"backgroundColor": newValue})}
					},
					isHidden: {
						get: function() { return _isHidden; },
						set: function(newValue) { _isHidden = newValue; _OMAppMessageSend(_OMAppMessage.navigation.bar, {"isHidden": newValue}) }
					}
				});
				return _navigationBarObject;
			})();

			var _navigationObject = {};
			Object.defineProperties(_navigationObject, {
				push:	{ get: function() { return _push; 	} },
				pop: 	{ get: function() { return _pop; 	} },
				popTo: 	{ get: function() { return _popTo; 	} },
				bar: 	{ get: function() { return _bar; 	} }
			});
			return _navigationObject;
		})();
		Object.defineProperty(_omAppObject, 'navigation', { get: function() { return _navigation; }});

		// 4. currentTheme
		var _currentTheme = OMAppTheme.day;
		Object.defineProperties(_omAppObject, {
			currentTheme: {
				get: function() { 
					return _currentTheme; 
				},
				set: function(newValue) {
					_currentTheme = newValue;
					_OMAppMessageSend(_OMAppMessage.currentTheme, {"name": newValue});
				}
			},
			theme: {
				get: function() {
					_deprecate("omApp.theme", "omApp.currentTheme");
					return window.omApp.currentTheme;
				},
				set: function(newValue) {
					_deprecate("omApp.theme", "omApp.currentTheme");
					window.omApp.currentTheme = newValue;
				}
			}
		});

		// 5. analytics 统计 

		var _analytics = (function() {
			function _track(event, parameters) {
				return _OMAppMessageSend(_OMAppMessage.analytics.track, {"event": event, "parameters": parameters}, null);
			}

			var _analyticsObject = {};
			Object.defineProperty(_analyticsObject, 'track', { get: function() { return _track; }});
			return _analyticsObject;
		})();
		Object.defineProperty(_omAppObject, 'analytics', { get: function() { return _analytics; }});

		// 6. 当前用户
		var _currentUser = (function() {
			var _id   = "0";
			var _name = "None";
			var _type = OMAppUserType.visitor;
			var _coin = 0;
			var _token = "";
			
			var _currentUserObject = {};
			Object.defineProperties(_currentUserObject, {
				isOnline: {
					get: function () {
						return (_type != OMAppUserType.visitor)
					}
				},
				id: {
					get: function() { return _id; },
					set: function(newValue) { _id = newValue; }
				},
				name: {
					get: function() { return _name; },
					set: function(newValue) { _name = newValue; }
				},
				type: {
					get: function() { return _type; },
					set: function(newValue) { _type = newValue; }
				},
				coin: {
					get: function() { return _coin; },
					set: function(newValue) { _coin = newValue; }
				},
				token: {
					get: function() { return _token; },
					set: function(newValue) { _token = newValue; }
				}
			});
			return _currentUserObject;
		})();
		Object.defineProperty(_omAppObject, 'currentUser', { get: function() { return _currentUser; }});

		// 7.1 HTTP
		Object.defineProperty(_omAppObject, 'http', { get: function() { return omApp.network.http; }});	

	 	// 7.2 HTTP 回调 （回调函数ID，是否成功，数据（Base64字符串），数据类型）
		function _didFinishHTTPRequest(callbackID, success, result, contentType) {
			var callback = _callbackManager.pop(callbackID);
			if (!callback) { return; };
			if (result) {
				result = decodeURIComponent(result);
				if (/json/.test(contentType)) {
					result = JSON.parse(result);
				}
			}
			callback(success, result);
		}
	 	Object.defineProperty(_omAppObject, 'didFinishHTTPRequest', { get: function() { return _didFinishHTTPRequest; }});

	 	// 8.1 alert
		function _alert(message, callback) {
			if (!_isApp) {
				setTimeout(function(){
					window.alert('title: ' + message.title + "\nbody: "+ message.body + "\nactions:" + message.actions);
					callback(-1);
				}, 100);
				return;
			};
			return _OMAppMessageSend(_OMAppMessage.alert, {"message": message}, callback);
		}
		Object.defineProperty(_omAppObject, 'alert', { get: function() { return _alert; }});

		// 8.2
		function _didSelectAlertActionAtIndex(callbackID, index) {
			var callback = _callbackManager.pop(callbackID);
			if (callback) {
				callback(index);
			}
		}
	 	Object.defineProperty(_omAppObject, 'didSelectAlertActionAtIndex', { get: function() { return _didSelectAlertActionAtIndex; }});

	 	// 9. 网络状态
	 	var _network = (function() {
	 		var _networkObject = {};
	 		var _type = OMAppNetworkType.unknown;
	 		var _networkObject = {};
	 	 	var _ajaxSettings = {
	 			headers: {},
	 			data: {}
	 		};

	 		var _ajax =	function(request, callback) {
	 	    	var xmlhttp = new XMLHttpRequest();
				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState != 4) {
						return;
					}
					var contentType = xmlhttp.getResponseHeader("Content-Type");
					var success = (xmlhttp.status == 200);
					var result = xmlhttp.responseText;
					if (result) {
						result = encodeURIComponent(result);
					};
					callback(success, result, contentType);
				}
				xmlhttp.open(request.method, request.url, true);
				
				// 设置 Headers
				if (_ajaxSettings && _ajaxSettings.headers) { 
					for (key in _ajaxSettings.headers) {
						xmlhttp.setRequestHeader(key, _ajaxSettings.headers[key]);
					}
				}
				if (request.headers) {
					for (key in request.headers) {
						xmlhttp.setRequestHeader(key, request.headers[key]);
					}
				}
				
				if(request.method=="POST"){  
					xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded; charset=UTF-8");  
				}

				function addObjectToXHRData(orgData, anObject) {
					if (!anObject) { return orgData; }
					for (key in _ajaxSettings.orgData) {
						var str = (key + "=" + encodeURIComponent(anObject[key]));
						if (orgData) { orgData = (orgData + "&" + str); } else { orgData = str; }
					}
					return orgData;
				}

				var data = null;
				if (request.data) {
					data = addObjectToXHRData(data, request.data);
					if (_ajaxSettings && _ajaxSettings.data) {
						var anObject = {};
						for (key in _ajaxSettings.data) {
							if (!request.data[key]) { anObject[key] = _ajaxSettings.data[key];}
						}
						data = addObjectToXHRData(data, anObject);
					}
				} else if (_ajaxSettings) {
					data = addObjectToXHRData(data, _ajaxSettings.data)
				}
				xmlhttp.send(data);
	 		}

	 		function _http(request, callback) {
				if (request.params && !request.data) {
					_deprecate("omApp.http 参数字段 request.params", "request.data");
					request.data = request.params;
				};
				if (!_isApp) {
					var callbackID = _callbackManager.push(callback);
					_ajax(request, function(success, result, contentType) {
						omApp.didFinishHTTPRequest(callbackID, success, result, contentType);
					});
					return;
				};
		        return _OMAppMessageSend(_OMAppMessage.http, {"request": request}, callback);
			}

	 		Object.defineProperties(_networkObject, {
				type: {
					get: function() { return _type; },
		 			set: function(newValue) { _type = newValue; }
				},
				isReachable: {
					get: function() { return (_type != OMAppNetworkType.none); }
				},
				isViaWiFi: {
					get: function() { return (_type == OMAppNetworkType.WiFi); }
				},
				ajax: {
					get: function() { return _ajax; }
				},
				ajaxSettings: {
					get: function() { return function(newValue) { _ajaxSettings = newValue; } }
				},
				http: {
					get: function() { return _http; }
				}
			});
	 		return _networkObject;
	 	})();
	 	Object.defineProperty(_omAppObject, 'network', { get: function() { return _network; }});



		/*****************************************************/
		/****************** Private Methods ******************/
		/*****************************************************/

	 	// debug
	 	function _debug(configuration) {
	 		if (_isApp) { return; }
	 		if (!configuration) { return; }
	 		if (configuration.http) {
	 			_network.ajaxSettings(configuration.http);
	 		}
	 		if (configuration.currentTheme) {
	 			_currentTheme = configuration.currentTheme;
	 		}
	 		function copyValues(sourceObject, targetObject) {
	 			if (!sourceObject) { return; }
	 			if (!targetObject) { return; }
	 			for (key in sourceObject) {
	 				sourceObject[key] = targetObject[key];
	 			}
	 		}
	 		copyValues(configuration.currentUser, _currentUser);
	 		copyValues(configuration.navigation.bar, _navigation.bar);
	 		copyValues(configuration.network, _network);
	 	}
	 	Object.defineProperty(_omAppObject, 'debug', { get: function() { return _debug; } });

		return _omAppObject;
	})();

	Object.defineProperties(window, {
		omApp: { get: function() { return _omApp; } }
	});

	define("omApp",[],function(){
		return window.omApp;
	});




	// 当页面加载完成时，向 App 发送消息，初始化 omApp 对象。
	if (document.readyState === "complete") {   
         setTimeout(omApp.documentIsReady);      
	} else {
		var _eventListener = function() {
			document.removeEventListener("DOMContentLoaded", _eventListener);
			window.removeEventListener("load", _eventListener);
			omApp.documentIsReady();
		}
        document.addEventListener("DOMContentLoaded", _eventListener, false);
		window.addEventListener("load", _eventListener, false);   
	}



};






// 发送网路请求
// 回调参数：是否请求成功, 请求回来的数据（URL编码的字符串）, 文档类型.
function OMAppAJAX(request, callback) {
	
}

// 获取 URL 中的参数
function OMAppGetURLQueryString(parameterName) {
	var reg = new RegExp("(^|&)"+ parameterName +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return null;
}

// 设置 Cookie
function OMAppSetCookie(name,value) {
	var Days = 30;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days*24*60*60*1000);
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

// 读取 Cookie
function OMAppGetCookie(name) {
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
	return unescape(arr[2]);
	else
	return null;
}





