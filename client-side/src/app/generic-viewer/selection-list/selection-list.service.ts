import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DataSource } from "src/app/data-source/data-source";
import { IGenericViewerDataSource } from "src/app/generic-viewer-data-source";
import { IGenericViewerConfigurationObject } from "src/app/metadata";
import { IGenericViewer } from "../../../../../shared/entities";
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
            actions: [],
            selectionType: selectionListConfiguration.selectionList?.selection || "single",
            menuItems: [],
            dropDownOfViews: selectionListConfiguration.viewsList || [],
            button: {title: this.translate.instant("Done")},
            hasCancelButton: true

        }
    }
    createDataSource(genericViewer: IGenericViewer, gvDataSource: IGenericViewerDataSource): DataSource{
        return new DataSource([], [] ,[])
    }
}