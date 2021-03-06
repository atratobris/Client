import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-click-to-edit',
  templateUrl: './click-to-edit.component.html',
  styleUrls: ['./click-to-edit.component.sass']
})
export class ClickToEditComponent implements OnInit {
  @Input() fieldValue: string;
  @Input() fieldName: string;
  @Output() nameUpdated = new EventEmitter();
  public editable: boolean;

  constructor() { }

  ngOnInit() {
    this.editable = this.fieldValue === '' ? true : false;
  }

  onClick(event): void {
    event.preventDefault();
    event.stopPropagation();
    this.editable = true;
  }

  onSave(event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!!this.fieldValue) {
      this.nameUpdated.emit(this.fieldValue);
      this.editable = false;
    }
  }

}
