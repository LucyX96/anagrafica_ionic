import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import iro from '@jaames/iro';
import { BehaviorSubject, Subscription } from 'rxjs';
import { distinctUntilChanged, tap } from 'rxjs/operators';

type IroColor = iro.Color;

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class ColorPickerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('hueWheelContainer') hueWheelContainer!: ElementRef<HTMLElement>;
  @ViewChild('svBoxContainer') svBoxContainer!: ElementRef<HTMLElement>;

  @Input()
  set color(value: string | IroColor) {
    if (value) {
      this._initialColor = new iro.Color(value);
      if (this.isInitialized) {
        this.updateColor(this._initialColor);
      }
    }
  }

  @Output() colorChange = new EventEmitter<string>();

  private huePicker!: iro.ColorPicker;
  private svPicker!: iro.ColorPicker;
  private colorState$ = new BehaviorSubject<IroColor | null>(null);
  private stateSubscription!: Subscription;
  private isInitialized = false;
  private _initialColor: IroColor = new iro.Color('#ff0000');

  constructor() {
  }

  ngAfterViewInit(): void {
    this.svPicker = iro.ColorPicker(this.svBoxContainer.nativeElement, {
      width: 180,
      color: this._initialColor,
      layout: [{ component: iro.ui.Box, options: { wheelWidth: 36, sliderSize: 0 } }]
    });

    this.huePicker = iro.ColorPicker(this.hueWheelContainer.nativeElement, {
      width: 280,
      color: this._initialColor,
      layout: [{ component: iro.ui.Wheel, options: { wheelWidth: 36, sliderSize: 0 } }]
    });

    this.isInitialized = true;
    this.setupSync();
  }

  ngOnDestroy(): void {
    if (this.huePicker) this.huePicker.off('color:change', this.onHueChange);
    if (this.svPicker) this.svPicker.off('color:change', this.onSvChange);
    this.stateSubscription?.unsubscribe();
  }

  private onHueChange = (color: IroColor) => {
    if (this.svPicker.color.hue !== color.hue) {
      this.svPicker.color.hue = color.hue;
    }
  };

  private onSvChange = (color: IroColor) => {
    
    // SOLUZIONE DEFINITIVA: Creiamo un NUOVO oggetto colore dalla sua stringa esadecimale.
    const newIndependentColor = new iro.Color(color.hexString);
    this.colorState$.next(newIndependentColor);
  };

  private setupSync(): void {
    this.huePicker.on('color:change', this.onHueChange);
    this.svPicker.on('color:change', this.onSvChange);

    this.stateSubscription = this.colorState$.pipe(
      distinctUntilChanged((prev, curr) => {
        const areEqual = prev?.hexString === curr?.hexString;
        return areEqual;
      }),
    ).subscribe((color) => {
      if (color) {
        if (this.huePicker.color.hexString !== color.hexString) {
          this.huePicker.color.set(color.hsv);
        }
        this.colorChange.emit(color.hexString);
      }
    });

    // Anche qui, inviamo una nuova istanza per sicurezza e coerenza.
    this.colorState$.next(new iro.Color(this.svPicker.color));
  }

  private updateColor(color: IroColor): void {
    if (this.huePicker && this.svPicker) {
      this.huePicker.color.set(color);
      this.svPicker.color.set(color);
      
      const newIndependentColor = new iro.Color(color.hexString);
      this.colorState$.next(newIndependentColor);
    }
  }
}

