import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { DifferentiateModule } from './differentiate/differentiate.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    DifferentiateModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
