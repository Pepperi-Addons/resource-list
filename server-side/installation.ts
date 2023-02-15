
/*
The return object format MUST contain the field 'success':
{success:true}

If the result of your code is 'false' then return:
{success:false, erroeMessage:{the reason why it is false}}
The error Message is importent! it will be written in the audit log and help the user to understand what happen
*/

import { Client, Request } from '@pepperi-addons/debug-server'
import { Relation } from '@pepperi-addons/papi-sdk'
import AddonService from './addon.service';
import { ViewsService } from './services/views.service';
import { EditorsService } from './services/editors.service';
import * as AddonConfig from '../addon.config.json'
import { editorSchema, viewsSchema } from './metadata';
import semver from 'semver'



export async function install(client: Client, request: Request): Promise<any> {
    await createAddonBlockRelation(client)
    await createPageBlockRelation(client);
    await createSettingsRelation(client);
    await createDIMXRelation(client)
    const viewsService = new ViewsService(client)
    const editorsService = new EditorsService(client)
    await viewsService.createSchema()
    await editorsService.createSchema()
    return {success:true,resultObject:{}}
}
export async function uninstall(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}

export async function upgrade(client: Client, request: Request): Promise<any> {
    if (request.body.FromVersion && semver.compare(request.body.FromVersion, '0.7.0') < 0) {
        const viewsService = new ViewsService(client)
        const editorsService = new EditorsService(client)
        await viewsService.createSchema()
        await editorsService.createSchema()
    }
    await createAddonBlockRelation(client)
    await createPageBlockRelation(client);
    await createSettingsRelation(client);
    await createDIMXRelation(client)
    return {success:true,resultObject:{}}
}
function getDIMXRelationObjects(){
    return [
        {
            RelationName: "DataExportResource",
            AddonUUID: AddonConfig.AddonUUID,
            Name: viewsSchema.Name,
            Description: "Data export relation for views table",
            Type: "AddonAPI",
        },
        {
            RelationName: "DataExportResource",
            AddonUUID: AddonConfig.AddonUUID,
            Name: editorSchema.Name,
            Description: "Data export relation for editors table",
            Type: "AddonAPI",
        },
        {
            RelationName: "DataImportResource",
            AddonUUID: AddonConfig.AddonUUID,
            Name: viewsSchema.Name,
            Description: "Data import relation for views table",
            Type: "AddonAPI",
        },
        {
            RelationName: "DataImportResource",
            AddonUUID: AddonConfig.AddonUUID,
            Name: editorSchema.Name,
            Description: "Data import relation for editors table",
            Type: "AddonAPI",
        }
    ]
}
async function createDIMXRelation(client: Client){
    try {
        const service = new AddonService(client)
        const result = await Promise.all(getDIMXRelationObjects().map(async relation => {
            await service.upsertRelation(relation)
        }))
        return  { success:true, resultObject: {result}};
    }catch(e){
        return { success: false, resultObject: e , errorMessage: `Error in upsert relation. error - ${e}`};
    }
}

export async function downgrade(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}

