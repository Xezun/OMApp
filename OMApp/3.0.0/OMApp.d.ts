// Type definitions for OMApp 3.0.0
//
// 2017-08-24
// Powered by mlibai.


module OMApp {

    const version: string;

    const defineProperty: (propertyName, descriptor: () => object) => void;
    const defineProperties: (descriptor: () => object) => void;

    const URLQueryStringFromObject: (anObject: object) => string;

    const registerMethod: (method: any, name?: string) => boolean;

    interface current {
        isInApp: boolean;
        system: OMApp.System;

        name: string;
        defineProperty: (propertyName, descriptor: () => object) => void;
        defineProperties: (descriptor: () => object) => void;

        // OM.Basic
        delegate: OMApp.Delegate;
        dispatch: (callbackID: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => any;
        perform: (method: OMApp.Method, parameters?: [any], callback?: () => void) => string;

        // config
        isDebug: boolean;
        config: (configuration: object) => void;

        // OM.ready
        isReady: boolean;
        ready: (callback: () => void) => void;

        currentTheme: OMApp.Theme;
        setCurrentTheme: (theme: OMApp.Theme) => void;
        onCurrentThemeChange: (currentTheme: OMApp.Theme) => void;

        // OM.login
        login: (callback: (isSuccess: boolean) => void) => void;

        currentUser: OMApp.User;

        open: (page: OMApp.Page, parameters?: object) => void;

        navigation: OMApp.Navigation;

        present: (url: string, animated: boolean, completion?: () => void) => void;
        dismiss: (animated: boolean) => void;

        networking: OMApp.Networking;
        http: (request: OMApp.HTTPRequest, callback: (response: OMApp.HTTPResponse) => void) => void;

        alert(message: AlertMessage, callback?: (index: number) => void): void;

        services: OMApp.Services;
    }
}

declare const omApp: OMApp.current;



// *************
// OMApp 接口定义

module OMApp {

    interface User {
        isOnline: boolean;
        id: string;
        name: string;
        type: UserType;
        coin: string;
    }

    interface NavigationBar {
        isHidden: boolean;
        title: string;
        titleColor: string;
        backgroundColor: string;

        setHidden(isHidden: boolean, animated: boolean): void;
        setTitle(title: string): void;
        setTitleColor(titleColor: string): void;
        setBackgroundColor(backgroundColor: string): void;
    }

    interface Navigation {
        push(url: string, animated: boolean): void;
        pop(animated: boolean): void;
        popTo(index: number, animated: boolean): void;
        bar: OMApp.NavigationBar;
    }

    interface System {
        isAndroid: boolean;
        isiOS: boolean;
    }


    interface HTTPRequest {
        url: string;
        method: string;
        data?: object;
        headers?: object;
    }

    interface HTTPResponse {
        code: number;
        message: string;
        contentType: string;
        data?: any;
    }

    interface Networking {
        isReachable: boolean;
        isViaWiFi: boolean;
        type: NetworkingType;
        http(request: HTTPRequest, callback: (response: HTTPResponse) => void): void;
    }

    interface AlertMessage {
        title: string;
        body: string;
        actions?: [string]
    }

    // Services

    interface Services {
        data:       DataService;
        event:      EventService;
        analytics:  AnalyticsService;
    }

    interface DataService {
        numberOfRowsInList(documentName: string, listName: string, callback: (count: number) => void): void;
        dataForRowAtIndex(documentName: string, listName: string, index: number, callback: (data: any) => void): void;
        cachedResourceForURL(url: string, resourceType?: OMApp.ResourceType, downloadIfNotExists?: boolean, callback?: (sourcePath: string) => void): void;
    }

    interface EventService {
        didSelectRowAtIndex(documentName: string, listName: string, index: number, completion?: () => void): void;
        elementWasClicked(documentName: string, elementName: string, data?: any, callback?: (isSelected: boolean) => void): void;
    }

    interface AnalyticsService {
        track(event: string, parameters?: object): void;
    }

}



// *************
// OMApp 方法名定义。

module OMApp {

    // Method
    interface Method {
        login: Method;
        open: Method;
        ready: Method;

        setCurrentTheme: Method;

        navigation: MethodNavigation

        present: Method;
        dismiss: Method;

        networking: MethodNetworking

        analytics: MethodAnalytics;

