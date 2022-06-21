import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ViewsService } from '../services/views.service'
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { ActivatedRoute, Router } from '@angular/router';
import { IPepGenericListActions } from '@pepperi-addons/ngx-composite-lib/generic-list';

@Component({
  selector: 'app-views-and-editors',
  templateUrl: './views-and-editors.component.html',
  styleUrls: ['./views-and-editors.component.scss']
})
export class ViewsAndEditorsComponent implements OnInit {
  //------------editor properties------------
  editorItems: any[] = []
  editorActions: IPepGenericListActions
  addEditorCB = () => this.router.navigate(["editor/new"], {relativeTo : this.route})
  editorsTableTitle = "Editors"
  
  //------------view properties------------
  items: any[] = []
  viewActions: IPepGenericListActions
  addViewCB = () => this.router.navigate(["new"], {relativeTo : this.route})
  viewsTableTitle = "Views"

  constructor(
    private translate: TranslateService,
    private viewsService: ViewsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.viewsTableTitle = this.translate.instant(this.viewsTableTitle)
    this.editorsTableTitle = this.translate.instant(this.editorsTableTitle)
  }
  ngOnInit(): void {
    this.viewActions = this.getViewsTableActions()
    this.getViewsTableItems().then(items => {
      this.items = items
    })
    this.editorActions = this.getEditorsTableActions()
    this.getEditorsItems().then(items => {
      this.editorItems = items
    })
  }
  //----------------------------------------------
  //-------------views table functions------------
  //----------------------------------------------
  async getViewsTableItems(){
    const views = await this.viewsService.getViews()
    return this.fieldsToListItems(views)
  }
  getViewsTableActions(){
    return {
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
  //-----------------------------------------------
  //------------editors table functions------------
  //-----------------------------------------------
  getEditorsTableActions(){
    return  {
      get: async (data: PepSelectionData) => {
        const actions = []
        if(data && data.rows.length == 1){
          actions.push({
            title: this.translate.instant('Edit'),
            handler: async (selectedRows) => {
              this.router.navigate([`editor/${selectedRows.rows[0]}`], {relativeTo : this.route})
            }
          })
        }
        return actions
      }
    }
  }
  async getEditorsItems(){
    const editors = await this.viewsService.getEditors()
    return this.fieldsToListItems(editors)
  }
  //-----------------------------------------
  //------------general functions------------
  //-----------------------------------------
  fieldsToListItems(items: any[]){
    return items.map((editor) => {
      return {
        Name: editor.Name,
        Description: editor.Description,
        Resource: editor.Resource.Name,
        Key: editor.Key
      }
    })
  }
}