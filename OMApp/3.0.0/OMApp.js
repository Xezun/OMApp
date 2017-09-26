// OMApp.js 3.0.0

/********************************************************
 *                                                      *
 *                    XZExtendable                      *
 *                                                      *
 ********************************************************/

(function () {
   
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
    // name 将被用作 URL 交互的协议。
    var _name = "app";
    // App 系统信息相关
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
    
    // 标识当前环境是否是 App
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

// OMApp.Method 枚举
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
        // 1. 数组直接 JSON
        if (Array.isArray(anObject)) {
            return encodeURIComponent(JSON.stringify(anObject));
        }
        switch (typeof anObject) {
            case 'string':
                return encodeURIComponent(anObject);
            case 'object':
                if (!anObject) {
                    return "null";
                }
                var queryString = null;
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
                return queryString;
            case 'undefined':
                return 'null';
            default:
                return encodeURIComponent(JSON.stringify(anObject));
        }
    }
    
    // 在 OMApp 中注册一个方法。
    // - 如果第二个参数为空，则方法的名称与方法相同。
    // - 第二个参数可以是一个 Object 。
    // - 允许的字符：大小写字母和下划线。
    function _registerMethod(method, name) {
        if (typeof name === 'undefined') { name = method; }
        
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
        
        // 在对象的值中找到对象的路径。
        function _findPath(string, obj, basePath) {
            if (!obj) { return null; }
            switch (typeof obj) {
                case 'string':
                    if (obj === string) {
                        return basePath;
                    }
                    break;
                    
                case 'object':
                    for (var key in obj) {
                        if (!obj.hasOwnProperty(key)) { continue; }
                        var path = _findPath(string, obj[key], basePath + "." + key);
                        if (!!path) {
                            return path;
                        }
                    }
                    break;
                    
                default:
                    console.log("[OMApp] 检查方法名重复的逻辑不正确。");
                    break;
            }
            return null;
        }
        
        
        // 遍历对象的值，callback 的返回值决定是否继续遍历。
        function _objectEachAllValues(anObject, callback) {
            switch (typeof anObject) {
                case 'object':
                    for (var key in anObject) {
                        if (!anObject.hasOwnProperty(key)) { continue; }
                        if (!_objectEachAllValues(anObject[key], callback)) {
                            break;
                        }
                    }
                    break;
                default:
                    return callback(anObject);
            }
            return true;
        }
        
        // 遍历所有方法名，查找是否有重复。
        var registeredMethods = this.Method;
        var findPath = null;
        _objectEachAllValues(method, function (value) {
            findPath = _findPath(value, registeredMethods, "OMApp.Method");
            return !findPath;
        });
        
        if (!!findPath) {
            console.log("[OMApp] 方法 "+ JSON.stringify(method) +" 注入失败，相同的方法 "+ findPath +" 已存在。");
            return false;
        }
        
        Object.defineProperty(this.Method, name, {
            get: function () {
                return method;
            },
            enumerable: true
        });
        
        return true;
    }
    
    return {
        URLQueryStringFromObject: {
            get: function () {
                return _URLQueryStringFromObject;
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
    // 如果 callback 不合法，返回 null。
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
            // 1. iOS.WKWebView 直接通过 function 转发消息。
            if (typeof _delegate === 'function') {
                callbackID = _store(callback);
                var message = {};
                message.method = method;
                if (parameters) { message.parameters = parameters; }
                if (callbackID) { message.callbackID = callbackID; }
                _delegate(message);
                return;
            }
            
            // 2. 直接调用对象的方法。
            if ( !_delegate.hasOwnProperty(method) || (typeof _delegate[method] !== 'function') ) {
                console.log("[OMApp] omApp.delegate 没有实现方法 " + method + "，操作无法进行。");
                return;
            }
            
            var _arguments = [];
            
            // 2.1 根据平台构造不同的参数
            if ( this.isInApp && this.system.isAndroid) {
                // 在 App 中时，安卓可以注入对象，但是只支持基本数据类型。
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
                // 其它可以注入对象，且支持复杂数据类型。
                // 比如 iOS.UIWebView 或在浏览器调试环境中用 JS 对象。
                if (callback) { _arguments.push(callback); }
                if (parameters) { _arguments = parameters.concat(_arguments); }
            }
            
            // 2.2 直接调用方法。
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
                if (_delegate !== newValue) {
                    _delegate = newValue;
                    // 如果重新设置了代理是否需要重新发送 ready 事件？
                    // 不。代理需要在 ready 事件前设置。如果使用者在 ready 之后或不确定的时机设置，则需要开发者自己去判断当前状态。
                }
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
    
    /**
     * 给对象的属性进行赋值。判断对象是否有 setter 方法，如果有则执行 setter 方法，否则属性直接赋值。
     * @param object 要赋值的对象
     * @param key    对象的属性名
     * @param value  要赋值
     * @param keyPath 当前对象在其它对象中的 keyPath
     * @private
     */
    function _setKeyValue(object, key, value, keyPath) {
        var setter = null;
        if ( /^is[A-Z]/.test(key) ) {
            // is 开头的的属性，变 is 为 set 。
            setter = key.replace(/^is/, "set");
        } else {
            // 其它属性，添加前缀 set
            setter = "set" + key.substring(0,1).toUpperCase() + key.substring(1);
        }
        // 判断对象是否有属性 set 方法，如果有适用 set 方法赋值。
        if ( object.hasOwnProperty(setter) ) {
            object[setter](value);
        } else {
            object[key] = value;
        }
        console.log("[OMAp] 应用配置: " + keyPath + "." + key + " = " + JSON.stringify(value) + " 。");
    }
    
    /**
     * 将一个对象的属性值，复制到另一个对象同名的属性上。
     * @param sourceObject 要复制的对象
     * @param targetObject 接收值的对象
     * @param targetName 描述目标对象的名称
     * @private
     */
    function _copyValueFromObject1ToObject2(sourceObject, targetObject, targetName) {
        for (var key in sourceObject) { // 遍历复制源
            if (!sourceObject.hasOwnProperty(key)) { continue; }
            var  value = sourceObject[key];
            if ( !value || (typeof value !== 'object') ) { // 值为非 object 时，直接赋值。
                _setKeyValue(targetObject, key, value, targetName);
            } else {
                if (!!targetObject[key] && typeof targetObject[key] === 'object') {
                    // 目标值存在且是 object ，执行深复制。
                    _copyValueFromObject1ToObject2(value, targetObject[key], targetName + "." + key);
                } else {
                    _setKeyValue(targetObject, key, value, targetName);
                }
            }
        }
    }

    /**
     * 适用一个键值对象配置 omApp 对象的初始属性。
     * @param configuration 键值对象
     * @private
     */
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
        }
    };
});



