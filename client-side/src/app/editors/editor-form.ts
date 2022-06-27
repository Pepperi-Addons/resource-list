import { Editor, OpenMode, View } from "../../../../shared/entities";
import { AbstractForm } from "./form";

export class EditorForm extends AbstractForm{
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
        const contentArray = await this.service.getEditors(key)
        if(contentArray && contentArray.length > 0)
        {
          this.content = contentArray[0]
        }
        else{
          throw new Error("Editor does not exist")
        }
      }
  }
  async update() {
    this.content.Name = this.dataSource.Name
    this.content.Description = this.dataSource.Description
    this.content.Resource.Name = this.dataSource.Resource
    this.content.OpenMode = this.dataSource.OpenMode
    this.service.upsertEditor(this.content)
  }
  setOpenMode(openMode: OpenMode){
    this.dataSource.OpenMode = openMode
  }
}