import { NgModule } from '@angular/core';
import { UppercaseDirective } from './uppercase.directive';


@NgModule({
  imports: [],
  declarations: [UppercaseDirective],
  exports: [UppercaseDirective]
})
export class DirectivesModule { }