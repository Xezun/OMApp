// OMApp

/* OMAppPage 页面类型枚举定义 */
var _OMAppPage = (function() {
	var kOMAppPageMall 			= "mall";
	var kOMAppPageTask 			= "task";
    var kOMAppPageNewsList 		= "newsList";
    var kOMAppPageNewsDetail 	= "newsDetail";
    var kOMAppPageVideoList	 	= "videoList";
    var kOMAppPageVideoDetail 	= "videoDetail";
    var _object = {};
	Object.defineProperties(_object, {
		mall: {get: function() {return kOMAppPageMall;}},
		task: {get: function() {return kOMAppPageTask;}},
		newsList: {get: function() {return kOMAppPageNewsList;}},
		newsDetail: {get: function() {return kOMAppPageNewsDetail;}},
		videoList: {get: function() {return kOMAppPageVideoList;}},
		videoDetail: {get: function() {return kOMAppPageVideoDetail;}}                  
	});
	return _object;
})();
Object.defineProperties(window, {
	OMAppPage: {get: function() {return _OMAppPage;}}
});

/* OMUserType 用户类型枚举定义 */
var _OMUserType = (function() {
	var kOMUserTypeVisitor 			= "vistor";
	var kOMUserTypeGoogle 			= "google";
    var kOMUserTypeFacebook 		= "facebook";
    var kOMUserTypeTwitter 			= "twitter";
    var _object = {};
	Object.defineProperties(_object, {
		vistor: { get: function() {return kOMUserTypeVisitor;} },
		google: { get: function() {return kOMUserTypeGoogle;} },
		facebook: { get: function() {return kOMUserTypeFacebook;} },
		twitter: { get: function() {return kOMUserTypeTwitter;} }                 
	});
	return _object;
})();
Object.defineProperties(window, {
	OMUserType: {get: function() {return _OMUserType;}}
});


/* OMAppTheme 主题类型枚举定义 */
var _OMAppTheme = (function(){
	var kOMAppThemeDay 			= "day";
	var kOMAppThemeNight 		= "night";
	var _object = {};
	Object.defineProperties(_object, {
		day: {get: function() {return kOMAppThemeDay;}},
		night: {get: function () {return kOMAppThemeNight;}}                  
	});
	return _object;
})();
Object.defineProperties(window, {
	OMAppTheme: {get: function() {return _OMAppTheme;}}
});



/* OMAppMessage 消息类型枚举定义 */
var _OMAppMessage = (function() {

	var _navigation = (function(){
		var _object = {};
		Object.defineProperties(_object, {
			pop: {get: function () {return "navigation.pop";}},
			popTo: {get: function () {return "navigation.popTo";}},
			push: {get: function () {return "navigation.push";}},
			bar: {get: function () {return "navigation.bar";}}
		});
	})();

	var _object = {};
	Object.defineProperties(_object, {
		scheme: {get: function() {return "app";}},
		navigation: {get: function () {
			return _navigation;
		}},
		open: {get: function () {return "open";}},
		login: {get: function () {return "login";}},
		theme: {get: function () {return "theme";}},
		http: {get: function () {return "http";}}
	});
	return _object;
})();
Object.defineProperties(window, {
	OMAppMessage: {get: function() {return _OMAppMessage;}}
});


