//
//  AppExport.h
//  OCJSCore
//
//  Created by mlibai on 2017/6/16.
//  Copyright © 2017年 mlibai. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <JavaScriptCore/JavaScriptCore.h>

@class AppNavigationExport, AppUserExport;
@protocol AppExportDelegate;

/// AppPage 枚举
typedef NSString *AppPage NS_EXTENSIBLE_STRING_ENUM;
/// AppTheme 枚举
typedef NSString *AppTheme NS_EXTENSIBLE_STRING_ENUM;

NS_ASSUME_NONNULL_BEGIN


/**
 定义了 OMApp 对 JavaScript 的接口。
 */
@protocol AppExport <NSObject, JSExport>
@property (nonatomic, strong, nonnull) AppNavigationExport *navigation;
@property (nonatomic, strong, nonnull) NSString *theme;
@property (nonatomic, strong, nonnull) AppUserExport *currentUser;
- (void)login:(nullable JSValue *)completion;
JSExportAs(open, - (void)open:(nonnull NSString *)page parameters:(nullable NSDictionary<NSString *, id> *)parameters);
- (void)present:(nonnull NSString *)url;
JSExportAs(http, - (void)http:(nonnull NSDictionary<NSString *, id> *)request completion:(nullable JSValue *)callback);
@end



UIKIT_EXTERN NSString * _Nonnull const UIWebViewJavaScriptContextKeyPath;

@interface AppExport : NSObject <AppExport>

+ (AppExport *)exportTo:(nonnull UIWebView *)webView delegate:(nullable id<AppExportDelegate>)delegate;

@property (nonatomic, weak, nullable) id<AppExportDelegate> delegate;

@end











@protocol AppNavigationBarExport;

@protocol AppExportDelegate <NSObject>

- (void)appExport:(AppExport *)appExport theme:(AppTheme)theme;
- (void)appExport:(AppExport *)appExport loginWithCompletion:(void (^)(BOOL))completion;
- (void)appExport:(AppExport *)appExport open:(AppPage)page parameters:(nullable NSDictionary<NSString *, id> *)parameters;
- (void)appExport:(AppExport *)appExport present:(nonnull NSString *)url;
- (void)appExport:(AppExport *)appExport http:(NSDictionary<NSString *, id> *)request completion:(void (^)(BOOL success, id _Nullable result))completion;

- (void)appExport:(AppExport *)appExport navigationPush:(NSString *)url animated:(BOOL)animated;
- (void)appExport:(AppExport *)appExport navigationPop:(BOOL)animated;
- (void)appExport:(AppExport *)appExport navigationPopTo:(NSInteger)index animated:(BOOL)animated;

- (void)appExport:(AppExport *)appExport updateNavigationBarTitle:(nullable NSString *)title;
- (void)appExport:(AppExport *)appExport updateNavigationBarTitleColor:(UIColor *)titleColor;
- (void)appExport:(AppExport *)appExport updateNavigationBarVisibility:(BOOL)isHidden;
- (void)appExport:(AppExport *)appExport updateNavigationBarBackgroundColor:(UIColor *)backgroundColor;

- (void)appExport:(AppExport *)appExport didCatchAnException:(NSString *)expection;

@end






FOUNDATION_EXPORT AppPage _Nonnull const AppPageMall;
FOUNDATION_EXPORT AppPage _Nonnull const AppPageTask;
FOUNDATION_EXPORT AppPage _Nonnull const AppPageNewsDetail;
FOUNDATION_EXPORT AppPage _Nonnull const AppPageNewsList;
FOUNDATION_EXPORT AppPage _Nonnull const AppPageVideoList;
FOUNDATION_EXPORT AppPage _Nonnull const AppPageVideoDetail;

@protocol AppPageExport <NSObject, JSExport>
@property (nonatomic, readonly, nonnull) AppPage mall;
@property (nonatomic, readonly, nonnull) AppPage task;
@property (nonatomic, readonly, nonnull) AppPage newsList;
@property (nonatomic, readonly, nonnull) AppPage newsDetail;
@property (nonatomic, readonly, nonnull) AppPage videoList;
@property (nonatomic, readonly, nonnull) AppPage videoDetail;
@end

@interface AppPageExport : NSObject <AppPageExport>
@end



FOUNDATION_EXPORT AppTheme const _Nonnull AppThemeDay;
FOUNDATION_EXPORT AppTheme const _Nonnull AppThemeNight;

@protocol AppThemeExport <NSObject, JSExport>
@property (nonatomic, readonly, nonnull) AppTheme day;
@property (nonatomic, readonly, nonnull) AppTheme night;
@end

@interface AppThemeExport : NSObject <AppThemeExport>
@end




@interface NSObject (UIWebViewJSContext)

- (void)webView:(UIWebView *)webView didCreateJavaScriptContext:(JSContext *)context;

@end

NS_ASSUME_NONNULL_END
