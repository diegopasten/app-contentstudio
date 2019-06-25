/**
 * Created on 06.03.2019.
 *
 */
const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const assert = chai.assert;
const webDriverHelper = require('../../libs/WebDriverHelper');
const appConstant = require('../../libs/app_const');
const ContentBrowsePanel = require('../../page_objects/browsepanel/content.browse.panel');
const studioUtils = require('../../libs/studio.utils.js');
const ContentWizard = require('../../page_objects/wizardpanel/content.wizard.panel');
const contentBuilder = require("../../libs/content.builder");
const PageInspectionPanel = require('../../page_objects/wizardpanel/liveform/page.inspection.panel');
const ConfirmationDialog = require('../../page_objects/confirmation.dialog');

describe('site.with.several.templates: click on dropdown handle in Inspection Panel and change a template ', function () {
    this.timeout(appConstant.SUITE_TIMEOUT);
    webDriverHelper.setupBrowser();

    let SITE;
    let TEMPLATE1;
    let TEMPLATE2;
    let SUPPORT = 'Site';
    let CONTROLLER_NAME1 = 'main region';
    let CONTROLLER_NAME2 = 'default';
    it(`Precondition: new site should be present in the grid`,
        () => {
            let contentBrowsePanel = new ContentBrowsePanel();
            let displayName = contentBuilder.generateRandomName('site');
            SITE = contentBuilder.buildSite(displayName, 'description', [appConstant.SIMPLE_SITE_APP]);
            return studioUtils.doAddSite(SITE).then(() => {
            }).then(() => {
                return studioUtils.findAndSelectItem(SITE.displayName);
            }).then(() => {
                return contentBrowsePanel.waitForContentDisplayed(SITE.displayName);
            }).then(isDisplayed => {
                assert.isTrue(isDisplayed, 'site should be listed in the grid');
            });
        });

    it(`Precondition: first template should be added `,
        () => {
            let contentBrowsePanel = new ContentBrowsePanel();
            TEMPLATE1 = contentBuilder.buildPageTemplate("template1", SUPPORT, CONTROLLER_NAME1);
            return studioUtils.doAddPageTemplate(SITE.displayName, TEMPLATE1).then(() => {
                return studioUtils.findAndSelectItem(TEMPLATE1.displayName);
            }).then(() => {
                return contentBrowsePanel.waitForContentDisplayed(TEMPLATE1.displayName);
            }).then(isDisplayed => {
                assert.isTrue(isDisplayed, 'template should be listed in the grid');
            });
        });

    it(`Precondition: second template should be added `,
        () => {
            let contentBrowsePanel = new ContentBrowsePanel();
            TEMPLATE2 = contentBuilder.buildPageTemplate("template2", SUPPORT, CONTROLLER_NAME2);
            return studioUtils.doAddPageTemplate(SITE.displayName, TEMPLATE2).then(() => {
                return studioUtils.findAndSelectItem(TEMPLATE2.displayName);
            }).then(() => {
                return contentBrowsePanel.waitForContentDisplayed(TEMPLATE2.displayName);
            }).then(isDisplayed => {
                assert.isTrue(isDisplayed, 'template should be listed in the grid');
            });
        });
    it(`GIVEN site is opened AND Inspection Panel is opened WHEN the second template has been selected in the Inspect Panel THEN site should be saved automatically AND 'Saved' button should appear`,
        () => {
            let contentWizard = new ContentWizard();
            let pageInspectionPanel = new PageInspectionPanel();
            let confirmationDialog = new ConfirmationDialog();
            return studioUtils.selectContentAndOpenWizard(SITE.displayName).then(() => {
            }).then(() => {
                return contentWizard.doUnlockLiveEditor();
            }).then(() => {
                return contentWizard.switchToParentFrame();
            }).then(() => {
                return pageInspectionPanel.selectPageTemplateOrController("template1");
            }).then(() => {
                return confirmationDialog.waitForDialogOpened();
            }).then(() => {
                return confirmationDialog.clickOnYesButton();
            }).then(() => {
                return contentWizard.waitForNotificationMessage();
            }).then(message => {
                let expectedMessage = appConstant.itemSavedNotificationMessage(SITE.displayName);
                assert.isTrue(message === expectedMessage, "'Item is saved' - this message should appear")
            }).then(() => {
                studioUtils.saveScreenshot('inspect_panel_template_changed');
                return assert.eventually.isTrue(contentWizard.waitForSaveButtonDisabled(),
                    "`Save` button gets disabled on the toolbar");
            });
        });

    beforeEach(() => studioUtils.navigateToContentStudioApp());
    afterEach(() => studioUtils.doCloseAllWindowTabsAndSwitchToHome());
    before(() => {
        return console.log('specification starting: ' + this.title);
    });
});
