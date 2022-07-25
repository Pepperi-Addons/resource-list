import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ViewsService } from '../services/views.service'
import {EditorsService} from '../services/editors.service'
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-views-and-editors',
  templateUrl: './views-and-editors.component.html',
  styleUrls: ['./views-and-editors.component.scss']
})
export class ViewsAndEditorsComponent implements OnInit {

  currentTabIndex: 0 | 1 = 0
  constructor(
    public viewsService: ViewsService,
    public editorsService: EditorsService,
    ) {}
    ngOnInit(): void {
    }
    onTabChanged($event){
      this.currentTabIndex = $event.index
    }
}