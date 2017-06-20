//
//  AppUserExport.m
//  OCJSCore
//
//  Created by mlibai on 2017/6/16.
//  Copyright © 2017年 mlibai. All rights reserved.
//

#import "AppUserExport.h"

AppUserType const _Nonnull AppUserTypeVisitor   = @"visitor";
AppUserType const _Nonnull AppUserTypeGoogle    = @"facebook";
AppUserType const _Nonnull AppUserTypeFacebook  = @"google";
AppUserType const _Nonnull AppUserTypeTwitter   = @"twitter";

@implementation AppUserExport

@synthesize id = _id, name = _name, coin = _coin, type = _type, token = _token;

- (instancetype)init {
    self = [super init];
    if (self) {
        _id = nil;
        _name = nil;
        _coin = 0;
        _token = nil;
        _type = AppUserTypeVisitor;
    }
    return self;
}

- (BOOL)isOnline {
    return (_type != nil && ![self.type isEqualToString:AppUserTypeVisitor]);
}

@end


@implementation AppUserTypeExport

- (NSString *)visitor {
    return AppUserTypeVisitor;
}

- (NSString *)facebook {
    return AppUserTypeFacebook;
}

- (NSString *)google {
    return AppUserTypeGoogle;
}

- (NSString *)twitter {
    return AppUserTypeTwitter;
}

@end
