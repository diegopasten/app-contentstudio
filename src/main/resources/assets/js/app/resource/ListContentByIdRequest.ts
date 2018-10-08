import ContentSummaryJson = api.content.json.ContentSummaryJson;
import ContentSummary = api.content.ContentSummary;
import ContentId = api.content.ContentId;
import ContentMetadata = api.content.ContentMetadata;
import {ContentResourceRequest} from './ContentResourceRequest';
import {ContentResponse} from './ContentResponse';
import {ListContentResult} from './ListContentResult';

export class ListContentByIdRequest
    extends ContentResourceRequest<ListContentResult<ContentSummaryJson>, ContentResponse<ContentSummary>> {

    private parentId: ContentId;

    private expand: api.rest.Expand = api.rest.Expand.SUMMARY;

    private from: number;

    private size: number;

    private order: api.content.order.ChildOrder;

    constructor(parentId: ContentId) {
        super();
        super.setMethod('GET');
        this.parentId = parentId;
    }

    setExpand(value: api.rest.Expand): ListContentByIdRequest {
        this.expand = value;
        return this;
    }

    setFrom(value: number): ListContentByIdRequest {
        this.from = value;
        return this;
    }

    setSize(value: number): ListContentByIdRequest {
        this.size = value;
        return this;
    }

    setOrder(value: api.content.order.ChildOrder): ListContentByIdRequest {
        this.order = value;
        return this;
    }

    getParams(): Object {
        return {
            parentId: this.parentId ? this.parentId.toString() : null,
            expand: this.expand,
            from: this.from,
            size: this.size,
            childOrder: !!this.order ? this.order.toString() : ''
        };
    }

    getRequestPath(): api.rest.Path {
        return api.rest.Path.fromParent(super.getResourcePath(), 'list');
    }

    sendAndParse(): wemQ.Promise<ContentResponse<ContentSummary>> {

        return this.send().then((response: api.rest.JsonResponse<ListContentResult<api.content.json.ContentSummaryJson>>) => {
            return new ContentResponse(
                ContentSummary.fromJsonArray(response.getResult().contents),
                new ContentMetadata(response.getResult().metadata['hits'], response.getResult().metadata['totalHits'])
            );
        });
    }
}
