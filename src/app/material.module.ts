import{NgModule} from '@angular/core'
import {MatButtonModule} from '@angular/material/button'
import {MatSnackBarModule} from '@angular/material/snack-bar'

const modules = [
    MatButtonModule,
    MatSnackBarModule
];

@NgModule({
    imports: modules,
    exports: modules
})

export class MaterialModule{}