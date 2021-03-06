import {ContentItemPreviewPanel} from './ContentItemPreviewPanel';
import {ContentSummaryAndCompareStatus} from '../content/ContentSummaryAndCompareStatus';
import {ItemStatisticsPanel} from 'lib-admin-ui/app/view/ItemStatisticsPanel';
import {ViewItem} from 'lib-admin-ui/app/view/ViewItem';

export class ContentItemStatisticsPanel
    extends ItemStatisticsPanel<ContentSummaryAndCompareStatus> {

    private previewPanel: ContentItemPreviewPanel;

    constructor() {
        super('content-item-statistics-panel');

        this.previewPanel = new ContentItemPreviewPanel();
        this.previewPanel.setDoOffset(false);
        this.appendChild(this.previewPanel);
    }

    setItem(item: ViewItem<ContentSummaryAndCompareStatus>) {
        if (this.getItem() !== item) {
            super.setItem(item);
            this.previewPanel.setItem(item);
        }
    }

    clearItem() {
        super.clearItem();

        this.previewPanel.clearItem();
    }

    getPreviewPanel(): ContentItemPreviewPanel {
        return this.previewPanel;
    }
}
