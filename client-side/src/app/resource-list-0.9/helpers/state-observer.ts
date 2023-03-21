import { Subject } from "rxjs"
import { GenericListAdapterResult, SmartSearchInput } from "../metadata"
import { PepMenuItem } from "@pepperi-addons/ngx-lib/menu"
import { GVButton } from "src/app/generic-viewer/generic-viewer.model"
import { IPepListSortingChangeEvent, PepListSelectionType, PepSelectionData } from "@pepperi-addons/ngx-lib/list"
import { ListState } from "shared"
import { stat } from "fs"

export class StateObserver{
    //subjects 
    private $searchString: Subject<string> = new Subject()
    private $pageIndex: Subject<number> = new Subject()
    private $sorting: Subject<IPepListSortingChangeEvent> = new Subject()


    notifyObservers(state: Partial<ListState>){
        this.$searchString.next(state.SearchString)
        this.$pageIndex.next(state.PageIndex)
        if(state.Sorting){
            this.$sorting.next({
                isAsc: state.Sorting.Ascending,
                sortBy: state.Sorting.FieldID  
            })
        }
    }
    // update variables

    onSearchStringChanged(cb: (data: string) => void): StateObserver{
        this.$searchString.subscribe(cb)
        return this
    }
    onPageIndexChanged(cb: (data: number) => void): StateObserver{
        this.$pageIndex.subscribe(cb)
        return this
    }
    onSortingChanged(cb: (data: IPepListSortingChangeEvent) => void): StateObserver{
        this.$sorting.subscribe(cb)
        return this
    }
}