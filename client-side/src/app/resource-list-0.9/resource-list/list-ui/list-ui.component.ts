import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IPepGenericListDataSource } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { GridDataView } from '@pepperi-addons/papi-sdk';
import { SmartSearchInput } from '../../metadata';
import { PepMenuItem } from '@pepperi-addons/ngx-lib/menu';

@Component({
  selector: 'list-ui',
  templateUrl: './list-ui.component.html',
  styleUrls: ['./list-ui.component.scss']
})
export class ListUIComponent implements OnInit {
  @Input() dataSource: IPepGenericListDataSource
  @Input() smartSearch: SmartSearchInput
  @Input() menu: PepMenuItem[]
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.dataSource
  }

}
