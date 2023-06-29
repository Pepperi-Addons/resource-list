import { PepAddonService } from "@pepperi-addons/ngx-lib";
import { Injectable } from "@angular/core";
import { List, ListContainer, ListState, loadListEventKey, menuClickEventKey, stateChangeEventKey } from "shared";
import { PepSelectionData } from "@pepperi-addons/ngx-lib/list";


export interface ICPIEventsService{
    addonService: PepAddonService
    emitLoadListEvent(state: Partial<ListState> | undefined, changes: Partial<ListState>, list?: List) : Promise<ListContainer>
    emitStateChangedEvent(state: Partial<ListState>, changes: Partial<ListState>, list?: List): Promise<ListContainer>
    emitMenuClickEvent(state: Partial<ListState>, key: string, list?: List, data?: PepSelectionData): Promise<ListContainer>
}

@Injectable({providedIn: 'root'})
export class ClientEventsService implements ICPIEventsService{

    constructor(public addonService: PepAddonService){
        
    }
    async emitLoadListEvent(state: Partial<ListState> | undefined ,changes: Partial<ListState>, list?: List): Promise<ListContainer>{
        return await this.addonService.emitEvent(loadListEventKey, {State: state, Changes: changes, List: list}) as ListContainer
    }
    async emitStateChangedEvent(state: Partial<ListState>, changes: Partial<ListState>, list?: List): Promise<ListContainer>{
        return await this.addonService.emitEvent(stateChangeEventKey, {State: state, Changes: changes, List: list}) as ListContainer
    }
    async emitMenuClickEvent(state: Partial<ListState>, key: string, list?: List): Promise<ListContainer>{
        return await this.addonService.emitEvent(menuClickEventKey, {State: state, Key: key, List: list}) as ListContainer
    }
}