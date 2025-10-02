
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
import { distinctUntilChanged, skip } from 'rxjs/operators';

// Creiamo un alias per il tipo 'Color' dall'oggetto 'iro' importato
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

  constructor() {}

  ngAfterViewInit(): void {
    

    this.svPicker = iro.ColorPicker(this.svBoxContainer.nativeElement, {
      width: 180,
      color: this._initialColor,
      // Diciamo alla libreria di disegnare SOLO il riquadro (Box).
      layout: [
        {
          component: iro.ui.Box,
          options: {
            wheelWidth: 36,   // thickness del ring
            sliderSize: 0     // nasconde slider esterni
          }
        }
      ]
    });

    this.huePicker = iro.ColorPicker(this.hueWheelContainer.nativeElement, {
      width: 280,
      color: this._initialColor,
      
      layout: [
        {
          component: iro.ui.Wheel,
          options: {
            wheelWidth: 36,
            sliderSize: 0
          }
        }
      ]
    });

    this.isInitialized = true;
    this.setupSync();
  }

  ngOnDestroy(): void {
    if (this.huePicker) {
      this.huePicker.off('color:change', this.onHueChange);
    }
    if (this.svPicker) {
      this.svPicker.off('color:change', this.onSvChange);
    }
    this.stateSubscription?.unsubscribe();
  }

  private onHueChange = (color: IroColor) => {
    // Quando l'anello esterno cambia, aggiorniamo solo la tonalità del disco interno
    if (this.svPicker.color.hue!== color.hue) {
      this.svPicker.color.hue = color.hue;
    }
  };

  private onSvChange = (color: IroColor) => {
    // Il disco interno definisce il colore finale (tonalità, saturazione, luminosità)
    this.colorState$.next(color);
  };

  private setupSync(): void {
    this.huePicker.on('color:change', this.onHueChange);
    this.svPicker.on('color:change', this.onSvChange);

    this.stateSubscription = this.colorState$
     .pipe(
        distinctUntilChanged((prev, curr) => prev?.hexString === curr?.hexString),
        skip(1)
      )
     .subscribe((color) => {
        if (color) {
          // Aggiorniamo la posizione del selettore sull'anello esterno per coerenza visiva
          if (this.huePicker.color.hexString!== color.hexString) {
            this.huePicker.color.set(color.hsv);
          }
          // Emettiamo il colore finale
          this.colorChange.emit(color.hexString);
        }
      });

    this.colorState$.next(this.svPicker.color);
  }

  private updateColor(color: IroColor): void {
    if (this.huePicker && this.svPicker) {
      this.huePicker.color.set(color);
      this.svPicker.color.set(color);
      this.colorState$.next(color);
    }
  }
}