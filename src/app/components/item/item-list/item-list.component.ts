import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Item } from '../../../models';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  private _items: Item[];
  faEdit = faEdit;
  faTimes = faTimes;

  @Input('items') set items(items: Item[]) {
    this._items = items;
  }
  @Output() selectedItemIDEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  get items() {
    return this._items;
  }

  selectItem(item: Item): void {
    this.selectedItemIDEvent.emit(item.id);
  }

  getItemDate(item: Partial<Item>): Date {
    if (typeof item.dateCreated === 'number') {
      return new Date(item.dateCreated);
    }
    else if (typeof item.dateCreated.toDate === 'function') {
      return item.dateCreated.toDate();
    }
  }

}
