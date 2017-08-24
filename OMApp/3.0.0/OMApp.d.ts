// Type definitions for OMApp 3.0.0
//
// 2017-08-24
// Powered by mlibai.


module OMApp {

    const version: string;

    const defineProperty: (propertyName, descriptor: () => object) => void;
    const defineProperties: (descriptor: () => object) => void;

    const current: omApp;

    const URLQueryStringFromObject :(anObject: object) => string;
    const deprecate: (oldMethod: string, newMethod: string) => void;

}







module omApp {

    // Basic
    const isInApp: boolean;
    const system: OMApp.System;

    var name: string;
    const defineProperty: (propertyName, descriptor: () => object) => void;
    const defineProperties: (descriptor: () => object) => void;

    // OM.Basic
    var delegate: OMApp.Delegate;
    const dispatch: (callbackID: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => any;
    const perform: (method: OMApp.Method, parameters?: [any], callback?: () => void) => string;

    // config
    var isDebug: boolean;
    const config: (configuration: object) => void;

    // OM.ready
    const isReady: boolean;
    const documentIsReady: () => void;
    const ready: (callback: () => void) => void;

    var currentTheme: OMApp.Theme;
    const setCurrentTheme: (theme: OMApp.Theme, needs?: boolean) => void;

    // OM.login
    const login: (callback: (isSuccess: boolean) => void) => void;

    const currentUser: OMApp.User;

    const open: (page: OMApp.Page, parameters?: object) => void;

    const navigation: OMApp.Navigation;

    const present: (url: string, animated: boolean, completion: () => void) => void;

    const networking: OMApp.Networking;
    const http: (request: OMApp.HTTPRequest, callback: (response: OMApp.HTTPResponse) => void) => void;

    const service: OMApp.Service;

}


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
        bar: OMAppNavigationBar;
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
        event: ServiceEvent
    }

    interface ServiceData {
        fetchNumberOfRowsInListInDocument(documentName: string, listName: string, callback: (count: number) => void): void;
        fetchDataForRowAtIndexInListInDocument(documentName: string, listName: string, index: number, callback: (data: any) => void): void;
        fetchCachedResourceForURL(url: string, automaticallyDownload: boolean, callback: (filePath: string) => voi): void;
    }

    interface ServiceEvent {
        documentListDidSelectRowAtIndex(documentName: string, listName: string, index: number): void;
        documentElementWasClicked(documentName: string, elementName: string, parameters: any, callback: (isSelected: boolean) => void): void;
    }

}



// *************
// OMApp 方法名定义。

module OMApp {

    // Method
    interface Method {
        login: Method;
        open: Method;
        documentIsReady: Method;

        currentTheme: Method;

        navigation: MethodNavigation
        present: Method;

        networking: MethodNetworking

        analytics: MethodAnalytics;

        alert: Method;

        service: MethodService;

        register(method: any, name?: string): boolean;
    }

    interface MethodNavigation {
        push: Method;
        pop: Method;
        popTo: Method;
        bar: MethodNavigationBar;
    }

    interface MethodNavigationBar {
        isHidden: Method;
        title: Method;
        titleColor: Method;
        backgroundColor: Method;
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
    }

    interface MethodServiceEvent {
        documentListDidSelectRowAtIndex: Method;
        documentElementWasClicked: Method;
    }

    interface MethodServiceData {
        fetchNumberOfRowsInListInDocument: Method;
        fetchDataForRowAtIndexInListInDocument: Method;
        fetchCachedResourceForURL: Method;
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

        documentIsReady: (callback: () => void) => void;

        currentTheme: (newValue: OMApp.Theme) => void;

        login: (callback: (success: boolean) => void) => void;

        open: (page: OMApp.Page, parameters?: any) => void;

        present: (url: string, animated: boolean, completion: () => void) => void;

        navigationPush: (url: string, animated?: boolean) => void;

        navigationPop: (animated?: boolean) => void;

        navigationPopTo: (index: number, animated?: boolean) => void;

        navigationBarIsHidden: (newValue: boolean) => void;

        navigationBarTitle: (newValue: string) => void;

        navigationBarTitleColor: (newValue: string) => void;

        navigationBarBackgroundColor: (newValue: string) => void;

        ajaxSettings: AJAXSettings;

        setAjaxSettings: (newValue: AJAXSettings) => void;

        ajax: (request: HTTPRequest, callback: (response: HTTPResponse) => void) => void;

        networkingHTTP: (request: HTTPRequest, callback: (response: HTTPResponse) => void) => void;

        dataServiceFetchNumberOfRowsInListInDocument: (documentName: string, listName: string, callback: (count: number) => void) => void;
        dataServiceFetchDataForRowAtIndexInListInDocument: (documentName: string, listName: string, index: number, callback: (data: any) => void) => void;
        dataServiceFetchCachedResourceForURL: (url: string, automaticallyDownload: boolean, callback: (filePath: string) => voi) => void;

        eventServiceDocumentListDidSelectRowAtIndex: (documentName: string, listName: string, index: number) => void;
        eventServiceDocumentElementWasClicked: (documentName: string, elementName: string, parameters: any, callback: (isSelected: boolean) => void) => void;

    }
}