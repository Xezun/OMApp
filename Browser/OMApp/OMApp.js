// OMApp

/* App 可跳转的页面类型 */
var _OMAppPage = (function() {
	var kOMAppPageMall 			= "mall";
	var kOMAppPageTask 			= "task";
    var kOMAppPageNewsList 		= "newsList";
    var kOMAppPageNewsDetail 	= "newsDetail";
    var kOMAppPageVideoList	 	= "videoList";
    var kOMAppPageVideoDetail 	= "videoDetail";
    var object = {};
	Object.defineProperties(object, {
		mall: {get: function() {return kOMAppPageMall;}},
		task: {get: function() {return kOMAppPageTask;}},
		newsList: {get: function() {return kOMAppPageNewsList;}},
		newsDetail: {get: function() {return kOMAppPageNewsDetail;}},
		videoList: {get: function() {return kOMAppPageVideoList;}},
		videoDetail: {get: function() {return kOMAppPageVideoDetail;}}                  
	});
	return object;
})();

Object.defineProperties(window, {
	OMAppPage: {get: function() {return _OMAppPage;}}
});

/* 主题类型枚举值 */
var _OMAppTheme = (function(){
	var kOMAppThemeDay 			= "day";
	var kOMAppThemeNight 		= "night";
	var object = {};
	Object.defineProperties(object, {
		day: {get: function() {return kOMAppThemeDay;}},
		night: {get: function () {return kOMAppThemeNight;}}                  
	});
	return object;
})();

Object.defineProperties(window, {
	OMAppTheme: {get: function() {return _OMAppTheme;}}
});

var _omApp = (function() {
	var kScheme			= "app"

	// navigation
	var kMessagePush 	= "push";
	var kMessagePop 	= "pop";
	var kMessagePopTo 	= "popTo";

	// navigationStyle
	var kMessageNavigationBar = "navigationBar";

	// open
	var kMessageOpen 	= "open";
	// login
	var kMessageLogin 	= "login";

	var kMessageTheme	= "theme";

	// 保存回调
	var _allCallbacks = {}

    // 检测是否是手机浏览器：/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
	var _isApp = (/Onemena/i.test(navigator.userAgent));

	function native_message_send(message, parameterObject, callback) {
        if (!message) { return; }
        var url = kScheme + '://' + encodeURIComponent(message);
        
        var query = null;
        var taskID = null;
        if (callback) {
			taskID = Date.parse(new Date());
	        _allCallbacks[taskID] = callback;
	        query = "taskID=" + taskID;
        }

        for (key in parameterObject) {
        	if (query) {
        		query = query + "&" + encodeURIComponent(key) + "=" + encodeURIComponent(parameterObject[key]);
        	} else {
        		query = encodeURIComponent(key) + "=" + encodeURIComponent(parameterObject[key]);
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

	// 打开指定页面
	function _open(page, id) {
		if (!_isApp) {
			return;
		}
		var param = {
			"page": page	
		};
		if (id) {
			param.id = id;
		}
		return native_message_send(kMessageOpen, param);
	}

	// HTML 调用原生的登录
	// 参数：登录成功后的信息。
	function _login(callback) {
		if (!_isApp) {
			return;
		}
		return native_message_send(kMessageLogin, null, callback);
	}

	// 完成登录后的
	function _didFinishLogining(taskID, resultObject) {
		if (_allCallbacks[taskID]) {
			_allCallbacks[taskID](resultObject);
		}
		_allCallbacks[taskID] = null;
	}
 
	function _alert(message) {
		setTimeout(function(){
			alert(message);
		}, 100);
	}

	var _navigation = (function() {

		// 进入新页面，使栈内页面数量 +1。
		// 参数：新页面 url，新页面标题，url 是否是相对路径。
		var _push = function (url) {
			if (!_isApp) {
				window.location.href = url;
				return;
			}

			// 不是以 http、https 开头的，被视作为相对路径。
   			if (url.search(/(http|https|file):\/\//i) != 0) {
   				url = window.location.protocol + "//" + window.location.host + url;
   			}
   		 	return native_message_send(kMessagePush, {"url": url});
		}

		// 推出当前页面，使栈内页面数量 -1。
		var _pop = function () {
			if (!_isApp) {
				window.history.go(-1);
				return;
			}
			return native_message_send(kMessagePop);
		}

		// 移除栈内索引大于 index 的所有页面，即将 index 页面所显示的内容展示出来。
		var _popTo = function (index) {
			if (!_isApp) {
				window.history.go(-1);
				return;
			}
			return native_message_send(kMessagePopTo, {"index": index});
		}

		var _bar = (function(){
			var _title = null;
			var _titleColor = null;
			var _backgroundColor = null;
			var _isHidden = false;

			var object = {};
			Object.defineProperties(object, {
				title: {
					get: function() {
						return _title;
					},
					set: function(newValue) {
						_title = newValue;
						native_message_send(kMessageNavigationBar, {"title": newValue});
					}
				},
				titleColor: {
					get: function() {
						return _titleColor;
					},
					set: function(newValue) {
						_titleColor = newValue;
						native_message_send(kMessageNavigationBar, {"titleColor": newValue})
					}
				},
				backgroundColor: {
					get: function() {
						return _backgroundColor;
					},
					set: function(newValue) {
						_backgroundColor = newValue;
						native_message_send(kMessageNavigationBar, {"backgroundColor": newValue})
					}
				},
				isHidden: {
					get: function() {
						return _isHidden;
					},
					set: function(newValue) {
						_isHidden = newValue;
						native_message_send(kMessageNavigationBar, {"isHidden": newValue})
					}
				}
			});
			return object;
		})();

		var object = {};
		Object.defineProperties(object, {
			push: {
				get: function() {
					return _push;
				}
			},
			pop: {
				get: function() {
					return _pop;
				}
			},
			popTo: {
				get: function() {
					return _popTo;
				}
			},
			bar: {
				get: function() {
					return _bar;
				}
			}
		});
		return object;
	})();
	
	var _theme = OMAppTheme.day;

	var _currentUser = null;

	var object = {};
	Object.defineProperties(object, {
		navigation: {get: function() {return _navigation;}},
		open: 		{get: function() {return _open;}},
		login: 		{get: function() {return _login;}},
		didFinishLogining: {get: function() {return _didFinishLogining;}},
		alert: 	{get: function() {return _alert;}},
		theme: {
			get: function() {
				return _theme;
			},
			set: function(newValue) {
				_theme = newValue; 
				native_message_send(kMessageTheme, {"name": newValue});
			}
		}
	});

	return object;
})();

Object.defineProperties(window, {
	omApp: {
		get: function () {
			return _omApp;
		}
	}
});







