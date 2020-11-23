import { NgModule } from '@angular/core';
import { VapaeeScatter2 } from './scatter2.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule
  ],
  declarations: [],
  providers: [VapaeeScatter2],
  exports: []
})
export class VapaeeScatter2Module { }
