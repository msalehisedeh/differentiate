import { NgModule } from '@angular/core';
import { DifferentiateComponent } from './components/differentiate.component';
import { DifferentiateTree } from './components/differentiate-tree.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    DifferentiateComponent,
    DifferentiateTree
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DifferentiateComponent,
    DifferentiateTree
  ]
})
export class DifferentiateModule { }
