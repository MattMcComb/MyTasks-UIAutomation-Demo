//
//  AppDelegate.h
//  MyTasks
//
//  Created by Matthew McComb on 05/30/13.
//  Copyright (c) 2013 Instil. All rights reserved.
//

#import <UIKit/UIKit.h>

@class TaskListViewController;

@interface AppDelegate : UIResponder <UIApplicationDelegate>

@property (strong, nonatomic) UIWindow *window;

@property (strong, nonatomic) TaskListViewController *viewController;

@end