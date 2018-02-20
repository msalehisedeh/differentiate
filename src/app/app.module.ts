import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { DifferentiateModule } from './differentiate/differentiate.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    DifferentiateModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
