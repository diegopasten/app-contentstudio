/**
 * Created on 5/31/2017.
 */
const ContentDuplicateDialog = require('../content.duplicate.dialog');
const CreateTaskDialog = require('../issue/create.task.dialog');
const lib = require('../../libs/elements');
const appConst = require('../../libs/app_const');
const ConfirmationDialog = require('../confirmation.dialog');
const CreateRequestPublishDialog = require('../../page_objects/issue/create.request.publish.dialog');
const ContentDeleteDialog = require('../../page_objects/delete.content.dialog');
const ConfirmContentDeleteDialog = require('../../page_objects/confirm.content.delete.dialog');
const BrowseDetailsPanel = require('../../page_objects/browsepanel/detailspanel/browse.details.panel');
const BaseBrowsePanel = require('../../page_objects/base.browse.panel');

const XPATH = {
    container: "//div[contains(@id,'ContentBrowsePanel')]",
    toolbar: `//div[contains(@id,'ContentBrowseToolbar')]`,
    treeGridToolbar: `//div[contains(@id,'ContentTreeGridToolbar')]`,
    treeGrid: `//div[contains(@id,'ContentTreeGrid')]`,
    appBar: `//div[contains(@id,'AppBar')]`,
    projectSelector: "//div[contains(@id,'ProjectSelector')]",
    selectedRow: `//div[contains(@class,'slick-viewport')]//div[contains(@class,'slick-row') and descendant::div[contains(@class,'slick-cell') and contains(@class,'highlight')]]`,
    checkedRows: `//div[contains(@class,'slick-viewport')]//div[contains(@class,'slick-cell-checkboxsel selected')]`,
    searchButton: "//button[contains(@class, 'icon-search')]",
    showIssuesListButton: "//button[contains(@id,'ShowIssuesDialogButton')]",
    createTaskMenuItem: "//ul[contains(@id,'Menu')]//li[contains(@id,'MenuItem') and text()='Create Task...']",
    markAsReadyMenuItem: "//ul[contains(@id,'Menu')]//li[contains(@id,'MenuItem') and text()='Mark as ready']",
    requestPublishMenuItem: "//ul[contains(@id,'Menu')]//li[contains(@id,'MenuItem') and text()='Request Publish']",
    createTaskButton: "//button[contains(@id,'ActionButton')]//span[text()='Create Task...']",
    contentPublishMenuButton: `//div[contains(@id,'ContentBrowsePublishMenuButton')]`,
    selectionControllerCheckBox: `//div[contains(@id,'SelectionController')]`,
    numberInSelectionToggler: `//button[contains(@id,'SelectionPanelToggler')]/span`,
    duplicateButton: `/button[contains(@id,'ActionButton') and child::span[contains(.,'Duplicate...')]]`,
    contentSummaryByName: function (name) {
        return `//div[contains(@id,'ContentSummaryAndCompareStatusViewer') and descendant::p[contains(@class,'sub-name') and contains(.,'${name}')]]`
    },
    contentSummaryByDisplayName: function (displayName) {
        return `//div[contains(@id,'ContentSummaryAndCompareStatusViewer') and descendant::h6[contains(@class,'main-name') and contains(.,'${displayName}')]]`
    },
    projectItemByDisplayName:
        displayName => `//div[contains(@id,'ProjectListItemViewer')and descendant::h6[contains(@class,'main-name') and contains(.,'${displayName}')]]`,
    publishMenuItemByName: function (name) {
        return `//ul[contains(@id,'Menu')]//li[contains(@id,'MenuItem') and contains(.,'${name}')]`
    },
    rowByDisplayName:
        displayName => `//div[contains(@id,'NamesView') and child::h6[contains(@class,'main-name') and contains(.,'${displayName}')]]`,

    checkboxByName: function (name) {
        return `${lib.itemByName(
            name)}/ancestor::div[contains(@class,'slick-row')]/div[contains(@class,'slick-cell-checkboxsel')]/label`
    },
    checkboxByDisplayName: displayName => `${lib.itemByDisplayName(
        displayName)}/ancestor::div[contains(@class,'slick-row')]/div[contains(@class,'slick-cell-checkboxsel')]/label`,

    expanderIconByName: function (name) {
        return lib.itemByName(name) +
               `/ancestor::div[contains(@class,'slick-cell')]/span[contains(@class,'collapse') or contains(@class,'expand')]`;
    },
    defaultActionByName: name => `//button[contains(@id, 'ActionButton') and child::span[contains(.,'${name}')]]`,
}

