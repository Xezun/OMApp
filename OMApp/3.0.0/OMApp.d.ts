// Type definitions for OMApp 3.0.0
//
// 2017-08-24
// Powered by mlibai.

declare const OMApp: OMAppStatic;
declare const omApp: OMAppInstance;

/**
 * 在 HTML 与 App 的交互过程中，OMApp 在 JavaScript 环境中代表的就是 App，它模拟了 App 具有的属性和方法，将
 * HTML 对 App 的交互过程转简化为对 OMApp 对象属性和方法的访问。
 *
 * 由于平台、环境的不同，App 与 HTML 的实际交互方式不一，但是 OMApp 负责对外统一接口，以保证适应各个平台：
 * - OMApp 是单纯的 JS 对象，它将 HTML 对其方法的调用转化成 "消息" 发送给 App 来实现 HTML 对 App 功能的访问；
 * - 因为 OMApp 的部分属性描述的是 App 的属性，因此 App 在状态更改时，需同步信息到 OMApp，在具体的接口中会有说明。
 */
interface OMAppStatic {

    /**
     * 只读。标识当前 OMApp 版本，如 3.0.0 。
     */
    version: string;

    /**
     * 为了方便对 OMApp 进行拓展升级，提供了一个通过闭包函数构造属性的方法。
     * - 构造属性的闭包函数必须返回与 Object.defineProperty 方法所需相同的参数。
     *
     * @param propertyName 属性名
     * @param descriptor 构造属性的闭包
     */
    defineProperty(propertyName, descriptor: () => object): void;

    /**
     * 为了方便对 OMApp 进行拓展升级，提供了一个通过闭包函数构造属性的方法。
     * - 构造属性的闭包函数必须返回与 Object.defineProperties 方法所需相同的参数。
     *
     * @param descriptor 构造属性的闭包
     */
    defineProperties(descriptor: () => object): void;

    /**
     * 将一个 Object 格式化成 URL query 字符串。根据 anObject 类型的不同分别进行以下处理：
     * - Array：直接转换成 JSON 串，返回该串的 encodeURIComponent 值。
     * - String：直接返回该串的 encodeURIComponent 。
     * - Object：遍历所有属性Key和值Value，对属性名和值（值如果不是字符串，则进行 JSON.stringify）进行 encodeURIComponent，并拼接成 key1=vlaue1&key2=value2 的形式。
     * - Null/Undefined: 返回字符串 null 。
     * - 其它值，对其 JSON.stringify 后返回其 encodeURIComponent 。
     *
     * @param anObject 键值对象
     */
    URLQueryStringFromObject(anObject: object): string;

    /**
     * 注册 OMApp.Method ，如果注册失败，请留意控制台输出。
     * - 只有 string 或以 string 为键值的 Object 类型可以注册为 Method 。
     *
     * @param method 将作为 OMApp.Method 的属性值
     * @param name 引用注册方法时调用 OMApp.Method 的属性名
     * @return boolean 是否注册成功
     */
    registerMethod(method: any, name?: string): boolean;

    /**
     * 只读。当前 HTML 环境所处的与 App 对象。
     * - OMApp.current 与 omApp 都可以获取对它的引用。
     */
    current: OMAppInstance;

}

interface OMAppInstance {

    /**
     * 只读。标识当前环境是否处于 App 中。
     */
    isInApp: boolean;

    /**
     * 只读。当前 App 系统信息。
     */
    system: {
        /**
         * 只读。是否安卓系统。
         */
        isAndroid: boolean;

        /**
         * 只读。是否是 iOS 系统。
         */
        isiOS: boolean;
    };

    /**
     * 只读。App 标识，被用作 HTML 与 App 交互的 scheme 。
     */
    name: string;

    /**
     * 给 OMApp 实例对象拓展单个属性。构造属性的闭包函数必须返回与 Object.defineProperty 方法所需相同的参数。
     *
     * @param propertyName 属性名
     * @param {() => Object} descriptor 构造属性的闭包函数。
     */
    defineProperty(propertyName, descriptor: () => object): void;

    /**
     * 给 OMApp 实例对象拓展多个属性。构造属性的闭包函数必须返回与 Object.defineProperties 方法所需相同的参数。
     *
     * @param {() => Object} descriptor 属性构造闭包函数
     */
    defineProperties(descriptor: () => object): void;

    // OM.Basic

