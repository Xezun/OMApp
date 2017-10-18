// OMApp.js 3.0.0

/********************************************************
 *                                                      *
 *                         OMApp                        *
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
    
    function _OMApp(_isInApp) {
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
            },
            isInApp: {
                get: function () {
                    return _isInApp;
                }
            }
        });
    }
    
    Object.defineProperties(_OMApp, {
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
    
    Object.defineProperty(window, 'OMApp', {
        get: function () {
            return _OMApp;
        }
    });
    
})();


// OMApp, OMApp.version
OMApp.defineProperties(function () {
    
    var _version = "3.0.0";
    
    return {
        version: {
            get: function () {
                return _version;
            }
        }
    }
});



/********************************************************
 *                                                      *
 *               OMApp.current, omApp                   *
 *                                                      *
 ********************************************************/

(function () {
    var _omApp = new OMApp(/Onemena/i.test(window.navigator.userAgent));
    
    // 定义全局 OMApp.current 属性。
    OMApp.defineProperties(function () {
        return {
            current: {
                get: function () { return _omApp; }
            }
        }
    });
    
    // 定义全局 window.omApp 属性。
    if (typeof omApp !== 'undefined') {
        console.log("[OMApp] `omApp` 已被定义，无法将其作为 OMApp.current 的直接访问方式。");
    } else {
        Object.defineProperty(window, 'omApp', {
            get: function () { return _omApp; }
        });
    }
})();

