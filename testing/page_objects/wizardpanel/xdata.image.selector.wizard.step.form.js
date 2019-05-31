/**
 * Created on 20.11.2018.
 */
const Page = require('../page');
const lib = require('../../libs/elements');
const appConst = require('../../libs/app_const');
const LoaderComboBox = require('../components/loader.combobox');

const XPATH = {
    container: `//div[contains(@id,'XDataWizardStepForm')]`,
};

class XDataImageSelector extends Page {

    get imageOptionsFilterInput() {
        return XPATH.container + lib.COMBO_BOX_OPTION_FILTER_INPUT;
    }

    filterOptionsAndSelectImage(displayName) {
        let loaderComboBox = new LoaderComboBox();
        return this.typeTextInInput(this.imageOptionsFilterInput, displayName).then(() => {
            return loaderComboBox.selectOption(displayName);
        });
    }

    isImageSelected() {
        let selector = XPATH.container + "//div[contains (@id,'ImageSelectorSelectedOptionView')]";
        return this.waitForElementDisplayed(selector, appConst.TIMEOUT_2);
    }

    waitForImageOptionsFilterInputVisible() {
        return this.waitForElementDisplayed(this.imageOptionsFilterInput, appConst.TIMEOUT_2).catch(err => {
            throw new Error("x-data with Image Selector - image options filter input is not visible! " + err);
        });
    }
};
module.exports = XDataImageSelector;
