import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-view-dialog',
  templateUrl: './edit-view-dialog.component.html',
  styleUrls: ['./edit-view-dialog.component.scss']
})
export class EditViewDialogComponent implements OnInit {
  dataView
  dataSource
  constructor(@Inject(MAT_DIALOG_DATA) public incoming: any) { }

  ngOnInit(): void {
    this.dataSource = this.incoming.item
    this.dataView = this.incoming.editorDataView
  }

}
