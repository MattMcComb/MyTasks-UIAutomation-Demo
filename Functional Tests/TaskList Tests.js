#import "../tuneup/tuneup.js"

var APP;
var TARGET;
var TEST_TASK_TITLE = "Automate all the things";


/**
 * Use the first test to slip in some test fixture initialisation.
 *
 * Tuneup.js does not seem to provide test suite initialisation methods i.e. setUp() and before().  There may still be
 * a better way to do initialisation however?
 */
test("setup", function(target, app) {
    // Store the target and app parameters in global variables - they can then be used by helper functions to access
    // UI elements with needing individual tests to pass them as parameters.
    APP = app;
    TARGET = target;
});

/**
 * Tests that a new task can be added to the task list.
 */
test("tasks can be added to the list", function (target, app) {
    addTaskWithTitle(TEST_TASK_TITLE);
    assertNotNull(taskCellWithTitle(TEST_TASK_TITLE));
});

/**
 * Tests that an existing task can be removed from the task list.
 */
test("tasks can be removed from the list", function (target, app) {
    //... delete the task added in the previous test ...
    deleteTaskWithTitle(TEST_TASK_TITLE);
    assertNull(taskCellWithTitle(TEST_TASK_TITLE));
});

/**
 * Tests that tasks are ordered by the date/time at which they were added.
 */
test("new tasks are inserted at the top of the list", function(target, app){
    var taskTitle = 'Put me at the top';
    addTaskWithTitle(taskTitle);
    // assert that the first cell's title matches the task we've just added
    assertEquals(taskTable().cells()[0].name(), taskTitle);
});

/**
 * Tests that tasks with no title cannot be added.
 */
test("task title cannot be empty", function(target, app) {
    var didShowAlert = false;
    // Add an alert handler that will set a boolean flag if an error alert is displayed
    UIATarget.onAlert = function onAlert(alert) {
        if (alert.name() == 'Task Title Cannot be Blank') {
	 		UIALogger.logMessage('Dismissing blank task title alert');
            alert.buttons()["OK"].tap();
	 		didShowAlert = true;
        }
        return false;
    }
    addTaskWithTitle('');
    // Give the UI thread some time to display the alert
    target.delay(2);
    // Assert that the error alert was displayed and that the task was not added to the list
    assertTrue(didShowAlert);
    assertNull(taskCellWithTitle(''));
});

/**
 * Test that no two tasks can share the same title.
 */
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
    // Attempt to add the same task twice...
    addTaskWithTitle(titleForTask);
    addTaskWithTitle(titleForTask);
    target.delay(2);
    // Assert that the error alert was displayed and that the task was only added to the list once
    assertTrue(didShowAlert);
    assertEquals(1, taskTable().cells().withName(titleForTask).length);
    // ... clean up after ourselves and leave the task list empty for future runs of the test suite
    deleteTaskWithTitle(titleForTask);
});

/**
 * Obtains a reference to the table view containing the list of tasks.
 * @returns {UIATableView} reference to the table view containing tasks
 */
function taskTable() {
    return APP.mainWindow().tableViews()["Task list"];
}

/**
 * Obtains the cell title for a particular row in table of tasks - this will match the title of the task itself.
 * @param row the index of the row from which to retrieve the title.
 * @returns {string} the title of the task cell
 */
function titleOfTaskAtRow(row) {
    var cell = taskTable().cells()[row];
    return cell.elements[0].text();
}

/**
 * Obtains a reference to a cell in the table of tasks whose title matches that provided - or null if no matching cell
 * was found.
 * @param title the task title for which a matching table view cell is to be found
 * @returns {UIATableViewCell} the table view cell containing the task title
 */
function taskCellWithTitle(title) {
    UIALogger.logMessage("Getting task cell with title '" + title + "'");
    return taskTable().cells().withName(title)[0];
}

/**
 * Adds a task to the tasks table.
 * @param title the title of the task to be added
 */
function addTaskWithTitle(title) {
    var newTaskField = taskTable().textFields()["New task title"];
    newTaskField.tap();
    newTaskField.setValue(title);
    UIALogger.logMessage("Adding task with title '" + title + "'");
    APP.keyboard().elements()['Done'].tap();
}

/**
 * Deletes a task from the tasks tables.
 * @param title title of the task to be deleted
 */
function deleteTaskWithTitle(title) {
    UIALogger.logMessage("Deleting task with title '" + title + "'");
    var cell = taskCellWithTitle(title);
    cell.dragInsideWithOptions({startOffset: {x: 0.1, y: 0.1}, endOffset: {x: 0.6, y: 0.1}, duration: 0.25});
    cell.buttons().withPredicate("name contains[c] 'Confirm Deletion'")[0].tap();
}
