import { IPepGenericListDataSource, IPepGenericListInitData, IPepGenericListListInputs, IPepGenericListParams } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { GridDataView } from "@pepperi-addons/papi-sdk";

export class DataSource implements IPepGenericListDataSource{
    constructor(private dataView: GridDataView, private items: any[] = []){

    }
    async init(params: IPepGenericListParams): Promise<IPepGenericListInitData> {
        return {
            dataView: this.dataView,
            items: this.items,
            totalCount: this.items.length,
        }
    }
}