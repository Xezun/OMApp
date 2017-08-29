// OMApp.js 3.0.0

/********************************************************
 *                                                      *
 *                    XZExtendable                      *
 *                                                      *
 ********************************************************/

(function () {
    // 可拓展属性的对象基类。
    function _defineProperty(name, callback) {
        if (!callback || typeof callback !== 'function') { return; }
        var descriptor = callback.call(this, this);
        Object.defineProperty(this, name, descriptor);
    }
    function _defineProperties(callback) {
        if (!callback || typeof callback !== 'function') { return; }
        var descriptor = callback.call(this, this);
        Object.defineProperties(this, descriptor);
    }
    function _XZExtendable() {
        Object.defineProperties(this, {
            defineProperty: {
                get: function () {
                    return _defineProperty;
                }
            },
            defineProperties: {
                get: function () {
                    return _defineProperties;
                }
            }
        });
    }
    Object.defineProperties(_XZExtendable, {
        defineProperty: {
            get: function () {
                return _defineProperty;
            }
        },
        defineProperties: {
            get: function () {
                return _defineProperties;
            }
        }
    });
    Object.defineProperty(window, 'XZExtendable', { get: function () { return _XZExtendable; } });
})();


/********************************************************
 *                                                      *
 *                   OMApp & omApp                      *
 *                                                      *
 ********************************************************/

(function () {
    if (typeof omApp !== 'undefined') {
        return omApp;
    }
    
    Object.defineProperty(window, "OMApp", { get: function () {
        return window.XZExtendable;
    }});
    
    var _omApp = new OMApp();
    // 定义全局 OMApp.current 属性。
    Object.defineProperties(OMApp, { current: { get: function () { return _omApp; } } });
    // 定义全局 window.omApp 属性。
    Object.defineProperty(window, 'omApp', { get: function () { return _omApp; } });
})();

// OMApp.Version
OMApp.defineProperty('version', function () {
    return {
        get: function () {
            return "3.0.0";
        }
    }
});

