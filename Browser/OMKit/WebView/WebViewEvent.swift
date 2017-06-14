//
//  WebViewEvent.swift
//  OMKit
//
//  Created by mlibai on 2017/5/12.
//  Copyright © 2017年 mlibai. All rights reserved.
//

import Foundation


extension WebViewEvent {
    
    public static let undefined     = WebViewEvent(rawValue: "undefined")

    public static let login         = WebViewEvent(rawValue: "login")
    
    public static let navigationBar = WebViewEvent(rawValue: "navigation.bar")
    public static let pop           = WebViewEvent(rawValue: "navigation.pop")
    public static let popTo         = WebViewEvent(rawValue: "navigation.popTo")
    public static let push          = WebViewEvent(rawValue: "navigation.push")
    
    public static let present       = WebViewEvent(rawValue: "present")
    
    public static let open          = WebViewEvent(rawValue: "open")
    
    public static let currentUser   = WebViewEvent(rawValue: "currentUser")
    
    public static let http          = WebViewEvent(rawValue: "http")
    
}

/// WebView 事件
public struct WebViewEvent: RawRepresentable, CustomStringConvertible, Comparable {
    
    public typealias RawValue = String
    
    public let rawValue: String
    public init(rawValue: String) {
        self.rawValue = rawValue
    }
    
    public var description: String {
        return "WebViewEvents.\(rawValue)"
    }
    
    public init?(url: URL) {
        guard let host = url.host else { return nil }
        self.init(rawValue: host)
    }
    
    public static func <(lhs: WebViewEvent, rhs: WebViewEvent) -> Bool {
        return lhs.rawValue < rhs.rawValue
    }
    
    
    public static func <=(lhs: WebViewEvent, rhs: WebViewEvent) -> Bool {
        return lhs.rawValue <= rhs.rawValue
    }
    
    
    public static func >=(lhs: WebViewEvent, rhs: WebViewEvent) -> Bool {
        return lhs.rawValue >= rhs.rawValue
    }
    
    
    public static func >(lhs: WebViewEvent, rhs: WebViewEvent) -> Bool {
        return lhs.rawValue > rhs.rawValue
    }
    
}




