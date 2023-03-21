import { PepAddonService } from "@pepperi-addons/ngx-lib";
import { Injectable } from "@angular/core";
import { ListContainer, ListState, loadListEventKey, menuClickEventKey, stateChangeEventKey } from "shared";

@Injectable({ providedIn: 'root' })
export class ClientEventsService{
    constructor(private addonService: PepAddonService){
        
    }
    async emitLoadListEvent(state: Partial<ListState> | undefined ,changes: Partial<ListState>){
        return await this.addonService.emitEvent(loadListEventKey, {State: undefined, Changes: changes}) as ListContainer
    }
    async emitStateChangedEvent(state: Partial<ListState>, changes: Partial<ListState>){
        return await this.addonService.emitEvent(stateChangeEventKey, {State: state, Changes: changes}) as ListContainer 
    }
    async emitMenuClickEvent(state: Partial<ListState>, key: string){
        return await this.addonService.emitEvent(menuClickEventKey, {State: state, Key: key}) as ListContainer 
    }
}