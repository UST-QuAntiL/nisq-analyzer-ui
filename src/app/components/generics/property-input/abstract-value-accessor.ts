import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { forwardRef } from '@angular/core';

export abstract class AbstractValueAccessor implements ControlValueAccessor {
  _value: any = '';

  get value(): any {
    return this._value;
  }

  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  writeValue(value: any): void {
    this._value = value;
  }

  public onChange: any = () => {};
  public onTouched: any = () => {};

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function DoProvider(type: any) {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => type),
    multi: true,
  };
}
