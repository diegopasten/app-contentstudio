import {RichComboBox, RichComboBoxBuilder} from 'lib-admin-ui/ui/selector/combobox/RichComboBox';
import {BaseSelectedOptionsView} from 'lib-admin-ui/ui/selector/combobox/BaseSelectedOptionsView';
import {Option} from 'lib-admin-ui/ui/selector/Option';
import {SelectedOption} from 'lib-admin-ui/ui/selector/combobox/SelectedOption';
import {CustomSelectorItem} from './CustomSelectorItem';
import {CustomSelectorItemViewer} from './CustomSelectorItemViewer';
import {RichSelectedOptionView, RichSelectedOptionViewBuilder} from 'lib-admin-ui/ui/selector/combobox/RichSelectedOptionView';
import {Viewer} from 'lib-admin-ui/ui/Viewer';
import {SelectedOptionsView} from 'lib-admin-ui/ui/selector/combobox/SelectedOptionsView';

export class CustomSelectorComboBox
    extends RichComboBox<CustomSelectorItem> {

    constructor(builder: CustomSelectorComboBoxBuilder) {
        super(builder);
    }

    static create(): CustomSelectorComboBoxBuilder {
        return new CustomSelectorComboBoxBuilder();
    }
}

export class CustomSelectorSelectedOptionsView
    extends BaseSelectedOptionsView<CustomSelectorItem> {
    createSelectedOption(option: Option<CustomSelectorItem>): SelectedOption<CustomSelectorItem> {
        return new SelectedOption<CustomSelectorItem>(new CustomSelectorSelectedOptionView(option), this.count());
    }

}

export class CustomSelectorSelectedOptionView
    extends RichSelectedOptionView<CustomSelectorItem> {

    constructor(option: Option<CustomSelectorItem>) {
        super(
            new RichSelectedOptionViewBuilder<CustomSelectorItem>(option)
                .setDraggable(true)
        );
    }

    protected createView(_content: CustomSelectorItem): CustomSelectorItemViewer {
        let viewer = new CustomSelectorItemViewer();
        viewer.setObject(this.getOption().displayValue);

        return viewer;
    }

}

export class CustomSelectorComboBoxBuilder
    extends RichComboBoxBuilder<CustomSelectorItem> {

    optionDisplayValueViewer: Viewer<CustomSelectorItem> = new CustomSelectorItemViewer();

    delayedInputValueChangedHandling: number = 300;

    selectedOptionsView: SelectedOptionsView<CustomSelectorItem> = new CustomSelectorSelectedOptionsView();

    build(): CustomSelectorComboBox {
        return new CustomSelectorComboBox(this);
    }
}
