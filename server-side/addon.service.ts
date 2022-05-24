import { PapiClient, InstalledAddon, FindOptions } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';


class AddonService {

    papiClient: PapiClient

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client.ActionUUID
        });
    }

    doSomething() {
        console.log("doesn't really do anything....");
    }
    
    // For page block template
    upsertRelation(relation): Promise<any> {
        return this.papiClient.post('/addons/data/relations', relation);
    }
    getAddons(): Promise<InstalledAddon[]> {
        return this.papiClient.addons.installedAddons.find({});
    }
}

export default AddonService;