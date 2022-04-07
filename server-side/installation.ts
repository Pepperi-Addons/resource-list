
/*
The return object format MUST contain the field 'success':
{success:true}

If the result of your code is 'false' then return:
{success:false, erroeMessage:{the reason why it is false}}
The error Message is importent! it will be written in the audit log and help the user to understand what happen
*/

import { Client, Request } from '@pepperi-addons/debug-server'
import { Relation } from '@pepperi-addons/papi-sdk'
import MyService from './my.service';

export async function install(client: Client, request: Request): Promise<any> {
    // For page block template uncomment this.
    await createPageBlockRelation(client);
    // return res;
    return {success:true,resultObject:{}}
}

export async function uninstall(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}

export async function upgrade(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}

export async function downgrade(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}

function createPageBlockRelationObject(client: Client,
        blockNames:{
            blockName: string,
            filename: string,
            componentName: string,
            moduleName: string,
            editorComponentName: string,
            editorModuleName: string,
            description: string
        }){
    return {
        RelationName: "PageBlock",
        Name: blockNames.blockName,
        Description: blockNames.description,
        Type: "NgComponent",
        SubType: "NG11",
        AddonUUID: client.AddonUUID,
        AddonRelativeURL: blockNames.filename,
        ComponentName: blockNames.componentName, // This is should be the block component name (from the client-side)
        ModuleName: blockNames.moduleName, // This is should be the block module name (from the client-side)
        EditorComponentName: blockNames.editorComponentName, // This is should be the block editor component name (from the client-side)
        EditorModuleName: blockNames.editorModuleName // This is should be the block editor module name (from the client-side)
    };
}


async function createPageBlockRelation(client: Client): Promise<any> {
    try {
        const dataViewerBlock = 
        {
            blockName: 'DataViewerBlock',
            filename:'data_viewer_block',
            componentName: `BlockComponent`,
            moduleName: `BlockModule`,
            editorComponentName: `BlockEditorComponent`,
            editorModuleName:`BlockEditorModule`,
            description: `data viewer`
        }
        const dataConfigurationBlock = 
        {
            blockName: 'DataConfigurationBlock',
            filename:'data_viewer_block',
            componentName: `DataConfigurationBlockComponent`,
            moduleName: `DataConfigurationBlockModule`,
            editorComponentName: `DataConfigurationBlockEditorComponent`,
            editorModuleName:`DataConfigurationBlockEditorModule`,
            description: `data configuration`
        }
        const service = new MyService(client);
        const dataViewerResult = await service.upsertRelation(createPageBlockRelationObject(client, dataViewerBlock));
        const dataConfigurationResult = await service.upsertRelation(createPageBlockRelationObject(client, dataConfigurationBlock));
        return { success:true, resultObject: {'data-viewer-result': dataViewerResult, 'data-configuration-result': dataConfigurationResult}};
    } catch(err) {
        return { success: false, resultObject: err , errorMessage: `Error in upsert relation. error - ${err}`};
    }
}