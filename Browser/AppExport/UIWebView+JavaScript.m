//
//  UIWebView+JavaScript.m
//  Browser
//
//  Created by mlibai on 2017/6/19.
//  Copyright © 2017年 mlibai. All rights reserved.
//

#import "UIWebView+JavaScript.h"
@import ObjectiveC;
@import JavaScriptCore;




@class WebView, WebFrame;

@implementation NSObject (UIWebViewJavaScriptDelegate)

+ (NSHashTable<UIWebView *> *)XZ_allRegistedWebViews {
    static const void * const key = &key;
    NSHashTable *table = objc_getAssociatedObject(self, key);
    if ([table isKindOfClass:[NSHashTable class]]) {
        return table;
    }
    table = [NSHashTable weakObjectsHashTable];
    objc_setAssociatedObject(self, key, table, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    return  table;
}

- (void)webView:(WebView *)webView didCreateJavaScriptContext:(JSContext *)context forFrame:(WebFrame *)frame {
    if (![context isKindOfClass:[JSContext class]]) {
        return;
    }
    
    static NSString *const kJSObjectIDKey = @"OM_WEBVIEW_ID";
    static NSInteger objectID = 0;
    
    objectID += 1;
    context[kJSObjectIDKey] = @(objectID);
    
    for (UIWebView *webView in [NSObject XZ_allRegistedWebViews]) {
        // 遍历所有注册的 UIWebView 从中取出 ObjectID 如果有和当前 context 相同的，则发送消息。
        NSInteger tmpID = [[webView stringByEvaluatingJavaScriptFromString:kJSObjectIDKey] integerValue];
        if (tmpID == objectID) {
            id<UIWebViewJavaScriptDelegate> delegate = (id<UIWebViewJavaScriptDelegate>)webView.delegate;
            if ([delegate respondsToSelector:@selector(webView:didCreateJavaScriptContext:)]) {
                [delegate webView:webView didCreateJavaScriptContext:context];
            }
            break;
        }
    }
}

@end



@import XZKit;

// _WebSafeForwarder   WebFrame
@interface UIWebViewJSDelegatePropertyWrapper : NSObject
@property (nonatomic, weak, nullable) id<UIWebViewJavaScriptDelegate> JSDelegate;
@end

@implementation UIWebView (UIWebViewJavaScriptDelegate)

+ (void)load {
    Class cls = [UIWebView class];
    Method m2 = class_getInstanceMethod(cls, @selector(XZ_setJavaScriptContextDelegate:));
    if (class_addMethod(cls, @selector(setDelegate:), method_getImplementation(m2), method_getTypeEncoding(m2))) {
        return;
    }
    Method m1 = class_getInstanceMethod(cls, @selector(setDelegate:));
    method_exchangeImplementations(m1, m2);
}

- (void)XZ_setJavaScriptContextDelegate:(id<UIWebViewJavaScriptDelegate>)JavaScriptContextDelegate {
    [self XZ_setJavaScriptContextDelegate:JavaScriptContextDelegate];
    if (JavaScriptContextDelegate != nil) {
        [[NSObject XZ_allRegistedWebViews] addObject:self];
    } else {
        [[NSObject XZ_allRegistedWebViews] removeObject:self];
    }
}

- (UIWebViewJSDelegatePropertyWrapper *)XZ_propertyWrapper {
    static const void * const key = &key;
    UIWebViewJSDelegatePropertyWrapper *wrapper = objc_getAssociatedObject(self, &key);
    if ([wrapper isKindOfClass:[UIWebViewJSDelegatePropertyWrapper class]]) {
        return wrapper;
    }
    wrapper = [[UIWebViewJSDelegatePropertyWrapper alloc] init];
    objc_setAssociatedObject(self, key, wrapper, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    return  wrapper;
}

@end

@implementation UIWebViewJSDelegatePropertyWrapper
@end
