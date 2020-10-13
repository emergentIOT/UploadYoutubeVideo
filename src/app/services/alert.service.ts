import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertService{

  constructor(private snackBar: MatSnackBar) { }

  //Custom alert messages service
  success(message: string, duration = 3000){
    this.snackBar.open(message, '', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['alert', 'alert-success']
    });
  }

  alert(message: string, duration = 3000){
    this.snackBar.open(message, '', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['alert', 'alert-error']
    });
  }

  message(message: string, duration = 3000){
    this.snackBar.open(message, '', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['alert']
    })
  }
}