// OMApp.current.name, OMApp.current.system, OMApp.current.isInApp.
OMApp.current.defineProperties(function () {
    var _name = "app";
    var _system = new (function () {
        var _userAgent = window.navigator.userAgent;
        var _isAndroid = /Android/i.test(_userAgent);
        var _isiOS     = /\(i[^;]+;( U;)? CPU.+Mac OS X/.test(_userAgent);
        Object.defineProperties(this, {
            isAndroid: {
                get:function () {
                    return _isAndroid;
                }
            },
            isiOS: {
                get: function () {
                    return _isiOS;
                }
            }
        });
    });
    var _isInApp = /Onemena/i.test(window.navigator.userAgent);
    
    function _setName(newValue) {
        if (/[^a-z]/.test(newValue)) {
            console.log("[OMApp] omApp.name 必须只能为全小写字母。");
            return;
        }
        _name = newValue;
    }
    
    return {
        name: {
            get: function () { return _name; },
            set: _setName
        },
        isInApp: { get: function () { return _isInApp; } },
        system: { get: function () { return _system; } }
    }
});




/********************************************************
 *                                                      *
 *                  Static Methods                      *
 *                                                      *
 ********************************************************/

// OMApp.Method
OMApp.defineProperty("Method", function () {
    var _Method = {};
    return {
        get: function () {
            return _Method;
        }
    }
});


OMApp.defineProperties(function() {
    // 将任意 Object 序列化成 URLQuery 部分。
    // - 如果是字符串，则对字符串 URL 编码并返回。
    // - null/undefined 返回 null 。
    // - 如果 JSON 序列化成功，返回 URL 编码后的 JSON 串；NaN JSON序列化后是 null 。
    // - 默认返回空字符串。
    function _URLQueryStringFromObject(anObject) {
        if (Array.isArray(anObject)) {
            return encodeURIComponent(JSON.stringify(anObject));
        }
        var queryString = "";
        switch (typeof anObject) {
            case 'string':
                queryString = encodeURIComponent(anObject);
                break;
            case 'object':
                if (anObject === null) {
                    queryString = "null";
                } else {
                    for (var key in anObject) {
                        if (!anObject.hasOwnProperty(key)) { continue; }
                        if (!!queryString) {
                            queryString +=  ("&" + encodeURIComponent(key));
                        } else {
                            queryString = encodeURIComponent(key);
                        }
                        var value = anObject[key];
                        if (!!value) {
                            if (typeof value !== 'string') {
                                value = JSON.stringify(value);
                            }
                            queryString += ("=" + encodeURIComponent(value));
                        }
                    }
                }
                break;
            case 'undefined':
                queryString = 'null';
                break;
            default:
                var json = JSON.stringify(anObject);
                if (!!json) { queryString = encodeURIComponent(json); }
                break;
        }
        return queryString;
    }
    
    function _deprecate(oldMethod, newMethod) {
        console.log("[OMApp] " + oldMethod + " 已废弃，请使用 " + newMethod + " 代替！");
    }
    
    // 在 OMApp 中注册一个方法。
    // - 如果第二个参数为空，则方法的名称与方法相同。
    // - 第二个参数可以是一个 Object 。
    // - 允许的字符：大小写字母和下划线。
    function _registerMethod(method, name) {
        if (!name) { name = method; }
        
        // 检查 method.name 。
        function _checkMethodName(name) {
            return ( (typeof name === 'string') || !(/[^a-zA-Z_]/.test(name)) )
        }
        
        // 检查 method 。
        function _checkMethodBody(method) {
            switch (typeof method) {
                case 'object':
                    for (var key in method) {
                        if (!method.hasOwnProperty(key))    { continue; }
                        if (!_checkMethodName(key))         { return false; }
                        if (!_checkMethodBody(method[key])) { return false; }
                    }
                    return true;
                case 'string':
                    return !(/[^a-zA-Z_]/.test(method));
                default:
                    return false
            }
        }
        
        if (!_checkMethodName(name)) {
            console.log("[OMApp] 注册失败。方法名 "+ name +" 不合法，必须只能包含是字母、下划线的字符串。");
            return false;
        }
        if (!_checkMethodBody(method)) {
            console.log("[OMApp] 注册失败。参数 "+ method +" 不合法，必须只能包含是字母、下划线的字符串。");
            return false;
        }
        
        if (!!this.Method[name]) {
            console.log("[OMApp] 注册失败，方法名 "+ name +" 已存在。");
            return false;
        }
        
        Object.defineProperty(this.Method, name, {
            get: function () {
                return method;
            }
        });
        
        return true;
    }
    
    return {
        URLQueryStringFromObject: {
            get: function () {
                return _URLQueryStringFromObject;
            }
        },
        deprecate: {
            get: function () {
                return _deprecate;
            }
        },
        registerMethod: {
            get: function () {
                return _registerMethod;
            }
        }
    };
    
    
});






/********************************************************
 *                                                      *
 *                Instance Methods                      *
 *                                                      *
 ********************************************************/

OMApp.current.defineProperties(function () {
    // 提供一个接口，供原生注入对象，接替 load url。
    var _delegate = null;
    
    var _uniqueNumber       = 100000;
    var _allCallbacks 	    = {}; // 所有已保存的回调
    
    // 保存一个 callback ，并返回其 ID 。
    function _store(callback) {
        if (!callback || (typeof callback !== 'function') ) {
            return null;
        }
        var uid = "OM_CALLBACK_" + _uniqueNumber;
        _uniqueNumber += 1;
        _allCallbacks[uid] = callback;
        return uid;
    }
    
    // 通过 callbackID 调度 callback 并执行。
    // - 在 callback 执行完毕后，从缓存清除。
    // - 执行结果为 callback 的运行结果。
    function _dispatch(callbackID) {
        if (!callbackID) { return; }
        var callback = _allCallbacks[callbackID];
        delete _allCallbacks[callbackID];
        if (!callback) { return; }
        if (typeof callback !== 'function') { return; }
        var params = [];
        for (var i = 1; i < arguments.length; i++) {
            params.push(arguments[i]);
        }
        return callback.apply(window, params);
    }
    
    // 执行 App 的一个方法。
    // - 如果有 callback 的话，返回 callbackID 。
    // - parameters 为数组，分别对应接口参数。
    function _perform(method, parameters, callback) {
        // 检测 method
        if ( !method || (typeof method !== 'string') ) { return; }
        
        var callbackID = null;
        if ( !!_delegate ) {
            if ( !_delegate.hasOwnProperty(method) || (typeof _delegate[method] !== 'function') ) {
                console.log("[OMApp] omApp.delegate 没有实现方法 " + method + "，操作无法进行。");
                return;
            }
            var _arguments = [];
            if ( this.isInApp && this.system.isAndroid ) {
                // 安卓平台的需要将参数转换成基本数据类型。
                if (Array.isArray(parameters)) {
                    for (var i = 0; i < parameters.length; i += 1) {
                        var value = parameters[i];
                        switch (typeof value) {
                            case 'number':
                            case 'string':
                            case 'boolean':
                                break;
                            default:
                                value = JSON.stringify(value);
                                break;
                        }
                        _arguments.push(value);
                    }
                }
                callbackID = _store(callback);
                if (callbackID) { _arguments.push(callbackID); }
            } else {
                if (callback) { _arguments.push(callback); }
                if (parameters) { _arguments = parameters.concat(_arguments); }
            }
            _delegate[method].apply(window, _arguments);
            return callbackID;
        }
        
        callbackID = _store(callback);
        
        var url = OMApp.current.name + "://" + method;
        
        if (callbackID) {
            if (parameters) {
                parameters.push(callbackID);
            } else {
                parameters = [callbackID];
            }
        }
        
        var queryString = OMApp.URLQueryStringFromObject(parameters);
        if (queryString) { url += ("?arguments=" + queryString); }
        
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.setAttribute('src', url);
        document.body.appendChild(iframe);
        setTimeout(function() {
            document.body.removeChild(iframe);
        }, 1000);
        
        return callbackID;
    }
    
    return {
        delegate: {
            get: function () {
                return _delegate;
            },
            set: function (newValue) {
                _delegate = newValue;
            }
        },
        dispatch: {
            get: function () {
                return _dispatch;
            }
        },
        perform: {
            get: function () {
                return _perform;
            }
        }
    };
});


/********************************************************
 *                                                      *
 *               OMApp.current.config                   *
 *                                                      *
 ********************************************************/

OMApp.current.defineProperties(function () {
    
    // Debug
    var _isDebug = false;
    
    // 判断对象是否有 setter 方法，如果有则执行 setter 方法，否则属性直接赋值。
    function _setKeyValue(object, key, value, keyPath) {
        var setter = "set" + key.substring(0,1).toUpperCase() + key.substring(1);
        if ( object.hasOwnProperty(setter) ) {
            object[setter](value);
        } else {
            object[key] = value;
        }
        console.log("[OMAp] 应用配置: " + keyPath + "." + key + " = " + JSON.stringify(value) + " 。");
    }
    
    // 对象属性深复制。
    function _copyValueFromObject1ToObject2(sourceObject, targetObject, keyPath) {
        for (var key in sourceObject) { // 遍历复制源
            if (!sourceObject.hasOwnProperty(key)) { continue; }
            var  value = sourceObject[key];
            if ( !value || (typeof value !== 'object') ) { // 值为非 object 时，直接赋值。
                _setKeyValue(targetObject, key, value, keyPath);
            } else {
                if (!!targetObject[key] && typeof targetObject[key] === 'object') {
                    // 目标值存在且是 object ，执行深复制。
                    _copyValueFromObject1ToObject2(value, targetObject[key], keyPath + "." + key);
                } else {
                    _setKeyValue(targetObject, key, value, keyPath);
                }
            }
        }
    }

    // Config
    function _config(configuration) {
        if (this.isInApp) { return; }
        if (!configuration) { return; }
        if (typeof configuration !== 'object') { return; }
        
        _copyValueFromObject1ToObject2(configuration, this, "omApp");
    }

    return {
        config: {
            get: function () {
                return _config;
            }
        },
        isDebug: {
            get: function () {
                return _isDebug;
            },
            set: function (newValue) {
                _isDebug = newValue;
            }
        }
    };
});



/********************************************************
 *                                                      *
 *               OMApp.current.ready                    *
 *                                                      *
 ********************************************************/

OMApp.registerMethod("documentIsReady");

OMApp.current.defineProperties(function () {
    // 标识 omApp 是否初始化完成
    var _isReady = false;
    
    // 所有通过 omApp.ready 方法传递的函数。
    // - omApp.isReady = true 后依次执行。
    var _readyHandlers = null;
    
    function _didFinishLoading() {
        if (!_readyHandlers) {
            console.log('[OMApp] 为了保证 omApp 在使用时已完成初始化，请将操作放在 \nomApp.ready(function() {\n\t/*代码*/\n}); \n中。');
            return;
        }
        _isReady = true;
        for (var i = _readyHandlers.length - 1; i >= 0; i--) {
            (_readyHandlers.pop()).apply(window);
        }
    }
    
    // 0.1 向 App 发送消息，HTML 页面准备完成，可以初始化 omApp 对象了。
    // - App 需在完成初始化 omApp 对象后调用 didFinishLoading 函数。
    // - 此函数有固定的回调函数，不需要额外传入。
    function _documentIsReady() {
        if (_isReady) { return; }
        OMApp.current.perform(OMApp.Method.documentIsReady, null, _didFinishLoading);
    }
    
    var _hasAddListener = false;
    
    // 0.2 绑定 omApp.isReady 后要执行的方法。
    // - 此方法不调用，omApp 对象不会执行初始化操作。
    // - 根据 omApp 当前的状态。
    // - callback 执行时，其内部的 this 指向 window 。
    function _ready(callback) {
        // 如果 App 已经初始化，则异步执行 callback。
        if (_isReady) { setTimeout(callback); return; }
        
        // App 尚未初始化，保存 callback 。
        if (!_readyHandlers) {
            _readyHandlers = [callback];
        } else {
            _readyHandlers.push(callback);
        }
        
        // 如果 document.isReady 发送 documentIsReady 事件。
        if (document.readyState === 'complete') {
            setTimeout(_documentIsReady);
        } else if (!_hasAddListener) {
            _hasAddListener = true;
            var _eventListener = function() {
                document.removeEventListener("DOMContentLoaded", _eventListener);
                window.removeEventListener("load", _eventListener);
                _documentIsReady();
            };
            // Listener 不会被重复添加。
            document.addEventListener("DOMContentLoaded", _eventListener, false);
            window.addEventListener("load", _eventListener, false);
        }
    }
    
    return {
        isReady: {
            get: function () {
                return _isReady;
            }
        },
        documentIsReady: {
            get: function() { return _documentIsReady; }
        },
        ready: {
            get: function() { return _ready; }
        }
    };
});


/********************************************************
 *                                                      *
 *            OMApp.current.currentTheme                *
 *                                                      *
 ********************************************************/

OMApp.defineProperty("Theme", function () {
    var _Theme = {};
    Object.defineProperties(_Theme, {
        day: 	{ get: function() { return "day"; 	} },
        night: 	{ get: function() { return "night";	} }
    });
    return {
        get: function () {
            return _Theme;
        }
    }
});

OMApp.registerMethod('currentTheme');

OMApp.current.defineProperties(function () {
    var _currentTheme = OMApp.Theme.day;
    
    function _setCurrentTheme(newValue, needs) {
        _currentTheme = newValue;
        if (needs) {
            OMApp.current.perform(OMApp.Method.currentTheme, [newValue], null);
        }
    }
    
    return {
        currentTheme: {
            get: function () {
                return _currentTheme;
            },
            set: function (newValue) {
                _setCurrentTheme(newValue, true);
            }
        },
        setCurrentTheme: {
            get: function () {
                return _setCurrentTheme;
            }
        }
    }
});


/********************************************************
 *                                                      *
 *               OMApp.current.login                    *
 *                                                      *
 ********************************************************/

OMApp.registerMethod("login");

OMApp.current.defineProperty("login", function () {
    // 1.1 HTML 调用原生的登录。
    function _login(callback) {
        return this.perform(OMApp.Method.login, null, callback);
    }
    
    return {
        get: function() {
            return _login;
        }
    };
});


/********************************************************
 *                                                      *
 *            OMApp.current.currentUser                 *
 *                                                      *
 ********************************************************/

OMApp.defineProperty('UserType', function () {
    var _UserType = {};
    Object.defineProperties(_UserType, {
        visitor: 	{ get: function() { return "visitor"; 	} },
        google: 	{ get: function() { return "google";	} },
        facebook: 	{ get: function() { return "facebook";	} },
        twitter: 	{ get: function() { return "twitter";	} }
    });
    return {
        get: function () {
            return _UserType;
        }
    }
});

OMApp.current.defineProperty('currentUser', function () {
    var _currentUser = new (function() {
        var _id   = "0";
        var _name = "Visitor";
        var _type = OMApp.UserType.visitor;
        var _coin = 0;
        var _token = "";
        
        Object.defineProperties(this, {
            isOnline: {
                get: function () {
                    return (_type !== OMApp.UserType.visitor)
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
    });
    return { get: function () { return _currentUser; } };
});


/********************************************************
 *                                                      *
 *               OMApp.current.open                     *
 *                                                      *
 ********************************************************/

OMApp.defineProperty('Page', function () {
    var _Page = {};
    Object.defineProperties(_Page, {
        mall:	{ get: function() { return "mall";	} },
        task:	{ get: function() { return "task";	} },
        news:	{ get: function() { return "news";	} },
        video:	{ get: function() { return "video";	} },
        web:	{ get: function() { return "web";	} }
    });
    return {
        get: function () {
            return _Page;
        }
    }
});

OMApp.current.defineProperty('open', function () {
    OMApp.registerMethod('open');
    function _open(page, parameters) {
        var _arguments = [page];
        if (parameters) { _arguments.push(parameters); }
        return this.perform(OMApp.Method.open, _arguments);
    }
    return {
        get: function () {
            return _open;
        }
    }
});

/********************************************************
 *                                                      *
 *             OMApp.current.navigation                 *
 *                                                      *
 ********************************************************/

OMApp.registerMethod({
    push: 'navigationPush',
    pop: 'navigationPop',
    popTo: 'navigationPopTo',
    bar: {
        isHidden: "navigationBarIsHidden",
        title: "navigationBarTitle",
        titleColor: "navigationBarTitleColor",
        backgroundColor: "navigationBarBackgroundColor"
    }
}, 'navigation');

OMApp.current.defineProperty('navigation', function () {
    var _navigation = new (function() {
        
        // 3.1 进入下级页面。
        function _push(url, animated) {
            // 不是以 http、https 开头的，被视作为相对路径。
            if (/^(http|https|file):\/\//i.test(url)) {
                url = window.location.protocol + "//" + window.location.host + url;
            }
            if (typeof animated !== 'boolean') {
                animated = true;
            }
            return OMApp.current.perform(OMApp.Method.navigation.push, [url, animated], null);
        }
        
        // 3.2 推出当前页面，使栈内页面数量 -1。
        function _pop(animated) {
            if (typeof animated !== 'boolean') {
                animated = true;
            }
            return OMApp.current.perform(OMApp.Method.navigation.pop, [animated], null);
        }
        
        // 3.3 移除栈内索引大于 index 的所有页面，即将 index 页面所显示的内容展示出来。
        function _popTo(index, animated) {
            if (typeof animated !== 'boolean') {
                animated = true;
            }
            return OMApp.current.perform(OMApp.Method.navigation.popTo, [index, animated]);
        }
        
        // 3.4 Bar
        var _bar = new (function() {
            var _title			 = "Onemena";
            var _titleColor		 = "#000000";
            var _backgroundColor = "#FFFFFF";
            var _isHidden		 = false;
            
            function _setTitle(newValue, doPerform) {
                _title = newValue;
                if (doPerform) {
                    OMApp.current.perform(OMApp.Method.navigation.bar.title, [newValue]);
                }
            }
    
            function _setTitleColor(newValue, doPerform) {
                _titleColor = newValue;
                if (doPerform) {
                    OMApp.current.perform(OMApp.Method.navigation.bar.titleColor, [newValue]);
                }
            }
    
            function _setIsHidden(newValue, doPerform) {
                _isHidden = newValue;
                if (doPerform) {
                    OMApp.current.perform(OMApp.Method.navigation.bar.isHidden, [newValue]);
                }
            }
    
            function _setBackgroundColor(newValue, doPerform) {
                _backgroundColor = newValue;
                if (doPerform) {
                    OMApp.current.perform(OMApp.Method.navigation.bar.backgroundColor, [newValue]);
                }
            }
            
            Object.defineProperties(this, {
                title: {
                    get: function() { return _title; },
                    set: function(newValue) {
                        _setTitle(newValue, true);
                    }
                },
                titleColor: {
                    get: function() { return _titleColor; },
                    set: function(newValue) {
                        _setTitleColor(newValue, true);
                    }
                },
                backgroundColor: {
                    get: function() { return _backgroundColor; },
                    set: function(newValue) {
                        _setBackgroundColor(newValue, true);
                    }
                },
                isHidden: {
                    get: function() { return _isHidden; },
                    set: function(newValue) {
                        _setIsHidden(newValue, true);
                    }
                },
                setTitle:           { get: function () { return _setTitle; } },
                setTitleColor:      { get: function () { return _setTitleColor; } },
                setBackgroundColor: { get: function () { return _setBackgroundColor; } },
                setIsHidden:        { get: function () { return _setIsHidden; } }
            });
        });
        
        Object.defineProperties(this, {
            push:	{ get: function() { return _push; 	} },
            pop: 	{ get: function() { return _pop; 	} },
            popTo: 	{ get: function() { return _popTo; 	} },
            bar: 	{ get: function() { return _bar; 	} }
        });
    });
    
    return { get: function () { return _navigation; } };
});


/********************************************************
 *                                                      *
 *                OMApp.current.present                 *
 *                                                      *
 ********************************************************/

OMApp.registerMethod("present");

OMApp.current.defineProperty("present", function () {
    
    function _present(url, arg1, arg2) {
        var animated = true;
        var completion = null;
        if ( typeof arg1 === 'boolean' ) {
            animated = arg1;
            completion = arg2;
        } else if (typeof arg1 === 'function') {
            completion = arg1;
        }
        OMApp.current.perform(OMApp.Method.present, [url, animated], completion);
    }
    
    return {
        get: function () {
            return _present;
        }
    }

});




/********************************************************
 *                                                      *
 *             OMApp.current.networking                 *
 *                                                      *
 ********************************************************/

OMApp.defineProperty('NetworkingType', function () {
    var _NetworkingType = {};
    Object.defineProperties(_NetworkingType, {
        none: 			{ get: function() { return "none"; 			} },
        WiFi: 			{ get: function() { return "WiFi";			} },
        WWan2G: 		{ get: function() { return "2G";			} },
        WWan3G: 		{ get: function() { return "3G";			} },
        WWan4G: 		{ get: function() { return "4G";			} },
        other: 		    { get: function() { return "other";		} }
    });
    return {
        get: function () {
            return _NetworkingType;
        }
    }
});

OMApp.registerMethod({
    http: "networkingHTTP"
}, "networking");

OMApp.current.defineProperty("networking", function () {
    var _networking = new (function() {
        var _type = OMApp.NetworkingType.other;
        
        // HTTP 请求
        function _http(request, callback) {
            return OMApp.current.perform(OMApp.Method.networking.http, [request], callback);
        }
        
        Object.defineProperties(this, {
            type: {
                get: function() { return _type; },
                set: function(newValue) { _type = newValue; }
            },
            isReachable: {
                get: function() { return (_type !== OMApp.NetworkingType.none); }
            },
            isViaWiFi: {
                get: function() { return (_type === OMApp.NetworkingType.WiFi); }
            },
            http: {
                get: function() { return _http; }
            }
        });
    });
    return {
        get: function () {
            return _networking;
        }
    }
});

OMApp.current.defineProperty('http', function () {
    return {
        get: function () {
            return OMApp.current.networking.http;
        }
    }
});


/********************************************************
 *                                                      *
 *              OMApp.current.analytics                 *
 *                                                      *
 ********************************************************/

OMApp.registerMethod({
    track: "analyticsTrack"
}, 'analytics');

OMApp.current.defineProperty("analytics", function () {
    function _track(event, parameters) {
        return OMApp.current.perform(OMApp.Method.analytics.track, [event, parameters]);
    }
    return {
        get: function () {
            return _track;
        }
    };
});


/********************************************************
 *                                                      *
 *              OMApp.current.analytics                 *
 *                                                      *
 ********************************************************/

OMApp.registerMethod("alert");

OMApp.current.defineProperty('alert', function () {
    function _alert(message, callback) {
        return OMApp.current.perform(OMApp.Method.alert, [message], callback);
    }
    return {
        get: function () {
            return _alert;
        }
    };
});

/********************************************************
 *                                                      *
 *                OMApp.current.service                 *
 *                                                      *
 ********************************************************/

OMApp.registerMethod({
    data: {
        fetchNumberOfRowsInListInDocument: "dataServiceFetchNumberOfRowsInListInDocument",
        fetchDataForRowAtIndexInListInDocument: "dataServiceFetchDataForRowAtIndexInListInDocument",
        fetchCachedResourceForURL: "dataServiceFetchCachedResourceForURL"
    },
    event: {
        documentListDidSelectRowAtIndex: "eventServiceDocumentListDidSelectRowAtIndex",
        documentElementWasClicked: "eventServiceDocumentElementWasClicked"
    }
}, "service");


OMApp.current.defineProperty('service', function () {
    
    var _service = new (function () {
    
        var _data = new (function () {
        
            // 获取 list 的行数。
            // - list: string
            // - callback: (number)=>void
            function _fetchNumberOfRowsInListInDocument(documentName, listName, callback) {
                var method = OMApp.Method.service.data.fetchNumberOfRowsInListInDocument;
                OMApp.current.perform(method, [documentName, listName], callback);
            }
        
            // 加载数据
            // - list: OMAppList
            // - index: number
            // - callback: (data)=>void
            function _fetchDataForRowAtIndexInListInDocument(documentName, listName, index, callback) {
                var method = OMApp.Method.service.data.fetchDataForRowAtIndexInListInDocument;
                OMApp.current.perform(method, [documentName, listName, index], callback);
            }
        
            // 获取缓存。
            function _fetchCachedResourceForURL(url, arg1, arg2) {
                var method = OMApp.Method.service.data.fetchCachedResourceForURL;
                var callback = null;
                var automatic = true;
                if ( typeof arg1 === 'boolean' ) {
                    automatic = arg1;
                    callback = arg2;
                } else if (typeof arg1 === 'function') {
                    callback = arg1;
                }
                OMApp.current.perform(method, [url, automatic], callback);
            }
        
            Object.defineProperties(this, {
                fetchNumberOfRowsInListInDocument: {
                    get: function () {
                        return _fetchNumberOfRowsInListInDocument;
                    }
                },
                fetchDataForRowAtIndexInListInDocument: {
                    get: function () {
                        return _fetchDataForRowAtIndexInListInDocument;
                    }
                },
                fetchCachedResourceForURL: {
                    get: function () {
                        return _fetchCachedResourceForURL;
                    }
                }
            });
        
        });
    
        var _event = new (function () {
        
            // List 点击事件。
            function _documentListDidSelectRowAtIndex(documentName, listName, index) {
                var method = OMApp.Method.service.event.documentListDidSelectRowAtIndex;
                OMApp.current.perform(method, [documentName, listName, index]);
            }
        
            // 处理事件
            function _documentElementWasClicked(documentName, elementName, data, callback) {
                var method = OMApp.Method.service.event.documentElementWasClicked;
                OMApp.current.perform(method, [documentName, elementName, data], callback);
            }
        
            Object.defineProperties(this, {
                documentListDidSelectRowAtIndex: {
                    get: function () {
                        return _documentListDidSelectRowAtIndex;
                    }
                },
                documentElementWasClicked: {
                    get: function () {
                        return _documentElementWasClicked;
                    }
                }
            });
        
        });
        
        Object.defineProperties(this, {
            data: {
                get: function () {
                    return _data;
                }
            },
            event: {
                get: function () {
                    return _event;
                }
            }
        });
    })();

    return {
        get: function () {
            return _service;
        }
    };
    
});































































/********************************************************
 *                                                      *
 *                     OMApp.Delegate                   *
 *                                                      *
 ********************************************************/

function _OMAppDelegate() {
    
    this.documentIsReady = function (callback) {
        callback();
    };
    
    this.currentTheme = function (newValue) {
        console.log("设置 App 主题：" + newValue);
    };
    
    this.login = function (callback) {
        callback(confirm('点击按钮确定登陆！ \n[确定] -> 登录成功 \n[取消] -> 登录失败'));
    };
    
    this.open = function (page, parameters) {
        console.log("Open Page: "+ page +", parameters: "+ JSON.stringify(parameters));
        // window.open(page + "[" + parameters + "]");
    };
    
    this.present = function (url, animated, completion) {
        console.log("[omApp] present: "+ url + ", animated: "+ animated);
        setTimeout(completion);
    };
    
    this.navigationPush = function (url, animated) {
        console.log("Navigation Push: "+ url +", animated: "+ animated);
        // window.location.href = url;
    };
    
    this.navigationPop = function (animated) {
        console.log("Navigation Pop animated: "+ animated);
        // window.history.back();
    };
    
    this.navigationPopTo = function (index, animated) {
        console.log("Navigation Pop To: "+ index +", animated: "+ animated);
        var i = index - window.history.length + 1;
        window.history.go(i);
    };
    
    this.navigationBarIsHidden = function (newValue) {
        console.log("Set Navigation Bar Hidden: "+ newValue);
    };
    
    this.navigationBarTitle = function (newValue) {
        console.log("Set Navigation Bar Title: "+ newValue);
    };
    
    this.navigationBarTitleColor = function (newValue) {
        console.log("Set Navigation Bar Title Color: "+ newValue);
    };
    
    this.navigationBarBackgroundColor = function (newValue) {
        console.log("Set Navigation Bar Background Color: "+ newValue);
    };
    
    var _ajaxSettings = {};
    
    function _setAjaxSettings(newValue) {
        if (!newValue) { return; }
        if (typeof newValue !== 'object') { return; }
        for (var key in newValue) {
            if (!newValue.hasOwnProperty(key)) { continue; }
            _ajaxSettings[key] = newValue[key];
        }
    }
    
    // 回调函数为 response 对象。
    function _ajax(request, callback) {
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
        var data = OMApp.URLQueryStringFromObject(dataObject);
        xhr.send(data);
    }
    
    Object.defineProperties(this, {
        ajaxSettings: {
            get: function() { return _ajaxSettings; }
        },
        setAjaxSettings: {
            get: function () {
                return _setAjaxSettings;
            }
        },
        ajax: {
            get: function () {
                return _ajax;
            }
        }
    });
    
    this.networkingHTTP = function (request, callback) {
        _ajax(request, callback)
    };
    
    this.dataServiceFetchNumberOfRowsInListInDocument = function () {
        console.log(arguments);
    };
    
    this.dataServiceFetchDataForRowAtIndexInListInDocument = function () {
        console.log(arguments);
    };
    
    this.dataServiceFetchCachedResourceForURL = function () {
        console.log(arguments);
    };
    
    this.eventServiceDocumentListDidSelectRowAtIndex = function () {
        console.log(arguments);
    };
    
    this.eventServiceDocumentElementWasClicked = function () {
        console.log(arguments);
    };
    

}

if (!OMApp.current.isInApp) {
    // 当处于非 App 环境时，设置默认代理。
    OMApp.current.delegate = new _OMAppDelegate();
}