    /**
     * 可写。OMApp 事件代理。
     * - 在非 App 环境中，该属性初始化，方便开发者在桌面浏览器中测试。
     * - 一般情况下，这个属性是原生 App 对象，用于接收 HTML 的事件。
     * - 在桌面浏览器中，可以通过设置此属性，来模拟 App 在接收到事件时的行为。
     */
    delegate: OMAppDelegate|((message: OMAppDelegateMessage) => void)|any;

    /**
     * 执行 App 的指定的已约定的方法。
     * - 一般情况下，不需要调用此方法；直接使用 OMApp.current 的具体方法即可。
     * - 本访问主要是给拓展 OMApp.current 时使用。
     * - 方法参数可以包含一个回调函数，作为单独参数传入。
     *
     * @param {OMAppMethod} method 已注册的方法
     * @param {[any]} parameters 方法对应的参数，不包括回调函数
     * @param {() => void} callback 方法的回调函数
     * @return {string} 如果方法有回调函数，将返回回调函数的唯一标识
     */
    perform(method: OMAppMethod, parameters?: [any], callback?: () => void): string;

    /**
     * 本方法主要是提供给 App 使用。
     * 因为交互机制的原因，如果 App 不能直接接收回调函数，那么回调函数将被保存起来，并生成唯一ID传递给 App。
     * App 执行完相应的任务后，通过调用此方法来唤起回调函数执行。
     * 通过唯一标识符，调度并执行 perform 方法中所传入回调函数。
     *
     * @param {string} callbackID
     * @param args 回调函数执行时的参数
     * @return {any} 回调函数的返回值
     */
    dispatch(callbackID: string, ...args: any[]): any;


    // Config

    /**
     * 用键值对象配置 OMApp 实例对象属性的初始值。
     * - 该方法只有在非 App 环境中才会生效。
     * @param {Object} configuration
     */
    config(configuration: object): void;

    // OM.ready

    /**
     * 只读。标识当前 OMApp 是否已完成初始化。如果操作必须在 OMApp 完成初始化后进行，请在 ready 方法中执行。
     */
    isReady: boolean;

    /**
     * 当 OMApp 实例对象完成初始化时，通过此方法传递的闭包函数会被执行。
     * - 请注意，若此方法不调用，omApp 对象可能不会进行初始化操作。
     * @param {() => void} callback 需在 OMApp 实例对象完成初始化后执行的闭包函数
     */
    ready(callback: () => void): void;

    /**
     * 读写。当前 App 主题。直接更改此属性，将更改主题事件同步到 App 中，但不会触发已绑定的主题事件。
     */
    currentTheme: OMAppTheme;

    /**
     * 供 App 初始化或设置值时使用。needsSyncToApp 参数决定了改方法的行为：
     * - true：更改主题的行为将同步到 App ，即 App 会收到主题变更事件。
     * - false：更改不同步到 App ，但是会触发已绑定的 currentThemeChange 事件。
     *
     * @param {OMAppTheme} theme 新的主题
     * @param {boolean} needsSyncToApp 是否需要同步到 App，默认 true。
     */
    setCurrentTheme(theme: OMAppTheme, needsSyncToApp?: boolean): void;

    /**
     * 注册一个监听主题发生改变的闭包函数。如果不传递参数则触发已注册的闭包函数。
     * @param {(currentTheme: OMAppTheme) => void} callback
     */
    onCurrentThemeChange(callback: (currentTheme: OMAppTheme) => void);

    // OM.login

    /**
     * 发起 App 登录进程。
     *
     * @param {(isSuccess: boolean) => void} callback 登录后的回调
     */
    login(callback: (isSuccess: boolean) => void): void;

    /**
     * 获取当前 App 已登录的用户。
     */
    currentUser: {

        /**
         * 只读。是否在线。
         */
        isOnline: boolean;

        /**
         * 只读。用户唯一标识。
         */
        id: string;

        /**
         * 只读。用户显示名。
         */
        name: string;

        /**
         * 只读。用户类型。
         */
        type: OMAppUserType;

        /**
         * 只读。金币数。
         */
        coin: number;

        /**
         * App 初始化 omApp 对象时，使用此方法设置用户 ID。
         * - 请在业务逻辑中请勿使用此方法，以保持 currentUser.id 的只读特性。
         *
         * @param {string} newID
         */
        setID(newID: string): void;

        /**
         * App 初始化 omApp 对象时，使用此方法设置用户名。
         * - 请在业务逻辑中请勿使用此方法，以保持 currentUser.name 的只读特性。
         *
         * @param {string} newName
         */
        setName(newName: string): void;

        /**
         * App 初始化 omApp 对象时，使用此方法设置用户类型。
         * - 请在业务逻辑中请勿使用此方法，以保持 currentUser.type 的只读特性。
         *
         * @param {string} newType
         */
        setType(newType: OMAppUserType): void;

        /**
         * App 初始化 omApp 对象时，使用此方法设置用户金币数。
         * - 请在业务逻辑中请勿使用此方法，以保持 currentUser.coin 的只读特性。
         *
         * @param {string} newCoin
         */
        setCoin(newCoin: number): void;

    };

