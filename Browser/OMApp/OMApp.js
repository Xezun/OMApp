// OMApp

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
};



/* OMAppMessage 消息类型枚举定义 */
if (!window.OMAppMessage) {
	var _OMAppMessage = (function() {

		var _navigation = (function(){
			var _object = {};
			Object.defineProperties(_object, {
				pop: 	{ get: function () { return "navigation.pop";	} },
				popTo: 	{ get: function () { return "navigation.popto";	} },
				push: 	{ get: function () { return "navigation.push";	} },
				bar: 	{ get: function () { return "navigation.bar";	} }
			});
			return _object;
		})();

		var _object = {};
		Object.defineProperties(_object, {
			scheme: 		{ get: function() { return "app"; 			} },
			navigation: 	{ get: function() { return _navigation; 	} },
			open: 			{ get: function() { return "open"; 			} },
			login: 			{ get: function() { return "login"; 		} },
			currentTheme: 	{ get: function() { return "currenttheme";	} },
			http: 			{ get: function() { return "http"; 			} },
			alert: 			{ get: function() { return "alert"; 		} }
		});
		return _object;
	})();
	Object.defineProperties(window, {
		OMAppMessage: 		{ get: function() { return _OMAppMessage; 	}}
	});
}

/* omApp 接口定义 */
if (!window.omApp) {
	if (!window.OMAppInfo) {
		window.OMAppInfo = OMAppGetAppInfo();
	}
	
	var _omApp = (function() {
		var _object = {};

		var _isApp = /Onemena/.test(window.navigator.userAgent);

		var _callbacks = (function(){
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

			var _object = {};
			Object.defineProperties(_object, {
				push: { get: function() { return _push; } },
				pop:  { get: function() { return _pop;  } }
			});
			return _object;
		})();

		function _deprecate(oldMethod, newMethod) {
			console.log("[OMApp] " + oldMethod + " 已废弃，请使用 " + newMethod + " 代替！");
		}

		/* 向App发送消息：（消息类型，消息参数，回调）。*/
		function OMAppMessageSend(message, parameterObject, callback) {
	        if (!message) { return; }
	        var url = OMAppMessage.scheme + '://' + encodeURIComponent(message);
	        
	        var query = null;
	        var callbackID = null;
	        if (callback) {
	        	callbackID = _callbacks.push(callback);
		        query = "callbackID=" + callbackID;
	        }

	        function toQueryValue(value) {
	        	if (typeof value == 'string') {
	        		return value;
	        	} else if (typeof value == 'object') {
	        		return JSON.stringify(value);
	        	}
	        	return value.toString();
	        }

	        for (key in parameterObject) {
	        	var value = encodeURIComponent(toQueryValue(parameterObject[key]));
	        	if (query) {
	        		query = query + "&" + key + "=" + value;
	        	} else {
	        		query = key + "=" + value;
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

		// 1. 打开指定页面
		function _open(page, parameters) {
			if (!_isApp) {
				window.open(page + "[" + parameters + "]");
				return;
			}
			var param = { "page": page };
			if (parameters) { param.parameters = parameters; }
			return OMAppMessageSend(OMAppMessage.open, param);
		}
		Object.defineProperty(_object, 'open', { get: function() { return _open; }});

		// 2.1 HTML 调用原生的登录。
		function _login(callback) {
			if (!_isApp) {
				if (confirm('Click to select the login result! \n[OK] -> true \n[Cancel] -> false')) {
					callback(true);
				} else {
					callback(false);
				}
				return;
			}
			return OMAppMessageSend(OMAppMessage.login, null, callback);
		}
		Object.defineProperty(_object, 'login', { get: function() { return _login; }});

		// 2.2 原生通知JS登录已完成。
		function _didFinishLogin(callbackID, success) {
		 	var callback = _callbacks.pop(callbackID);
		 	if (callback) {
		 		callback(success);
		 	}
		}
	 	Object.defineProperty(_object, 'didFinishLogin', { get: function() { return _didFinishLogin; }});

	 	// 3.1 alert
		function _alert(message, callback) {
			if (!_isApp) {
				setTimeout(function(){
					window.alert('title: ' + message.title + "\nbody: "+ message.body + "\nactions:" + message.actions);
					callback(-1);
				}, 100);
				return;
			};
			return OMAppMessageSend(OMAppMessage.alert, {"message": message}, callback);
		}
		Object.defineProperty(_object, 'alert', { get: function() { return _alert; }});

		// 3.2
		function _didSelectAlertActionAtIndex(callbackID, index) {
			var callback = _callbacks.pop(callbackID);
			if (callback) {
				callback(index);
			}
		}
	 	Object.defineProperty(_object, 'didSelectAlertActionAtIndex', { get: function() { return _didSelectAlertActionAtIndex; }});

		// 4. navigation
		var _navigation = (function() {
			// 进入下级页面。
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
	   		 	return OMAppMessageSend(OMAppMessage.navigation.push, {"url": url, "animated": animated});
			}

			// 推出当前页面，使栈内页面数量 -1。
			var _pop = function (animated) {
				if (!_isApp) {
					window.history.back();
					return;
				};
				if (typeof animated != 'boolean') {
					animated = true;
				};
				return OMAppMessageSend(OMAppMessage.navigation.pop, {"animated": animated});
			}

			// 移除栈内索引大于 index 的所有页面，即将 index 页面所显示的内容展示出来。
			var _popTo = function (index, animated) {
				if (!_isApp) {
					var i = index - window.history.length + 1;
					window.history.go(i);
					return;
				};
				if (typeof animated != 'boolean') {
					animated = true;
				};
				return OMAppMessageSend(OMAppMessage.navigation.popTo, {"index": index, "animated": animated});
			}

			var _bar = (function() {
				var _title			 = OMAppInfo.navigation.bar.title;
				var _titleColor		 = OMAppInfo.navigation.bar.titleColor;
				var _backgroundColor = OMAppInfo.navigation.bar.backgroundColor;
				var _isHidden		 = OMAppInfo.navigation.bar.isHidden;

				var _object = {};
				Object.defineProperties(_object, {
					title: {
						get: function() { return _title; },
						set: function(newValue) { _title = newValue; OMAppMessageSend(OMAppMessage.navigation.bar, {"title": newValue}); }
					},
					titleColor: {
						get: function() { return _titleColor; },
						set: function(newValue) { _titleColor = newValue; OMAppMessageSend(OMAppMessage.navigation.bar, {"titleColor": newValue}) }
					},
					backgroundColor: {
						get: function() { return _backgroundColor; },
						set: function(newValue) { _backgroundColor = newValue; OMAppMessageSend(OMAppMessage.navigation.bar, {"backgroundColor": newValue})}
					},
					isHidden: {
						get: function() { return _isHidden; },
						set: function(newValue) { _isHidden = newValue; OMAppMessageSend(OMAppMessage.navigation.bar, {"isHidden": newValue}) }
					}
				});
				return _object;
			})();

			var _object = {};
			Object.defineProperties(_object, {
				push:	{ get: function() { return _push; 	} },
				pop: 	{ get: function() { return _pop; 	} },
				popTo: 	{ get: function() { return _popTo; 	} },
				bar: 	{ get: function() { return _bar; 	} }
			});
			return _object;
		})();
		Object.defineProperty(_object, 'navigation', { get: function() { return _navigation; }});
		
		// 5. theme
		var _currentTheme = OMAppInfo.currentTheme;
		Object.defineProperties(_object, {
			currentTheme: {
				get: function() { 
					return _currentTheme; 
				},
				set: function(newValue) {
					_currentTheme = newValue;
					OMAppMessageSend(OMAppMessage.currentTheme, {"name": newValue});
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


		// 6. 当前用户
		var _currentUser = (function(){
			var _id   = OMAppInfo.currentUser.id;
			var _name = OMAppInfo.currentUser.name;
			var _type = OMAppInfo.currentUser.type;
			var _coin = OMAppInfo.currentUser.coin;
			
			var _object = {};
			Object.defineProperties(_object, {
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
				}
			});
			return _object;
		})();
		Object.defineProperty(_object, 'currentUser', { get: function() { return _currentUser; }});

		// 7.1 HTTP
		function _http(request, callback) {
			if (request.params && !request.data) {
				_deprecate("omApp.http 参数字段 request.params", "request.data");
				request.data = request.params;
			};
			if (!_isApp) {
				var callbackID = _callbacks.push(callback);
				OMAppAJAX(request, function(success, result, contentType) {
					omApp.didFinishHTTPRequest(callbackID, success, result, contentType);
				});
				return;
			};
	        OMAppMessageSend(OMAppMessage.http, {"request": request}, callback);
		}
		Object.defineProperty(_object, 'http', { get: function() { return _http; }});	
		// 7.2 
		function _didFinishHTTPRequest(callbackID, success, result, contentType) {
			var callback = _callbacks.pop(callbackID);
			if (!callback) { return; };
			if (result) {
				result = decodeURIComponent(result);
				if (/json/.test(contentType)) {
					result = JSON.parse(result);
				}
			}
			callback(success, result);
		}
	 	Object.defineProperty(_object, 'didFinishHTTPRequest', { get: function() { return _didFinishHTTPRequest; }});

		return _object;
	})();

	Object.defineProperties(window, {
		omApp: { get: function () { return _omApp; } }
	});
};






function OMAppGetAppInfo() {
    var info = {
		currentTheme: OMAppTheme.day,
		currentUser: {
			id: "0",
			name: "Default",
			type: OMAppUserType.facebook,
			token: 'OM_API_TEST_TOKEN',
			coin: 999
		},
		navigation: {
			bar: {
				title: "OMApp",
				titleColor: "#000000",
				isHidden: false,
				backgroundColor: "#FFFFFF"
			}
		}
	}
	return info;
}

// 发送网路请求
// 回调参数：是否请求成功, 请求回来的数据（URL编码的字符串）, 文档类型.
function OMAppAJAX(request, callback) {
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
	
	// 读取测试用的 user_token 和 access_token
	var access_token = OMAppGetURLQueryString("access_token");
	if (access_token) {
		if (request.headers) {
			request.headers["access-token"] = access_token;
		} else {
			request.headers = {"access-token": access_token};
		}
	};
	var user_token = OMAppGetURLQueryString("user_token");
	if (user_token) {
		request.headers["user-token"] = user_token;
		if (request.data) {  // 因西安接口不规范，这个做兼容
			request.data["user_token"] = user_token;
		} else {
			request.data = {"user_token": user_token};
		}
	};

	// 设置 Headers
	if (request.headers) {
		for (key in request.headers) {
			xmlhttp.setRequestHeader(key, request.headers[key]);
		}
	}
	
	if(request.method=="POST"){  
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");  
	}

	var data = null;
	if (request.data) {
		for (key in request.data) {
			if (data) {
				data = data + "&" + key + "=" + encodeURIComponent(request.data[key]);
			} else {
				data = key + "=" + encodeURIComponent(request.data[key]);
			}
		}
	}
	xmlhttp.send(data);
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





