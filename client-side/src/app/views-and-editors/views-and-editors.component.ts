import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ViewsService } from '../services/views.service'
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { ActivatedRoute, Router } from '@angular/router';
import { IPepGenericListActions } from '@pepperi-addons/ngx-composite-lib/generic-list';
import {EditorsService} from '../services/editors.service'

@Component({
  selector: 'app-views-and-editors',
  templateUrl: './views-and-editors.component.html',
  styleUrls: ['./views-and-editors.component.scss']
})
export class ViewsAndEditorsComponent implements OnInit {
  addEditorCB = () => this.router.navigate(["editor/new"], {relativeTo : this.route})
  addViewCB = () => this.router.navigate(["new"], {relativeTo : this.route})

  constructor(
    public viewsService: ViewsService,
    public editorsService: EditorsService,
    private router: Router,
    private route: ActivatedRoute
    ) {}
    ngOnInit(): void {
    }
}