import ComboBox = api.ui.selector.combobox.ComboBox;
import SelectedOptionsView = api.ui.selector.combobox.SelectedOptionsView;
import Option = api.ui.selector.Option;
import BaseSelectedOptionsView = api.ui.selector.combobox.BaseSelectedOptionsView;
import i18n = api.util.i18n;
import Element = api.dom.Element;
import DivEl = api.dom.DivEl;
import SpanEl = api.dom.SpanEl;
import DefaultOptionDisplayValueViewer = api.ui.selector.DefaultOptionDisplayValueViewer;
import SelectedOptionEvent = api.ui.selector.combobox.SelectedOptionEvent;
import OptionFilterInputValueChangedEvent = api.ui.selector.OptionFilterInputValueChangedEvent;

export class RowSelector
    extends DivEl {

    private title: SpanEl;

    private comboBox: ComboBox<string>;

    private selectedOptionsView: SelectedOptionsView<string>;

    constructor(title?: string) {
        super('row-selector');

        this.initElements(title);
    }

    protected initElements(title?: string) {
        this.initTitle(title);
        this.initCombobox();
        this.initListeners();
    }

    private initTitle(title?: string) {
        this.title = new SpanEl('title');
        this.title.setHtml(title == null ? i18n('field.rowselector.title') : title);
    }

    private initCombobox() {
        this.selectedOptionsView = new RowSelectedOptionsView();
        this.selectedOptionsView.setEditable(false);

        this.comboBox = new ComboBox<string>('rowSelector', {
            filter: RowSelector.comboBoxFilter,
            selectedOptionsView: this.selectedOptionsView,
            optionDisplayValueViewer: new RowOptionDisplayValueViewer(),
            hideComboBoxWhenMaxReached: false,
            maximumOccurrences: 1
        });
    }

    private static comboBoxFilter(item: api.ui.selector.Option<string>, args: any) {
        // Do not change to one-liner `return !(...);`. Bugs expected with UglifyJs + SlickGrid filter compilation.
        const isEmptyInput = args == null || args.searchString == null;
        return isEmptyInput || item.displayValue.toUpperCase().indexOf(args.searchString.toUpperCase()) !== -1;
    }

    private initListeners() {
        this.comboBox.onOptionSelected((event: SelectedOptionEvent<string>) => {
            this.comboBox.hide();
            const selectedOption = event.getSelectedOption().getOptionView().getOption();
            selectedOption.readOnly = true;
            this.comboBox.getSelectedOptions().forEach(option => {
                if (option.value !== selectedOption.value) {
                    option.readOnly = false;
                    this.deselect(option);
                }
            });
        });

        this.onClicked((event: MouseEvent) => {
            const target = <HTMLElement> event.target;
            const {classList} = target;
            if (classList.contains('selected-option') || classList.contains('option-value')) {
                event.stopPropagation();
                this.comboBox.show();
                this.comboBox.showDropdown();
                this.comboBox.giveInputFocus();
            }
        });

        this.comboBox.onOptionFilterInputValueChanged((event: OptionFilterInputValueChangedEvent) => {
            this.comboBox.setFilterArgs({searchString: event.getNewValue()});
        });

        this.handleClickOutside();
    }

    private handleClickOutside() {
        const mouseClickListener: (event: MouseEvent) => void = (event: MouseEvent) => {
            if (this.comboBox.isVisible()) {
                for (let target = event.target; target; target = (<any>target).parentNode) {
                    if (target === this.comboBox.getHTMLElement()) {
                        return;
                    }
                }
                this.comboBox.hide();
            }
        };

        this.comboBox.onRemoved(() => {
            api.dom.Body.get().unMouseDown(mouseClickListener);
        });

        this.comboBox.onAdded(() => {
            api.dom.Body.get().onMouseDown(mouseClickListener);
        });
    }

    setOptions(options: Option<string>[], saveSelection?: boolean) {
        this.comboBox.setOptions(options, saveSelection);
    }

    static createOptions(options: string[]): Option<string>[] {
        return options.map((displayValue: string, index: number) => {
            return <Option<string>>{
                value: index.toString(),
                displayValue,
                indices: [displayValue],
                selectable: true
            };
        });
    }

    clearSelection() {
        this.comboBox.clearSelection();
    }

    select(option: Option<string>) {
        this.comboBox.selectOption(option);
    }

    deselect(option: Option<string>) {
        this.comboBox.deselectOption(option);
    }

    setSelection(option: Option<string>, select: boolean = true) {
        if (select) {
            this.select(option);
        } else {
            this.deselect(option);
        }
    }

    isOptionSelected(option: Option<string>): boolean {
        return this.comboBox.isOptionSelected(option);
    }

    isSelectionEmpty(): boolean {
        return this.comboBox.countSelectedOptions() === 0;
    }

    updateOptionValue(option: Option<string>, value: string, selectable?: boolean): Option<string> {
        const newOption = <Option<string>>{
            value: option.value,
            displayValue: value,
            indices: [value],
            selectable: selectable != null ? selectable : option.selectable,
            readOnly: option.readOnly
        };

        this.comboBox.updateOption(option, newOption);

        return newOption;
    }

    onOptionSelected(listener: (event: SelectedOptionEvent<string>) => void) {
        this.comboBox.onOptionSelected(listener);
    }

    onOptionDeselected(listener: (event: SelectedOptionEvent<string>) => void) {
        this.comboBox.onOptionDeselected(listener);
    }

    doRender(): Q.Promise<boolean> {
        return super.doRender().then((rendered: boolean) => {
            this.appendChildren<Element>(this.title, this.comboBox, this.selectedOptionsView);

            return rendered;
        });
    }
}

class RowSelectedOptionsView
    extends BaseSelectedOptionsView<string> {

    constructor() {
        super('row-selected-options-view');
    }

    updateOption(optionToUpdate: Option<string>, newOption: Option<string>) {
        super.updateOption(optionToUpdate, newOption);
    }

    maximumOccurrencesReached(): boolean {
        return false;
    }
}

class RowOptionDisplayValueViewer
    extends DefaultOptionDisplayValueViewer {
    setObject(displayName: string) {
        const withoutNumber = !(/\(\d+\)$/.test(displayName));
        this.toggleClass('without-number', withoutNumber);
        return super.setObject(displayName);
    }
}