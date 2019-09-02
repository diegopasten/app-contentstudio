import {ContentLayer} from '../content/ContentLayer';
import {ContentLayerExtended} from './ContentLayerExtended';

export class LayersHelper {

    static sortAndExtendLayers(layers: ContentLayer[]): ContentLayerExtended[] {
        return new LayersTransformer().extendAndSort(layers);
    }

}

class LayersTransformer {

    private result: ContentLayerExtended[];

    private layersToSort: ContentLayer[];

    extendAndSort(layers: ContentLayer[]): ContentLayerExtended[] {
        this.result = [];
        this.layersToSort = layers;

        this.doSort(null, 1);

        return this.result;
    }

    private doSort(parentName: string, level: number) {
        const children: ContentLayer[] = this.findDirectChildren(parentName);

        children.forEach((child: ContentLayer) => {
            this.result.push(new ContentLayerExtended(child, level, this.hasChildren(child)));
            this.doSort(child.getName(), level + 1);
        });
    }

    private findDirectChildren(parentName: string): ContentLayer[] {
        return this.layersToSort.filter((item: ContentLayer) => item.getParentName() === parentName);
    }

    private hasChildren(layer: ContentLayer): boolean {
        return this.findDirectChildren(layer.getName()).length > 0;
    }

}