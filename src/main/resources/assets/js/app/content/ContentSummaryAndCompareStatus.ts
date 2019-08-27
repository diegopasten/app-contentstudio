import UploadItem = api.ui.uploader.UploadItem;
import ContentSummary = api.content.ContentSummary;
import ContentPath = api.content.ContentPath;
import ContentId = api.content.ContentId;
import ContentSummaryBuilder = api.content.ContentSummaryBuilder;
import {CompareStatus, CompareStatusChecker, CompareStatusFormatter} from './CompareStatus';
import {PublishStatus, PublishStatusFormatter} from '../publish/PublishStatus';

export class ContentSummaryAndCompareStatus
    implements api.Equitable {

    private uploadItem: UploadItem<ContentSummary>;

    private contentSummary: ContentSummary;

    private compareStatus: CompareStatus;

    private publishStatus: PublishStatus;

    private readOnly: boolean;

    public static fromContentSummary(contentSummary: ContentSummary) {
        return new ContentSummaryAndCompareStatus().setContentSummary(contentSummary);
    }

    public static fromContentAndCompareStatus(contentSummary: ContentSummary, compareStatus: CompareStatus) {
        return new ContentSummaryAndCompareStatus().setContentSummary(contentSummary).setCompareStatus(compareStatus);
    }

    public static fromContentAndCompareAndPublishStatus(contentSummary: ContentSummary, compareStatus: CompareStatus,
                                                        publishStatus: PublishStatus) {
        return new ContentSummaryAndCompareStatus().setContentSummary(contentSummary).setCompareStatus(compareStatus).setPublishStatus(
            publishStatus);
    }

    public static fromUploadItem(item: UploadItem<ContentSummary>): ContentSummaryAndCompareStatus {
        return new ContentSummaryAndCompareStatus().setUploadItem(item);
    }

    hasContentSummary(): boolean {
        return !!this.contentSummary;
    }

    getContentSummary(): ContentSummary {
        return this.contentSummary;
    }

    setContentSummary(contentSummary: ContentSummary): ContentSummaryAndCompareStatus {
        this.contentSummary = contentSummary;
        return this;
    }

    getCompareStatus(): CompareStatus {
        return this.compareStatus;
    }

    setCompareStatus(status: CompareStatus): ContentSummaryAndCompareStatus {
        this.compareStatus = status;
        return this;
    }

    getPublishStatus(): PublishStatus {
        return this.publishStatus;
    }

    setPublishStatus(publishStatus: PublishStatus): ContentSummaryAndCompareStatus {
        this.publishStatus = publishStatus;
        return this;
    }

    hasUploadItem(): boolean {
        return !!this.uploadItem;
    }

    getUploadItem(): UploadItem<ContentSummary> {
        return this.uploadItem;
    }

    setUploadItem(item: UploadItem<ContentSummary>): ContentSummaryAndCompareStatus {
        this.uploadItem = item;
        if (item.isUploaded()) {
            this.contentSummary = item.getModel();
        } else {
            item.onUploaded((contentSummary: ContentSummary) => {
                this.contentSummary = contentSummary;
            });
        }
        return this;
    }

    getContentId(): ContentId {
        return this.contentSummary ? this.contentSummary.getContentId() : null;
    }

    getId(): string {
        return (this.contentSummary && this.contentSummary.getId()) ||
               (this.uploadItem && this.uploadItem.getId()) ||
               '';
    }

    getPath(): ContentPath {
        return this.contentSummary ? this.contentSummary.getPath() : null;
    }

    getType(): api.schema.content.ContentTypeName {
        return this.contentSummary ? this.contentSummary.getType() : null;
    }

    getDisplayName(): string {
        return this.contentSummary ? this.contentSummary.getDisplayName() : null;
    }

    getIconUrl(): string {
        return this.contentSummary ? this.contentSummary.getIconUrl() : null;
    }

    hasChildren(): boolean {
        return !!this.contentSummary ? this.contentSummary.hasChildren() : false;
    }

    getStatusText(): string {
        let value = CompareStatusFormatter.formatStatusTextFromContent(this);

        const isExpired = PublishStatus.EXPIRED === this.getPublishStatus();

        const isPending = PublishStatus.PENDING === this.getPublishStatus() &&
                          (CompareStatus.NEWER === this.getCompareStatus() || CompareStatus.EQUAL === this.getCompareStatus());

        if (isExpired || isPending) {
            value += ' (' + PublishStatusFormatter.formatStatus(this.getPublishStatus()) + ')';
        }

        return value;
    }

    getStatusClass(): string {
        let value = CompareStatusFormatter.formatStatusClassFromContent(this).toLowerCase();

        if (PublishStatus.EXPIRED === this.getPublishStatus() || PublishStatus.PENDING === this.getPublishStatus()) {
            value += ' ' + PublishStatus[this.getPublishStatus()].toLowerCase();
        }

        return value.toLowerCase().replace('_', '-').replace(' ', '_') || 'unknown';
    }

    equals(o: api.Equitable): boolean {

        if (!api.ObjectHelper.iFrameSafeInstanceOf(o, ContentSummaryAndCompareStatus)) {
            return false;
        }

        let other = <ContentSummaryAndCompareStatus>o;

        if (!api.ObjectHelper.equals(this.uploadItem, other.getUploadItem())) {
            return false;
        }

        if (!api.ObjectHelper.equals(this.contentSummary, other.getContentSummary())) {
            return false;
        }

        if (this.compareStatus !== other.getCompareStatus()) {
            return false;
        }

        return true;
    }

    setReadOnly(value: boolean) {
        this.readOnly = value;
    }

    isReadOnly(): boolean {
        return this.readOnly;
    }

    isPendingDelete(): boolean {
        return CompareStatusChecker.isPendingDelete(this.getCompareStatus());
    }

    isPublished(): boolean {
        return !!this.getCompareStatus() && CompareStatusChecker.isPublished(this.getCompareStatus());
    }

    isOnline(): boolean {
        return CompareStatusChecker.isOnline(this.getCompareStatus());
    }

    isNew(): boolean {
        return CompareStatusChecker.isNew(this.getCompareStatus());
    }

    clone(): ContentSummaryAndCompareStatus {
        const contentSummary = new ContentSummaryBuilder(this.getContentSummary()).build();
        const clone = ContentSummaryAndCompareStatus.fromContentAndCompareAndPublishStatus(
            contentSummary,
            this.compareStatus,
            this.publishStatus
        );
        clone.setReadOnly(this.readOnly);
        return clone;
    }
}
