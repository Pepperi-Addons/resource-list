import { IPepGenericListDataSource, IPepGenericListInitData, IPepGenericListParams } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { IStateChangedHandler } from "./pepperi-list";
/**
 * @param stateChangedHandler - object that react to init and update events of the generic list
 * @param disableFirstInit - in case you want to skip the first init(for example on menu click event we calculate the state outside of the ngx lib and therefore we don't
 * want the first init to happen)
 */
export class ListDataSource implements IPepGenericListDataSource{
    
    constructor(private stateChangedHandler: IStateChangedHandler, private isFirstEvent: boolean = true){

    }
    async init(params: IPepGenericListParams): Promise<IPepGenericListInitData> {
        const result =  await this.stateChangedHandler.onListEvent(params, this.isFirstEvent)
        this.isFirstEvent = false
        return result

    }
    async update(params: IPepGenericListParams): Promise<any[]> {
        const result =  await this.stateChangedHandler.onListEvent(params)
        return result.items
    }
}