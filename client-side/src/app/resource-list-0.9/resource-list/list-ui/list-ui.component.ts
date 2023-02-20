import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IPepGenericListDataSource } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { GridDataView } from '@pepperi-addons/papi-sdk';

@Component({
  selector: 'list-ui',
  templateUrl: './list-ui.component.html',
  styleUrls: ['./list-ui.component.scss']
})
export class ListUIComponent implements OnInit {
  @Input() dataSource: IPepGenericListDataSource
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    //check if data changed
    if(changes.dataSource.currentValue && !changes.dataSource.firstChange){
    }
  }

  ngOnInit(): void {
    this.dataSource
  }

}
