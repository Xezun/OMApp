//
//  AppUserExport.m
//  OCJSCore
//
//  Created by mlibai on 2017/6/16.
//  Copyright © 2017年 mlibai. All rights reserved.
//

#import "AppUserExport.h"

AppUserType const _Nonnull AppUserTypeVisitor = @"visitor";
AppUserType const _Nonnull AppUserTypeGoogle = @"facebook";
AppUserType const _Nonnull AppUserTypeFacebook = @"google";
AppUserType const _Nonnull AppUserTypeTwitter = @"twitter";

@implementation AppUserExport

@synthesize id = _id, name = _name, coin = _coin, type = _type;

- (instancetype)init {
    self = [super init];
    if (self) {
        _id = @"";
        _name = @"";
        _coin = 0;
        _type = AppUserTypeVisitor;
    }
    return self;
}

- (BOOL)isOnline {
    return ![self.type isEqualToString:AppUserTypeVisitor];
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