class ContentBrowsePanel extends BaseBrowsePanel {

    get deleteButton() {
        return XPATH.toolbar + `/*[contains(@id, 'ActionButton') and child::span[text()='Delete...']]`;
    }

    get moveButton() {
        return XPATH.toolbar + `/*[contains(@id, 'ActionButton') and child::span[text()='Move...']]`;
    }

    get duplicateButton() {
        return XPATH.toolbar + XPATH.duplicateButton;
    }

    get previewButton() {
        return XPATH.toolbar + `/*[contains(@id, 'ActionButton') and child::span[contains(.,'Preview')]]`;
    }

    get sortButton() {
        return XPATH.toolbar + `/*[contains(@id, 'ActionButton') and child::span[contains(.,'Sort...')]]`;
    }

    get searchButton() {
        return XPATH.toolbar + XPATH.searchButton;
    }

    get detailsPanelToggleButton() {
        return XPATH.container + lib.DETAILS_PANEL_TOGGLE_BUTTON;
    }

    get showPublishMenuButton() {
        return XPATH.toolbar + XPATH.contentPublishMenuButton + lib.DROP_DOWN_HANDLE;
    }

    get createTaskMenuItem() {
        return XPATH.toolbar + XPATH.createTaskMenuItem;
    }

    get requestPublishMenuItem() {
        return XPATH.toolbar + XPATH.requestPublishMenuItem;
    }

    get markAsReadyMenuItem() {
        return XPATH.toolbar + XPATH.markAsReadyMenuItem;
    }

    get createTaskButton() {
        return XPATH.toolbar + XPATH.createTaskButton;
    }

    get showIssuesListButton() {
        return XPATH.appBar + XPATH.showIssuesListButton;
    }

    get selectionControllerCheckBox() {
        return XPATH.treeGridToolbar + XPATH.selectionControllerCheckBox;
    }

    get selectionPanelToggler() {
        return `${XPATH.treeGridToolbar}${lib.SELECTION_PANEL_TOGGLER}`;
    }

    get newButton() {
        return `${XPATH.toolbar}/*[contains(@id, 'ActionButton') and child::span[contains(.,'New...')]]`
    }

    get editButton() {
        return `${XPATH.toolbar}/*[contains(@id, 'ActionButton') and child::span[text()='Edit']]`;
    }

    get undoDeleteButton() {
        return XPATH.toolbar + "/*[contains(@id, 'ActionButton') and child::span[text()='Undo delete']]";
    }

    get numberInToggler() {
        return XPATH.treeGridToolbar + XPATH.numberInSelectionToggler;
    }

    get publishButton() {
        return XPATH.contentPublishMenuButton + `//button[contains(@id, 'ActionButton') and child::span[contains(.,'Publish...')]]`
    }

    get unpublishButton() {

        return XPATH.contentPublishMenuButton + `//button[contains(@id, 'ActionButton') and child::span[contains(.,'Unpublish...')]]`
    }

    get publishTreeButton() {
        return XPATH.contentPublishMenuButton + `//button[contains(@id, 'ActionButton') and child::span[contains(.,'Publish Tree...')]]`;
    }

    get markAsReadyButton() {
        return XPATH.contentPublishMenuButton + `//button[contains(@id, 'ActionButton') and child::span[contains(.,'Mark as ready')]]`;
    }

    get displayNames() {
        return XPATH.treeGrid + lib.H6_DISPLAY_NAME;
    }

    get treeGrid() {
        return XPATH.container + XPATH.treeGrid;
    }

    get projectSelectorDropDownHandle() {
        return XPATH.projectSelector + "//button[contains(@id,'DropdownHandle')]"
    }

    waitForProjectSelectorDropDownHandleDisplayed() {
        return this.waitForElementDisplayed(this.projectSelectorDropDownHandle, appConst.TIMEOUT_2);
    }

    async clickOnProjectSelectorDropDownHandle() {
        await this.waitForProjectSelectorDropDownHandleDisplayed();
        return await this.clickOnElement(this.projectSelectorDropDownHandle);
    }

