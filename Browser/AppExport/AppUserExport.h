//
//  AppUserExport.h
//  OCJSCore
//
//  Created by mlibai on 2017/6/16.
//  Copyright © 2017年 mlibai. All rights reserved.
//

#import <Foundation/Foundation.h>
@import JavaScriptCore;

typedef NSString *AppUserType NS_EXTENSIBLE_STRING_ENUM;

FOUNDATION_EXPORT AppUserType const _Nonnull AppUserTypeVisitor;
FOUNDATION_EXPORT AppUserType const _Nonnull AppUserTypeGoogle;
FOUNDATION_EXPORT AppUserType const _Nonnull AppUserTypeFacebook;
FOUNDATION_EXPORT AppUserType const _Nonnull AppUserTypeTwitter;

@protocol AppUserTypeExport <NSObject, JSExport>
@property (nonatomic, readonly, nonnull) AppUserType visitor;
@property (nonatomic, readonly, nonnull) AppUserType google;
@property (nonatomic, readonly, nonnull) AppUserType facebook;
@property (nonatomic, readonly, nonnull) AppUserType twitter;
@end

@protocol AppUserExport <NSObject, JSExport>
@property (nonatomic, readonly) BOOL isOnline;
@property (nonatomic, copy, nullable, readonly) NSString *id;
@property (nonatomic, copy, nullable, readonly) NSString *name;
@property (nonatomic, copy, nullable, readonly) NSString *type;
@property (nonatomic, readonly) NSInteger coin;
@end

@interface AppUserTypeExport : NSObject <AppUserTypeExport>

@end

@interface AppUserExport : NSObject <AppUserExport>
@property (nonatomic, copy, nullable) NSString *id;
@property (nonatomic, copy, nullable) NSString *name;
@property (nonatomic, copy, nullable) NSString *type;
@property (nonatomic) NSInteger coin;
@end