        alert: Method;

        services: MethodService;
    }

    interface MethodNavigation {
        push: Method;
        pop: Method;
        popTo: Method;
        bar: MethodNavigationBar;
    }

    interface MethodNavigationBar {
        setHidden: Method;
        setTitle: Method;
        setTitleColor: Method;
        setBackgroundColor: Method;
    }

    interface MethodNetworking {
        http: Method;
    }

    interface MethodAnalytics {
        track: Method;
    }

    interface MethodService {
        data: MethodServiceData;
        event: MethodServiceEvent;
        analytics: MethodServiceAnalytics;
    }

    interface MethodServiceEvent {
        didSelectRowAtIndex: Method;
        elementWasClicked: Method;
    }

    interface MethodServiceData {
        numberOfRowsInList: Method;
        dataForRowAtIndex: Method;
        cachedResourceForURL: Method;
    }

    interface MethodServiceAnalytics {
        track: Method;
    }

    interface ResourceType {
        image: ResourceType
    }


}



// ***************
// OMApp 枚举值定义

module OMApp {

    // Page
    interface Page {
        mall:      Page;
        task:      Page;
        news:      Page;
        video:     Page;
        web:       Page;
    }

    // Page
    interface Theme {
        day:      Theme;
        night:    Theme;
    }

    // UserType
    interface UserType {
        visitor: 	UserType;
        google: 	UserType;
        facebook: 	UserType;
        twitter: 	UserType;
    }

    interface NetworkingType {
        none: 		NetworkingType;
        WiFi: 		NetworkingType;
        WWan2G: 	NetworkingType;
        WWan3G: 	NetworkingType;
        WWan4G: 	NetworkingType;
        other: 	    NetworkingType;
    }

}


// *************
module  OMApp {

    interface AJAXSettings {
        header?: object;
        data?: object;
    }

    interface Delegate {

        // 当 HTML 页面完成初始化时，此方法会被调用。
        // App 应该在此方法中初始化 omApp 对象属性的初始值。
        ready: (callback: () => void) => void;

        // 切换主题。
        // 如果 HTML 页面可以切换 App 主题，此方法将被调用。
        setCurrentTheme: (newValue: OMApp.Theme) => void;

        // 当 HTML 页面需要用户登录时，此方法会被调用。
        // App 需在此方法中执行用户登录的逻辑。
        login: (callback: (success: boolean) => void) => void;

        // 当 HTML 要打开新的页面时。
        open: (page: OMApp.Page, parameters?: object) => void;

        present: (url: string, animated: boolean, completion: () => void) => void;
        dismiss: (animated: boolean, completion?: () => void) => void;

        push: (url: string, animated?: boolean) => void;

        pop: (animated?: boolean) => void;

        popTo: (index: number, animated?: boolean) => void;

        setNavigationBarHidden: (newValue: boolean) => void;

        setNavigationBarTitle: (newValue: string) => void;

        setNavigationBarTitleColor: (newValue: string) => void;

        setNavigationBarBackgroundColor: (newValue: string) => void;

        // 统计分析事件。
        track: (event: string, parameters?: object) => void;

        // Debug. App 不需要实现。
        ajaxSettings: AJAXSettings;
        setAjaxSettings: (newValue: AJAXSettings) => void;
        ajax: (request: HTTPRequest, callback: (response: HTTPResponse) => void) => void;

        alert(message, parameters)
        // 网络请求。
        http: (request: HTTPRequest, callback: (response: HTTPResponse) => void) => void;

        // HTML 查询某一列表的行数。
        numberOfRowsInList: (documentName: string, listName: string, callback: (count: number) => void) => void;
        // HTML 获取某一列表行的数据。
        dataForRowAtIndex: (documentName: string, listName: string, index: number, callback: (data: any) => void) => void;
        // HTML 页面获取某一 URL 对应的资源。
        cachedResourceForURL: (url: string, resourceType: OMApp.ResourceType, automaticallyDownload: boolean, callback?: (filePath: string) => void) => void;

        // HTML 的某一列表行被点击事件。
        didSelectRowAtIndex: (documentName: string, listName: string, index: number, completion?: () => void) => void;
        // HTML 的某一元素被点击。
        elementWasClicked: (documentName: string, elementName: string, data: any, callback: (isSelected: boolean) => void) => void;

    }
}