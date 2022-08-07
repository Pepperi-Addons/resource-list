import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { config } from '../addon.config';
import { GenericResourceService } from '../services/generic-resource-service';
import { EditorForm } from '../editors/editor-form'
import { IPepOption } from '@pepperi-addons/ngx-lib';
import { OpenMode } from '../../../../shared/entities'
import { EditorsService } from '../services/editors.service';
import { PepDialogActionsType, PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';

@Component({
  selector: 'app-editors-form',
  templateUrl: './editors-form.component.html',
  styleUrls: ['./editors-form.component.scss']
})
export class EditorsFormComponent implements OnInit {
  dataSource: any = {}
  dataView: any = {
    Type: "Form",
    Fields: [],
    Context: {
      Name: "",
      Profile: {},
      ScreenSize: 'Tablet'
    }
  };
  editorForm: EditorForm
  dataViewKey: string
  editorName: string = ""
  openModes: IPepOption[] = []
  openMode: OpenMode = 'popup'
  editCard: boolean = false
  resourceName: string
  loadCompleted: boolean = false

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private editorsService: EditorsService,
    private translate: TranslateService,
    private genericResource: GenericResourceService,
    private dialogService: PepDialogService,
    ){ 
      this.genericResource.pluginUUID = config.AddonUUID
    }

  ngOnInit(): void {
    this.openModes = [
      {
        key: "same-page",
        value: this.translate.instant("Replace")
      },
      {
        key: "popup",
        value: this.translate.instant("Popup")
      }
    ]
    this.dataViewKey  = this.route.snapshot.paramMap.get('key')
    this.initGeneralTab()
  }
  async initGeneralTab(){
    this.editorForm = this.createEditorForm()
    await this.editorForm.init()
    this.loadVariablesFromForm()
    this.loadCompleted = true
  }
  loadVariablesFromForm(){
    this.editorName = this.editorForm.getName()
    this.dataSource = this.editorForm.getDataSource()
    this.dataView = this.editorForm.getDataView()
    this.resourceName = this.dataSource.Resource
    this.loadCompleted = true
  }
  createEditorForm(){
    return new EditorForm(
      this.router,
      this.route,
      this.translate,
      this.genericResource,
      this.editorsService
    )
  }
  onBackToList(){
    this.router.navigate(["../.."],{ relativeTo: this.route },)
  }
  onUpdate(){
    this.editorForm.update()
    this.showDialog('Update', 'UpdateDialogMSG', 'close')
  }
  onOpenModeChange(event){
    this.openMode = event
    this.editorForm.setOpenMode(this.openMode)
  }
  showDialog(title: string, content: string, actionsType: PepDialogActionsType){
    const dataMsg = new PepDialogData({
      title: this.translate.instant(title),
      actionsType: actionsType,
      content: this.translate.instant(content)
    });
    this.dialogService.openDefaultDialog(dataMsg)
  }
}
