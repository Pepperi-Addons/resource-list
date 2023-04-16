import { PepAddonService } from "@pepperi-addons/ngx-lib";
import { Injectable } from "@angular/core";
import { List, ListContainer, ListState, loadListEventKey, menuClickEventKey, stateChangeEventKey } from "shared";
import { PepSelectionData } from "@pepperi-addons/ngx-lib/list";

@Injectable({ providedIn: 'root' })
export class ClientEventsService{
    constructor(private addonService: PepAddonService){
        
    }
    async emitLoadListEvent(state: Partial<ListState> | undefined ,changes: Partial<ListState>, list?: List): Promise<ListContainer>{
        return await this.addonService.emitEvent(loadListEventKey, {State: undefined, Changes: changes, List: list}) as ListContainer
    }
    async emitStateChangedEvent(state: Partial<ListState>, changes: Partial<ListState>, list?: List): Promise<ListContainer>{
        return await this.addonService.emitEvent(stateChangeEventKey, {State: state, Changes: changes, List: list}) as ListContainer 
    }
    async emitMenuClickEvent(state: Partial<ListState>, key: string, list?: List, data?: PepSelectionData): Promise<ListContainer>{
        return await this.addonService.emitEvent(menuClickEventKey, {State: state, Key: key, List: list, Data: data}) as ListContainer 
    }
}