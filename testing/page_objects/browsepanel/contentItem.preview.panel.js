/**
 * Created on 20/06/2018.
 */
const Page = require('../page');
const lib = require('../../libs/elements');
const appConst = require('../../libs/app_const');

const xpath = {
    toolbar: `//div[contains(@id,'ContentItemPreviewToolbar')]`,
    status: `//div[contains(@class,'content-status-wrapper')]/span[contains(@class,'status')]`,
    author: `//div[contains(@class,'content-status-wrapper')]/span[contains(@class,'author')]`,
    issueMenuButton: `//div[contains(@id,'MenuButton')]`,
    issueMenuItemByName:
        name => `//ul[contains(@id,'Menu')]/li[contains(@id,'MenuItem')]/i[contains(.,'${name}')]`,
};

class ContentItemPreviewPanel extends Page {

    get issueDropdownHandle() {
        return xpath.toolbar + xpath.issueMenuButton + lib.DROP_DOWN_HANDLE;
    }

    get contentStatus() {
        return xpath.toolbar + xpath.status;
    }

    get author() {
        return xpath.toolbar + xpath.author;
    }

    waitForPanelVisible() {
        return this.waitForElementDisplayed(xpath.container, appConst.TIMEOUT_2).catch(err => {
            throw new Error('Content Item preview toolbar was not loaded in ' + appConst.TIMEOUT_2);
        });
    }

    //wait for content status cleared
    waitForStatusCleared() {
        let selector = xpath.toolbar + "//div[@class='content-status-wrapper']/span[contains(@class,'status')]";
        return this.waitForElementNotDisplayed(selector, appConst.TIMEOUT_2);
    }

    waitForAuthorCleared() {
        let selector = xpath.toolbar + "//div[@class='content-status-wrapper']/span[contains(@class,'author')]";
        return this.waitForElementNotDisplayed(selector, appConst.TIMEOUT_2);
    }

    clickOnIssueMenuDropDownHandle() {
        return this.clickOnElement(this.issueDropdownHandle).catch(err => {
            throw new Error('error when clicking on the dropdown handle ' + err);
        })
    }

    waitForIssueDropDownHandleDisplayed() {
        return this.waitForElementDisplayed(this.issueDropdownHandle, appConst.TIMEOUT_2);
    }

    clickOnIssueMenuItem(issueName) {
        let selector = xpath.issueMenuItemByName(issueName);
        return this.waitForElementDisplayed(selector, appConst.TIMEOUT_3).catch((err) => {
            throw new Error("Menu item was not found! " + issueName + "  " + err);
            this.saveScreenshot("err_issue_menu_item");
        }).then(() => {
            return this.clickOnElement(selector);
        });
    }

    waitForIssueMenuButtonNotVisible() {
        return this.waitForElementNotDisplayed(xpath.toolbar + xpath.issueMenuButton, appConst.TIMEOUT_3).catch(err => {
            console.log('issue menu button still visible in !  ' + appConst.TIMEOUT_3);
            return false;
        });
    }

    clickOnIssueMenuButton() {
        return this.waitForElementDisplayed(xpath.toolbar + xpath.issueMenuButton, appConst.TIMEOUT_3).catch(err => {
            throw new Error('issue menu button was not found!  ' + err);
        }).then(() => {
            return this.clickOnElement(xpath.toolbar + xpath.issueMenuButton);
        });
    }

    async getContentStatus() {
        let result = await this.getDisplayedElements(this.contentStatus);
        //return await result[0].getElementText();
        return await this.getBrowser().getElementText(result[0].ELEMENT);
    }

    async getContentAuthor() {
        let result = await this.getDisplayedElements(this.author);
        return await this.getBrowser().getElementText(result[0].ELEMENT);
    }

    getIssueNameOnMenuButton() {
        let selector = xpath.toolbar + xpath.issueMenuButton + '//span/i';
        return this.getText(selector);
    }

    async getTextInAttachmentPreview() {
        try {
            let attachmentFrame = "//iframe[contains(@src,'/admin/rest/content/media/')]";
            await this.switchToFrame(attachmentFrame);
            return await this.getText("//body/pre");
        } catch (err) {
            throw new Error(err);
        }
    }
};
module.exports = ContentItemPreviewPanel;


