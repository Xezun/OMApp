//
//  OMApp.swift
//  Browser
//
//  Created by mlibai on 2017/6/15.
//  Copyright © 2017年 mlibai. All rights reserved.
//

import UIKit
import JavaScriptCore

public let UIWebViewJavaScriptContextKeyPath = "documentView.webView.mainFrame.javaScriptContext"

protocol OMAppDelegate: class {
    
}

private struct AssociationKey {
    static var context = 0
}

class OMApp: NSObject, AppExport {
    
    deinit {
        #if DEBUG
            print("\(self) is deinit")
        #endif
    }
    
    init(for webView: UIWebView, navigation: AppNavigationExport, currentUser: AppUserExport) {
        self.navigation = navigation
        self.currentUser = currentUser
        super.init()
        
        let context = webView.value(forKeyPath: UIWebViewJavaScriptContextKeyPath) as! JSContext
        
        context.setObject(OMApp.Page.self, forKeyedSubscript: "OMAppPage" as NSCopying & NSObjectProtocol)
        //context.setObject(OMApp.User.self, forKeyedSubscript: "OMUser" as NSCopying & NSObjectProtocol)
        context.setObject(OMApp.User.Type.self, forKeyedSubscript: "OMUserType" as NSCopying & NSObjectProtocol)
        context.setObject(OMApp.Theme.self, forKeyedSubscript: "OMAppTheme" as NSCopying & NSObjectProtocol)
        //context.setObject(OMApp.Navigation.self, forKeyedSubscript: "OMAppNavigation" as NSCopying & NSObjectProtocol)
        //context.setObject(OMApp.Navigation.Bar.self, forKeyedSubscript: "OMAppNavigationBar" as NSCopying & NSObjectProtocol)
        
        context.setObject(navigation.bar, forKeyedSubscript: "omAppNavigationBar" as NSCopying & NSObjectProtocol)
        context.setObject(navigation, forKeyedSubscript: "omAppNavigation" as NSCopying & NSObjectProtocol)
        context.setObject(currentUser, forKeyedSubscript: "omAppCurrentUser" as NSCopying & NSObjectProtocol)
        context.setObject(self, forKeyedSubscript: "omApp" as NSCopying & NSObjectProtocol)
        
        context.exceptionHandler = {(context, exception) in
            if let exception = exception {
                print(exception)
            }
        }
        
//        let value = context.evaluateScript("omApp")
//        value?.setValue(navigation, forProperty: "navigation")
//        value?.setValue(currentUser, forProperty: "currentUser")
//        
//        context.evaluateScript("omApp.navigation.bar").setValue(navigation.bar, forProperty: "bar")
        
        objc_setAssociatedObject(webView, &AssociationKey.context, context, .OBJC_ASSOCIATION_RETAIN_NONATOMIC)
        
        self.context = context
    }

    weak var context: JSContext?

    weak var viewController: UIViewController?
    
    var currentUser: AppUserExport

    func login(_ callback: JSValue?) {
        print("login")
    }
    
    func open(_ page: String, _ id: String?) {
        print("open")
    }
    
    func present(_ url: String) {
        print("present")
    }
    
    var navigation: AppNavigationExport
    
    var theme: String = ""
    
    func http(_ request: [String : Any], _ callback: JSValue?) {
        print("http")
    }
    

    
}


extension OMApp {
    
    class Navigation: NSObject, AppNavigationExport {
        
        func push(_ url: String) {
            print("push")
        }
        
        func pop() {
            print("pop")
        }
        
        func popTo(_ index: Int) {
            print("popTo")
        }
        
        var bar: AppNavigationBarExport = Bar()
        
        
    }
    
    class User: NSObject, AppUserExport {
        
        var isOnline: Bool = false
        
        var id: String = "0"
        var name: String = ""
        var type: String = ""
        var coin: Int = 0
        
        class `Type`: NSObject, AppUserTypeExport {
            static var vistor: String { return "vistor" }
            static var google: String { return "google" }
            static var facebook: String { return "facebook" }
            static var twitter: String { return "twitter" }
        }
    }
    
    class Page: NSObject, AppPageExport {
        static let mall: String         = "mall"
        static let task: String         = "task"
        static let newsList: String     = "newsList"
        static let newsDetail: String   = "newsDetail"
        static let videoList: String    = "videoList"
        static let videoDetail: String  = "videoDetail"
    }
    

    
    class Theme: NSObject, AppThemeExport {
        static var day: String { return "day" }
        static var night: String { return "night" }
    }
}

extension OMApp.Navigation {
    
    class Bar: NSObject, AppNavigationBarExport {
        
        var isHidden: Bool = false
        var title: String = ""
        var titleColor: String = "#000000"
        var backgroundColor: String = "#FFFFFF"
        
    }
    
}


