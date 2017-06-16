//
//  AppNavigationExport.m
//  OCJSCore
//
//  Created by mlibai on 2017/6/16.
//  Copyright © 2017年 mlibai. All rights reserved.
//

#import "AppNavigationExport.h"
#import "AppExport.h"


@class AppNavigationBarExport;
@protocol AppNavigationBarExportDelegate <NSObject>

- (void)bar:(AppNavigationBarExport *)bar title:(nullable NSString *)title;
- (void)bar:(AppNavigationBarExport *)bar titleColor:(NSString *)titleColor;
- (void)bar:(AppNavigationBarExport *)bar isHidden:(BOOL)isHidden;
- (void)bar:(AppNavigationBarExport *)bar backgroundColor:(NSString *)backgroundColor;

@end

@interface AppNavigationBarExport : NSObject <AppNavigationBarExport>
@property (nonatomic, weak, nullable, readonly) id<AppNavigationBarExportDelegate> delegate;
- (instancetype)initWithDelegate:(id<AppNavigationBarExportDelegate>)delegate;
@end




// ---

@interface AppNavigationExport () <AppNavigationBarExportDelegate>

@end

@implementation AppNavigationExport

@synthesize bar = _bar;

- (instancetype)init {
    self = [super init];
    if (self != nil) {
        _bar = [[AppNavigationBarExport alloc] initWithDelegate:self];
    }
    return self;
}

- (void)push:(NSString *)url animated:(BOOL)animated {
    [_delegate navigation:self push:url animated:animated];
}

- (void)pop:(BOOL)animated {
    [_delegate navigation:self pop:animated];
}

- (void)popTo:(NSInteger)index animated:(BOOL)animated {
    [_delegate navigation:self popTo:index animated:animated];
}

- (void)bar:(AppNavigationBarExport *)bar title:(nullable NSString *)title {
    [_delegate navigation:self title:title];
}

- (void)bar:(AppNavigationBarExport *)bar titleColor:(NSString *)titleColor {
    [_delegate navigation:self titleColor:titleColor];
}

- (void)bar:(AppNavigationBarExport *)bar isHidden:(BOOL)isHidden {
    [_delegate navigation:self isHidden:isHidden];
}

- (void)bar:(AppNavigationBarExport *)bar backgroundColor:(NSString *)backgroundColor {
    [_delegate navigation:self backgroundColor:backgroundColor];
}

@end













@implementation AppNavigationBarExport

@synthesize isHidden = _isHidden, title = _title, titleColor = _titleColor, backgoundColor = _backgoundColor;

- (instancetype)initWithDelegate:(id<AppNavigationBarExportDelegate>)delegate {
    self = [super init];
    if (self != nil) {
        _delegate = delegate;
    }
    return self;
}

- (void)setIsHidden:(BOOL)isHidden {
    _isHidden = isHidden;
    [_delegate bar:self isHidden:_isHidden];
}

- (void)setTitle:(NSString *)title {
    _title = title;
    [_delegate bar:self title:_title];
}

- (void)setTitleColor:(NSString *)titleColor {
    _titleColor = titleColor;
    [_delegate bar:self titleColor:titleColor];
}

- (void)setBackgoundColor:(NSString *)backgoundColor {
    _backgoundColor = backgoundColor;
    [_delegate bar:self backgroundColor:backgoundColor];
}

@end
