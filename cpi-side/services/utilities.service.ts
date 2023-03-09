import { Sorting } from "shared";

export class UtilitiesService {
    constructor() {}

    getSortingString(sorting?: Sorting): string {
        let res = '';
        if (sorting) {
            const direction = sorting.Ascending ? 'ASC' : 'DESC'
            res = `${sorting.FieldKey} ${direction}`;
        }
        return res;
    }
}