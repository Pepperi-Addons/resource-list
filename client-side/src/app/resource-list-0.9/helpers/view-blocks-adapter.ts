import { AddonDataScheme, GridDataView, GridDataViewField } from "@pepperi-addons/papi-sdk";
import { ViewBlock } from "shared";
export interface IViewBlocksAdapter{
    adapt(): GridDataView
}

export class ViewBlocksAdapter implements IViewBlocksAdapter{
    dataView: GridDataView = {
        Type: 'Grid',
        Fields: [],
        Columns: []
    }
    constructor(private blocks: ViewBlock[] = [], private resourceFields: AddonDataScheme){

    }

    adapt(): GridDataView {
        try{
            this.convertBlocksToDataView()   
            return this.dataView
        }catch(err){}
    }

    private convertBlocksToDataView(){
        this.blocks.forEach(block => {
            const field: GridDataViewField = {
                FieldID: block.Configuration.FieldID,
                Type: this.resourceFields.Fields[block.Configuration.FieldID] || "TextBox
                "
            }
        })
    }
    

}