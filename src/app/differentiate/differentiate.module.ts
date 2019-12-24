import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DifferentiateComponent } from './components/differentiate.component';
import { DifferentiateTree } from './components/differentiate-tree.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DifferentiateComponent,
    DifferentiateTree
  ],
  exports: [
    DifferentiateComponent
  ],
  entryComponents: [
  ],
  providers: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class DifferentiateModule {}
