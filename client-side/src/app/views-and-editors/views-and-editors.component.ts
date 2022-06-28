import { Component, OnInit } from '@angular/core';
import { ViewsService } from '../services/views.service'
import {EditorsService} from '../services/editors.service'

@Component({
  selector: 'app-views-and-editors',
  templateUrl: './views-and-editors.component.html',
  styleUrls: ['./views-and-editors.component.scss']
})
export class ViewsAndEditorsComponent implements OnInit {

  constructor(
    public viewsService: ViewsService,
    public editorsService: EditorsService,
    ) {}
    ngOnInit(): void {
    }
}