import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataSource } from '../../data-source/data-source';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent{
  @Input() actions
  @Input() addCallback
  @Input() items: any[]
  @Input() title: string = ""
  datasource: DataSource
  widthArray = [
    {
      Width: 0
    },
    {
      Width: 0
    },
    {
      Width: 0
    }
  ]

  constructor(
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnChanges(){
    this.datasource = new DataSource(this.items, this.generateFields(), this.widthArray)
  }
  ngOnInit(){

  }
  generateFields(){
    return [{
        FieldID: 'Name',
        Mandatory: true,
        ReadOnly: true,
        Title: this.translate.instant('Name'),
        Type: 'TextBox'
      },
      {
        FieldID: 'Description',
        Mandatory: true,
        ReadOnly: true,
        Title: this.translate.instant('Description'),
        Type: 'TextBox'
      },
      {
        FieldID: 'Resource',
        Mandatory: true,
        ReadOnly: true,
        Title: this.translate.instant('Resource'),
        Type: 'TextBox'
      },
    ]
  }
  onAddClick(){
    this.addCallback()
  }
}
