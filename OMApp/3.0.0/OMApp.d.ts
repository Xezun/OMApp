// Type definitions for OMApp 3.0.0
//
// 2017-08-24
// Powered by mlibai.


module OMApp {

    const version: string;
    const defineProperty: (propertyName, descriptor: () => object) => void;
    const defineProperties: (descriptor: () => object) => void;

    const URLQueryStringFromObject: (anObject: object) => string;
    const deprecate: (oldMethod: string, newMethod: string) => void;

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
        setCurrentTheme: (theme: OMApp.Theme, needs?: boolean) => void;

        // OM.login
        login: (callback: (isSuccess: boolean) => void) => void;

        currentUser: OMApp.User;

        open: (page: OMApp.Page, parameters?: object) => void;

        navigation: OMApp.Navigation;

        present: (url: string, animated: boolean, completion: () => void) => void;

        networking: OMApp.Networking;
        http: (request: OMApp.HTTPRequest, callback: (response: OMApp.HTTPResponse) => void) => void;

        service: OMApp.Service;
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

        _setIsHidden(isHidden: boolean, needs?: boolean): void;
        _setTitle(title: string, needs?: boolean): void;
        _setTitleColor(titleColor: string, needs?: boolean): void;
        _setBackgroundColor(backgroundColor: string, needs?: boolean): void;
    }

    interface Navigation {
        push(url: string, animated?: boolean): void;
        pop(animated?: boolean): void;
        popTo(index: number, animated?: boolean): void;
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

    interface Service {
        data: ServiceData;
        event: ServiceEvent;
        analytics: ServiceAnalytics;
    }

    interface ServiceData {
        numberOfRows(documentName: string, listName: string, callback: (count: number) => void): void;
        dataForRowAtIndex(documentName: string, listName: string, index: number, callback: (data: any) => void): void;
        cachedResourceForURL(url: string, downloadIfNotExists?: boolean, callback?: (sourcePath: string) => void): void;
    }

    interface ServiceEvent {
        didSelectRowAtIndex(documentName: string, listName: string, index: number, completion?: () => void): void;
        wasClicked(documentName: string, elementName: string, data?: any, callback?: (isSelected: boolean) => void): void;
    }

    interface ServiceAnalytics {
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

        networking: MethodNetworking

        analytics: MethodAnalytics;

        alert: Method;

        service: MethodService;
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
        wasClicked: Method;
    }

    interface MethodServiceData {
        numberOfRows: Method;
        dataForRowAtIndex: Method;
        cachedResourceForURL: Method;
    }

    interface MethodServiceAnalytics {
        track: Method;
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

        ready: (callback: () => void) => void;

        setCurrentTheme: (newValue: OMApp.Theme) => void;

        login: (callback: (success: boolean) => void) => void;

        open: (page: OMApp.Page, parameters?: object) => void;

        present: (url: string, animated?: boolean, completion?: () => void) => void;

        push: (url: string, animated?: boolean) => void;

        pop: (animated?: boolean) => void;

        popTo: (index: number, animated?: boolean) => void;

        setNavigationBarHidden: (newValue: boolean) => void;

        setNavigationBarTitle: (newValue: string) => void;

        setNavigationBarTitleColor: (newValue: string) => void;

        setNavigationBarBackgroundColor: (newValue: string) => void;

        analyticsTrack: (event: string, parameters?: object) => void;

        // Debug
        ajaxSettings: AJAXSettings;
        setAjaxSettings: (newValue: AJAXSettings) => void;
        ajax: (request: HTTPRequest, callback: (response: HTTPResponse) => void) => void;

        http: (request: HTTPRequest, callback: (response: HTTPResponse) => void) => void;

        numberOfRows: (documentName: string, listName: string, callback: (count: number) => void) => void;
        dataForRowAtIndex: (documentName: string, listName: string, index: number, callback: (data: any) => void) => void;
        cachedResourceForURL: (url: string, automaticallyDownload: boolean, callback: (filePath: string) => void) => void;

        didSelectRowAtIndex: (documentName: string, listName: string, index: number, completion?: () => void) => void;
        wasClicked: (documentName: string, elementName: string, data: any, callback: (isSelected: boolean) => void) => void;

    }
}