    /**
     * 通过次方来打开 App 指定的页面。
     *
     * @param {OMAppPage} page 指定的页面
     * @param {Object} parameters 打开页面所需的参数
     */
    open(page: OMAppPage, parameters?: object): void;

    /**
     * 封装了 App 管理导航行为的对象，通过此对象来控制 App 页面的导航行为。
     */
    navigation: {

        /**
         * App 页面导航行为，进入下级页面，导航栈 +1。
         * @param {string} url 下级页面的 URL
         * @param {boolean} animated 是否展示转场动画
         */
        push(url: string, animated: boolean): void;

        /**
         * App 页面导航行为，弹出导航栈顶页面 -1。
         * @param {boolean} animated 是否展示转场动画
         */
        pop(animated: boolean): void;

        /**
         * App 页面导航行为，弹出导航栈内页面到指定页面。导航栈以 HTML 页面计算。
         * @param {number} index 页面在栈内的索引
         * @param {boolean} animated 是否展示转场动画
         */
        popTo(index: number, animated: boolean): void;

        /**
         * 只读。导航条对象。
         */
        bar: {

            /**
             * 可写。是否隐藏。直接修改属性，会同步到 App 。
             */
            isHidden: boolean;

            /**
             * 可写。标题。直接修改属性，会同步到 App 。
             */
            title: string;

            /**
             * 可写。标题文字颜色。直接修改属性，会同步到 App 。
             */
            titleColor: string;

            /**
             * 可写。导航条背景色。直接修改属性，会同步到 App 。
             */
            backgroundColor: string;

            /**
             * 设置导航条隐藏／显示。
             *
             * @param {boolean} isHidden 是否隐藏
             * @param {boolean} animated 是否展示显示/隐藏动画
             * @param {boolean} needsSyncToApp 是否需要同步到 App，默认 true。
             */
            setHidden(isHidden: boolean, animated: boolean, needsSyncToApp?: boolean): void;

            /**
             * 设置标题。供 App 初始化或设置值时使用，调用此方法，设置的值不会触发 App 方法。
             *
             * @param {string} title
             * @param {boolean} needsSyncToApp 是否需要同步到 App，默认 true。
             */
            setTitle(title: string, needsSyncToApp?: boolean): void;

            /**
             * 设置标题文字颜色。供 App 初始化或设置值时使用，调用此方法，设置的值不会触发 App 方法。
             *
             * @param {string} titleColor
             * @param {boolean} needsSyncToApp 是否需要同步到 App，默认 true。
             */
            setTitleColor(titleColor: string, needsSyncToApp?: boolean): void;

            /**
             * 供 App 初始化使用。供 App 初始化或设置值时使用，调用此方法，设置的值不会触发 App 方法。
             *
             * @param {string} backgroundColor
             * @param {boolean} needsSyncToApp 是否需要同步到 App，默认 true。
             */
            setBackgroundColor(backgroundColor: string, needsSyncToApp?: boolean): void;
        };
    };

    /**
     * 以模态的方式，打开一个新的 HTML 页面，新打开的页面与当前页面处于不同的导航栈结构中。
     * @param {string} url 要打开的页面的 URL
     * @param {boolean} animated 是否展示动画效果，默认 true
     * @param {() => void} completion
     */
    present(url: string, animated?: boolean, completion?: () => void): void;

    /**
     * 关闭已打开的模态页面。如果当前页面是模态出来的页面，则关闭当前的页面，否则关闭当前页面模态出来的页面。
     * @param {boolean} animated
     */
    dismiss(animated: boolean): void;

