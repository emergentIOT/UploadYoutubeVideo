import{NgModule} from '@angular/core'
import {MatButtonModule} from '@angular/material/button'
import {MatSnackBarModule} from '@angular/material/snack-bar'
import {MatIconModule} from '@angular/material/icon'; 
const modules = [
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule
];

@NgModule({
    imports: modules,
    exports: modules
})

export class MaterialModule{}