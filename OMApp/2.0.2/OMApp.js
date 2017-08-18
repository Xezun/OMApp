// OMApp
// Version: 2.0.2

function _OMAppDefine(name, value) {
    if ("function" === typeof define && define.amd) {
        define(name, [], function () {
            return value;
        });
    }
}

/* OMAppPage 页面类型枚举定义 */
if (!window.OMAppPage) {
	var _OMAppPage = (function() {
	    var _OMAppPageObject = {};
		Object.defineProperties(_OMAppPageObject, {
			mall:	{ get: function() { return "mall";	} },
			task:	{ get: function() { return "task";	} },
			news:	{ get: function() { return "news";	} },
			video:	{ get: function() { return "video";	} },
			web:	{ get: function() { return "web";	} }
		});
		return _OMAppPageObject;
	})();
	Object.defineProperties(window, {
		OMAppPage: { get: function() { return _OMAppPage; } }
	});
    _OMAppDefine("OMAppPage", _OMAppPage);
}

/* OMAppUserType 用户类型枚举定义 */
if (!window.OMAppUserType) {
	var _OMAppUserType = (function() {
	    var _OMAppUserTypeObject = {};
		Object.defineProperties(_OMAppUserTypeObject, {
			visitor: 	{ get: function() { return "visitor"; 	} },
			google: 	{ get: function() { return "google";	} },
			facebook: 	{ get: function() { return "facebook";	} },
			twitter: 	{ get: function() { return "twitter";	} }                 
		});
		return _OMAppUserTypeObject;
	})();
	Object.defineProperties(window, {
		OMAppUserType: { get: function() {return _OMAppUserType;} }
	});
    _OMAppDefine("OMAppUserType", _OMAppUserType);
}


/* OMAppTheme 主题类型枚举定义 */
if (!window.OMAppTheme) {
	var _OMAppTheme = (function(){
		var _OMAppThemeObject = {};
		Object.defineProperties(_OMAppThemeObject, {
			day: 	{ get: function() { return "day"; 	} },
			night: 	{ get: function() { return "night";	} }                  
		});
		return _OMAppThemeObject;
	})();
	Object.defineProperties(window, {
		OMAppTheme: { get: function() {return _OMAppTheme;} }
	});
    _OMAppDefine("OMAppTheme", _OMAppTheme);
}

/* OMAppNetworkingType 网路类型 */
if (!window.OMAppNetworkingType) {
	var _OMAppNetworkingType = (function(){
		var _OMAppNetworkingTypeObject = {};
		Object.defineProperties(_OMAppNetworkingTypeObject, {
			none: 			{ get: function() { return "none"; 			} },
			WiFi: 			{ get: function() { return "WiFi";			} },
			WWan2G: 		{ get: function() { return "2G";			} },
			WWan3G: 		{ get: function() { return "3G";			} },
			WWan4G: 		{ get: function() { return "4G";			} },
			other: 		    { get: function() { return "other";		} }
		});
		return _OMAppNetworkingTypeObject;
	})();
	Object.defineProperties(window, {
		OMAppNetworkType: { get: function() {return _OMAppNetworkingType;} }
	});
    _OMAppDefine("OMAppNetworkingType", _OMAppNetworkingType);
}