    hotKeyPublish() {
        return this.getBrowser().status().then(status => {
            if (status.os.name.toLowerCase().includes('wind') || status.os.name.toLowerCase().includes('linux')) {
                return this.getBrowser().keys(['Control', 'Alt', 'p']);
            }
            if (status.os.name.toLowerCase().includes('mac')) {
                return this.getBrowser().keys(['Command', 'Alt', 'p']);
            }
        })
    }

    //Wait for `Publish Menu` Button gets `Publish...`
    waitForPublishButtonVisible() {
        return this.waitForElementDisplayed(this.publishButton, appConst.TIMEOUT_3).catch(err => {
            this.saveScreenshot("err_publish_button");
            throw new Error("Publish button is not visible! " + err);
        })
    }

    waitForStateIconNotDisplayed(displayName) {
        let xpath = XPATH.contentSummaryByDisplayName(displayName);
        return this.getBrowser().waitUntil(() => {
            return this.getAttribute(xpath, 'class').then(result => {
                return (!result.includes('in-progress') && !result.includes('ready'));
            });
        }, 3000).catch(err => {
            throw new Error("Workflow icon still visible in content: " + displayName + " " + err);
        });
    }

    //Wait for `Publish Menu` Button gets 'Mark as ready'
    waitForMarkAsReadyButtonVisible() {
        return this.waitForElementDisplayed(this.markAsReadyButton, appConst.TIMEOUT_3).catch(err => {
            this.saveScreenshot("err_publish_button_mark_as_ready");
            throw new Error("Mark as Ready button is not visible! " + err);
        })
    }

    //Wait for `Publish Menu` Button gets 'Unpublish'
    waitForUnPublishButtonVisible() {
        return this.waitForElementDisplayed(this.unpublishButton, appConst.TIMEOUT_2).catch(err => {
            throw new Error('Unpublish button is not displayed after 2 seconds ' + err);
        })
    }

    //Wait for `Publish Menu` Button gets 'Publish Tree...'
    waitForPublishTreeButtonVisible() {
        return this.waitForElementDisplayed(this.publishTreeButton, appConst.TIMEOUT_3).catch(err => {
            this.saveScreenshot("err_browse_publish_tree_button");
            throw new Error("'Publish Tree' button should be present on the browse-toolbar " + err);
        })
    }

    async clickOnPublishTreeButton() {
        await this.waitForPublishTreeButtonVisible();
        return await this.clickOnElement(this.publishTreeButton);
    }

    async clickOnUndoDeleteButton() {
        await this.waitForElementDisplayed(this.undoDeleteButton);
        return await this.clickOnElement(this.undoDeleteButton);
    }

    //waits for button MARK AS READY appears on the toolbar, then click on it and confirm.
    async clickOnMarkAsReadyButtonAndConfirm() {
        await this.waitForMarkAsReadyButtonVisible();
        await this.clickOnElement(this.markAsReadyButton);
        let confirmationDialog = new ConfirmationDialog();
        await confirmationDialog.waitForDialogOpened();
        return await confirmationDialog.clickOnYesButton();
    }

    //Opens 'Delete Content Dialog' and clicks on 'Mark as deleted' menu item:
    async doSelectedContentMarkAsDeleted() {
        let contentDeleteDialog = new ContentDeleteDialog();
        await this.clickOnDeleteButton();
        await contentDeleteDialog.waitForDialogOpened();
        await contentDeleteDialog.clickOnMarkAsDeletedMenuItem();
        return await contentDeleteDialog.waitForDialogClosed();
    }

    //When single content is selected, confirmation is no needed
    async clickOnMarkAsReadyButton() {
        await this.waitForMarkAsReadyButtonVisible();
        await this.clickOnElement(this.markAsReadyButton);
        return await this.pause(500);
    }

    clickOnMoveButton() {
        return this.clickOnElement(this.moveButton).catch(err => {
            throw new Error('error when clicking on the Move button ' + err);
        })
    }

    async clickOnPublishButton() {
        await this.waitForPublishButtonVisible();
        await this.pause(400);
        return await this.clickOnElement(this.publishButton);
    }

    async clickOnSortButton() {
        await this.waitForElementEnabled(this.sortButton);
        await this.pause(200);
        await this.clickOnElement(this.sortButton);
        return await this.pause(400);
    }

