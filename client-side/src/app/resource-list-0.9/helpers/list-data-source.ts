import { IPepGenericListDataSource, IPepGenericListInitData, IPepGenericListListInputs, IPepGenericListParams } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { IStateChangedHandler } from "./pepperi-list";
/**
 * @param stateChangedHandler - object that react to init and update events of the generic list
 */
export class ListDataSource implements IPepGenericListDataSource{
    inputs: IPepGenericListListInputs;
    constructor(private stateChangedHandler: IStateChangedHandler){

    }
    async init(params: IPepGenericListParams): Promise<IPepGenericListInitData> {
        const eventResult = await this.stateChangedHandler.onListEvent(params)
        this.inputs = {
            selectionType: eventResult.listData?.selectionType
        }
        const ret = {
            dataView: eventResult.dataView,
            items: eventResult.items,
            totalCount: eventResult.totalCount,
        }
        return ret;
    }
    async update(params: IPepGenericListParams): Promise<any[]> {
        const result =  await this.stateChangedHandler.onListEvent(params)
        return result.items
    }
}