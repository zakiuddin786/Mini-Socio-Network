import { NgModule } from '@angular/core';

import { MatInputModule, 
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatExpansionModule, 
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule} from '@angular/material';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
    exports:[
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatDialogModule,
    ]
})

export class AngularMaterialModule{}