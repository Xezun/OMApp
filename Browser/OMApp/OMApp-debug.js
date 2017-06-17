// OMApp

if (!(/Onemena/.test(navigator.userAgent))) {
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
			return _object;
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
				if (xmlhttp.readyState != 4) { // 小于 4 时，请求未完成。
					return;
				}
				if (xmlhttp.status != 200) {
					callback(false, null);
					return;
				}
				var result = xmlhttp.responseText;
				// document.write(result);
				if (/application\/json/.test(xmlhttp.getResponseHeader("Content-Type"))) {
					result = JSON.parse(result);
				}
				callback(true, result);
			}
			xmlhttp.open(requestObject.method, requestObject.url, true);

			// 设置 headers
			if (requestObject.headers) {
				for (key in requestObject.headers) {
					xmlhttp.setRequestHeader(key, requestObject.headers[key]);
				}
			}
			xmlhttp.setRequestHeader("Access-Token", "ab5a9b96-1ea7-4da1-aa96-02d6dca28cdb");

			// 请求参数
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

	Object.defineProperties(window, {
		omApp: { get: function () { return _omApp; } }
	});
}
