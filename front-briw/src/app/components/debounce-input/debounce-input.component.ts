import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-debounce-input',
  templateUrl: './debounce-input.component.html',
  styleUrls: ['./debounce-input.component.css']
})
export class DebounceInputComponent implements OnInit {
  @Input() placeholder = '';
  @Output() onDebounce: EventEmitter<string> = new EventEmitter();
  @Output() onEnter:EventEmitter<string> = new EventEmitter();
  debounce: Subject<string> = new Subject();
  searchInput: FormControl = new FormControl();
  constructor() { }

  ngOnInit(): void {
    this.debounce.pipe(debounceTime(400))
    .subscribe(value => this.onDebounce.emit(value));
  }

  keyPressed(){
    this.debounce.next(this.searchInput.value);
  }

  searchBox(){
    this.onEnter.emit(this.searchInput.value);
  }

}
