import {ContentId} from 'lib-admin-ui/content/ContentId';
import {JsonResponse} from 'lib-admin-ui/rest/JsonResponse';
import {ResolveDependenciesResult, ResolveDependenciesResultJson} from './ResolveDependenciesResult';
import {ContentResourceRequest} from './ContentResourceRequest';

export class ResolveDependenciesRequest
    extends ContentResourceRequest<ResolveDependenciesResultJson, ResolveDependenciesResult> {

    private ids: ContentId[];

    constructor(contentIds: ContentId[]) {
        super();
        super.setMethod('POST');
        this.ids = contentIds;
        this.addRequestPathElements('getDependencies');
    }

    getParams(): Object {
        return {
            contentIds: this.ids.map(id => id.toString())
        };
    }

    protected processResponse(response: JsonResponse<ResolveDependenciesResultJson>): ResolveDependenciesResult {
        return ResolveDependenciesResult.fromJson(response.getResult());
    }
}
