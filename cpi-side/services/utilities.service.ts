import { OldSorting } from "shared";

export class UtilitiesService {
    constructor(private inAccountContext: boolean) {}

    getSortingString(sorting?: OldSorting): string {
        let res = '';
        if (sorting) {
            const direction = sorting.Ascending ? 'asc' : 'desc'
            res = `${sorting.FieldKey} ${direction}`;
        }
        return res;
    }

    async shouldWorkOnline(): Promise<boolean> {
        const isWebApp = await global['app']['wApp']['isWebApp']();
		const isBuyer = await global['app']['wApp']['isBuyer']();
        return !isBuyer && isWebApp && !this.inAccountContext;
    }

    async isAdmin(): Promise<boolean> {
        return await global['app']['wApp']['isAdmin']();
    }
}