    /**
     * 只读。封装了 App 网络功能的对象。
     */
    networking: {

        /**
         * 只读。网络是否已连通互联网。
         */
        isReachable: boolean;

        /**
         * 是否通过 Wi-Fi 上网。
         */
        isViaWiFi: boolean;

        /**
         * 只读。当前 App 接入网络的类型。
         */
        type: OMAppNetworkingType;

        /**
         * 设置网络类型。供 App 初始化网络类型使用。
         *
         * @param {OMAppNetworkingType} newType
         */
        setType(newType: OMAppNetworkingType): void;

        // networkTypeChange(handler): void;

        /**
         * 发送网络请求。
         * @param {OMApp.HTTPRequest} request 网络请求对象
         * @param {(response: OMApp.HTTPResponse) => void} callback 网络请求回调
         */
        http(request: OMAppHTTPRequest, callback: (response: OMAppHTTPResponse) => void): void;
    };

    /**
     * 调用 App 网络功能发送 HTTP 请求的快捷方法。
     * @param {OMApp.HTTPRequest} request 包含网络请求的信息
     * @param {(response: OMApp.HTTPResponse) => void} callback 网络请求后的回调
     */
    http(request: OMAppHTTPRequest, callback: (response: OMAppHTTPResponse) => void): void;

    /**
     * 调用 App 原生 alert 方法。
     * @param {OMApp.AlertMessage} message 需要 alert 的消息内容
     * @param {(index: number) => void} callback 按钮事件
     */
    alert(message: OMAppAlertMessage, callback?: (index: number) => void): void;

    /**
     * 只读。封装了 App 提供的各类服务，通过此方法来获取 OMApp 实例对象更多的内容 。
     */
    services: {
        /**
         * 只读。App 数据服务。
         */
        data: {

            /**
             * 当页面列表通过 App 管理数据源时，通过此方法获取列表的行数。
             * @param {string} documentName 页面名称
             * @param {string} listName     列表名称
             * @param {(count: number) => void} callback 获取行数在此回调中
             */
            numberOfRowsInList(documentName: string, listName: string, callback: (count: number) => void): void;

            /**
             * 通过此方法获取指定页面，指定列表指定行的数据。
             * @param {string} documentName 页面名称
             * @param {string} listName     列表名称
             * @param {number} index        行索引
             * @param {(data: any) => void} callback 获取数据的回调。
             */
            dataForRowAtIndex(documentName: string, listName: string, index: number, callback: (data: any) => void): void;

            /**
             * 通过此接口让 App 缓存指定 URL 资源。
             * @param {string} url 资源的 URL
             * @param {OMApp.ResourceType} resourceType 资源的类型
             * @param {(sourcePath: string) => void} callback 获取缓存资源的回调，获得缓存路径
             */
            cachedResourceForURL(url: string, resourceType?: OMAppCacheType, callback?: (sourcePath: string) => void): void;
        };

        /**
         * 只读。App 事件服务。
         */
        event: {
            /**
             * 专门为列表提供的方法。当列表的行被选中时，调用此方法将事件传递给 App 。
             * @param {string} documentName 页面名称
             * @param {string} listName 列表名称
             * @param {number} index 行索引
             * @param {() => void} completion 回调。
             */
            didSelectRowAtIndex(documentName: string, listName: string, index: number, completion?: () => void): void;

            /**
             * 当页面元素被（不限于）点击时，调用此方法将事件传递给 App 。
             * @param {string} documentName 页面名称
             * @param {string} elementName  元素名称
             * @param data 连同事件包含的数据
             * @param {(isSelected: boolean) => void} callback 回调，表示元素是否可以被选中。
             */
            elementWasClicked(documentName: string, elementName: string, data?: any, callback?: (isSelected: boolean) => void): void;
        };

        /**
         * 只读。App 统计分析服务。
         */
        analytics: {

            /**
             * 统计跟踪一条用户行为。
             * @param {string} event        事件名称
             * @param {Object} parameters   参数
             */
            track(event: string, parameters?: object): void;
        };
    };
}


// *************
// OMApp 接口定义


/**
 * 描述 App 网路请求信息的接口。
 */
interface OMAppHTTPRequest {
    url: string;
    method: string;
    data?: object;
    headers?: object;
}

/**
 * 描述 App 网路请求结果信息的接口。
 */
interface OMAppHTTPResponse {
    code: number;
    message: string;
    contentType: string;
    data?: any;
}


/**
 * 描述 alert 的接口。
 */
interface OMAppAlertMessage {
    /**
     * alert 标题。
     */
    title: string;

    /**
     * alert 内容。
     */
    body: string;

    /**
     * 按钮文字。默认只有一个 确认 按钮。
     */
    actions?: [string]
}







// ***************
// OMApp 枚举值定义

