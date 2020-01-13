import {ContentId} from 'lib-admin-ui/content/ContentId';
import {ContentResourceRequest} from './ContentResourceRequest';
import {JsonResponse} from 'lib-admin-ui/rest/JsonResponse';

export class MarkAsReadyRequest
    extends ContentResourceRequest<void, void> {

    private ids: ContentId[];

    constructor(ids: ContentId[]) {
        super();
        super.setMethod('POST');
        this.ids = ids;
        this.addRequestPathElements('markAsReady');
    }

    getParams(): Object {
        return {
            contentIds: this.ids.map((contentId: ContentId) => contentId.toString())
        };
    }

    protected processResponse(response: JsonResponse<void>): void {
        return;
    }

}
