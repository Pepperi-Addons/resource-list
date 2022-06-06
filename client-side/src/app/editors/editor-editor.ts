import { Editor, OpenMode, View } from "../../../../shared/entities";
import { AbstractEditor } from "./editor";

export class EditorEditor extends AbstractEditor{
  content: Editor;
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
          OpenMode: "same-page"
        }
      }
      else{
        this.content = (await this.service.getEditors(key))[0]
      }
  }
  async update() {
    debugger
    this.content.Name = this.dataSource.Name
    this.content.Description = this.dataSource.Description
    this.content.Resource.Name = this.dataSource.Resource
    this.content.OpenMode = this.dataSource.OpenMode
    this.service.upsertEditor(this.content)
  }
  setOpenMode(openMode: OpenMode){
    debugger
    this.dataSource.OpenMode = openMode
  }
}