/**
 * 枚举 OMApp.Theme.* 的类型。实际上是 string。
 */
interface OMAppTheme {}
/**
 * 枚举 OMApp.UserType.* 的类型。实际上是 string。
 */
interface OMAppUserType {}
/**
 * 枚举 OMApp.NetworkingType.* 的类型。实际上是 string。
 */
interface OMAppNetworkingType {}
/**
 * 枚举 OMApp.Method.* 的类型。实际上是 string。
 */
interface OMAppMethod {}
/**
 * 枚举 OMApp.Page.* 的类型。实际上是 string。
 */
interface OMAppPage {}
/**
 * 枚举 OMApp.CacheType.* 的类型。实际上是 string。
 */
interface OMAppCacheType {}


interface OMAppStatic {

    /**
     * App 与 HTML 交互机制。
     * - OMApp.Method 列举了 App 所支持的方法。
     * - App 通过 JavaScript 传递的 OMApp.Method 值来区分 HTML 要调用 App 方法。
     * - 所有 OMApp.Method 都是事先约定好的字符串。
     */
    Method: {
        login: OMAppMethod;
        open: OMAppMethod;
        ready: OMAppMethod;

        setCurrentTheme: OMAppMethod;

        navigation: {
            push: OMAppMethod;
            pop: OMAppMethod;
            popTo: OMAppMethod;
            bar: {
                setHidden: OMAppMethod;
                setTitle: OMAppMethod;
                setTitleColor: OMAppMethod;
                setBackgroundColor: OMAppMethod;
            };
        }

        present: OMAppMethod;
        dismiss: OMAppMethod;

        networking: {
            http: OMAppMethod;
        };

        alert: OMAppMethod;

        services: {
            data: {
                numberOfRowsInList: OMAppMethod;
                dataForRowAtIndex: OMAppMethod;
                cachedResourceForURL: OMAppMethod;
            };
            event: {
                didSelectRowAtIndex: OMAppMethod;
                elementWasClicked: OMAppMethod;
            };
            analytics: {
                track: OMAppMethod;
            };
        };
    };

    /**
     * OMApp.Page 列举了 App 的拥有的页面。
     */
    Page: {
        mall:      OMAppPage;
        task:      OMAppPage;
        news:      OMAppPage;
        video:     OMAppPage;
        web:       OMAppPage;
    }

    /**
     * OMApp.Theme 列举了 App 支持的主题。
     */
    Theme: {
        day:      OMAppTheme;
        night:    OMAppTheme;
    }

    /**
     * OMApp.UserType 列举了 App 已登录用户的类型。
     */
    UserType: {
        visitor: 	OMAppUserType;
        google: 	OMAppUserType;
        facebook: 	OMAppUserType;
        twitter: 	OMAppUserType;
    }


    /**
     * OMApp.NetworkingType 列举了 App 可能处于的网络类型。
     */
    NetworkingType: {
        none: 		OMAppNetworkingType;
        WiFi: 		OMAppNetworkingType;
        WWan2G: 	OMAppNetworkingType;
        WWan3G: 	OMAppNetworkingType;
        WWan4G: 	OMAppNetworkingType;
        other: 	    OMAppNetworkingType;
    }

    /**
     * OMApp.CacheType 列举了 App 的缓存类型。
     */
    CacheType: {
        image: OMAppCacheType;
    }

}


/**
 * OMAppDelegateMessage 描述了 omApp.delegate 为函数时，该函数的参数模型。
 */
interface OMAppDelegateMessage {
    method: OMAppMethod;
    parameters?: [any];
    callbackID?: string;
}

/**
 * OMAppDelegateAJAXSettings 描述了 omApp.delegate 对象在非 App 环境中，创建的 delegate 对象的全局 ajax 配置。
 */
interface OMAppDelegateAJAXSettings {
    header?: object;
    data?: object;
}

/**
 * OMAppDelegate 描述了 omApp 在非 App 环境中时的 delegate 对象。
 */
interface OMAppDelegate {

    /**
     * 当 HTML 页面完成初始化时，此方法会被调用。
     * - App 应该在此方法中初始化 omApp 对象属性的初始值。
     * @param {() => void} callback 完成初始化后应该执行的回调函数
     */
    ready: (callback: () => void) => void;

    /**
     * 当 HTML 更改了 App 主题时，此方法会被调用。
     * @param {OMApp.Theme} newValue
     */
    setCurrentTheme: (newValue: OMAppTheme) => void;

