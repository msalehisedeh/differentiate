import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DifferentiateComponent } from '@sedeh/differentiate';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DifferentiateComponent
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
