import { IGenericViewer, PageBlockConfiguration } from "shared";
import { ViewsService } from "../services/views.service";
import { GenericResourceService } from "../services/generic-resource.service";
import { Addon, AddonData, AddonDataScheme, FindOptions, GridDataView, SearchData } from "@pepperi-addons/papi-sdk";

export async function loadBlock(req, res, next){
    try{
        // console.log(`request recieved: ${JSON.stringify(req.body)}`);
        const result = { ...req.body };
        const body = req.body || {};
        const accountUUID = body.State?.AccountUUID || '';
        const viewKey = getViewKey(body.Configuration || {});
        if(viewKey != '') {
            const viewsService = new ViewsService();
            const resourcesService = new GenericResourceService(accountUUID != '');
            const genericView: IGenericViewer = await viewsService.getGenericView(viewKey, accountUUID);
            const resourceScheme: AddonDataScheme = await resourcesService.getResource(genericView.view.Resource.Name);
            const items: SearchData<AddonData> = await getResourceItems(genericView, resourceScheme, accountUUID, resourcesService);
            result.Configuration = {
                ...result.Configuration,
                GenericView: genericView,
                ResourceScheme: resourceScheme,
                Items: items
            }
        }
        res.json(result);
    }
    catch(err){
        next(err)
    }
}

async function getResourceItems(view: IGenericViewer, resourceScheme: AddonDataScheme, accountUUID: string, service: GenericResourceService): Promise<SearchData<AddonData>> {

    const query = getRequestQuery(view.filter, resourceScheme.Fields, accountUUID);
    const fields = getRequestFields(view.viewDataview);

    return await service.getItems(resourceScheme.Name, query, fields, view.view.Sorting)
}

function getViewKey(configuration: PageBlockConfiguration) {
    let viewKey = ''

    if(configuration.viewsList?.length > 0) {
        viewKey = configuration.viewsList[0].selectedView.key
    }
    return viewKey;
}

function getWhereClause(viewFilter: string, accountUUID: string, resourceFields: AddonDataScheme['Fields']) {
    let whereClause = viewFilter;
    const accountFilter = getAccountUUIDQuery(accountUUID, resourceFields);

    if (accountFilter) {
        whereClause = `${viewFilter} AND ${accountFilter}`;
    }
    
    return whereClause;
}

function getAccountUUIDQuery(accountUUID: string, resourceFields: AddonDataScheme['Fields']) {
    const fieldName = getAccountField(resourceFields);
    let query = ''
    if (fieldName && accountUUID) {
        query = `${fieldName}=${accountUUID}`
    }

    return query;
}

function getAccountField(resourceFields: AddonDataScheme['Fields'] = {}) {
    const fieldName = Object.keys(resourceFields || {}).find(fieldID => {
        const field = resourceFields[fieldID]
        return  (field && field.Type == "Resource" && field.Resource == "accounts" && field.ApplySystemFilter) 
    })
    
    return fieldName || ''
}

function getRequestQuery(viewFilter: string, resourceFields: AddonDataScheme['Fields'], accountUUID: string) {
    let query: FindOptions = {
        where: getWhereClause(viewFilter,accountUUID,resourceFields), 
        include_deleted: false,
        page: 1,
        page_size: 100
    }

    return query;
}

function getRequestFields(viewDataview: GridDataView): string[] {
    let fields: string[] = (viewDataview.Fields || []).map(x => x.FieldID);
    const keyFiledIndex = fields.findIndex(field => field == "Key");

    if(keyFiledIndex < 0){
        fields = [...fields, "Key"]
    }

    return fields;
}