    clickOnDuplicateButton() {
        return this.clickOnElement(this.duplicateButton).catch(err => {
            throw new Error('error when clicking on the Duplicate button ' + err);
        })
    }

    clickOnDetailsPanelToggleButton() {
        return this.clickOnElement(this.detailsPanelToggleButton).catch(err => {
            this.saveScreenshot('err_click_on_details_panel_toggle');
            throw new Error(`Error when clicking on Details Panel toggler` + err);
        });
    }

    async clickOnExpanderIcon(name) {
        try {
            let expanderIcon = XPATH.treeGrid + XPATH.expanderIconByName(name);
            await this.clickOnElement(expanderIcon);
            return await this.pause(900);
        } catch (err) {
            this.saveScreenshot('err_click_on_expander');
            throw new Error('error when clicking on expander-icon ' + err);
        }
    }

    async clickOnShowIssuesListButton() {
        try {
            await this.waitForElementDisplayed(this.showIssuesListButton);
            return await this.clickOnElement(this.showIssuesListButton);
        } catch (err) {
            throw new Error('error when click on the button ' + err);
        }
    }

    clickOnSearchButton() {
        return this.clickOnElement(this.searchButton);
    }

    // clicks on 'Duplicate button' and waits until modal dialog appears
    async clickOnDuplicateButtonAndWait() {
        try {
            await this.waitForElementEnabled(this.duplicateButton, appConst.TIMEOUT_3);
            await this.clickOnElement(this.duplicateButton);
            //Wait for modal dialog loaded:
            let contentDuplicateDialog = new ContentDuplicateDialog();
            return await contentDuplicateDialog.waitForDialogOpened();
        } catch (err) {
            throw new Error('error when clicking on the Duplicate button ' + err);
        }
    }

    async waitForContentDisplayed(contentName) {
        try {
            return await this.waitForElementDisplayed(XPATH.treeGrid + lib.itemByName(contentName), appConst.TIMEOUT_3);
        } catch (err) {
            console.log("item is not displayed:" + contentName);
            this.saveScreenshot('err_find_' + contentName)
            throw new Error('content is not displayed ! ' + contentName + "  " + err);
        }
    }

    waitForContentNotDisplayed(contentName) {
        return this.waitForElementNotDisplayed(XPATH.treeGrid + lib.itemByName(contentName), appConst.TIMEOUT_3).catch(err => {
            throw new Error("Content is still displayed :" + err);
        });
    }

    clickOnDeleteButton() {
        return this.waitForElementEnabled(this.deleteButton, 2000).then(() => {
            return this.clickOnElement(this.deleteButton);
        }).catch(err => {
            this.saveScreenshot('err_browsepanel_delete');
            throw new Error('Delete button is not enabled! ' + err);
        })
    }

    async clickOnPreviewButton() {
        try {
            await this.waitForElementEnabled(this.previewButton, 2000);
            await this.clickOnElement(this.previewButton);
            return await this.pause(2000);
        } catch (err) {
            this.saveScreenshot('err_browsepanel_preview');
            throw new Error('Error when clicking on Preview button ' + err);
        }
    }

    isSearchButtonDisplayed() {
        return this.isElementDisplayed(this.searchButton);
    }

    waitForPreviewButtonDisabled() {
        return this.waitForElementDisabled(this.previewButton, 3000).catch(err => {
            this.saveScreenshot('err_preview_disabled_button');
            throw Error('Preview button should be disabled, timeout: ' + 3000 + 'ms')
        })
    }

    waitForDetailsPanelToggleButtonDisplayed() {
        return this.waitForElementDisplayed(this.detailsPanelToggleButton, 3000).catch(err => {
            this.saveScreenshot('err_details_panel_displayed');
            throw Error('Details Panel toggle button should be displayed, timeout: ' + 3000 + 'ms')
        })
    }

    waitForSortButtonDisabled() {
        return this.waitForElementDisabled(this.sortButton, 3000).catch(err => {
            this.saveScreenshot('err_sort_disabled_button');
            throw Error('Sort button should be disabled, timeout: ' + 3000 + 'ms')
        })
    }

