import { Injectable } from "@angular/core";
import { PepColorSettings } from "@pepperi-addons/ngx-composite-lib/color-settings";
import { PepColorService } from "@pepperi-addons/ngx-lib";

@Injectable({
    providedIn: 'root',
})
export class CardsService {

    constructor(private pepColorService: PepColorService) {};
    
    changeCursorOnDragStart() {
        document.body.classList.add('inheritCursors');
        document.body.style.cursor = 'grabbing';
    }

    changeCursorOnDragEnd() {
        document.body.classList.remove('inheritCursors');
        document.body.style.cursor = 'unset';
    }

}
