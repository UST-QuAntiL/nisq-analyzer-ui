import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DoProvider } from './abstract-value-accessor';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  providers: [DoProvider(TextInputComponent)],
})
export class TextInputComponent implements OnInit, OnChanges {
  @Output() onSaveChanges: EventEmitter<string> = new EventEmitter<string>();
  @Output() onChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() name = '';
  @Input() value: string;

  inputValue: string;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('value')) {
      this.inputValue = changes.value.currentValue;
    }
  }

  saveChanges(): void {
    this.onSaveChanges.emit(this.inputValue);
  }

  inputChanged(): void {
    if (!this.inputValue) {
      this.inputValue = null;
    }
    this.onChange.emit(this.inputValue);
  }

  openLink(): void {
    window.open(this.inputValue, '_blank');
  }

  ngOnInit(): void {
    this.inputValue = this.value;
  }
}
