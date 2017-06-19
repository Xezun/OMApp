//
//  UIWebView+JavaScript.h
//  Browser
//
//  Created by mlibai on 2017/6/19.
//  Copyright © 2017年 mlibai. All rights reserved.
//

#import <UIKit/UIKit.h>
@import JavaScriptCore;

// 为 UIWebViewDelegate 的代理增加了一个方法用于接收 JavaScriptContext 的事件。
@protocol UIWebViewJavaScriptDelegate <UIWebViewDelegate>

@optional
- (void)webView:(nonnull UIWebView *)webView didCreateJavaScriptContext:(nonnull JSContext *)context;

@end

@interface UIWebView (UIWebViewJavaScriptDelegate)

@end