    waitForDuplicateButtonDisabled() {
        return this.waitForElementDisabled(this.duplicateButton, 3000).catch(err => {
            this.saveScreenshot('err_duplicate_disabled_button');
            throw Error('Duplicate button should be disabled, timeout: ' + 3000 + 'ms')
        })
    }

    waitForMoveButtonDisabled() {
        return this.waitForElementDisabled(this.moveButton, 3000).catch(err => {
            this.saveScreenshot('err_move_disabled_button');
            throw Error('Move button should be disabled, timeout: ' + 3000 + 'ms')
        })
    }

    waitForSortButtonEnabled() {
        return this.waitForElementEnabled(this.sortButton, 3000).catch(err => {
            this.saveScreenshot('err_sort_enabled_button');
            throw Error('Sort button should be enabled, timeout: ' + 3000 + 'ms')
        })
    }

    waitForMoveButtonEnabled() {
        return this.waitForElementEnabled(this.moveButton, 3000).catch(err => {
            this.saveScreenshot('err_move_enabled_button');
            throw Error('Move button should be enabled, timeout: ' + 3000 + 'ms')
        })
    }

    waitForMoveButtonDisabled() {
        return this.waitForElementDisabled(this.moveButton, 3000).catch(err => {
            this.saveScreenshot('err_move_disabled_button');
            throw Error('Move button should be disabled, timeout: ' + 3000 + 'ms')
        })
    }

    clickOnRowByDisplayName(displayName) {
        let nameXpath = XPATH.treeGrid + lib.itemByDisplayName(displayName);
        return this.waitForElementDisplayed(nameXpath, 3000).then(() => {
            return this.clickOnElement(nameXpath);
        }).then(() => {
            return this.pause(300);
        }).catch(err => {
            this.saveScreenshot('err_find_' + displayName);
            throw Error('Row with the displayName ' + displayName + ' was not found' + err)
        })
    }

    waitForRowByNameVisible(name) {
        let nameXpath = XPATH.treeGrid + lib.itemByName(name);
        return this.waitForElementDisplayed(nameXpath, 3000).catch(err => {
            this.saveScreenshot('err_find_' + name);
            throw Error('Row with the name ' + name + ' is not visible after ' + 3000 + 'ms')
        })
    }

    waitForContentByDisplayNameVisible(displayName) {
        let nameXpath = XPATH.treeGrid + lib.itemByDisplayName(displayName);
        return this.waitForElementDisplayed(nameXpath, 3000).catch(err => {
            this.saveScreenshot('err_find_' + displayName);
            throw Error('Content with the displayName ' + displayName + ' is not visible after ' + 3000 + 'ms')
        })
    }

    clickCheckboxAndSelectRowByDisplayName(displayName) {
        const displayNameXpath = XPATH.checkboxByDisplayName(displayName);
        return this.waitForElementDisplayed(displayNameXpath, 2000).then(() => {
            return this.clickOnElement(displayNameXpath);
        }).then(() => {
            return this.pause(400);
        }).catch(err => {
            this.saveScreenshot('err_find_item');
            throw Error(`Row with the displayName ${displayName} was not found.` + err);
        })
    }

    clickOnCheckboxAndSelectRowByName(name) {
        let nameXpath = XPATH.checkboxByName(name);
        return this.waitForElementDisplayed(nameXpath, 2000).then(() => {
            return this.clickOnElement(nameXpath);
        }).then(() => {
            return this.pause(300);
        }).catch(err => {
            this.saveScreenshot('err_find_item');
            throw Error('Row with the name ' + name + ' was not found ' + err)
        })
    }

    getNumberOfSelectedRows() {
        return this.findElements(XPATH.selectedRow).then(result => {
            return result.length;
        }).catch(err => {
            throw new Error(`Error when getting selected rows ` + err);
        });
    }

    getNameOfSelectedRow() {
        return this.findElements(XPATH.selectedRow).then(result => {
            return this.getText(XPATH.selectedRow + lib.H6_DISPLAY_NAME);
        }).catch(err => {
            throw new Error(`Error when getting selected rows ` + err);
        });
    }

