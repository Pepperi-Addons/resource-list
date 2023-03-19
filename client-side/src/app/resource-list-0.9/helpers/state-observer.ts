import { ReplaySubject } from "rxjs"
import { IPepListSortingChangeEvent, PepListSelectionType, PepSelectionData } from "@pepperi-addons/ngx-lib/list"
import { ListState } from "shared"

export class StateObserver{
    //subjects 
    private $searchString: ReplaySubject<string> = new ReplaySubject()
    private $pageIndex: ReplaySubject<number> = new ReplaySubject()
    private $sorting: ReplaySubject<IPepListSortingChangeEvent> = new ReplaySubject()


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