//
//  AppExport.swift
//  Browser
//
//  Created by mlibai on 2017/6/15.
//  Copyright © 2017年 mlibai. All rights reserved.
//

import Foundation
import JavaScriptCore

@objc protocol AppPageExport: NSObjectProtocol, JSExport {
    
    static var mall: String { get }
    static var task: String { get }
    static var newsList: String { get }
    static var newsDetail: String { get }
    static var videoList: String { get }
    static var videoDetail: String { get }
    
}

@objc protocol AppUserTypeExport: NSObjectProtocol, JSExport {
    
    static var vistor: String { get }
    static var google: String { get }
    static var facebook: String { get }
    static var twitter: String { get }
    
}

@objc protocol AppThemeExport: NSObjectProtocol, JSExport {
    
    static var night: String { get }
    static var day: String { get }
    
}


@objc protocol AppNavigationBarExport: NSObjectProtocol, JSExport {
    
    var isHidden: Bool { get set }
    var title: String { get set }
    var titleColor: String { get set }
    var backgroundColor: String { get set }
    
}

@objc protocol AppNavigationExport: NSObjectProtocol, JSExport {
    
    var bar: AppNavigationBarExport { get }
    
    func push(_ url: String)
    func pop()
    func popTo(_ index: Int)
    
}

@objc protocol AppUserExport: NSObjectProtocol, JSExport {
    
    var isOnline: Bool { get }
    var id: String { get }
    var name: String { get }
    var type: String { get }
    var coin: Int { get }
    
}

@objc protocol AppExport: NSObjectProtocol, JSExport {
    
    var navigation: AppNavigationExport { get }
    var theme: String { get set }
    var currentUser: AppUserExport { get }
    
    // (Bool)->Void
    func login(_ callback: JSValue?)
    func open(_ page: String, _ id: String?)
    func present(_ url: String)
    func http(_ request: [String: Any], _ callback: JSValue?)
    
}
