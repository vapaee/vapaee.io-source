import { NgModule } from '@angular/core';
import { VapaeeScatter } from './scatter.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule
  ],
  declarations: [],
  providers: [VapaeeScatter],
  exports: []
})
export class VapaeeScatterModule { }