    async getSortingIcon(name) {
        let selector = lib.slickRowByDisplayName(XPATH.treeGrid, name) + "//div[contains(@class,'r2')]/span/div";
        let elems = await this.findElements(selector);
        if (elems.length === 0) {
            return "Default";
        }
        let classAttr = await elems[0].getAttribute("class");
        if (classAttr.includes('num-asc')) {
            return "Date ascending";
        } else if (classAttr.includes('num-desc')) {
            return "Date descending";
        } else if (classAttr === 'sort-dialog-trigger icon-menu') {
            return appConst.sortMenuItem.MANUALLY_SORTED;
        }
    }

    getNumberOfCheckedRows() {
        return this.findElements(XPATH.checkedRows).then(result => {
            return result.length;
        }).catch(err => {
            throw new Error(`Error when getting selected rows ` + err);
        });
    }

    isExpanderIconPresent(name) {
        let expanderIcon = XPATH.treeGrid + XPATH.expanderIconByName(name);
        return this.waitForElementDisplayed(expanderIcon).catch(err => {
            this.saveScreenshot('expander_not_exists ' + name);
            return false;
        })
    }

    // this method does not wait, it just checks the attribute
    isRedIconDisplayed(contentName) {
        let xpath = XPATH.contentSummaryByName(contentName);
        return this.getAttribute(xpath, 'class').then(result => {
            return result.includes('invalid');
        });
    }

    // this method waits until 'invalid' appears in the @class
    waitForRedIconDisplayed(contentName) {
        let xpath = XPATH.contentSummaryByName(contentName);
        return this.waitUntilInvalid(xpath);
    }

    getContentStatus(name) {
        let selector = lib.slickRowByDisplayName(XPATH.treeGrid, name) + "//div[contains(@class,'r3')]";
        return this.getText(selector);
    }

    waitForShowPublishMenuDropDownVisible() {
        return this.waitForElementDisplayed(this.showPublishMenuButton, appConst.TIMEOUT_3);
    }

    waitForCreateTaskButtonDisplayed() {
        return this.waitForElementDisplayed(this.createTaskButton, appConst.TIMEOUT_5).catch(err => {
            this.saveScreenshot("err_create_issue_button");
            throw new Error("Create Task button is not visible on the toolbar! " + err);
        });
    }

    async clickOnCreateTaskButton() {
        try {
            await this.waitForCreateTaskButtonDisplayed();
            return await this.clickOnElement(this.createTaskButton);
        } catch (err) {
            this.saveScreenshot("err_click_create_issue_button");
            throw new Error("Browse Panel. Error when click on Create Task button in the toolbar! " + err);
        }
    }

    waitUntilInvalid(selector) {
        return this.getBrowser().waitUntil(() => {
            return this.getAttribute(selector, 'class').then(result => {
                return result.includes('invalid');
            });
        }, 3000).catch(err => {
            return false;
        });
    }

    async waitForPublishMenuItemDisabled(menuItem) {
        let selector = XPATH.toolbar + XPATH.publishMenuItemByName(menuItem);
        return await this.waitForAttributeHasValue(selector, "class", "disabled");
    }

    async waitForPublishMenuItemEnabled(menuItem) {
        let selector = XPATH.toolbar + XPATH.publishMenuItemByName(menuItem);
        return await this.waitForAttributeNotIncludesValue(selector, "class", "disabled");
    }

    async openPublishMenu() {
        await this.clickOnElement(this.showPublishMenuButton);
        await this.pause(300);
    }

    async openPublishMenuSelectItem(menuItem) {
        try {
            await this.waitForShowPublishMenuDropDownVisible();
            await this.clickOnElement(this.showPublishMenuButton);
            let selector = XPATH.toolbar + XPATH.publishMenuItemByName(menuItem);
            await this.waitForPublishMenuItemEnabled(menuItem);
            await this.clickOnElement(selector);
            return this.pause(300);
        } catch (err) {
            this.saveScreenshot("err_click_issue_menuItem");
            throw new Error('error when try to click on publish menu item, ' + err);
        }
    }

    async openPublishMenuAndClickOnCreateTask() {
        await this.openPublishMenuSelectItem(appConst.PUBLISH_MENU.CREATE_TASK);
        let createTaskDialog = new CreateTaskDialog();
        return await createTaskDialog.waitForDialogLoaded();
    }

