//
//  AppNavigationExport.h
//  OCJSCore
//
//  Created by mlibai on 2017/6/16.
//  Copyright © 2017年 mlibai. All rights reserved.
//

#import <Foundation/Foundation.h>
@import JavaScriptCore;

@protocol AppExportDelegate, AppNavigationExportDelegate;

NS_ASSUME_NONNULL_BEGIN


/** 导航栏 */
@protocol AppNavigationBarExport <NSObject, JSExport>
@property (nonatomic) BOOL isHidden;
@property (nonatomic, copy, nullable) NSString *title;
@property (nonatomic, copy, nullable) NSString *titleColor;
@property (nonatomic, copy, nullable) NSString *backgoundColor;
@end

/** 导航。处理导航行为以及管理导航条。 */
@protocol AppNavigationExport <NSObject, JSExport>
@property (nonatomic, strong, readonly, nonnull) NSObject<AppNavigationBarExport> *bar;
@property (nonatomic, weak, nullable, readonly) id<AppNavigationExportDelegate> delegate;
JSExportAs(push, - (void)push:(nonnull NSString *)url animated:(BOOL)animated);
- (void)pop:(BOOL)animated;
JSExportAs(popTo, - (void)popTo:(NSInteger)index animated:(BOOL)animated);
@end





// 导航
@interface AppNavigationExport : NSObject <AppNavigationExport>
@property (nonatomic, weak, nullable) id<AppNavigationExportDelegate> delegate;
@end



@protocol AppNavigationExportDelegate <NSObject>

- (void)navigation:(AppNavigationExport *)navigation push:(NSString *)url animated:(BOOL)animated;
- (void)navigation:(AppNavigationExport *)navigation pop:(BOOL)animated;
- (void)navigation:(AppNavigationExport *)navigation popTo:(NSInteger)index animated:(BOOL)animated;

- (void)navigation:(AppNavigationExport *)navigation title:(nullable NSString *)title;
- (void)navigation:(AppNavigationExport *)navigation titleColor:(NSString *)titleColor;
- (void)navigation:(AppNavigationExport *)navigation isHidden:(BOOL)isHidden;
- (void)navigation:(AppNavigationExport *)navigation backgroundColor:(NSString *)backgroundColor;

@end
NS_ASSUME_NONNULL_END
