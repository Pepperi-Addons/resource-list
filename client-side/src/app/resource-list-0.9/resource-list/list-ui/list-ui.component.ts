import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { SmartSearchInput } from '../../metadata';
import { IPepMenuItemClickEvent, PepMenuItem } from '@pepperi-addons/ngx-lib/menu';
import { GVButton } from '../../metadata'
import { PepperiList } from '../../helpers/pepperi-list';
import { IPepListSortingChangeEvent, PepListSelectionType } from '@pepperi-addons/ngx-lib/list';
import { GenericListComponent, IPepGenericListActions, IPepGenericListPager } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { ReplaySubject } from 'rxjs';
import { PageType, ViewsMenu } from 'shared';

@Component({
  selector: 'list-ui',
  templateUrl: './list-ui.component.html',
  styleUrls: ['./list-ui.component.scss']
})
export class ListUIComponent implements OnInit, OnChanges, AfterViewInit {
  //layout inputs
  @Input() dataSource: PepperiList
  @Input() smartSearch: SmartSearchInput
  @Input() menu: PepMenuItem[]
  @Input() buttons: GVButton[]
  @Input() lineMenu: IPepGenericListActions
  @Input() search: boolean
  @Input() title: string
  @Input() selectionType: PepListSelectionType
  @Input() viewsMenu: ViewsMenu
  @Input() selectedViewKey: string
  
  //state inputs
  @Input() $searchString: ReplaySubject<string>

  //pager states
  @Input() $pageIndex: ReplaySubject<number>
  @Input() $pageType: ReplaySubject<IPepGenericListPager['type']>
  @Input() $pageSize: ReplaySubject<number>
  
  @Input() $sorting: ReplaySubject<IPepListSortingChangeEvent>
  
  @Output() menuClickedEvent: EventEmitter<string> = new EventEmitter() 
  @Output() viewChangedEvent: EventEmitter<string> = new EventEmitter()
  
  //generic list instance
  @ViewChild(GenericListComponent) list: GenericListComponent
  
  constructor() { }


  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges) {
      // console.log(`inside on changes\n current: ${changes.selectionType.currentValue}\n previous: ${changes.selectionType.previousValue}`);
      // if(!changes.selectionType.firstChange && changes.selectionType.currentValue != changes.selectionType.previousValue) {
      //   this.list.selectionType = changes.selectionType.currentValue;
      // }
  }
  ngAfterViewInit(){
    this.$searchString.subscribe(str => this.list.searchString = str)
    //pager observables 
    this.$pageIndex.subscribe(index => this.list.pager.index = index - 1)
    this.$pageSize.subscribe(size => this.list.pager.size = size)
    this.$pageType.subscribe(type => this.list.pager.type = type)

    this.$sorting.subscribe(sorting => this.list.listInputs.sorting = sorting)
  }

  onMenuClicked(event: IPepMenuItemClickEvent){
    this.menuClickedEvent.emit(event.source.key)
  }

  onViewChanged(event){
    this.viewChangedEvent.emit(event)
  }

  getSelectedItems(){
    return this.list?.getSelectedItems()
  }

}
