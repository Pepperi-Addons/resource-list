import { DataViewFieldType, GridDataView, GridDataViewField } from "@pepperi-addons/papi-sdk";
import { ViewBlock } from "shared";
import { IViewBlocksAdapter } from "./view-blocks-adapter";


export class GridViewBlockAdapter implements IViewBlocksAdapter{
    dataView: GridDataView = {
        Type: 'Grid',
        Fields: [],
        Columns: [],
        Context: {
            Name: '',
            Profile: { InternalID: 0 },
            ScreenSize: 'Landscape'
          },
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
            this.dataView.Columns.push({
                Width: block.Configuration.Width || 10
            })
        })
    }
    

}