/********************************************************
 *                                                      *
 *               OMApp.current.ready                    *
 *                                                      *
 ********************************************************/

OMApp.registerMethod("ready");

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
        while (_readyHandlers.length > 0) {
            (_readyHandlers.shift()).apply(window);
        }
    }
    
    // 0.1 向 App 发送消息，HTML 页面准备完成，可以初始化 omApp 对象了。
    // - App 需在完成初始化 omApp 对象后调用 didFinishLoading 函数。
    // - 此函数有固定的回调函数，不需要额外传入。
    function _documentIsReady() {
        if (_isReady) { return; }
        OMApp.current.perform(OMApp.Method.ready, null, _didFinishLoading);
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

OMApp.registerMethod('setCurrentTheme');

OMApp.current.defineProperties(function () {
    var _currentTheme = OMApp.Theme.day;
    var _allThemeHandlers = [];
    
    // 绑定主题发生改变函数。如果不传参数表示触发已绑定的函数。
    function _currentThemeChange(handler) {
        if (typeof handler === 'undefined') {
            for (var i = 0; i < _allThemeHandlers.length; i++) {
                _allThemeHandlers[i].call(this, _currentTheme);
            }
            return;
        }
        if (typeof handler !== 'function') {
            return;
        }
        _allThemeHandlers.push(handler);
    }
    
    function _setCurrentTheme(newValue, needsSyncToApp) {
        if (typeof newValue !== 'string') {
            console.log("[OMApp] The currentTheme must be a OMApp.Theme value.");
            return;
        }
        _currentTheme = newValue;
        if (needsSyncToApp || typeof needsSyncToApp === 'undefined') {
            OMApp.current.perform(OMApp.Method.setCurrentTheme, [newValue], null);
        } else {
            _currentThemeChange();
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
        },
        currentThemeChange: {
            get: function () {
                return _currentThemeChange;
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
        if (!callback) {
            console.log("[OMApp] Method `login` called without a callback is not allowed.");
            return;
        }
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
        
        function _setID(newValue) {
            _id = newValue;
        }
        
        function _setName(newValue) {
            _name = newValue;
        }
        
        function _setType(newValue) {
            _type = newValue;
        }
        
        function _setCoin(newValue) {
            _coin = newValue;
        }
        
        Object.defineProperties(this, {
            isOnline: {
                get: function () {
                    return (_type !== OMApp.UserType.visitor)
                }
            },
            id: {
                get: function() { return _id; },
                set: _setID
            },
            name: {
                get: function() { return _name; },
                set: _setName
            },
            type: {
                get: function() { return _type; },
                set: _setType
            },
            coin: {
                get: function() { return _coin; },
                set: _setCoin
            },
            token: {
                get: function() { return _token; },
                set: function(newValue) { _token = newValue; }
            },
            setID: { get: function () { return _setID; } },
            setName: { get: function () { return _setName; } },
            setType: { get: function () { return _setType; } },
            setCoin: { get: function () { return _setCoin; } }
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
        if (typeof page !== 'string') {
            console.log("[OMApp] Method `open`'s page parameter must be a OMApp.Page value.");
            return;
        }
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
    push: 'push',
    pop: 'pop',
    popTo: 'popTo',
    bar: {
        setHidden: "setNavigationBarHidden",
        setTitle: "setNavigationBarTitle",
        setTitleColor: "setNavigationBarTitleColor",
        setBackgroundColor: "setNavigationBarBackgroundColor"
    }
}, 'navigation');

OMApp.current.defineProperty('navigation', function () {
    var _navigation = new (function() {
        
        // 3.1 进入下级页面。
        var _push = function(url, animated) {
            if (typeof url !== 'string') {
                console.log("[OMApp] Method `push` can not be called without a url parameter.");
                return;
            }
            // 不是以 http、https 开头的，被视作为相对路径。
            if (/^(http|https|file):\/\//i.test(url)) {
                url = window.location.protocol + "//" + window.location.host + url;
            }
            if (typeof animated !== 'boolean') {
                animated = true;
            }
            return OMApp.current.perform(OMApp.Method.navigation.push, [url, animated], null);
        };
        
        // 3.2 推出当前页面，使栈内页面数量 -1。
        var _pop = function(animated) {
            if (typeof animated !== 'boolean') {
                animated = true;
            }
            return OMApp.current.perform(OMApp.Method.navigation.pop, [animated], null);
        };
        
        // 3.3 移除栈内索引大于 index 的所有页面，即将 index 页面所显示的内容展示出来。
        var _popTo = function(index, animated) {
            if (typeof index !== 'number') {
                console.log("[OMApp] Method `popTo` can not be called without a index parameter.");
                return;
            }
            if (typeof animated !== 'boolean') {
                animated = true;
            }
            return OMApp.current.perform(OMApp.Method.navigation.popTo, [index, animated]);
        };
        
        // 3.4 Bar
        var _bar = new (function() {
            var _title			 = "Onemena";
            var _titleColor		 = "#000000";
            var _backgroundColor = "#FFFFFF";
            var _isHidden		 = false;
            
            function _setTitle(newValue, needsSyncToApp) {
                if (typeof newValue !== 'string') {
                    console.log("[OMApp] The navigation.bar.title must be a string value.");
                    return;
                }
                _title = newValue;
                if (needsSyncToApp || typeof needsSyncToApp === 'undefined') {
                    OMApp.current.perform(OMApp.Method.navigation.bar.setTitle, [newValue]);
                }
            }
    
            function _setTitleColor(newValue, needsSyncToApp) {
                if (typeof newValue !== 'string') {
                    console.log("[OMApp] The navigation.bar.titleColor must be a string value.");
                    return;
                }
                _titleColor = newValue;
                if (needsSyncToApp || typeof needsSyncToApp === 'undefined') {
                    OMApp.current.perform(OMApp.Method.navigation.bar.setTitleColor, [newValue]);
                }
            }
    
            function _setHidden(newValue, animated, needsSyncToApp) {
                switch (arguments.length) {
                    case 0:
                        break;
                    case 1:
                        animated = true;
                        needsSyncToApp = true;
                        break;
                    case 2:
                        needsSyncToApp = true;
                        break;
                    default:
                        if (typeof needsSyncToApp === 'undefined') {
                            needsSyncToApp = true;
                        }
                        break;
                    
                }
                if (typeof newValue !== 'boolean') {
                    console.log("[OMApp] The navigation.bar.isHidden must be a boolean value.");
                    return;
                }
                _isHidden = newValue;
                if (!needsSyncToApp) { return; }
                OMApp.current.perform(OMApp.Method.navigation.bar.setHidden, [newValue, !!animated]);
            }
    
            function _setBackgroundColor(newValue, needsSyncToApp) {
                if (typeof newValue !== 'string') {
                    console.log("[OMApp] The navigation.bar.backgroundColor must be a string value.");
                    return;
                }
                _backgroundColor = newValue;
                if (needsSyncToApp || typeof needsSyncToApp === 'undefined') {
                    OMApp.current.perform(OMApp.Method.navigation.bar.setBackgroundColor, [newValue]);
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
                        _setHidden(newValue, true, true);
                    }
                },
                setTitle:           { get: function () { return _setTitle; } },
                setTitleColor:      { get: function () { return _setTitleColor; } },
                setBackgroundColor: { get: function () { return _setBackgroundColor; } },
                setHidden:          { get: function () { return _setHidden; } }
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
OMApp.registerMethod("dismiss");

OMApp.current.defineProperties(function () {
    
    function _present(url, arg1, arg2) {
        if (typeof url !== 'string') {
            console.log("[OMApp] Method `present` first parameter must be a string value.");
            return;
        }
        var animated = arg1;
        var completion = arg2;
        if (typeof arg1 === 'function') {
            animated = true;
            completion = arg1;
        }
        if (typeof animated !== 'boolean') {
            animated = true;
        }
        OMApp.current.perform(OMApp.Method.present, [url, animated], completion);
    }
    
    function _dismiss(arg1, arg2) {
        var animated = arg1;
        var completion = arg2;
        if (typeof arg1 === 'function') {
            animated = true;
            completion = arg1;
        }
        if (typeof animated !== 'boolean') { animated = true; }
        OMApp.current.perform(OMApp.Method.dismiss, [animated], completion);
    }
    
    return {
        present: { get: function () { return _present; } },
        dismiss: { get: function () { return _dismiss; } }
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
        other: 		    { get: function() { return "other";		    } }
    });
    return {
        get: function () {
            return _NetworkingType;
        }
    }
});

OMApp.registerMethod({
    http: "http"
}, "networking");

OMApp.current.defineProperty("networking", function () {
    var _networking = new (function() {
        var _type = OMApp.NetworkingType.other;
        
        // HTTP 请求
        function _http(request, callback) {
            if (!request || typeof request !== 'object') {
                console.log("[OMApp] Method `http` first parameter must be an request object.");
                return;
            }
            return OMApp.current.perform(OMApp.Method.networking.http, [request], callback);
        }
        
        function _setType(newValue) {
            _type = newValue;
        }
        
        Object.defineProperties(this, {
            type: {
                get: function() { return _type; },
                set: _setType
            },
            isReachable: {
                get: function() { return (_type !== OMApp.NetworkingType.none); }
            },
            isViaWiFi: {
                get: function() { return (_type === OMApp.NetworkingType.WiFi); }
            },
            http: {
                get: function() { return _http; }
            },
            setType: { get: function () { return _setType; } }
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
 *                OMApp.current.alert                   *
 *                                                      *
 ********************************************************/

OMApp.registerMethod("alert");

OMApp.current.defineProperty('alert', function () {
    function _alert(message, callback) {
        if (!message || typeof message !== 'object') {
            console.log("[OMApp] Method `alert` first parameter must be an message object.");
            return;
        }
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
 *               OMApp.current.services                 *
 *                                                      *
 ********************************************************/

OMApp.registerMethod({
    data: {
        numberOfRowsInList: "numberOfRowsInList",
        dataForRowAtIndex: "dataForRowAtIndex",
        cachedResourceForURL: "cachedResourceForURL"
    },
    event: {
        didSelectRowAtIndex: "didSelectRowAtIndex",
        elementWasClicked: "elementWasClicked"
    },
    analytics: {
        track: "track"
    }
}, "services");

OMApp.defineProperty("CacheType", function () {
    
    var _CacheType = new (function () {
        Object.defineProperties(this, {
            image: { get: function () { return "image"; } }
        })
    })();
    
    return {
        get: function () {
            return _CacheType;
        }
    }
});


OMApp.current.defineProperty('services', function () {
    
    var _services = new (function () {
    
        var _data = new (function () {
        
            // 获取 list 的行数。
            // - list: string
            // - callback: (number)=>void
            function _numberOfRowsInList(documentName, listName, callback) {
                if (typeof documentName !== 'string' || typeof listName !== 'string') {
                    console.log("[OMApp] Method `numberOfRowsInList` first/second parameter must be a string value.");
                    return;
                }
                var method = OMApp.Method.services.data.numberOfRowsInList;
                OMApp.current.perform(method, [documentName, listName], callback);
            }
        
            // 加载数据
            // - list: OMAppList
            // - index: number
            // - callback: (data)=>void
            function _dataForRowAtIndex(documentName, listName, index, callback) {
                if (typeof documentName !== 'string' || typeof listName !== 'string' || typeof index !== 'number') {
                    console.log("[OMApp] Method `dataForRowAtIndex` first/second/third parameter must be a string/string/number value.");
                    return;
                }
                var method = OMApp.Method.services.data.dataForRowAtIndex;
                OMApp.current.perform(method, [documentName, listName, index], callback);
            }
        
            // 获取缓存。
            function _cachedResourceForURL(url, cacheType, completion) {
                // 检查 URL
                if (typeof url !== 'string') {
                    console.log("[OMApp] Method `cachedResourceForURL` url parameter must be a string value.");
                    return;
                }
                // 检查 cacheType
                switch (typeof cacheType) {
                    case 'function':
                        completion = cacheType;
                        cacheType = OMApp.CacheType.image;
                        break;
                    case 'string':
                        switch (cacheType) {
                            case OMApp.CacheType.image:
                                break;
                            default:
                                console.log("[OMApp] CacheType fot method `cachedResourceForURL` is not supported yet.");
                                return;
                        }
                        break;
                    default:
                        
                        cacheType = OMApp.CacheType.image;
                        break;
                }
                // 检查 handler
                if (typeof completion !== 'function') {
                    console.log("[OMApp] Method `cachedResourceForURL` must have a callback handler.");
                    return;
                }
                var method = OMApp.Method.services.data.cachedResourceForURL;
                OMApp.current.perform(method, [url, cacheType], completion);
            }
        
            Object.defineProperties(this, {
                numberOfRowsInList: {
                    get: function () {
                        return _numberOfRowsInList;
                    }
                },
                dataForRowAtIndex: {
                    get: function () {
                        return _dataForRowAtIndex;
                    }
                },
                cachedResourceForURL: {
                    get: function () {
                        return _cachedResourceForURL;
                    }
                }
            });
        
        });
    
        var _event = new (function () {
        
            // List 点击事件。
            function _didSelectRowAtIndex(documentName, listName, index, callback) {
                if (typeof documentName !== 'string' || typeof listName !== 'string' || typeof index !== 'number') {
                    console.log("[OMApp] Method `didSelectRowAtIndex` first/second/third parameter must be a string/string/number value.");
                    return;
                }
                var method = OMApp.Method.services.event.didSelectRowAtIndex;
                OMApp.current.perform(method, [documentName, listName, index], callback);
            }
        
            // 处理事件
            function _elementWasClicked(documentName, elementName, data, callback) {
                if (typeof documentName !== 'string' || typeof elementName !== 'string') {
                    console.log("[OMApp] Method `elementWasClicked` first/second parameter must be a string value.");
                    return;
                }
                var method = OMApp.Method.services.event.elementWasClicked;
                OMApp.current.perform(method, [documentName, elementName, data], callback);
            }
        
            Object.defineProperties(this, {
                didSelectRowAtIndex: {
                    get: function () {
                        return _didSelectRowAtIndex;
                    }
                },
                elementWasClicked: {
                    get: function () {
                        return _elementWasClicked;
                    }
                }
            });
        
        });
        
        var _analytics = new (function () {
            function _track(event, parameters) {
                if (typeof event !== 'string') {
                    console.log("[OMApp] Method `track` first parameter must be a string value.");
                    return;
                }
                return OMApp.current.perform(OMApp.Method.services.analytics.track, [event, parameters]);
            }
            Object.defineProperties(this, {
                track: {
                    get: function () {
                        return _track;
                    }
                }
            })
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
            },
            analytics: {
                get: function () {
                    return _analytics;
                }
            }
        });
    })();

    return {
        get: function () {
            return _services;
        }
    };
    
});































































/********************************************************
 *                                                      *
 *                     OMApp.Delegate                   *
 *                                                      *
 ********************************************************/

function _OMAppDelegate() {
    
    this.ready = function (callback) {
        console.log("[OMApp] omApp.ready is called by default handler.");
        callback();
    };
    
    this.setCurrentTheme = function (newValue) {
        console.log("[OMApp] omApp.setCurrentTheme = " + newValue + ".");
    };
    
    this.login = function (callback) {
        console.log("[OMApp] omApp.login is called with a confirm handler.");
        callback(confirm('点击按钮确定登陆！ \n[确定] -> 登录成功 \n[取消] -> 登录失败'));
    };
    
    this.open = function (page, parameters) {
        console.log("[OMApp] omApp.open is called with {page: "+ page +", parameters: "+ JSON.stringify(parameters) + "}.");
    };
    
    this.present = function (url, animated, completion) {
        console.log("[OMApp] omApp.present is called with {url: "+ url + ", animated: "+ animated +"} and default handler.");
        setTimeout(completion);
    };
    
    this.push = function (url, animated) {
        console.log("[OMApp] omApp.navigation.push is called with {url: "+ url +", animated: "+ animated +"}.");
    };
    
    this.pop = function (animated) {
        console.log("[OMApp] omApp.navigation.pop is called with {animated: "+ animated + "}.");
    };
    
    this.popTo = function (index, animated) {
        console.log("[OMApp] omApp.navigation.popTo is called with {index: "+ index +", animated: "+ animated +"}.");
    };
    
    this.setNavigationBarHidden = function (newValue) {
        console.log("[OMApp] omApp.navigation.bar.isHidden = " + newValue + ".");
    };
    
    this.setNavigationBarTitle = function (newValue) {
        console.log("[OMApp] omApp.navigation.bar.title = " + newValue + ".");
    };
    
    this.setNavigationBarTitleColor = function (newValue) {
        console.log("[OMApp] omApp.navigation.bar.titleColor = " + newValue + ".");
    };
    
    this.setNavigationBarBackgroundColor = function (newValue) {
        console.log("[OMApp] omApp.navigation.bar.backgroundColor = " + newValue + ".");
    };
    
    this.track = function (event, parameters) {
        console.log("[OMApp] omApp.analytics.track is called with {event: "+ event + ", parameters: " + JSON.stringify(parameters) + "}.");
    };
    
    this.alert = function (message, callback) {
        console.log("[OMApp] omApp.alert is called with {message: "+ JSON.stringify(message) +" } and default handler(-1).");
        callback(-1);
    };
    
    this.http = function (request, callback) {
        this.ajax(request, callback);
        console.log("[OMApp] omApp.http is call with default handler (ajax).");
    };
    
    this.numberOfRowsInList = function (documentName, listName, callback) {
        console.log("[OMApp] omApp.services.data.numberOfRowsInList is called with {document: " + documentName + ", list: " + listName + "} and default handler(4).");
        setTimeout(function() {
            callback(4);
        }, Math.random() * 10000);
    };
    
    this.dataForRowAtIndex = function (documentName, listName, index, callback) {
        console.log("[OMApp] omApp.services.data.dataForRowAtIndex: " + documentName + ", " + listName + ", " + index + ".");
        setTimeout(function () {
            callback({});
        }, Math.random() * 10000);
    };
    
    this.cachedResourceForURL = function (url, resourceType, callback) {
        console.log("[OMApp] omApp.services.data.cachedResourceForURL is called with {url: " + url + ", resourceType: " + resourceType + "}.");
        if (callback) { callback(url); }
    };
    
    this.didSelectRowAtIndex = function (documentName, listName, index, callback) {
        console.log("[OMApp] omApp.services.event.didSelectRowAtIndex is called with {document: " + documentName + ", list: " + listName + ", index: " + index + "}.");
        if (callback) { callback(); }
    };
    
    this.elementWasClicked = function (documentName, elementName, data, callback) {
        console.log("[OMApp] omApp.services.event.dataForRowAtIndex is called with {document: " + documentName + ", element: " + elementName + ", data: " + data + "}.");
        if (typeof data === 'boolean' && typeof callback === 'function') {
            callback(!data);
        }
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
    this.ajax = function (request, callback) {
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
    };
    
    this.ajaxSettings = function (newValue) {
        if (newValue) {
            _setAjaxSettings(newValue);
        }
        return _ajaxSettings;
    };
    
}

if (!OMApp.current.isInApp) {
    
    // 当处于非 App 环境时，设置默认代理。
    OMApp.current.delegate = new _OMAppDelegate();
    
}




