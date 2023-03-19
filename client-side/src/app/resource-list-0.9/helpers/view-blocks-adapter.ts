import { IPepGenericListInitData } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { AddonDataScheme, BaseDataView, CardsGridDataView, DataViewFieldType, GridDataView, GridDataViewField, SchemeFieldType } from "@pepperi-addons/papi-sdk";
import { ViewBlock } from "shared";

export interface IViewBlocksAdapter{
    adapt(): IPepGenericListInitData['dataView']
}

export class ViewBlocksAdapterFactory{
    static create(type: "Grid" | "Cards", viewBlocks: ViewBlock[]): IViewBlocksAdapter{
        switch (type){
            case "Grid":
                return new GridViewBlockAdapter(viewBlocks)
            default:
                throw Error(`view blocks adapter for type ${type} is not implemented yet`)
        }
    }
}

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
            this.dataView.Columns.push(block.Configuration.Width || 10)
        })
    }
    

}