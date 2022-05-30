import { AbstractEditor } from "./editor";

export  class ViewEditor extends AbstractEditor{
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
          this.content = (await this.service.getViews(key))[0]
        }
      }

}
