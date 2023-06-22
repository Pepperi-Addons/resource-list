import { ReplaySubject } from "rxjs"
import { IPepListSortingChangeEvent, PepListSelectionType, PepSelectionData } from "@pepperi-addons/ngx-lib/list"
import { ListState, PageType } from "shared"
import { IPepGenericListPager } from "@pepperi-addons/ngx-composite-lib/generic-list"

export class StateObserver{
    //subjects 
    private $searchString: ReplaySubject<string> = new ReplaySubject()
    private $pageIndex: ReplaySubject<number> = new ReplaySubject()
    private $pageSize: ReplaySubject<number> = new ReplaySubject()
    private $pageType: ReplaySubject<IPepGenericListPager['type']> = new ReplaySubject()
    private $sorting: ReplaySubject<IPepListSortingChangeEvent> = new ReplaySubject()
    private $selectedViewKey: ReplaySubject<string>  = new ReplaySubject()
    private $selectAll: ReplaySubject<boolean>  = new ReplaySubject()

    notifyObservers(state: Partial<ListState>){
        this.$searchString.next(state.SearchString)
        this.$pageIndex.next(state.PageIndex)
        this.$pageSize.next(state.PageSize)
        this.$pageType.next(state.PageType?.toLowerCase() as IPepGenericListPager['type'])
        this.$selectAll.next(state.ItemSelection?.SelectAll || false)
        if(state.Sorting){
            this.$sorting.next({
                isAsc: state.Sorting.Ascending,
                sortBy: state.Sorting.FieldID  
            })
        }
        this.$selectedViewKey.next(state.ViewKey)

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
    onViewKeyChanged(cb: (key: string) => void): StateObserver{
        this.$selectedViewKey.subscribe(cb)
        return this
    }
    onPageSizeChanged(cb: (size: number) => void): StateObserver{
        this.$pageSize.subscribe(cb)
        return this
    }
    onPageTypeChanged(cb: (type: IPepGenericListPager['type']) => void): StateObserver{
        this.$pageType.subscribe(cb)
        return this
    }
    onSelectAllChanged(cb: (isAllSelected: boolean) => void): StateObserver{
        this.$selectAll.subscribe(cb)
        return this
    }
}