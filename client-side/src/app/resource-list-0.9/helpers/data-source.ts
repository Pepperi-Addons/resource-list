// import { IPepGenericListDataSource, IPepGenericListInitData, IPepGenericListListInputs, IPepGenericListParams } from "@pepperi-addons/ngx-composite-lib/generic-list";
// import { GridDataView } from "@pepperi-addons/papi-sdk";
// import { CPIEventsManager } from "./cpi-events-manager";
// import { GLParamsAdapter } from "./GL-params-adapter";

// export class DataSource implements IPepGenericListDataSource{
//     constructor(private cpiEventsManager: CPIEventsManager){

//     }
//     async init(params: IPepGenericListParams): Promise<IPepGenericListInitData> {
//         const paramsAdapter = new GLParamsAdapter(params)
//         const changes = paramsAdapter.adapt()
//         return await this.cpiEventsManager.onDataSourceInit(changes)
//     }
// }