import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { AddonDataScheme, GridDataViewColumn, GridDataViewField, MenuDataView } from "@pepperi-addons/papi-sdk";
import { DataSource } from "src/app/data-source/data-source";
import { IGenericViewerDataSource } from "src/app/generic-viewer-data-source";
import { IGenericViewerConfigurationObject } from "src/app/metadata";
import { ListOptions } from "../generic-viewer.model";
import { ViewsListsService } from "../viewsLists.service";

@Injectable({
    providedIn: 'root',
})
export class SelectionListService{

    constructor(
        private translate: TranslateService,
        private viewsService: ViewsListsService) {}

    createListOptions(selectionListConfiguration: IGenericViewerConfigurationObject, smartSearchDataView: MenuDataView, resourceFields: AddonDataScheme['Fields'], searchDataView: MenuDataView): ListOptions{
        const smartSearchConfiguration = this.viewsService.getSmartSearchConfiguration(smartSearchDataView, resourceFields)
        return {
            actions: {get: () => []},
            selectionType: selectionListConfiguration.selectionList?.selection || "single",
            menuItems: [],
            dropDownOfViews: selectionListConfiguration.viewsList || [],
            buttons: [
                {
                    key: 'done',
                    value: "Done",
                    styleType: "strong",
                    classNames: "save"
                },
                {
                    key:  'cancel',
                    value: 'Cancel',
                    styleType: 'weak',
                    classNames: "cancel"
                }
            ],
            smartSearchDataView: smartSearchConfiguration,
            searchDataView: searchDataView,
            inlineList: false,
            showSearch: searchDataView.Fields.length > 0,
        }
    }
}