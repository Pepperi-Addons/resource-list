import { View, Editor } from "../../../../shared/entities";
import { AbstractForm } from "./form";

export  class ViewEditor extends AbstractForm{
  content: View;
  async initView(key: string){
      if(key === "new"){
        this.content = {
          Key: "",
          Name: "",
          Description: "",
          Resource: {
            AddonUUID: "",
            Name: ""
          }
        }
      }
      else{
        this.content = (await this.service.getItems(key))[0]
      }
  }
  async update() {
    this.content.Name = this.dataSource.Name
    this.content.Description = this.dataSource.Description
    this.content.Resource.Name = this.dataSource.Resource
    this.service.upsertItem(this.content)
  }
}
