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
          OpenMode: "same-page",
          ReferenceFields: []
        }
      }
      else{
        const contentArray = await this.service.getItems(key)
        if(contentArray && contentArray.length > 0)
        {
          this.content = contentArray[0]
        }
        else{
          throw new Error("Editor does not exist")
        }
      }
  }
  setOpenMode(openMode: OpenMode){
    this.dataSource.OpenMode = openMode
  }
}