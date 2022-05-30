import { AbstractEditor } from "./editor";

export class EditorEditor extends AbstractEditor{
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
          this.content = (await this.service.getEditors(key))[0]
        }
      }
}