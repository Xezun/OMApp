//
//  WebViewAction.swift
//  OMKit
//
//  Created by mlibai on 2017/5/12.
//  Copyright © 2017年 mlibai. All rights reserved.
//

import Foundation

extension WebViewAction {
    
    public static let alert: WebViewAction              = WebViewAction(rawValue: "omApp.alert")
    // taskID, isSuccess, {userToken: }
    public static let didFinishLogining: WebViewAction  = WebViewAction(rawValue: "omApp.didFinishLogining")
    
}

/// WebView 行为
public struct WebViewAction: RawRepresentable, CustomStringConvertible {
    
    public typealias RawValue = String
    
    public let rawValue: String
    
    public init(rawValue: String) {
        self.rawValue = rawValue
    }
    
    public var description: String {
        return rawValue
    }
    
}
