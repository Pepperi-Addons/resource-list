import { OldSorting } from "shared";

export class UtilitiesService {
    constructor() {}

    getSortingString(sorting?: OldSorting): string {
        let res = '';
        if (sorting) {
            const direction = sorting.Ascending ? 'asc' : 'desc'
            res = `${sorting.FieldKey} ${direction}`;
        }
        return res;
    }
}