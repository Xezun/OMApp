//
//  AppExport.m
//  OCJSCore
//
//  Created by mlibai on 2017/6/16.
//  Copyright © 2017年 mlibai. All rights reserved.
//

#import "AppExport.h"
@import ObjectiveC;
@import XZKit;

#import "AppNavigationExport.h"
#import "AppUserExport.h"

NSString * _Nonnull const UIWebViewJavaScriptContextKeyPath = @"documentView.webView.mainFrame.javaScriptContext";

const void *const UIWebViewJavaScriptContext = &UIWebViewJavaScriptContext;

@interface AppExport () <AppNavigationExportDelegate>

@property (nonatomic, weak) JSContext *context;

@end

@implementation AppExport

@synthesize currentUser = _currentUser, currentTheme = _currentTheme, navigation = _navigation;

- (void)dealloc {
#if DEBUG
    NSLog(@"AppExport is dealloc.");
#endif
}

+ (AppExport *)exportTo:(UIWebView *)webView delegate:(id<AppExportDelegate>)delegate {
    AppNavigationExport *navigation = [[AppNavigationExport alloc] init];
    AppUserExport *currentUser = [[AppUserExport alloc] init];
    
    AppExport *appExport = [[AppExport alloc] initWithNavigation:navigation currentUser:currentUser];
    
    JSContext *context = [webView valueForKeyPath:UIWebViewJavaScriptContextKeyPath];
    
    context[@"OMAppPage"] = [[AppPageExport alloc] init];
    context[@"OMAppTheme"] = [[AppThemeExport alloc] init];
    context[@"OMUserType"] = [[AppUserExport alloc] init];
    
    context[@"omApp"] = appExport;
    
    AppExport * __weak weakObject = appExport;
    [context setExceptionHandler:^(JSContext *context, JSValue *exception) {
        dispatch_async(dispatch_get_main_queue(), ^{
            [weakObject.delegate appExport:weakObject didCatchAnException:exception.toString];
        });
    }];
    
    objc_setAssociatedObject(webView, UIWebViewJavaScriptContext, context, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    
    appExport.context = context;
    appExport.delegate = delegate;
    
    return appExport;
}

- (instancetype)initWithNavigation:(AppNavigationExport *)navigation currentUser:(AppUserExport *)currentUser {
    self = [super init];
    if (self != nil) {
        _currentUser = currentUser;
        _navigation = navigation;
        _navigation.delegate = self;
    }
    return self;
}

- (void)setCurrentTheme:(NSString *)currentTheme {
    _currentTheme = currentTheme;
    dispatch_async(dispatch_get_main_queue(), ^{
        [_delegate appExport:self currentTheme:currentTheme];
    });
}

- (NSString *)theme {
    return [self currentTheme];
}

- (void)setTheme:(NSString *)theme {
    [self setCurrentTheme:theme];
}

- (void)login:(JSValue *)completion {
    dispatch_async(dispatch_get_main_queue(), ^{
        [_delegate appExport:self loginWithCompletion:^(BOOL success) {
            [completion callWithArguments:@[@(success)]];
        }];
    });
}

- (void)open:(NSString *)page parameters:(nullable NSDictionary<NSString *,id> *)parameters {
    dispatch_async(dispatch_get_main_queue(), ^{
        [_delegate appExport:self open:page parameters:parameters];
    });
}

- (void)present:(NSString *)url {
    dispatch_async(dispatch_get_main_queue(), ^{
        [_delegate appExport:self present:url];
    });
}

- (void)http:(NSDictionary<NSString *,id> *)request completion:(JSValue *)completion {
    // TODO:  不确定 JSValue 在异步请求的过程中是否会被释放。JSManagedValue
    dispatch_async(dispatch_get_main_queue(), ^{
        [_delegate appExport:self http:request completion:^(BOOL success, id _Nullable result) {
            NSMutableArray *arguments = [NSMutableArray arrayWithObject:@(success)];
            if (result != nil) {
                [arguments addObject:result];
            }
            [completion callWithArguments:arguments];
        }];
    });
}


#pragma mark - AppNavigationExportDelegate


- (void)navigation:(AppNavigationExport *)navigation push:(NSString *)url animated:(BOOL)animated {
    dispatch_async(dispatch_get_main_queue(), ^{
        [_delegate appExport:self navigationPush:url animated:animated];
    });
}

- (void)navigation:(AppNavigationExport *)navigation pop:(BOOL)animated {
    dispatch_async(dispatch_get_main_queue(), ^{
        [_delegate appExport:self navigationPop:animated];
    });
}

- (void)navigation:(AppNavigationExport *)navigation popTo:(NSInteger)index animated:(BOOL)animated {
    dispatch_async(dispatch_get_main_queue(), ^{
        [_delegate appExport:self navigationPopTo:index animated:animated];
    });
}

- (void)navigation:(AppNavigationExport *)navigation title:(nullable NSString *)title {
    dispatch_async(dispatch_get_main_queue(), ^{
        [_delegate appExport:self updateNavigationBarTitle:title];
    });
}

- (void)navigation:(AppNavigationExport *)navigation titleColor:(NSString *)titleColor {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIColor *color = [[UIColor alloc] initWithString:titleColor];
        [_delegate appExport:self updateNavigationBarTitleColor:color];
    });
}

- (void)navigation:(AppNavigationExport *)navigation isHidden:(BOOL)isHidden {
    dispatch_async(dispatch_get_main_queue(), ^{
        [_delegate appExport:self updateNavigationBarVisibility:isHidden];
    });
}

- (void)navigation:(AppNavigationExport *)navigation backgroundColor:(NSString *)backgroundColor {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIColor *color = [[UIColor alloc] initWithString:backgroundColor];
        [_delegate appExport:self updateNavigationBarBackgroundColor:color];
    });
}

@end











AppPage _Nonnull const AppPageMall = @"mall";
AppPage _Nonnull const AppPageTask = @"task";
AppPage _Nonnull const AppPageNewsList = @"newsList";
AppPage _Nonnull const AppPageNewsDetail = @"newsDetail";
AppPage _Nonnull const AppPageVideoList = @"videoList";
AppPage _Nonnull const AppPageVideoDetail = @"videoDetail";

@implementation AppPageExport

- (AppPage)mall {
    return AppPageMall;
}

- (AppPage)task {
    return AppPageTask;
}

- (AppPage)newsList {
    return AppPageNewsList;
}

- (AppPage)newsDetail {
    return AppPageNewsDetail;
}

- (AppPage)videoList {
    return AppPageVideoList;
}

- (AppPage)videoDetail {
    return AppPageVideoDetail;
}

@end




AppTheme const _Nonnull AppThemeDay = @"day";
AppTheme const _Nonnull AppThemeNight = @"night";

@implementation AppThemeExport

- (NSString *)night {
    return AppThemeNight;
}

- (NSString *)day {
    return AppThemeDay;
}

@end



