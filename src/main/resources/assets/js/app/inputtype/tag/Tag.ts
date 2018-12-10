import PropertyPath = api.data.PropertyPath;
import PropertyPathElement = api.data.PropertyPathElement;
import PropertyArray = api.data.PropertyArray;
import Value = api.data.Value;
import ValueType = api.data.ValueType;
import ValueTypes = api.data.ValueTypes;
import {ContentTagSuggester, ContentTagSuggesterBuilder} from './ContentTagSuggester';
import {Tags, TagsBuilder} from '../ui/tag/Tags';
import {TagRemovedEvent} from '../ui/tag/TagRemovedEvent';
import {TagAddedEvent} from '../ui/tag/TagAddedEvent';
import {ContentInputTypeViewContext} from '../ContentInputTypeViewContext';

export class Tag
    extends api.form.inputtype.support.BaseInputTypeManagingAdd {

    private context: ContentInputTypeViewContext;

    private tags: Tags;

    private tagSuggester: ContentTagSuggester;

    constructor(context: ContentInputTypeViewContext) {
        super('tag');
        this.addClass('input-type-view');

        this.context = context;

        this.tagSuggester = new ContentTagSuggesterBuilder().setDataPath(this.resolveDataPath(context)).build();
    }

    private resolveDataPath(context: ContentInputTypeViewContext): PropertyPath {
        if (context.parentDataPath) {
            return PropertyPath.fromParent(context.parentDataPath, PropertyPathElement.fromString(context.input.getName()));
        } else {
            return new PropertyPath([PropertyPathElement.fromString(context.input.getName())], false);
        }
    }

    getValueType(): ValueType {
        return ValueTypes.STRING;
    }

    newInitialValue(): Value {
        return null;
    }

    layout(input: api.form.Input, propertyArray: PropertyArray): wemQ.Promise<void> {
        if (!ValueTypes.STRING.equals(propertyArray.getType())) {
            propertyArray.convertValues(ValueTypes.STRING);
        }
        super.layout(input, propertyArray);

        let tagsBuilder = new TagsBuilder().setTagSuggester(this.tagSuggester).setMaxTags(this.context.input.getOccurrences().getMaximum());

        propertyArray.forEach((property) => {
            let value = property.getString();
            if (value) {
                tagsBuilder.addTag(value);
            }
        });

        this.tags = tagsBuilder.build();
        this.appendChild(this.tags);

        this.tags.onTagAdded((event: TagAddedEvent) => {
            this.ignorePropertyChange = true;
            let value = new Value(event.getValue(), ValueTypes.STRING);
            if (this.tags.countTags() === 1) {
                this.getPropertyArray().set(0, value);
            } else {
                this.getPropertyArray().add(value);
            }
            this.validate(false);
            this.ignorePropertyChange = false;
        });

        this.tags.onTagRemoved((event: TagRemovedEvent) => {
            this.ignorePropertyChange = true;
            this.getPropertyArray().remove(event.getIndex());
            this.validate(false);
            this.ignorePropertyChange = false;
        });

        this.setLayoutInProgress(false);

        return wemQ<void>(null);
    }

    update(propertyArray: api.data.PropertyArray, unchangedOnly?: boolean): Q.Promise<void> {
        let superPromise = super.update(propertyArray, unchangedOnly);

        if (!unchangedOnly || !this.tags.isDirty()) {
            return superPromise.then(() => {
                this.tags.setValue(this.getValueFromPropertyArray(propertyArray));
            });
        } else if (this.tags.isDirty()) {
            this.resetDirtyValue();
        }
        return superPromise;
    }

    reset() {
        this.tags.resetBaseValues();
    }

    resetDirtyValue() {
        this.getPropertyArray().removeAll(true);
        this.tags.resetDirtyValue();
    }

    protected getNumberOfValids(): number {
        return this.getPropertyArray().getSize();
    }

    giveFocus(): boolean {
        return this.tags.giveFocus();
    }

    onFocus(listener: (event: FocusEvent) => void) {
        this.tags.onFocus(listener);
    }

    unFocus(listener: (event: FocusEvent) => void) {
        this.tags.unFocus(listener);
    }

    onBlur(listener: (event: FocusEvent) => void) {
        this.tags.onBlur(listener);
    }

    unBlur(listener: (event: FocusEvent) => void) {
        this.tags.unBlur(listener);
    }
}

api.form.inputtype.InputTypeManager.register(new api.Class('Tag', Tag));
