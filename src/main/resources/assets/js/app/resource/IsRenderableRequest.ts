import {ContentId} from 'lib-admin-ui/content/ContentId';
import {JsonResponse} from 'lib-admin-ui/rest/JsonResponse';
import {PageTemplateResourceRequest} from './PageTemplateResourceRequest';

export class IsRenderableRequest
    extends PageTemplateResourceRequest<boolean, boolean> {

    private contentId: ContentId;

    constructor(contentId: ContentId) {
        super();
        this.setMethod('GET');
        this.contentId = contentId;
        this.addRequestPathElements('isRenderable');
    }

    setContentId(value: ContentId): IsRenderableRequest {
        this.contentId = value;
        return this;
    }

    getParams(): Object {
        return {
            contentId: this.contentId.toString()
        };
    }

    protected processResponse(response: JsonResponse<boolean>): boolean {
        return response.getResult();
    }
}
