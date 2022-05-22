
/*
The return object format MUST contain the field 'success':
{success:true}

If the result of your code is 'false' then return:
{success:false, erroeMessage:{the reason why it is false}}
The error Message is importent! it will be written in the audit log and help the user to understand what happen
*/

import { Client, Request } from '@pepperi-addons/debug-server'
import { Relation } from '@pepperi-addons/papi-sdk'
import UtilitiesService from './utilities.service';

export async function install(client: Client, request: Request): Promise<any> {
    await createPageBlockRelation(client);
    const service = new UtilitiesService(client)
    await service.createViewsTable()
    return {success:true,resultObject:{}}
}
export async function uninstall(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}

export async function upgrade(client: Client, request: Request): Promise<any> {
    createPageBlockRelation(client)
    return {success:true,resultObject:{}}
}

export async function downgrade(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}

async function createPageBlockRelation(client: Client): Promise<any> {
    try {
        let blockName = 'DataViewerBlock';
        let filename = 'data_viewer_block';

        const dataViewerRelation: Relation = {
            RelationName: "PageBlock",
            Name: blockName,
            Description: `data viewer`,
            Type: "NgComponent",
            SubType: "NG11",
            AddonUUID: client.AddonUUID,
            AddonRelativeURL: filename,
            ComponentName: `BlockComponent`, // This is should be the block component name (from the client-side)
            ModuleName: `BlockModule`, // This is should be the block module name (from the client-side)
            EditorComponentName: `BlockEditorComponent`, // This is should be the block editor component name (from the client-side)
            EditorModuleName: `BlockEditorModule` // This is should be the block editor module name (from the client-side)
        };
        const service = new UtilitiesService(client);
        const dataViewerResult = await service.upsertRelation(dataViewerRelation);
        
        filename = 'data_configuration_block';
        blockName = 'DataConfigurationBlock';
        const dataConfigurationBlockRelation: Relation = {
            RelationName: "PageBlock",
            Name: blockName,
            Description: `data configuration`,
            Type: "NgComponent",
            SubType: "NG11",
            AddonUUID: client.AddonUUID,
            AddonRelativeURL: filename,
            ComponentName: `DataConfigurationBlockComponent`, // This is should be the block component name (from the client-side)
            ModuleName: `DataConfigurationBlockModule`, // This is should be the block module name (from the client-side)
            EditorComponentName: `DataConfigurationBlockEditorComponent`, // This is should be the block editor component name (from the client-side)
            EditorModuleName: `DataConfigurationBlockEditorModule` // This is should be the block editor module name (from the client-side)
        };
        const dataConfigurationResult = await service.upsertRelation(dataConfigurationBlockRelation);
        return { success:true, resultObject: {dataViewerResult, dataConfigurationResult}};
    } catch(err) {
        return { success: false, resultObject: err , errorMessage: `Error in upsert relation. error - ${err}`};
    }
}