import {BrowseItemPanel} from 'lib-admin-ui/app/browse/BrowseItemPanel';
import {ItemStatisticsPanel} from 'lib-admin-ui/app/view/ItemStatisticsPanel';
import {SettingsItemStatisticsPanel} from './SettingsItemStatisticsPanel';
import {SettingsViewItem} from '../view/SettingsViewItem';

export class SettingsBrowseItemPanel
    extends BrowseItemPanel<SettingsViewItem> {

    createItemStatisticsPanel(): ItemStatisticsPanel<SettingsViewItem> {
        return new SettingsItemStatisticsPanel();
    }

    doRender(): Q.Promise<boolean> {
        return super.doRender().then((rendered) => {
            this.addClass('settings-browse-item-panel');

            return rendered;
        });
    }

}