/* omApp 接口定义 */
if (!window.omApp) {
	var _omApp = (function() {
		var _omAppObject = {};

		var _isApp = /Onemena/.test(window.navigator.userAgent);

		var _configuration = {
            currentTheme: OMAppTheme.day,
            currentUser: {
                id: "0",
                name: "Onemena",
                type: OMAppUserType.visitor,
                coin: 0,
                token: "Onemena"
            },
            network: {
            	type: OMAppNetworkType.unknown,
                ajaxSettings: {
                    headers: {
                        "Access-Token": "OMApp",
                        "User-Token": "Onemena"
                    },
                    data: { }
                }
			},
            navigation: {
                bar: {
                    title: "Onemena",
                    titleColor: "#FFFFFF",
                    backgroundColor: "#000000",
                    isHidden: false
                }
            }
		};

		// 在控制台打印方法废弃的消息。
		function _deprecate(oldMethod, newMethod) {
			console.log("[OMApp] " + oldMethod + " 已废弃，请使用 " + newMethod + " 代替！");
		}

		// _manager 负责管理所有回调函数。
		// 主要方法: 
		// - 1，register 保存一个回调函数并返回其ID。
		// - 2，execute 通过 ID 执行一个回调函数，执行完释放。
		var _manager = (function() {
			var _callbacks 	    = {}; // 所有已保存的回调
			var _callbackID 	= 0;

			function _register(callback) {
				var id = "om_" + (_callbackID++);
				_callbacks[id] = callback;
				return id;
			}

            // 执行一个 callback , 并删除 callback 。
            function _execute(callbackID) {
			    if (!callbackID) { return; }
                var callback = _callbacks[callbackID];
                if (!callback) { return; }
                var params = [];
                for (var i = 1; i < arguments.length; i++) {
                    params.push(arguments[i]);
                }
                callback.apply(window, params);
            }

			var _managerObject = {};
			Object.defineProperties(_managerObject, {
				register: { get: function() { return _register; } },
				execute:  { get: function() { return _execute;  } }
			});
			return _managerObject;
		})();
        Object.defineProperty(_omAppObject, 'manager', { get: function() { return _manager; }});

		// _OMAppMessage 定义了所有消息类型。
		var _OMAppMessage = {
			documentIsReady: "documentIsReady".toLowerCase(),
			navigation: {
				pop: 	"navigation.pop",
				popTo: 	"navigation.popTo".toLowerCase(),
				push: 	"navigation.push",
				bar: 	"navigation.bar"
			},
			open: 				"open",
			login: 				"login",
			currentTheme: 		"currentTheme".toLowerCase(),
			alert: 				"alert",
			analytics: {
				track: "analytics.track"
			},
            networking: {
			    http: "networking.http"
            }
		};

		// 将 Object 序列化成 URLQuery 部分，返回值可能是 null。
		function _URLQueryStringFromObject(anObject) {
			if (!anObject) { return null; }
			var query = null;
			for (var key in anObject) {
			    if (!anObject.hasOwnProperty(key)) { continue; }
				if (query) { query = query + "&" + key; } else { query = key; }
	        	var value = anObject[key];
	        	if (value) {
	        		if (typeof value === 'object') {
	        			value = JSON.stringify(value);
	        		} else {
	        			value = value.toString();
	        		}
	        		query += ("=" + encodeURIComponent(value));
	        	}
			}
			return query;
		}

		// 向 App 发送消息：（消息类型，消息参数，回调）。
		function _OMAppMessageSend(message, parameters, callback) {
	        if (!message) { return; }
	        var url = 'app://' + message;
	        
	        var query = null; // ? 以后的部分，不包括 ?
	        var callbackID = null;
	        if (callback) {
	        	callbackID = _manager.register(callback);
		        query = "callbackID=" + callbackID;
	        }

	        var dataQuery = _URLQueryStringFromObject(parameters);
	        if (dataQuery) {
	        	if (query) { query += ("&" + dataQuery); } else { query = dataQuery; }
	        }
	        if (query) { url += ("?" + query); }

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
	 	function _ready(callback) {
	 		if (typeof callback !== 'function') {
	 			return; 
	 		}
	 		// 如果文档已加载，异步执行。
 			if (document.readyState === 'complete') {
 				setTimeout(callback);
			} else if (!_readyHandlers) {
				_readyHandlers = [callback];
			} else {
				_readyHandlers.push(callback);
			}
	 	}
	 	Object.defineProperty(_omAppObject, 'ready', {
	 		get: function() { return _ready; }
	 	});

		// 0.1
	 	var _isReady = false; // 标识 omApp 是否初始化完成
	 	Object.defineProperty(_omAppObject, 'isReady', { 
	 		get: function() { return _isReady; }
	 	});

        // 0.3 App 在完成初始化 omApp 后调用此方法，告诉 HTML 初始化已完成。
        function _didFinishLoading() {
            if (!_readyHandlers) {
                console.log('[OMApp] 为了保证 omApp 在使用时已完成初始化，请将操作放在 omApp.ready(function(){/*代码*/}) 中。');
                return;
            }
            _isReady = true;
            for (var i = _readyHandlers.length - 1; i >= 0; i--) {
                (_readyHandlers.pop())();
            }
        }
        Object.defineProperty(_omAppObject, 'didFinishLoading', { get: function() { return _didFinishLoading; }});

	 	// 0.2 向 App 发送消息，HTML 页面准备完成，可以初始化 omApp 对象了。
	 	function _documentIsReady() {
	 		if (_isReady) { return; }
	 		if (!_isApp) {
	 			setTimeout(function(){ _didFinishLoading(); });
	 			return;
	 		}
	 		_OMAppMessageSend(_OMAppMessage.documentIsReady, null, null);
	 	}
	 	Object.defineProperty(_omAppObject, 'documentIsReady', { get: function() { return _documentIsReady; }});


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
		    _manager.execute(callbackID, success);
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
	   			if (url.search(/(http|https|file):\/\//i) !== 0) {
	   				url = window.location.protocol + "//" + window.location.host + url;
	   			}
	   			if (!_isApp) {
					window.location.href = url;
					return;
				}
				if (typeof animated !== 'boolean') {
					animated = true;
				}
	   		 	return _OMAppMessageSend(_OMAppMessage.navigation.push, {"url": url, "animated": animated});
			};

			// 3.2 推出当前页面，使栈内页面数量 -1。
			var _pop = function (animated) {
				if (!_isApp) {
					window.history.back();
					return;
				}
				if (typeof animated !== 'boolean') {
					animated = true;
				}
				return _OMAppMessageSend(_OMAppMessage.navigation.pop, {"animated": animated});
			};

			// 3.3 移除栈内索引大于 index 的所有页面，即将 index 页面所显示的内容展示出来。
			var _popTo = function (index, animated) {
				if (!_isApp) {
					var i = index - window.history.length + 1;
					window.history.go(i);
					return;
				}
				if (typeof animated !== 'boolean') {
					animated = true;
				}
				return _OMAppMessageSend(_OMAppMessage.navigation.popTo, {"index": index, "animated": animated});
			};

			// 3.4 Bar
			var _bar = (function() {
				var _title			 = _configuration.navigation.bar.title;
				var _titleColor		 = _configuration.navigation.bar.titleColor;
				var _backgroundColor = _configuration.navigation.bar.backgroundColor;
				var _isHidden		 = _configuration.navigation.bar.isHidden;

				var _navigationBarObject = {};
				Object.defineProperties(_navigationBarObject, {
					title: {
						get: function() { return _title; },
						set: function(newValue) {
							_title = newValue;
							_OMAppMessageSend(_OMAppMessage.navigation.bar, {"title": newValue});
						}
					},
					titleColor: {
						get: function() { return _titleColor; },
						set: function(newValue) {
						    _titleColor = newValue;
						    _OMAppMessageSend(_OMAppMessage.navigation.bar, {"titleColor": newValue});
						}
					},
					backgroundColor: {
						get: function() { return _backgroundColor; },
						set: function(newValue) {
						    _backgroundColor = newValue;
						    _OMAppMessageSend(_OMAppMessage.navigation.bar, {"backgroundColor": newValue});
						}
					},
					isHidden: {
						get: function() { return _isHidden; },
						set: function(newValue) {
						    _isHidden = newValue;
						    _OMAppMessageSend(_OMAppMessage.navigation.bar, {"isHidden": newValue});
						}
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
		var _currentTheme = _configuration.currentTheme;
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
			    var data = {"event": event, "parameters": parameters};
				return _OMAppMessageSend(_OMAppMessage.analytics.track, data, null);
			}

			var _analyticsObject = {};
			Object.defineProperty(_analyticsObject, 'track', { get: function() { return _track; }});
			return _analyticsObject;
		})();
		Object.defineProperty(_omAppObject, 'analytics', { get: function() { return _analytics; }});

		// 6. 当前用户
		var _currentUser = (function() {
			var _id   = _configuration.currentUser.id;
			var _name = _configuration.currentUser.name;
			var _type = _configuration.currentUser.type;
			var _coin = _configuration.currentUser.coin;
			var _token = _configuration.currentUser.token;
			
			var _currentUserObject = {};
			Object.defineProperties(_currentUserObject, {
				isOnline: {
					get: function () {
						return (_type !== OMAppUserType.visitor)
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



	 	// 8.1 alert
		function _alert(message, callback) {
			if (!_isApp) {
				setTimeout(function(){
					window.alert('title: ' + message.title + "\nbody: "+ message.body + "\nactions:" + message.actions);
					callback(-1);
				}, 100);
				return;
			}
			return _OMAppMessageSend(_OMAppMessage.alert, {"message": message}, callback);
		}
		Object.defineProperty(_omAppObject, 'alert', { get: function() { return _alert; }});

		// 8.2
		function _didSelectAlertActionAtIndex(callbackID, index) {
			_manager.execute(callbackID, index);
		}
	 	Object.defineProperty(_omAppObject, 'didSelectAlertActionAtIndex', {
	 	    get: function() {
	 	        return _didSelectAlertActionAtIndex;
	 	    }
	 	});

	 	// 9. 网络状态
	 	var _networking = (function() {
	 		var _type = _configuration.network.type;
	 	 	var _ajaxSettings = _configuration.network.ajaxSettings;

	 	 	// 回调函数为 response 对象。
	 		var _ajax =	function(request, callback) {
	 	    	var xhr = new XMLHttpRequest();

				xhr.onreadystatechange = function() {
					if (xhr.readyState !== 4) {
						return;
					}
					var response = {};
					response.contentType = xhr.getResponseHeader("Content-Type");
					response.code = (xhr.status === 200 ? 0 : xhr.status);
					response.message = xhr.statusText;

                    if (/application\/json/i.test(response.contentType)) {
                        response.data = JSON.parse(xhr.responseText);
                    } else if (/text\/xml/i.test(response.contentType)) {
                        response.data = xhr.responseXML;
                    } else {
                        response.data = xhr.responseText;
                    }
					callback(response);
				};
				xhr.open(request.method, request.url, true);

				function setXHRHeadersFromObject(anObject) {
                    if (!anObject) { return; }
                    for (var key in anObject) {
                        if (!anObject.hasOwnProperty(key)) { continue; }
                        xhr.setRequestHeader(key, anObject[key]);
                    }
                }
				
				// 设置 Headers
                setXHRHeadersFromObject(_ajaxSettings.headers);
				setXHRHeadersFromObject(request.headers);

				if(request.method === "POST"){
					xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
				}

				// 合并两个对象的属性值。如果其中某个对象为空，则不合并，直接返回另一个对象，否则创建新对象。
				function mergeObjectValueIfNeeded(object1, object2) {
                    if (!object1) { return object2; }
                    if (!object2) { return object1; }
                    var dataObject = {};
                    function copyValues(anObject) {
                        for (var key in anObject) {
                            if (!anObject.hasOwnProperty(key)) { continue; }
                            dataObject[key] = anObject[key];
                        }
                    }
                    copyValues(object1);
                    copyValues(object2);
                    return dataObject;
                }

                var dataObject = mergeObjectValueIfNeeded(_ajaxSettings.data, request.data);
				var data = _URLQueryStringFromObject(dataObject);
				xhr.send(data);
	 		};

            // 7.2 HTTP 回调
            function _didFinishHTTPRequest(callbackID, response) {
                _networking.didFinishHTTPRequest(callbackID, response);
            }

	 		function _http(request, callback) {
				return _networking.http(request, callback);
			}

            var _networkingObject = {};
	 		Object.defineProperties(_networkingObject, {
				type: {
					get: function() { return _type; },
		 			set: function(newValue) { _type = newValue; }
				},
				isReachable: {
					get: function() { return (_type !== OMAppNetworkType.none); }
				},
				isViaWiFi: {
					get: function() { return (_type === OMAppNetworkType.WiFi); }
				},
				ajax: {
					get: function() { return _ajax; }
				},
				ajaxSettings: {
					get: function() { return function(newValue) { _ajaxSettings = newValue; } }
				},
				http: {
					get: function() { return _http; }
				},
                didFinishHTTPRequest: {
				    get: function () { return _didFinishHTTPRequest; }
                }
			});
	 		return _networkingObject;
	 	})();
	 	Object.defineProperty(_omAppObject, 'networking', { get: function() { return _networking; }});


        // 7.2 HTTP 回调 （回调函数ID，是否成功，数据（Base64字符串），数据类型）
        function _didFinishHTTPRequest(callbackID, success, result, contentType) {
            if (result) {
                result = decodeURIComponent(result);
                if (/json/.test(contentType)) {
                    result = JSON.parse(result);
                }
            }
            _manager.execute(callbackID, success, result, contentType);
        }

        // 7.1 方法将要废弃
        function _http(request, callback) {
            if (request["params"] && !request.data) {
                _deprecate("omApp.http 参数字段 request.params", "request.data");
                request.data = request["params"];
            }
            if (!_isApp) {
                var callbackID = _manager.push(callback);
                _networking.ajax(request, function (response) {
                    _didFinishHTTPRequest(callbackID, response.code === 0, response.data, response.contentType);
                });
                return;
            }
            return _OMAppMessageSend(_OMAppMessage.http, {"request": request}, callback);
        }
        Object.defineProperty(_omAppObject, 'http', { get: function() { return _http; }});
        Object.defineProperty(_omAppObject, 'didFinishHTTPRequest', {
            get: function() { return _didFinishHTTPRequest; }
        });


		/*****************************************************/
		/****************** Private Methods ******************/
		/*****************************************************/

	 	// debug
	 	function _debug(configuration) {
	 		if (_isApp) { return; }
	 		if (!configuration) { return; }
	 		console.log("[Debug] "+ JSON.stringify(configuration));
	 		_configuration = configuration;
	 	}
	 	Object.defineProperty(_omAppObject, 'debug', { get: function() { return _debug; } });

	 	// 当页面加载完成时，向 App 发送消息，初始化 omApp 对象。
		if (document.readyState === "complete") {   
	         setTimeout(_documentIsReady);
		} else {
			var _eventListener = function() {
				document.removeEventListener("DOMContentLoaded", _eventListener);
				window.removeEventListener("load", _eventListener);
				_documentIsReady();
			};
	        document.addEventListener("DOMContentLoaded", _eventListener, false);
			window.addEventListener("load", _eventListener, false);   
		}

		return _omAppObject;
	})();

	Object.defineProperties(window, {
		omApp: { get: function() { return _omApp; } }
	});
    _OMAppDefine("omApp", window.omApp);
}