async function createAddonBlockRelation(client: Client){
    const blockName = "ResourceSelection"
    const addonBlockRelation: Relation = {
        RelationName: "AddonBlock",
        Name: "ResourcePicker",
        Description: `${blockName} addon block`,
        Type: "NgComponent",
        SubType: "NG14",
        AddonUUID: client.AddonUUID,
        AddonRelativeURL: `file_${client.AddonUUID}`,
        ComponentName: `${blockName}Component`,
        ModuleName: `${blockName}Module`,
        ElementsModule: 'WebComponents',
        ElementName: `resource-selection-element-${client.AddonUUID}`,
    };
    const addonService = new AddonService(client)
    await addonService.upsertRelation(addonBlockRelation) 
}
async function createPageBlockRelation(client: Client): Promise<any> {
    try {
        const fileName = `file_${client.AddonUUID}`;

        const dataViewerRelation: Relation = {
            RelationName: "PageBlock",
            Name: 'DataViewerBlock',
            Description: `data viewer`,
            Type: "NgComponent",
            SubType: "NG14",
            AddonUUID: client.AddonUUID,
            AddonRelativeURL: fileName,
            ComponentName: `BlockComponent`, // This is should be the block component name (from the client-side)
            ModuleName: `BlockModule`, // This is should be the block module name (from the client-side)
            EditorComponentName: `BlockEditorComponent`, // This is should be the block editor component name (from the client-side)
            EditorModuleName: `BlockEditorModule`, // This is should be the block editor module name (from the client-side)
            ElementsModule: 'WebComponents',
            ElementName: `viewer-block-element-${client.AddonUUID}`,
            EditorElementName: `viewer-block-editor-element-${client.AddonUUID}`

        };
        const resourceListRelation: Relation = {
            RelationName: "PageBlock",
            Name: 'DataViewerBlock',
            Description: `data viewer`,
            Type: "NgComponent",
            SubType: "NG14",
            AddonUUID: client.AddonUUID,
            AddonRelativeURL: fileName,
            ComponentName: `ResourceListComponent`, // This is should be the block component name (from the client-side)
            ModuleName: `ResourceListModule`, // This is should be the block module name (from the client-side)
            EditorComponentName: `BlockEditorComponent`, // This is should be the block editor component name (from the client-side)
            EditorModuleName: `BlockEditorModule`, // This is should be the block editor module name (from the client-side)
            ElementsModule: 'WebComponents',
            ElementName: `viewer-block-element-${client.AddonUUID}`,
            EditorElementName: `viewer-block-editor-element-${client.AddonUUID}`

        };
        const service = new AddonService(client);
        const dataViewerResult = await service.upsertRelation(dataViewerRelation)
        const resourceListResult = await service.upsertRelation(resourceListRelation)

        const dataConfigurationBlockRelation: Relation = {
            RelationName: "PageBlock",
            Name: 'DataConfigurationBlock',
            Description: `data configuration`,
            Type: "NgComponent",
            SubType: "NG14",
            AddonUUID: client.AddonUUID,
            AddonRelativeURL: fileName,
            ComponentName: `DataConfigurationBlockComponent`, // This is should be the block component name (from the client-side)
            ModuleName: `DataConfigurationBlockModule`, // This is should be the block module name (from the client-side)
            EditorComponentName: `DataConfigurationBlockEditorComponent`, // This is should be the block editor component name (from the client-side)
            EditorModuleName: `DataConfigurationBlockEditorModule`, // This is should be the block editor module name (from the client-side)
            ElementsModule: 'WebComponents',
            ElementName: `data-config-block-element-${client.AddonUUID}`,
            EditorElementName: `data-config-block-editor-element-${client.AddonUUID}`
        };
        const dataConfigurationResult = await service.upsertRelation(dataConfigurationBlockRelation);
        return { success:true, resultObject: {dataViewerResult, dataConfigurationResult, resourceListResult}};


    } catch(err) {
        return { success: false, resultObject: err , errorMessage: `Error in upsert relation. error - ${err}`};
    }
}

async function createSettingsRelation(client: Client): Promise<any> {
    try {
        const compName = 'ViewsAndEditors';
        const fileName = `file_${client.AddonUUID}`;

        const settingsBlockRelation: Relation = {
            RelationName: "SettingsBlock",
            GroupName: 'Views&Editors',
            SlugName: 'views_and_editors',
            Name: 'views_and_editors',
            Description: 'views and editors',
            Type: "NgComponent",
            SubType: "NG14",
            AddonUUID: client.AddonUUID,
            AddonRelativeURL: fileName,
            ComponentName: `${compName}Component`,
            ModuleName: `${compName}Module`,
            ElementsModule: 'WebComponents',
            ElementName: `settings-element-${client.AddonUUID}`,
        }; 
        
        const service = new AddonService(client);
        const dataViewerResult = await service.upsertRelation(settingsBlockRelation);
    
        return { success:true, resultObject: {dataViewerResult}};
    } catch(err) {
        return { success: false, resultObject: err , errorMessage: `Error in upsert relation. error - ${err}`};
    }
}