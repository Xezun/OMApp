// require JQurey.js
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
			vistor: 	{ get: function() { return "visitor"; 	} },
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
			http: 			{ get: function() { return "http"; 			} }
		});
		return _object;
	})();
	Object.defineProperties(window, {
		OMAppMessage: 		{ get: function() { return _OMAppMessage; 	}}
	});
}

/* omApp 接口定义 */
if (!window.omApp) {
	var _omApp = (function() {
		var _object = {};

		// 所有已保存的回调
		var _allCallbacks = {};
		var _isApp = /Onemena/.test(window.navigator.userAgent);

		/* 向App发送消息：（消息类型，消息参数，回调）。*/
		function OMAppMessageSend(message, parameterObject, callback) {
	        if (!message) { return; }
	        var url = OMAppMessage.scheme + '://' + encodeURIComponent(message);
	        
	        var query = null;
	        var callbackID = null;
	        if (callback) { //
				callbackID = "cb_" + Date.parse(new Date());
		        _allCallbacks[callbackID] = callback;
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

	        /* <iframe src='" + url + "' style='display: none;'></iframe> */
	        var iframe = document.createElement('iframe');
	        iframe.style.display = 'none';
	        iframe.setAttribute('src', url);
	        // $(iframe).ready(function() {
	        //     document.body.removeChild(iframe);
	        // });
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
			if (_allCallbacks[callbackID]) {
				_allCallbacks[callbackID](success);
			}
			_allCallbacks[callbackID] = null;
		}
	 	Object.defineProperty(_object, 'didFinishLogin', { get: function() { return _didFinishLogin; }});

	 	// 3.1 alert
		function _alert(message, callback) {
			if (!_isApp) {
				setTimeout(function(){
					window.alert('title: ' + message.title + "\nbody: "+ message.body + "\nbuttons:" + message.buttons);
					callback(-1);
				}, 100);
				return;
			};
			return OMAppMessageSend(OMAppMessage.alert, {"message": message}, callback);
		}
		Object.defineProperty(_object, 'alert', { get: function() { return _alert; }});

		// 3.2
		function _didSelectAlertActionAtIndex(callbackID, index) {
			if (_allCallbacks[callbackID]) {
				_allCallbacks[callbackID](index);
			}
			_allCallbacks[callbackID] = null;
		}
	 	Object.defineProperty(_object, 'didSelectAlertActionAtIndex', { get: function() { return _didSelectAlertActionAtIndex; }});

		// 4. navigation
		var _navigation = (function() {
			// 进入下级页面。
			var _push = function (url) {
				// 不是以 http、https 开头的，被视作为相对路径。
	   			if (url.search(/(http|https|file):\/\//i) != 0) {
	   				url = window.location.protocol + "//" + window.location.host + url;
	   			}
	   			if (!_isApp) {
					window.location.href = url;
					return;
				}
	   		 	return OMAppMessageSend(OMAppMessage.navigation.push, {"url": url});
			}

			// 推出当前页面，使栈内页面数量 -1。
			var _pop = function () {
				if (!_isApp) {
					window.history.back();
					return;
				};
				return OMAppMessageSend(OMAppMessage.navigation.pop);
			}

			// 移除栈内索引大于 index 的所有页面，即将 index 页面所显示的内容展示出来。
			var _popTo = function (index) {
				if (!_isApp) {
					var i = index - window.history.length + 1;
					window.history.go(i);
					return;
				};
				return OMAppMessageSend(OMAppMessage.navigation.popTo, {"index": index});
			}

			var _bar = (function() {
				var _title = null;
				var _titleColor = null;
				var _backgroundColor = null;
				var _isHidden = false;

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
		var _currentTheme = OMAppTheme.day;
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
					return currentTheme;
				},
				set: function(newValue) {
					currentTheme = newValue;
				}
			}
		});


		// 6. 当前用户
		var _currentUser = (function(){
			var _id   = "";
			var _name = "";
			var _type = OMAppUserType.vistor;
			var _coin = 0;
			
			var _object = {};
			Object.defineProperties(_object, {
				isOnline: {
					get: function () {
						return (_type != OMAppUserType.vistor)
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
			if (!_isApp) {
				function GetQueryString(parameterName) {
				     var reg = new RegExp("(^|&)"+ parameterName +"=([^&]*)(&|$)");
				     var r = window.location.search.substr(1).match(reg);
				     if(r!=null)return  unescape(r[2]); return null;
				}
				var access_token = GetQueryString("access_token");
				if (access_token) {
					if (request.headers) {
						request.headers["access-token"] = access_token;
					} else {
						request.headers = {"access-token": access_token};
					}
				};
				var user_token = GetQueryString("user_token");
				if (user_token) {
					if (request.params) {
						request.params["user_token"] = user_token;
					} else {
						request.params = {"user_token": user_token};
					}
				};
				$.ajax({
					url: request.url,
					type: request.method,
					data: request.params,
					headers: request.headers,
					success: function(data, status, xhr) {
						callback(true, data);
					},
					error: function() {
						callback(false);
					}
				});
				return;
			};
			if (request.params && !request.data) {
				request.data = request.params;
			};
	        OMAppMessageSend(OMAppMessage.http, {"request": request}, callback);
		}
		Object.defineProperty(_object, 'http', { get: function() { return _http; }});	
		// 7.2 
		function _didFinishHTTPRequest(callbackID, success, result, contentType) {
			if (_allCallbacks[callbackID]) {
				if (result) {
					result = decodeURIComponent(result);
					if (/json/.test(contentType)) {
						result = JSON.parse(result);
					}
				}
				_allCallbacks[callbackID](success, result);
			}
			_allCallbacks[callbackID] = null;
		}
	 	Object.defineProperty(_object, 'didFinishHTTPRequest', { get: function() { return _didFinishHTTPRequest; }});

		return _object;
	})();

	Object.defineProperties(window, {
		omApp: { get: function () { return _omApp; } }
	});
};





function OMApp_Show_HTTP_Configuration() {
	var html = '<div id="OMApp_HTTP_Configuration" style="position: absolute; width: 320px; height: 150px; top: 50%; left: 50%; margin-top: -75px; padding: 20px; margin-left: -160px; font-size: 12px; background-color: #f5f5f5;">'+
	'<table style="width: 100%; height: 100%">'+
	'	<tr>'+
	'		<th colspan="2">HTTP Request Configuration</th>'+
	'	</tr>'+
	'	<tr>'+
	'		<td width="35%" align="right">access-token:</td>'+
	'		<td><input type="text" name="access-token" style="width: 100%" id="OMApp_HTTP_Access_Token"></td>'+
	'	</tr>'+
	'	<tr>'+
	'		<td align="right">user_token:</td>'+
	'		<td><input type="text" name="user_token" style="width: 100%" id="OMApp_HTTP_User_Token"></td>'+
	'	</tr>'+
	'	<tr>'+
	'		<td align="right">Auto Send:</td>'+
	'		<td><input type="checkbox" name="save" id="OMApp_HTTP_Auto_Send"></td>'+
	'	</tr>'+
	'	<tr>'+
	'		<td colspan="2" style="padding: 0; text-align: center; margin: 0">'+
	'			<input type="button" name="send_http" value="Send HTTP Request" style="width: 80%; height: 100%;" onclick="\'OMApp_HTTP_Access_Token=\' + document.getElementById(\'OMApp_HTTP_Access_Token\').value + \'; OMApp_HTTP_User_Token=\' + document.getElementById(\'OMApp_HTTP_User_Token\').value + \'; OMApp_HTTP_Auto_Send=\' + document.getElementById(\'OMApp_HTTP_Auto_Send\').value;">'+
	'		</td>'+
	'	</tr>'+
	'</table> '+
	'</div>';
	function getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i].trim();
			if (c.indexOf(name)==0) return c.substring(name.length,c.length);
		}
		return "";
	}

	$(document.body).append(html);
	$("input#OMApp_HTTP_Access_Token").value = getCookie("OMApp_HTTP_Access_Token");
	$("input#OMApp_HTTP_User_Token").value = getCookie("OMApp_HTTP_User_Token");
	$("input#OMApp_HTTP_Auto_Send").value = getCookie("OMApp_HTTP_User_Token")
}
