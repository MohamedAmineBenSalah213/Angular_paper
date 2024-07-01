import { Component, Input, forwardRef } from '@angular/core'
import { NG_VALUE_ACCESSOR } from '@angular/forms'
import { AbstractInputComponent } from '../abstract-input'

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextComponent),
      multi: true,
    },
  ],
  selector: 'pngx-input-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent extends AbstractInputComponent<string>  {
  constructor() {
    super()
  } 
  @Input() transformValue: boolean = false;

 
  // Override writeValue to transform the value if needed
  writeValue(value: any) {
    if (this.transformValue && typeof value === 'string') {
      value = this.transformMatchValue(value);
    }
    super.writeValue(value);
  }

  // Method to transform the match value
  transformMatchValue(value: string): string {
    return value.split(',').join(' ');
  }

  // Method to handle input change
  onInputChange(value: string) {
    if (this.transformValue) {
      value = this.transformMatchValue(value);
    }
    this.onChange(value); // Emit the changed value
  }
}
