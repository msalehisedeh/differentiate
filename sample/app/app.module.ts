import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DifferentiateModule } from '@sedeh/differentiate';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DifferentiateModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
