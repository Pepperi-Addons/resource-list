import { View, Editor } from "../../../../shared/entities";
import { AbstractEditor } from "./editor";

export  class ViewEditor extends AbstractEditor{
  content: View;
  // currentEditors: {Key: any, Value: any }[] = []
  protected editors: Editor[] = []
  async initView(key: string){
      if(key === "new"){
        this.content = {
          Key: "",
          Name: "",
          Description: "",
          Resource: {
            AddonUUID: "",
            Name: ""
          },
          EditorKey: ""
        }
      }
      else{
        this.content = (await this.service.getViews(key))[0]
      }
  }
  async loadDataView(){
    this.dataView =  {
      Type: "Form",
      Fields:  await this.getFields(),
      Context: {
        Name: "",
        Profile: {},
        ScreenSize: 'Tablet'
      }
    };
  }
  async init(): Promise<void> {
    this.editors = await this.service.getEditors()
    await super.init()
    // this.setCurrentEditors()
    await this.loadDataView()
  }
  async update() {
    this.content.Name = this.dataSource.Name
    this.content.Description = this.dataSource.Description
    this.content.Resource.Name = this.dataSource.Resource
    this.service.upsertView(this.content)
  }
  async getFields(){
    const fields = await super.getFields()
    fields.push({
      ReadOnly: false,
      Title: this.translate.instant('Editor'),
      Type: 'ComboBox',
      FieldID: "EditorKey",
      Mandatory: false,
      OptionalValues: this.getCurrentEditors(this.content?.Resource?.Name),
      Layout: {
          Origin: {
          X: 1,
          Y:1
          },
          Size: {
          Width: 1,
          Height: 0
          }
      }
      })
    return fields
  }
  getCurrentEditors(resourceName){
    const arr = []
    this.editors.forEach(editor => {
      if(editor.Resource.Name == resourceName){
        arr.push({
          Key: editor.Key,
          Value: editor.Name
        })
      }
    })
    return arr;
  }
}