    async openPublishMenuAndClickOnRequestPublish() {
        await this.openPublishMenuSelectItem(appConst.PUBLISH_MENU.REQUEST_PUBLISH);
        let createRequestPublishDialog = new CreateRequestPublishDialog();
        return await createRequestPublishDialog.waitForDialogLoaded();
    }

    async openPublishMenuAndClickOnMarAsReady() {
        return await this.openPublishMenuSelectItem(appConst.PUBLISH_MENU.MARK_AS_READY);
    }

    async openPublishMenuAndClickOnMarAsReadyAndConfirm() {
        await this.openPublishMenuSelectItem(appConst.PUBLISH_MENU.MARK_AS_READY);
        let confirmationDialog = new ConfirmationDialog();
        return await confirmationDialog.clickOnYesButton();
    }

    //find workflow state by the display name
    async getWorkflowState(displayName) {
        let xpath = XPATH.contentSummaryByDisplayName(displayName);
        await this.waitForElementDisplayed(xpath, appConst.TIMEOUT_2);
        let result = await this.getAttribute(xpath, 'class');
        if (result.includes('in-progress')) {
            return appConst.WORKFLOW_STATE.WORK_IN_PROGRESS;
        } else if (result.includes('ready')) {
            return appConst.WORKFLOW_STATE.READY_FOR_PUBLISHING;
        } else if (result === 'viewer content-summary-and-compare-status-viewer') {
            return appConst.WORKFLOW_STATE.PUBLISHED;

        } else {
            throw new Error("Error when getting content's state, actual result is:" + result);
        }
    }

    //find workflow state by the name
    async getWorkflowStateByName(name) {
        let xpath = XPATH.contentSummaryByName(name);
        await this.waitForElementDisplayed(xpath, appConst.TIMEOUT_2);
        let result = await this.getAttribute(xpath, 'class');
        if (result.includes('in-progress')) {
            return appConst.WORKFLOW_STATE.WORK_IN_PROGRESS;
        } else if (result.includes('ready')) {
            return appConst.WORKFLOW_STATE.READY_FOR_PUBLISHING;
        } else if (result === 'viewer content-summary-and-compare-status-viewer') {
            return appConst.WORKFLOW_STATE.PUBLISHED;

        } else {
            throw new Error("Error when getting content's state, actual result is:" + result);
        }
    }

    async waitForDefaultAction(actionName) {
        try {
            let selector = XPATH.contentPublishMenuButton + XPATH.defaultActionByName(actionName);
            return await this.waitForElementDisplayed(selector, appConst.TIMEOUT_3);
        } catch (err) {
            throw Error(`Publish Menu -  '${actionName}'  this default action should be visible!: ` + err);
        }
    }

    async clickOnDeleteAndMarkAsDeletedAndConfirm(numberItems) {
        let contentDeleteDialog = new ContentDeleteDialog();
        let confirmContentDeleteDialog = new ConfirmContentDeleteDialog();
        await this.clickOnDeleteButton();
        await contentDeleteDialog.waitForDialogOpened();

        await contentDeleteDialog.clickOnMarkAsDeletedMenuItem();
        await confirmContentDeleteDialog.waitForDialogOpened();
        await confirmContentDeleteDialog.typeNumberOfContent(numberItems);
        await confirmContentDeleteDialog.clickOnConfirmButton();
        return await confirmContentDeleteDialog.waitForDialogClosed();
    }

    async openDetailsPanel() {
        let browseDetailsPanel = new BrowseDetailsPanel();
        let result = await browseDetailsPanel.isPanelVisible();
        if (!result) {
            await this.clickOnDetailsPanelToggleButton();
        }
        await browseDetailsPanel.waitForDetailsPanelLoaded();
        await browseDetailsPanel.waitForSpinnerNotVisible(appConst.TIMEOUT_5);
        return await this.pause(500);
    }


    getSelectedProjectDisplayName() {
        let selector = XPATH.projectSelector + lib.H6_DISPLAY_NAME;
        return this.getText(selector);
    }

    async selectContext(projectDisplayName) {
        await this.clickOnProjectSelectorDropDownHandle();
        let selector = XPATH.projectSelector + XPATH.projectItemByDisplayName(projectDisplayName);
        await this.waitForElementDisplayed(selector, appConst.TIMEOUT_2);
        return this.clickOnElement(selector);
    }
};
module.exports = ContentBrowsePanel;
