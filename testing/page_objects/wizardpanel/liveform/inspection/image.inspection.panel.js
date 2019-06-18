/**
 * Created on 25.01.2019.
 */

const Page = require('../../../page');
const lib = require('../../../../libs/elements');
const appConst = require('../../../../libs/app_const');
const LoaderComboBox = require('../../../components/loader.combobox');
const xpath = {
    container: `//div[contains(@id,'ImageInspectionPanel')]`,
    imageContentComboBox: `//div[contains(@id,'ImageContentComboBox')]`,
    applyButton: ``,
};

//Context Window, Inspect tab for Image Component
class ImageInspectionPanel extends Page {

    get captionTextArea() {
        return xpath.container + "//div[contains(@id,'InputView') and descendant::div[text()='Caption']]" + lib.TEXT_AREA;
    }

    get imageContentComboBox() {
        return xpath.container + xpath.imageContentComboBox;
    }

    async typeNameAndSelectImage(displayName) {
        let loaderComboBox = new LoaderComboBox();
        await loaderComboBox.typeTextAndSelectOption(displayName, xpath.container);
        return await this.pause(500);
    }

    waitForOpened() {
        return this.waitForElementDisplayed(xpath.container, appConst.TIMEOUT_2).catch(err => {
            this.saveScreenshot('err_load_inspect_panel');
            throw new Error('Live Edit, Inspection not loaded' + err);
        });
    }

    typeCaption(caption) {
        return this.waitForElementDisplayed(this.captionTextArea, appConst.TIMEOUT_2).then(() => {
            return this.typeTextInInput(this.captionTextArea, caption);
        }).catch(err => {
            this.saveScreenshot('err_type_text_in_caption');
            throw new Error('error- Image Inspect Panel, type text in Caption text area: ' + err)
        })
    }

    getCaptionText() {
        return this.getTextInInput(this.captionTextArea).catch(err => {
            this.saveScreenshot('err_get_text_in_caption');
            throw new Error('error- Image Inspect Panel, type text in Caption text area: ' + err)
        });
    }

    clickOnRemoveIcon() {
        let selector = xpath.container + lib.CONTENT_SELECTED_OPTION_VIEW + lib.REMOVE_ICON;
        return this.waitForElementDisplayed(selector).then(() => {
            return this.clickOnElement(selector);
        }).catch(err => {
            this.saveScreenshot('err_clicking_remove_inspection_panel');
            throw new Error('Image Inspect Panel, error when remove-icon has been clicked: ' + err)
        }).then(() => {
            return this.pause(500);
        })
    }

    async clickOnApplyButton() {
        let selector = "//div[contains(@id,'ContextWindow')]" + lib.ACTION_BUTTON + "/span[text()='Apply']";
        await this.clickOnElement(selector);
        return this.pause(2000);
    }

};
module.exports = ImageInspectionPanel;

