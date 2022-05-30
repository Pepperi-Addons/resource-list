import { DataSource } from '../data-source/data-source';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ViewsService } from '../services/views.service'
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { IPepGenericListActions } from '@pepperi-addons/ngx-composite-lib/generic-list';

@Component({
  selector: 'app-views-and-editors',
  templateUrl: './views-and-editors.component.html',
  styleUrls: ['./views-and-editors.component.scss']
})
export class ViewsAndEditorsComponent implements OnInit {
  datasource: DataSource
  editorsDatasource: DataSource
  items: any[] = []
  editorsItems: any[] = []
  actions: IPepGenericListActions
  editorsActions: IPepGenericListActions

  constructor(
    private translate: TranslateService,
    private viewsService: ViewsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
   }

  
  ngOnInit(): void {
    this.initEditrosActions()
    this.setEditorsItems()
    .then(() => {
      this.editorsDatasource = new DataSource(this.editorsItems, this.generateFields(), this.generateWidthArray())
    })
    this.initGenericListActions()
    this.setItems().then(() => {
      this.datasource = new DataSource(this.items, this.generateFields(), this.generateWidthArray())
    })
  }
  initEditrosActions(){

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
  generateWidthArray(){
    const width = {
      Width: 0
    }
    return [
      width,
      width,
      width
    ]
  }
  async setEditorsItems(){
    const editorsItems = await this.viewsService.getEditors()
    editorsItems.map((editor) => {
      return {
        Name: editor.Name,
        Description: editor.Description,
        Resource: editor.Resource.Name,
        Key: editor.Key
      }
    })
  }
  async setItems(){
    const items = await this.viewsService.getViews()
    this.items = items.map((item) => {
      return {
        Name: item.Name,
        Description: item.Description,
        Resource: item.Resource.Name,
        Key: item.Key
      }
    })
  }
  initGenericListActions(){
    this.actions = {
      get: async (data: PepSelectionData) => {
        const actions = []
        if(data && data.rows.length == 1){
          actions.push({
              title: this.translate.instant('Edit'),
              handler: async (selectedRows) => {
                this.router.navigate([`${selectedRows.rows[0]}`], {relativeTo : this.route})
              }
          })
        }
        return actions
      }
    }
  }
  onAddClick(){
    this.router.navigate(["new"], {relativeTo : this.route})

  }
}
