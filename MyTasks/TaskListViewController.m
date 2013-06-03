//
//  TaskListViewController.m
//  MyTasks
//
//  Created by Matthew McComb on 05/30/13.
//  Copyright (c) 2013 Instil. All rights reserved.
//

#import "TaskListViewController.h"

@interface TaskListViewController () <UITextFieldDelegate> {
    NSMutableArray *tasks;
    NSIndexPath *firstItemPath;
}

@end

@implementation TaskListViewController

@synthesize taskEntryField = _taskEntryField;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
    if (self = [super initWithNibName:nibBundleOrNil bundle:nibBundleOrNil]) {
        tasks = [[NSMutableArray alloc] init];
        firstItemPath = [NSIndexPath indexPathForRow:0 inSection:0];
    }
    return self;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    [[self tableView] setAccessibilityLabel:@"Task list"];
    [_taskEntryField setDelegate:self];
    [_taskEntryField setReturnKeyType:UIReturnKeyDone];
    [_taskEntryField setAccessibilityLabel:@"New task title"];
    [_taskEntryField setAccessibilityHint:@"Adds a new task to the list."];
}


#pragma mark - UITableViewDataSource

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    static NSString *TaskCellIdentifier = @"TaskCell";
    UITableViewCell *taskCell = [tableView dequeueReusableCellWithIdentifier:TaskCellIdentifier];
    if (taskCell == nil) {
        taskCell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleValue1 reuseIdentifier:TaskCellIdentifier];
    }
    NSString * taskForCell = [tasks objectAtIndex:[indexPath row]];
    [[taskCell textLabel] setText:taskForCell];
    return taskCell;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return [tasks count];
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}

#pragma mark - UITableViewDelegate

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    [[self tableView] deselectRowAtIndexPath:indexPath animated:true];
}

- (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath {
    return YES;
}

- (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle
        forRowAtIndexPath:(NSIndexPath *)indexPath {
    if (editingStyle == UITableViewCellEditingStyleDelete) {
        [tasks removeObjectAtIndex:[indexPath row]];
        [[self tableView] deleteRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationRight];
    }
}

#pragma mark - Task Addition

- (void)clearTaskEntryField {
    [_taskEntryField setText:@""];
}

- (void)addTask {
    NSString *taskTitle = [_taskEntryField text];
    NSLog(@"User added new task with title '%@'", taskTitle);
    if ([tasks containsObject:taskTitle]) {
        NSString *errorMessage = [NSString stringWithFormat:@"A task called '%@' exists already", taskTitle];
        UIAlertView *taskExistsAlert = [[UIAlertView  alloc] initWithTitle:@"Task Exists Already"
                                                                   message:errorMessage
                                                                  delegate:self
                                                         cancelButtonTitle:@"OK"
                                                         otherButtonTitles:nil];
        [taskExistsAlert show];
        return;
    }
    [tasks insertObject:taskTitle atIndex:0];
    [[self tableView] insertRowsAtIndexPaths:@[firstItemPath] withRowAnimation:UITableViewRowAnimationLeft];
    [self clearTaskEntryField];
}

#pragma mark - UITextFieldDelegate

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
    if (textField == _taskEntryField) {
        if ([[[textField text] stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]] length] == 0) {
            UIAlertView *enterTitleAlert = [[UIAlertView alloc] initWithTitle:@"Task Title Cannot be Blank"
                                                                      message:@"Enter a title for the task"
                                                                     delegate:self
                                                            cancelButtonTitle:@"OK"
                                                            otherButtonTitles:nil];
            [enterTitleAlert show];
            return NO;
        }
        [textField resignFirstResponder];
        [self addTask];
    }
    return NO;
}

@end