// OMApp.current.name, OMApp.current.system
OMApp.current.defineProperties(function () {
    var _name = "app"; // name 将被用作 URL 交互的协议。
    // App 系统信息相关
    var _system = new (function () {
        var _userAgent = window.navigator.userAgent;
        var _isAndroid = /Android/i.test(_userAgent);
        var _isiOS     = /\(i[^;]+;( U;)? CPU.+Mac OS X/.test(_userAgent);
        Object.defineProperties(this, {
            isAndroid: {
                get: function () {
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
    
    return {
        name: {
            get: function() {
                return _name;
            },
            set: function(newValue) {
                if (/[^a-z]/.test(newValue)) {
                    console.log("[OMApp] omApp.name 必须只能为全小写字母。");
                    return;
                }
                _name = newValue;
            }
        },
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
    function _URLQuery(anObject) {
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
        URLQuery: {
            get: function () {
                return _URLQuery;
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

window.OMApp.registerMethod("ready");

// omApp.delegate, omApp.dispatch, omApp.perform, omApp.ready
window.OMApp.current.defineProperties(function () {
    var _delegate       = null;
    var _uniqueNumber   = 100000;
    var _allCallbacks   = {};
    
    // 保存一个 callback ，并返回其 ID 。
    // 如果 callback 不合法，返回 null。
    function _save(callback) {
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
        if ( !method || (typeof method !== 'string') ) { return; }
        var callbackID = null;
        if ( !!_delegate ) {
            if (typeof _delegate === 'function') {
                callbackID = _save(callback);
                _delegate(method, parameters, callbackID);
                return callbackID;
            }
            
            if ( !_delegate.hasOwnProperty(method) || (typeof _delegate[method] !== 'function') ) {
                console.log("[OMApp] omApp.delegate 没有实现方法 " + method + "，操作无法进行。");
                return null;
            }
    
            function _makeArguments() {
                if (!Array.isArray(parameters)) { parameters = []; }
                if ( this.isInApp && this.system.isAndroid ) {
                    for (var i = 0; i < parameters.length; i += 1) {
                        var value = parameters[i];
                        switch (typeof value) {
                            case 'number':
                            case 'string':
                            case 'boolean':
                                break;
                            default:
                                parameters.splice(i, 1, JSON.stringify(value));
                                break;
                        }
                    }
                    callbackID = _save(callback);
                    if (callbackID) { parameters.push(callbackID); }
                } else if (callback) {
                    parameters.push(callback);
                }
                return parameters;
            }
            
            _delegate[method].apply(window, _makeArguments());
            return callbackID;
        }
        
        var url = OMApp.current.name + "://" + method;
        
        callbackID = _save(callback);
        if (callbackID) {
            if (parameters) {
                parameters.push(callbackID);
            } else {
                parameters = [callbackID];
            }
        }
        
        var queryString = OMApp.URLQuery(parameters);
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
    
    // 标识 omApp 是否初始化完成
    var _isReady = false;
    
    // 所有通过 omApp.ready 方法传递的函数。
    // - omApp.isReady = true 后依次执行。
    var _readyHandlers = null;
    
    // 是否调试模式
    var _isDebug = true;
    
    // App 完成初始化 omApp 对象。触发回调。
    function _didInitializeWithMode(isDebug) {
        if (!_readyHandlers) {
            console.log('[OMApp] 为了保证 omApp 在使用时已完成初始化，请将操作放在 \nomApp.ready(function() {\n\t/*代码*/\n}); \n中。');
            return;
        }
        _isReady = true;
        _isDebug = !!isDebug;
        while (_readyHandlers.length > 0) {
            (_readyHandlers.shift()).apply(window);
        }
    }
    
    // 0.1 向 App 发送消息，HTML 页面准备完成，可以初始化 omApp 对象了。
    // - App 需在完成初始化 omApp 对象后调用 didFinishLoading 函数。
    // - 此函数有固定的回调函数，不需要额外传入。
    function _documentIsReady() {
        if (_isReady) { return; }
        OMApp.current.perform(OMApp.Method.ready, null, _didInitializeWithMode);
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
                // 事件触发可能与页面加载在同一个进程里完成，造成 iOS.WKWebView 在文档末尾注入的 JS 晚于 ready 执行。
                // 所以需要使用异步。
                setTimeout(_documentIsReady);
            };
            // Listener 不会被重复添加。
            document.addEventListener("DOMContentLoaded", _eventListener, false);
            window.addEventListener("load", _eventListener, false);
        }
    }
    
    return {
        delegate: {
            get: function () {
                return _delegate;
            },
            set: function (newValue) {
                if (_delegate === newValue) { return; }
                // 如果重新设置了代理是否需要重新发送 ready 事件？
                // 不。代理需要在 ready 事件前设置。如果使用者在 ready 之后或不确定的时机设置，则需要开发者自己去判断当前状态。
                _delegate = newValue;
                // 如果文档已加载完成，但是 ready 状态并未改变，向代理发送 ready 事件。
                if (!_isReady && document.readyState === 'complete') {
                    setTimeout(_documentIsReady);
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
        },
        isDebug: {
            get: function () {
                return _isDebug;
            }
        },
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
    function _onCurrentThemeChange(handler) {
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
            _onCurrentThemeChange();
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
        onCurrentThemeChange: {
            get: function () {
                return _onCurrentThemeChange;
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

/// 当处于非 App 环境时，设置默认代理。
(function () {
    if (OMApp.current.isInApp) { return; }
    /// ajax 请求全局设置。
    var _ajaxSettings = {};
    
    function _setAjaxSettings(newValue) {
        if (!newValue) { return; }
        if (typeof newValue !== 'object') { return; }
        for (var key in newValue) {
            if (!newValue.hasOwnProperty(key)) { continue; }
            _ajaxSettings[key] = newValue[key];
        }
    }
    
    /// ajax 请求。
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
        var data = OMApp.URLQuery(dataObject);
        xhr.send(data);
    }
    
    // 代理
    var _delegate = {};
    
    _delegate.ready = function(callback) {
        console.log("[OMApp] App 收到 omApp 的初始化请求。在非 App 环境下，omApp 为调试模式。");
        callback(true);
    };
    
    _delegate.setCurrentTheme = function(newValue) {
        console.log("[OMApp] 设置 App 主题：" + newValue + "。");
    };
    
    _delegate.login = function(callback) {
        console.log("[OMApp] App 收到了 login 消息。在调试环境下，使用 confirm 对话框模拟。");
        callback(confirm('点击按钮确定登陆！ \n[确定] -> 登录成功 \n[取消] -> 登录失败'));
    };
    
    _delegate.open = function(page, parameters) {
        console.log("[OMApp] 打开 App 原生页面："+ page +"，页面参数："+ JSON.stringify(parameters) + "。");
    };
    
    _delegate.present = function(url, animated, completion) {
        console.log("[OMApp] 模态展示新页面："+ url + "，是否转场动画："+ animated +"。");
        setTimeout(completion);
    };
    
    _delegate.push = function(url, animated) {
        console.log("[OMApp] 导航到下级页面： "+ url +"，是否转场动画："+ animated +"。");
    };
    
    _delegate.pop = function(animated) {
        console.log("[OMApp] 导航返回上级页面，是否转场动画："+ animated + "。");
    };
    
    _delegate.popTo = function(index, animated) {
        console.log("[OMApp] 导航返回指定页面："+ index +"，是否转场动画："+ animated +"。");
    };
    
    _delegate.setNavigationBarHidden = function(newValue) {
        console.log("[OMApp] 设置是否隐藏导航条：" + newValue + "。");
    };
    
    _delegate.setNavigationBarTitle = function(newValue) {
        console.log("[OMApp] 设置导航条标题：" + newValue + "。");
    };
    
    _delegate.setNavigationBarTitleColor = function(newValue) {
        console.log("[OMApp] 设置导航条标题文字颜色：" + newValue + "。");
    };
    
    _delegate.setNavigationBarBackgroundColor = function(newValue) {
        console.log("[OMApp] 设置导航条背景色：" + newValue + "。");
    };
    
    _delegate.track = function(event, parameters) {
        console.log("[OMApp] 统计分析："+ event + "，参数：" + JSON.stringify(parameters) + "。");
    };
    
    _delegate.alert = function(message, callback) {
        console.log("[OMApp] 提示框："+ JSON.stringify(message) +"。调试环境下，回调返回选中按钮的排序为 -1 。");
        callback(-1);
    };
    
    _delegate.http = function(request, callback) {
        _ajax(request, callback);
        console.log("[OMApp] App 接收到 http 消息。在调试环境下，该消息由 JavaScript 的 AJAX 模拟。");
    };
    
    _delegate.numberOfRowsInList = function(documentName, listName, callback) {
        console.log("[OMApp] 查询页面 " + documentName + " 中列表 " + listName + " 的数据行数。调试环境返回 4 。");
        setTimeout(function() {
            callback(4);
        }, Math.random() * 10000);
    };
    
    _delegate.dataForRowAtIndex = function(documentName, listName, index, callback) {
        console.log("[OMApp] 请求查询页面 " + documentName + " 中的列表 " + listName + " 第 " + index + " 行数据。");
        setTimeout(function () {
            callback({});
        }, Math.random() * 10000);
    };
    
    _delegate.cachedResourceForURL = function(url, resourceType, callback) {
        console.log("[OMApp] 获取资源的缓存：链接，" + url + "；类型，" + resourceType + " 。");
        if (callback) { callback(url); }
    };
    
    _delegate.didSelectRowAtIndex = function(documentName, listName, index, callback) {
        console.log("[OMApp] 页面 " + documentName + " 中的列表 " + listName + " 的第 " + index + " 行被选中。");
        if (callback) { callback(); }
    };
    
    _delegate.elementWasClicked = function(documentName, elementName, data, callback) {
        console.log("[OMApp] 页面 " + documentName + " 中的 " + elementName + " 元素被点击了：" + data + " 。");
        if (typeof data === 'boolean' && typeof callback === 'function') {
            callback(!data);
        }
    };
    
    _delegate.ajaxSettings = function (newValue) {
        if (newValue) {
            _setAjaxSettings(newValue);
        }
        return _ajaxSettings;
    };
    
    _delegate.ajax = _ajax;
    
    OMApp.current.delegate = _delegate;
})();