    /**
     * 当 HTML 调用 App 登录功能时，此方法会被调用。
     * @param {(success: boolean) => void} callback 登录结果的回调
     */
    login: (callback: (success: boolean) => void) => void;

    /**
     * 当 HTML 要打开新的页面时。
     * @param {OMApp.Page} page
     * @param {Object} parameters
     */
    open: (page: OMAppPage, parameters?: object) => void;

    /**
     * 模态出新的 HTML 窗口。
     * @param {string} url
     * @param {boolean} animated
     * @param {() => void} completion
     */
    present: (url: string, animated: boolean, completion: () => void) => void;

    /**
     * 移除模态的 HTML 窗口。
     * @param {boolean} animated
     * @param {() => void} completion
     */
    dismiss: (animated: boolean, completion?: () => void) => void;

    /**
     * 导航到下级页面。
     * @param {string} url
     * @param {boolean} animated
     */
    push: (url: string, animated?: boolean) => void;

    /**
     * 导航到上级页面。
     * @param {boolean} animated
     */
    pop: (animated?: boolean) => void;

    /**
     * 跳转到导航历史中的指定页面。
     * @param {number} index
     * @param {boolean} animated
     */
    popTo: (index: number, animated?: boolean) => void;

    /**
     * HTML 设置隐藏导航条。
     * @param {boolean} newValue
     */
    setNavigationBarHidden: (newValue: boolean) => void;

    /**
     * HTML 设置导航条标题。
     * @param {string} newValue
     */
    setNavigationBarTitle: (newValue: string) => void;

    /**
     * HTML 设置导航条标题文字颜色。
     * @param {string} newValue
     */
    setNavigationBarTitleColor: (newValue: string) => void;

    /**
     * HTML 设置导航条背景色。
     * @param {string} newValue
     */
    setNavigationBarBackgroundColor: (newValue: string) => void;

    /**
     * 统计分析。
     * @param {string} event
     * @param {Object} parameters
     */
    track: (event: string, parameters?: object) => void;

    /**
     * 展示 alert 。
     * @param message
     * @param parameters
     */
    alert(message, parameters)

    /**
     * HTML 发送 App 网络请求。
     * @param {OMApp.HTTPRequest} request
     * @param {(response: OMApp.HTTPResponse) => void} callback
     */
    http: (request: OMAppHTTPRequest, callback: (response: OMAppHTTPResponse) => void) => void;

    /**
     * HTML 查询某一列表的行数。
     * @param {string} documentName
     * @param {string} listName
     * @param {(count: number) => void} callback
     */
    numberOfRowsInList: (documentName: string, listName: string, callback: (count: number) => void) => void;

    /**
     * HTML 获取某一列表行的数据。
     * @param {string} documentName
     * @param {string} listName
     * @param {number} index
     * @param {(data: any) => void} callback
     */
    dataForRowAtIndex: (documentName: string, listName: string, index: number, callback: (data: any) => void) => void;

    /**
     * HTML 页面获取某一 URL 对应的资源。
     * @param {string} url
     * @param {OMApp.ResourceType} resourceType
     * @param {boolean} automaticallyDownload
     * @param {(filePath: string) => void} callback
     */
    cachedResourceForURL: (url: string, resourceType: OMAppCacheType, callback?: (filePath: string) => void) => void;

    /**
     * HTML 的某一列表行被点击事件。
     * @param {string} documentName
     * @param {string} listName
     * @param {number} index
     * @param {() => void} completion
     */
    didSelectRowAtIndex: (documentName: string, listName: string, index: number, completion?: () => void) => void;

    /**
     * HTML 的某一元素被点击。
     * @param {string} documentName
     * @param {string} elementName
     * @param data
     * @param {(isSelected: boolean) => void} callback
     */
    elementWasClicked: (documentName: string, elementName: string, data: any, callback: (isSelected: boolean) => void) => void;



    // 以下 App 不需要实现，仅供桌面浏览器调试使用。

    /**
     * 桌面浏览调试时，默认情况下，通过此来设置网络请求的全局参数。
     */
    ajaxSettings: (newValue?: OMAppDelegateAJAXSettings) => OMAppDelegateAJAXSettings;

    /**
     * OMApp 提供的默认 Delegate 发送网络请求的方法。
     * @param {OMApp.HTTPRequest} request
     * @param {(response: OMApp.HTTPResponse) => void} callback
     */
    ajax: (request: OMAppHTTPRequest, callback: (response: OMAppHTTPResponse) => void) => void;
}


