import {i18n} from 'lib-admin-ui/util/Messages';
import {StringHelper} from 'lib-admin-ui/util/StringHelper';
import {Body} from 'lib-admin-ui/dom/Body';
import {CompositeFormInputEl} from 'lib-admin-ui/dom/CompositeFormInputEl';
import {H2El} from 'lib-admin-ui/dom/H2El';
import {TextInput} from 'lib-admin-ui/ui/text/TextInput';

export class InPlaceTextInput
    extends CompositeFormInputEl {

    private input: TextInput;
    private h2: H2El;
    private persistedValue: string;

    private modeListeners: { (editMode: boolean, newValue: string, oldValue: string) }[] = [];
    private outsideClickListener: (event: MouseEvent) => void;

    constructor(originalValue?: string, size?: string) {
        super();
        this.addClass('inplace-text-input');

        this.h2 = this.createHeader(originalValue);
        this.input = this.createInput(originalValue, size);

        this.setWrappedInput(this.input);
        this.addAdditionalElement(this.h2);
    }

    private createHeader(originalValue: string): H2El {
        const h2 = new H2El('inplace-text');
        h2.setHtml(this.formatTextToDisplay(originalValue), false);
        h2.getEl().setTitle(i18n('action.clickToEdit'));
        h2.onClicked(() => this.setEditMode(true));
        return h2;
    }

    private createInput(originalValue: string, size: string) {
        const input = new TextInput('inplace-input', size, originalValue);

        input.onValueChanged(event => {
            const isValid = this.isInputValid();
            input.toggleClass('invalid', !isValid);
            this.toggleClass('invalid', !isValid);
        });

        input.onKeyDown((event: KeyboardEvent) => {
            event.stopImmediatePropagation();
            switch (event.code) {
            case 'Escape':
                this.setEditMode(false, true);
                break;
            case 'Enter':
                if (this.isInputValid()) {
                    this.setEditMode(false);
                }
                break;
            }
        });

        input.onBlur(() => {
            this.setEditMode(false, !this.isInputValid());
        });

        return input;
    }

    private isInputValid(): boolean {
        return !StringHelper.isBlank(this.input.getValue());
    }

    public setEditMode(enableEdit: boolean, cancel?: boolean) {
        if (cancel) {
            this.input.setValue(this.persistedValue, true);
            this.input.removeClass('invalid');
            this.removeClass('invalid');
        }
        this.toggleClass('edit-mode', enableEdit);
        const newValue = this.input.getValue().trim();
        if (enableEdit) {
            this.persistedValue = newValue;
            this.input.giveFocus();
        } else {
            this.h2.setHtml(this.formatTextToDisplay(newValue), false);
        }
        this.bindOutsideClickListener(enableEdit);
        this.notifyEditModeChanged(enableEdit, newValue, this.persistedValue);
    }

    private bindOutsideClickListener(enableEdit: boolean) {
        const body = Body.get();
        if (!this.outsideClickListener) {
            this.outsideClickListener = (event: MouseEvent) => {
                if (this.isEditMode() && !this.getEl().contains(<HTMLElement>event.target)) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    this.setEditMode(false, !this.isInputValid());
                }
            };
        }
        if (enableEdit) {
            body.onClicked(this.outsideClickListener);
        } else {
            body.unClicked(this.outsideClickListener);
        }
    }

    setValue(value: string, silent?: boolean, userInput?: boolean): InPlaceTextInput {
        super.setValue(value, silent, userInput);
        this.h2.setHtml(this.formatTextToDisplay(value), false);
        return this;
    }

    public formatTextToDisplay(inputValue: string): string {
        return inputValue;
    }

    public isEditMode(): boolean {
        return this.hasClass('edit-mode');
    }

    public onEditModeChanged(listener: (editMode: boolean, newValue: string, oldValue: string) => void) {
        this.modeListeners.push(listener);
    }

    public unEditModeChanged(listener: (editMode: boolean, newValue: string, oldValue: string) => void) {
        this.modeListeners = this.modeListeners.filter(curr => curr !== listener);
    }

    private notifyEditModeChanged(editMode: boolean, newValue: string, oldValue: string) {
        this.modeListeners.forEach(listener => {
            listener(editMode, newValue, oldValue);
        });
    }
}
