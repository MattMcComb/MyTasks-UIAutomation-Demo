#import "../tuneup/tuneup.js"

var APP;
var TARGET;
var TEST_TASK_TITLE = "Automate all the things";

function taskTable() {
    return APP.mainWindow().tableViews()["Task list"];
}

function titleOfTaskAtRow(row) {
    var cell = taskTable().cells()[row];
    return cell.elements[0].text();
}

function taskCellWithTitle(title) {
    UIALogger.logMessage("Getting task cell with title '" + title + "'");
    return taskTable().cells().withName(title)[0];
}

function addTaskWithTitle(title) {
    var newTaskField = taskTable().textFields()["New task title"];
    newTaskField.tap();
    newTaskField.setValue(title);
    UIALogger.logMessage("Adding task with title '" + title + "'");
    APP.keyboard().elements()['Done'].tap();
}

function deleteTaskWithTitle(title) {
    UIALogger.logMessage("Deleting task with title '" + title + "'");
    var cell = taskCellWithTitle(title);
    cell.dragInsideWithOptions({startOffset: {x: 0.1, y: 0.1}, endOffset: {x: 0.6, y: 0.1}, duration: 0.25});
    cell.buttons().withPredicate("name contains[c] 'Confirm Deletion'")[0].tap();
}

test("blah", function(target, app) {
	target.logElementTree();
	 var textFields = target.textFields();
	 UIALogger.logMessage('Text Fields: ' + textFields.length);
});

test("setup", function(target, app) {
    APP = app;
    TARGET = target;
});

test("tasks can be added to the list", function (target, app) {
    addTaskWithTitle(TEST_TASK_TITLE);
    assertNotNull(taskCellWithTitle(TEST_TASK_TITLE));
});

test("tasks can be removed from the list", function (target, app) {
    deleteTaskWithTitle(TEST_TASK_TITLE);
    assertNull(taskCellWithTitle(TEST_TASK_TITLE));
});

test("new tasks are inserted at the top of the list", function(target, app){
    var taskTitle = 'Put me at the top';
    addTaskWithTitle(taskTitle);
    assertEquals(taskTable().cells()[0].name(), taskTitle);
});

test("task title cannot be empty", function(target, app) {
    var didShowAlert = false;
    UIATarget.onAlert = function onAlert(alert) {
        if (alert.name() == 'Task Title Cannot be Blank') {
	 		UIALogger.logMessage('Dismissing blank task title alert');
            alert.buttons()["OK"].tap();
	 		didShowAlert = true;
        }
        return false;
    }
    addTaskWithTitle('');
    target.delay(2);
    assertTrue(didShowAlert);
    assertNull(taskCellWithTitle(''));
});

test("task titles must be unique", function(target, app){
    var titleForTask = 'Do something once';
    var didShowAlert = false;
    UIATarget.onAlert = function onAlert(alert) {
        if (alert.name() == 'Task Exists Already') {
            UIALogger.logMessage('Dismissing duplicate task alert');
            alert.buttons()[0].tap();
            didShowAlert = true;
        }
    }
    addTaskWithTitle(titleForTask);
    addTaskWithTitle(titleForTask);
    target.delay(2);
    assertTrue(didShowAlert);
    assertEquals(1, taskTable().cells().withName(titleForTask).length);
    deleteTaskWithTitle(titleForTask);
});
