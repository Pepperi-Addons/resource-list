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
    private $topScrollIndex: ReplaySubject<number>  = new ReplaySubject()

    notifyObservers(state: Partial<ListState>){
        if(state.SearchString != undefined){
            this.$searchString.next(state.SearchString)
        }
        if(state.PageIndex != undefined){
            this.$pageIndex.next(state.PageIndex)
        }
        if(state.PageSize != undefined){
            this.$pageSize.next(state.PageSize)
        }
        if(state.PageType != undefined){
            this.$pageType.next(state.PageType?.toLowerCase() as IPepGenericListPager['type'])
        }
        if(state.ItemSelection?.SelectAll != undefined){
            this.$selectAll.next(state.ItemSelection?.SelectAll || false)
        }
        if(state.TopScrollIndex != undefined){
            this.$topScrollIndex.next(state.TopScrollIndex)
        }
        if(state.Sorting){
            this.$sorting.next({
                isAsc: state.Sorting.Ascending,
                sortBy: state.Sorting.FieldID  
            })
        }
        if(state.ViewKey != undefined){
            this.$selectedViewKey.next(state.ViewKey)
        }
    }

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
    onTopScrollIndexChanged(cb: (topScrollIndex: number) => void): StateObserver{
        this.$topScrollIndex.subscribe(cb)
        return this
    }
}