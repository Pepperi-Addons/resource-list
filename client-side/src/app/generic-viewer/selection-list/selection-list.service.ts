import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { GridDataViewColumn, GridDataViewField } from "@pepperi-addons/papi-sdk";
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

    createListOptions(selectionListConfiguration: IGenericViewerConfigurationObject): ListOptions{
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
            ]

        }
    }
}