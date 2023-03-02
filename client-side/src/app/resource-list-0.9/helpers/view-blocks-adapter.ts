import { AddonDataScheme, BaseDataView, DataViewFieldType, GridDataView, GridDataViewField, SchemeFieldType } from "@pepperi-addons/papi-sdk";
import { ViewBlock } from "shared";
export interface IViewBlocksAdapter{
    adapt(): BaseDataView
}

export class ViewBlocksAdapter implements IViewBlocksAdapter{
    dataView: GridDataView = {
        Type: 'Grid',
        Fields: [],
        Columns: []
    }
    constructor(private blocks: ViewBlock[] = []){

    }

    adapt(): GridDataView {
        try{
            this.convertBlocksToDataView()   
            return this.dataView
        }catch(err){
            throw new Error(`error inside viewBlocksAdapter  while converting view blocks to data view: ${err} `)
        }
    }

    private convertBlocksToDataView(){
        this.blocks.forEach(block => {
            const field: GridDataViewField = {
                FieldID: block.Configuration.FieldID,
                Type: block.Configuration.Type as DataViewFieldType,
                ReadOnly: true,
                Mandatory: true,
                Title: block.Title
            }
            this.dataView.Fields.push(field)
            this.dataView.Columns.push(block.Configuration.Width || 10)
        })
    }
    

}