import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule, MatCardModule, MatDatepickerModule, MatFormFieldModule,
  MatInputModule, MatNativeDateModule, MatSelectModule, MatStepperModule
} from '@angular/material';

import { TestComponent } from './test.component';
import { TestService } from './test.service';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatStepperModule,
  ],
  declarations: [TestComponent],
  providers: [TestService]
})
export class TestModule { }
