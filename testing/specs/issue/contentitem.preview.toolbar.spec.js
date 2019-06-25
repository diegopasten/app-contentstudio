/**
 * Created on 21.06.2018.
 * verifies https://github.com/enonic/app-contentstudio/issues/261
 *
 * ContentItemPreviewToolbar - issues are not refreshed on the toolbar, when an issue has been closed or reopened or updated
 */
const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const assert = chai.assert;
const webDriverHelper = require('../../libs/WebDriverHelper');
const appConstant = require('../../libs/app_const');
const studioUtils = require('../../libs/studio.utils.js');
const IssueListDialog = require('../../page_objects/issue/issue.list.dialog');
const CreateIssueDialog = require('../../page_objects/issue/create.issue.dialog');
const IssueDetailsDialog = require('../../page_objects/issue/issue.details.dialog');
const contentBuilder = require("../../libs/content.builder");
const ContentItemPreviewPanel = require('../../page_objects/browsepanel/contentItem.preview.panel');
const ContentBrowsePanel = require('../../page_objects/browsepanel/content.browse.panel');

describe('contentItem.preview.toolbar.spec: create an issue and check the toolbar', function () {
    this.timeout(appConstant.SUITE_TIMEOUT);
    webDriverHelper.setupBrowser();
    let firstIssueTitle = appConstant.generateRandomName('issue');
    let secondIssueTitle = appConstant.generateRandomName('issue');

    let TEST_FOLDER;
    it(`GIVEN folder has been created WHEN the folder is selected THEN 'New' status should be displayed on the toolbar`,
        () => {
            let contentItemPreviewPanel = new ContentItemPreviewPanel();
            let displayName = contentBuilder.generateRandomName('folder');
            TEST_FOLDER = contentBuilder.buildFolder(displayName);
            return studioUtils.doAddFolder(TEST_FOLDER).then(() => {
                return studioUtils.findAndSelectItem(TEST_FOLDER.displayName);
            }).then(() => {
                return expect(contentItemPreviewPanel.getContentStatus()).to.eventually.equal('New');
            }).then(() => {
                studioUtils.saveScreenshot("content_item_toolbar");
                return expect(contentItemPreviewPanel.getContentAuthor()).to.eventually.equal('by Super User');
            });
        });
    //verifies "https://github.com/enonic/app-contentstudio/issues/190"
    //Preview Panel - status should not be visible when no content is selected
    it(`GIVEN existing folder is selected WHEN the folder has been unselected THEN preview toolbar gets not visible`, () => {
        let contentItemPreviewPanel = new ContentItemPreviewPanel();
        return studioUtils.findAndSelectItem(TEST_FOLDER.displayName).then(() => {
            let contentBrowsePanel = new ContentBrowsePanel();
            return contentBrowsePanel.clickOnRowByName(TEST_FOLDER.displayName);
        }).then(() => {
            //content-status on the Preview Toolbar is cleared
            return contentItemPreviewPanel.waitForStatusCleared();
        }).then(() => {
            //content-author on the Preview Toolbar is cleared
            return contentItemPreviewPanel.waitForAuthorCleared();
        });
    });

    it(`GIVEN existing folder WHEN the folder is selected and published THEN 'Published' status should be displayed on the toolbar`,
        () => {
            let contentItemPreviewPanel = new ContentItemPreviewPanel();
            return studioUtils.findAndSelectItem(TEST_FOLDER.displayName).then(() => {
                return studioUtils.doPublish();
            }).then(() => {
                return expect(contentItemPreviewPanel.getContentStatus()).to.eventually.equal('Published');
            });
        });

    it(`GIVEN existing 'published' folder is selected WHEN new issue has been created THEN menu button with the issue-name should appear on the ContentItemPreviewToolbar`,
        () => {
            let issueDetailsDialog = new IssueDetailsDialog();
            let contentItemPreviewPanel = new ContentItemPreviewPanel();
            let contentBrowsePanel = new ContentBrowsePanel();
            let createIssueDialog = new  CreateIssueDialog();
            return studioUtils.findAndSelectItem(TEST_FOLDER.displayName).then(() => {
                //open 'Create Issue' dialog
                return contentBrowsePanel.openPublishMenuAndClickOnCreateIssue();
            }).then(() => {
                return createIssueDialog.typeTitle(firstIssueTitle);
            }).then(result => {
                return createIssueDialog.clickOnCreateIssueButton();
            }).then(() => {
                //close the modal dialog
                return issueDetailsDialog.clickOnCancelTopButton();
            }).then(() => {
                return contentItemPreviewPanel.getIssueNameOnMenuButton();
            }).then(result => {
                assert.isTrue(result == firstIssueTitle);
            })
        });

    it(`GIVEN existing 'published' folder is selected WHEN the second issue has been created THEN issue-name should be updated in the menu button(ContentItemPreviewToolbar)`,
        () => {
            let issueDetailsDialog = new IssueDetailsDialog();
            let contentItemPreviewPanel = new ContentItemPreviewPanel();
            let createIssueDialog = new  CreateIssueDialog();
            return studioUtils.findAndSelectItem(TEST_FOLDER.displayName).then(() => {
                return studioUtils.openPublishMenuAndClickOnCreateIssue();
            }).then(() => {
                return createIssueDialog.typeTitle(secondIssueTitle);
            }).then(result => {
                return createIssueDialog.clickOnCreateIssueButton();
            }).then(() => {
                //close the modal dialog
                return issueDetailsDialog.clickOnCancelTopButton();
            }).then(() => {
                assert.eventually.isTrue(contentItemPreviewPanel.waitForIssueDropDownHandleDisplayed(),
                    '`Issues-dropdown handle` should should appear on the toolbar');
            }).then(() => {
                return contentItemPreviewPanel.getIssueNameOnMenuButton();
            }).then(result => {
                assert.isTrue(result == secondIssueTitle, "issue-name should be update on the menu-button");
            })
        });

    it(`GIVEN existing folder is selected WHEN issue menu button has been clicked THEN 'IssueDetails' modal dialog should appear`,
        () => {
            let issueDetailsDialog = new IssueDetailsDialog();
            let contentItemPreviewPanel = new ContentItemPreviewPanel();
            return studioUtils.findAndSelectItem(TEST_FOLDER.displayName).then(() => {
                return contentItemPreviewPanel.clickOnIssueMenuButton();
            }).then(() => {
                return issueDetailsDialog.waitForDialogOpened();
            }).then(() => {
                return issueDetailsDialog.getIssueTitle();
            }).then(result => {
                studioUtils.saveScreenshot("issue_menu_button_clicked");
                assert.isTrue(result == secondIssueTitle);
            })
        });

    it(`GIVEN existing folder with 2 issues is selected AND dropdown in the issue-menu has been clicked WHEN click on the menu-item in the dropdown list THEN 'IssueDetails' modal dialog should appear with correct tittle`,
        () => {
            let issueDetailsDialog = new IssueDetailsDialog();
            let contentItemPreviewPanel = new ContentItemPreviewPanel();
            return studioUtils.findAndSelectItem(TEST_FOLDER.displayName).then(() => {
                return contentItemPreviewPanel.clickOnIssueMenuDropDownHandle();
            }).then(() => {
                return contentItemPreviewPanel.clickOnIssueMenuItem(firstIssueTitle);
            }).then(() => {
                return issueDetailsDialog.waitForDialogOpened();
            }).then(() => {
                return issueDetailsDialog.getIssueTitle();
            }).then(result => {
                studioUtils.saveScreenshot("issue_menu_item_clicked");
                assert.isTrue(result == firstIssueTitle, "required issue should be loaded in the modal dialog");
            })
        });
    //verifies https://github.com/enonic/app-contentstudio/issues/261. ContentItemPreviewToolbar - issues are not refreshed on the toolbar
    it(`GIVEN folder selected and 'IssueDetails' dialog is opened WHEN the issue has been closed  AND the dialog closed THEN issue-name should be updated on the issue-menu `,
        () => {
            let contentItemPreviewPanel = new ContentItemPreviewPanel();
            let issueDetailsDialog = new IssueDetailsDialog();
            return studioUtils.findAndSelectItem(TEST_FOLDER.displayName).then(() => {
                return contentItemPreviewPanel.clickOnIssueMenuButton();
            }).then(() => {
                return issueDetailsDialog.waitForDialogOpened();
            }).then(() => {
                return issueDetailsDialog.clickOnCloseIssueButton();
            }).then(() => {
                //dialog is closing.
                return issueDetailsDialog.clickOnCancelTopButton();
            }).then(result => {
                return contentItemPreviewPanel.getIssueNameOnMenuButton();
            }).then(result => {
                studioUtils.saveScreenshot("issue_menu_button_updated");
                assert.equal(result, firstIssueTitle, "Expected issue-title should be displayed on the Item Preview Panel");
            })
        });

    beforeEach(() => studioUtils.navigateToContentStudioApp());
    afterEach(() => studioUtils.doCloseAllWindowTabsAndSwitchToHome());
    before(() => {
        return console.log('specification is starting: ' + this.title);
    });
});
