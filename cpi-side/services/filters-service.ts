import { AddonDataScheme } from "@pepperi-addons/papi-sdk";
import { UtilitiesService } from "./utilities.service";
import { JSONFilter } from "@pepperi-addons/pepperi-filters";

const MAX_ACCOUNTS_IN_QUERY = 300
export class FiltersService {

    utilitiesService: UtilitiesService = new UtilitiesService(this.accountUUID != '');

    constructor(private accountUUID: string) {}

    async getAssignedAccountsFilter(resourceName: string, accountUUID: string): Promise<JSONFilter | undefined> {
        let filter: JSONFilter | undefined = undefined
        const service = new UtilitiesService(accountUUID != '');
        const shouldWorkOnline = await service.shouldWorkOnline();
        const isAdmin = await service.isAdmin();
        if(shouldWorkOnline && !isAdmin) {
            const fieldName = await this.getAccountField(resourceName);
            if(fieldName) {
                const accounts = await this.getAssignedAccounts();
                filter = {
                    ApiName: fieldName,
                    Values: accounts,
                    Operation: 'IsEqual',
                    FieldType: 'String'
                }
            }
        }
        return filter;
    }

    private async getAccountField(resourceName): Promise<string> {
        let field = '';
        const scheme = (await pepperi.papiClient.resources.resource('resources').key(resourceName).get()) as AddonDataScheme;
        Object.keys(scheme.Fields || {}).forEach(fieldName => {
            if(scheme.Fields![fieldName].Type === 'Resource' && scheme.Fields![fieldName].Resource === 'accounts' && scheme.Fields![fieldName].ApplySystemFilter) {
                field = fieldName;
            }
        })
        return field;
    }

    private async getAssignedAccounts(): Promise<string[]> {
        let accountsKeys: string[] = [];
        accountsKeys = (await pepperi.papiClient.accounts.find({fields: ['UUID'], page_size:MAX_ACCOUNTS_IN_QUERY + 1})).map(item => {
            return item.UUID || '';
        })
        if (accountsKeys.length > MAX_ACCOUNTS_IN_QUERY) {
            throw new Error(`User have more than ${MAX_ACCOUNTS_IN_QUERY} accounts assigned`);
        }
        return accountsKeys;
    }
}