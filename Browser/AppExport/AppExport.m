//
//  AppExport.m
//  OCJSCore
//
//  Created by mlibai on 2017/6/16.
//  Copyright © 2017年 mlibai. All rights reserved.
//

#import "AppExport.h"
@import UIKit;
@import ObjectiveC;
@import XZKit;

#import "AppNavigationExport.h"
#import "AppUserExport.h"


@interface AppHTTPRequest : NSObject <AppHTTPRequest>
@property (nonatomic, copy, nonnull) NSString *url;
@property (nonatomic, copy, nonnull) NSString *method;
@property (nonatomic, copy, nullable) NSDictionary<NSString *, id> *params;
@property (nonatomic, copy, nullable) NSDictionary<NSString *, id> *data;
@property (nonatomic, copy, nullable) NSDictionary<NSString *, NSString *> *headers;
@end

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

+ (AppExport *)exportWithContext:(nonnull JSContext *)context delegate:(nullable id<AppExportDelegate>)delegate {
    AppNavigationExport *navigation = [[AppNavigationExport alloc] init];
    AppUserExport *currentUser = [[AppUserExport alloc] init];
    
    AppExport *appExport = [[AppExport alloc] initWithNavigation:navigation currentUser:currentUser];
    
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
        [_delegate appExport:self login:^(BOOL success) {
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
    AppHTTPRequest *object = [[AppHTTPRequest alloc] init];
    object.url      = request[@"url"];
    object.method   = request[@"method"];
    object.headers  = request[@"headers"];
    object.params   = request[@"params"];
    object.data     = request[@"data"] != nil ? request[@"data"] : request[@"params"];
    dispatch_async(dispatch_get_main_queue(), ^{
        [_delegate appExport:self http:object completion:^(BOOL success, id _Nullable result) {
            if (completion == nil) {
                return;
            }
            NSMutableArray *arguments = [NSMutableArray arrayWithObject:@(success)];
            if (result != nil) {
                [arguments addObject:result];
            }
            [completion callWithArguments:arguments];
        }];
    });
}

- (void)alert:(NSDictionary<NSString *,id> *)message completion:(JSValue *)completion {
    dispatch_async(dispatch_get_main_queue(), ^{
        NSString *title = message[@"title"];
        if (![title isKindOfClass:[NSString class]]) {
            title = [NSBundle mainBundle].displayName;
        }
        NSString *body = message[@"body"];
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:title message:body preferredStyle:(UIAlertControllerStyleAlert)];
        NSArray<NSString *> *actions = message[@"actions"];
        if ([actions isKindOfClass:[NSArray class]] && completion != nil) {
            [actions enumerateObjectsUsingBlock:^(NSString * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                UIAlertAction *action = [UIAlertAction actionWithTitle:obj style:(UIAlertActionStyleCancel) handler:^(UIAlertAction * _Nonnull action) {
                    [completion callWithArguments:@[@(idx)]];
                }];
                [alert addAction:action];
            }];
        } else {
            NSString *title = NSLocalizedString(@"确定", @"HTML 页面显示 alert 的默认 “确定” 按钮，请在国际化文件中适配此文字。");
            UIAlertAction *action = [UIAlertAction actionWithTitle:title style:(UIAlertActionStyleDefault) handler:nil];
            [alert addAction:action];
        }
        [UIApplication.sharedApplication.keyWindow.rootViewController presentViewController:alert animated:true completion:nil];
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











AppPage _Nonnull const AppPageMall          = @"mall";
AppPage _Nonnull const AppPageTask          = @"task";
AppPage _Nonnull const AppPageNewsList      = @"newsList";
AppPage _Nonnull const AppPageNewsDetail    = @"newsDetail";
AppPage _Nonnull const AppPageVideoList     = @"videoList";
AppPage _Nonnull const AppPageVideoDetail   = @"videoDetail";

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



@implementation AppHTTPRequest

- (NSString *)description {
    return [NSString stringWithFormat:@"url: %@, method: %@, params: %@, headers: %@", self.url, self.method, self.params, self.headers];
}

@end