/* omApp 接口定义 */
var _omApp = (function() {
	var _object = {};

	// 所有已保存的回调
	var _allCallbacks = {};

	/* 向App发送消息：（消息类型，消息参数，回调）。*/
	function native_message_send(message, parameterObject, callback) {
        if (!message) { return; }
        var url = kScheme + '://' + encodeURIComponent(message);
        
        var query = null;
        var taskID = null;
        if (callback) { //
			taskID = Date.parse(new Date());
	        _allCallbacks[taskID] = callback;
	        query = "taskID=" + taskID;
        }

        function toQueryValue(value) {
        	if (typeof value == 'string') {
        		return value;
        	} else if (typeof parameterObject[key] == 'object') {
        		var string = null;
        		for (key in value) {
        			if (string) {
        				string = string + "&" + key + "=" + value[key];
        			} else {
        				string = key + "=" + value[key];
        			}
        		}
        		return string;
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

        return taskID;
    }

	// 1. 打开指定页面
	function _open(page, id) {
		var param = { "page": page };
		if (id) { param.id = id; }
		return native_message_send(OMAppMessage.open, param);
	}
	Object.defineProperty(_object, 'open', { get: function() { return _open; }});

	// 2.1 HTML 调用原生的登录。
	function _login(callback) {
		return native_message_send(OMAppMessage.login, null, callback);
	}
	Object.defineProperty(_object, 'login', { get: function() { return _login; }});

	// 2.2 原生通知JS登录已完成。
	function _didFinishLogining(taskID, resultObject) {
		if (_allCallbacks[taskID]) {
			_allCallbacks[taskID](resultObject);
		}
		_allCallbacks[taskID] = null;
	}
 	Object.defineProperty(_object, 'didFinishLogining', { get: function() { return _didFinishLogining; }});

 	// 3. alert
	function _alert(message) {
		setTimeout(function(){
			alert(message);
		}, 100);
	}
	Object.defineProperty(_object, 'alert', { get: function() { return _alert; }});

	// 4. navigation
	var _navigation = (function() {
		// 进入下级页面。
		var _push = function (url) {
			// 不是以 http、https 开头的，被视作为相对路径。
   			if (url.search(/(http|https|file):\/\//i) != 0) {
   				url = window.location.protocol + "//" + window.location.host + url;
   			}
   		 	return native_message_send(OMAppMessage.navigation.push, {"url": url});
		}

		// 推出当前页面，使栈内页面数量 -1。
		var _pop = function () {
			return native_message_send(OMAppMessage.navigation.pop);
		}

		// 移除栈内索引大于 index 的所有页面，即将 index 页面所显示的内容展示出来。
		var _popTo = function (index) {
			return native_message_send(OMAppMessage.navigation.popTo, {"index": index});
		}

		var _bar = (function(){
			var _title = null;
			var _titleColor = null;
			var _backgroundColor = null;
			var _isHidden = false;

			var _object = {};
			Object.defineProperties(_object, {
				title: {
					get: function() { return _title; },
					set: function(newValue) { _title = newValue; native_message_send(OMAppMessage.navigation.bar, {"title": newValue}); }
				},
				titleColor: {
					get: function() { return _titleColor; },
					set: function(newValue) { _titleColor = newValue; native_message_send(OMAppMessage.navigation.bar, {"titleColor": newValue}) }
				},
				backgroundColor: {
					get: function() { return _backgroundColor; },
					set: function(newValue) { _backgroundColor = newValue; native_message_send(OMAppMessage.navigation.bar, {"backgroundColor": newValue})}
				},
				isHidden: {
					get: function() { return _isHidden; },
					set: function(newValue) { _isHidden = newValue; native_message_send(OMAppMessage.navigation.bar, {"isHidden": newValue}) }
				}
			});
			return _object;
		})();

		var _object = {};
		Object.defineProperties(_object, {
			push: { get: function() { return _push; } },
			pop: { get: function() { return _pop; } },
			popTo: { get: function() { return _popTo; } },
			bar: { get: function() { return _bar; } }
		});
		return _object;
	})();
	Object.defineProperty(_object, 'navigation', { get: function() { return _navigation; }});
	
	// 5. theme
	var _theme = OMAppTheme.day;
	Object.defineProperty(_object, 'theme', { 
		get: function() { 
			return _theme; 
		},
		set: function(newValue) {
			_theme = newValue;
			native_message_send(OMAppMessage.theme, {"name": newValue});
		}
	});

	// 6. 当前用户
	var _currentUser = (function(){
		var _id = "";
		var _name = "";
		var _type = OMUserType.vistor;
		var _coin = 0;
		
		var _object = {};
		Object.defineProperties(_object, {
			isOnline: {
				get: function () {
					return (_type != OMUserType.vistor)
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

	// 7. HTTP
	function _http(requestObject, callback) {
        native_message_send(OMAppMessage.http, {"request": requestObject}, callback);
	}
	Object.defineProperty(_object, 'http', { get: function() { return _http; }});	

	return _object;
})();

Object.defineProperties(window, {
	omApp: { get: function () { return _omApp; } }
});


                       
                       
                       
                       
                       
                       
                       
                       
                       
                       
                       
                       
                       
                       
                       
                       
                       
                       
                       
                       
                       
                       
                       
                       
                       
                       
                       
                       
                       
                       
                       
                       
                       
                       
// 非 App 状态下调试用。

// 检测是否是手机浏览器：/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
if (!(/Onemena/i.test(navigator.userAgent))) {
	_omApp = (function() {
		var _object = {};

		// 1. 打开指定页面
		function _open(page, id) {
			alert("跳转到指定页面 {page:" + page + ", id: " + id + "}");
		}
		Object.defineProperty(_object, 'open', { get: function() { return _open; }});

		// 2.1 HTML 调用原生的登录。
		function _login(callback) {
			if (confirm("点击确定登录成功，取消登录失败")) {
				window.omApp.currentUser.name = "已登录";
				window.omApp.currentUser.coin = 100;
				window.omApp.currentUser.id = 1;
				window.omApp.currentUser.type = OMUserType.google;	
				callback(true);
			} else {
				window.omApp.currentUser.name = "未登录";
				window.omApp.currentUser.coin = 0;
				window.omApp.currentUser.id = 0;
				window.omApp.currentUser.type = OMUserType.vistor;
				callback(false);
			}
		}
		Object.defineProperty(_object, 'login', { get: function() { return _login; }});

		// 4. navigation
		var _navigation = (function() {
			// 进入下级页面。
			var _push = function (url) {
				// 不是以 http、https 开头的，被视作为相对路径。
	   			if (url.search(/(http|https|file):\/\//i) != 0) {
	   				url = window.location.protocol + "//" + window.location.host + url;
	   			}
	   			window.location.href = url;
			}

			// 推出当前页面，使栈内页面数量 -1。
			var _pop = function () {
				window.history.back();
			}

			// 移除栈内索引大于 index 的所有页面，即将 index 页面所显示的内容展示出来。
			var _popTo = function (index) {
				index = index - window.history.length + 1;
				window.history.go(index);
			}

			var _bar = (function(){
				var _title = null;
				var _titleColor = null;
				var _backgroundColor = null;
				var _isHidden = false;

				var _object = {};
				Object.defineProperties(_object, {
					title: {
						get: function() { return _title; },
						set: function(newValue) { _title = newValue; }
					},
					titleColor: {
						get: function() { return _titleColor; },
						set: function(newValue) { _titleColor = newValue; }
					},
					backgroundColor: {
						get: function() { return _backgroundColor; },
						set: function(newValue) { _backgroundColor = newValue; }
					},
					isHidden: {
						get: function() { return _isHidden; },
						set: function(newValue) { _isHidden = newValue; }
					}
				});
				return _object;
			})();

			var _object = {};
			Object.defineProperties(_object, {
				push: { get: function() { return _push; } },
				pop: { get: function() { return _pop; } },
				popTo: { get: function() { return _popTo; } },
				bar: { get: function() { return _bar; } }
			});
			return _object;
		})();
		Object.defineProperty(_object, 'navigation', { get: function() { return _navigation; }});
		
		// 5. theme
		var _theme = OMAppTheme.day;
		Object.defineProperty(_object, 'theme', { 
			get: function() { 
				return _theme; 
			},
			set: function(newValue) {
				_theme = newValue;
			}
		});

		// 6. 当前用户
		var _currentUser = (function(){
			var _id = "";
			var _name = "";
			var _type = OMUserType.vistor;
			var _coin = 0;
			
			var _object = {};
			Object.defineProperties(_object, {
				isOnline: {
					get: function () {
						return (_type != OMUserType.vistor)
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

		// 7. HTTP
		function _http(requestObject, callback) {
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState != 4) {
					return;
				}
				callback(xmlhttp.status == 200, xmlhttp.responseText);
			}
			xmlhttp.open(requestObject.method, requestObject.url, true);
			if (requestObject.headers) {
				for (key in requestObject.headers) {
					xmlhttp.setRequestHeader(key, requestObject.headers[key]);
				}
			}
			var data = null;
			if (requestObject.params) {
				for (key in requestObject.params) {
					if (data) {
						data = data + "&" + key + "=" + encodeURIComponent(requestObject.params[key]);
					} else {
						data = key + "=" + encodeURIComponent(requestObject.params[key]);
					}
				}
			}
			xmlhttp.send(data);
		}
		Object.defineProperty(_object, 'http', { get: function() { return _http; }});	

		return _object;
	})();
}





