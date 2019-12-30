import * as Q from 'q';
import {Path} from 'lib-admin-ui/rest/Path';
import {ContentId} from 'lib-admin-ui/content/ContentId';
import {OrderChildMovements} from './order/OrderChildMovements';
import {ReorderChildContentsJson} from './json/ReorderChildContentsJson';
import {ContentResourceRequest} from './ContentResourceRequest';
import {ChildOrder} from 'lib-admin-ui/content/order/ChildOrder';

export class OrderChildContentRequest
    extends ContentResourceRequest<any, any> {

    private silent: boolean = false;

    private manualOrder: boolean = false;

    private contentId: ContentId;

    private childOrder: ChildOrder;

    private contentMovements: OrderChildMovements;

    constructor() {
        super();
        super.setMethod('POST');
    }

    setSilent(silent: boolean): OrderChildContentRequest {
        this.silent = silent;
        return this;
    }

    setManualOrder(manualOrder: boolean): OrderChildContentRequest {
        this.manualOrder = manualOrder;
        return this;
    }

    setContentId(value: ContentId): OrderChildContentRequest {
        this.contentId = value;
        return this;
    }

    setChildOrder(value: ChildOrder): OrderChildContentRequest {
        this.childOrder = value;
        return this;
    }

    setContentMovements(value: OrderChildMovements): OrderChildContentRequest {
        this.contentMovements = value;
        return this;
    }

    getParams(): ReorderChildContentsJson {
        return {
            silent: this.silent,
            manualOrder: this.manualOrder,
            contentId: this.contentId.toString(),
            childOrder: this.childOrder ? this.childOrder.toJson() : undefined,
            reorderChildren: this.contentMovements.toArrayJson()
        };
    }

    getRequestPath(): Path {
        return Path.fromParent(super.getResourcePath(), 'reorderChildren');
    }

    sendAndParse(): Q.Promise<any> {

        return this.send();
    }
}
