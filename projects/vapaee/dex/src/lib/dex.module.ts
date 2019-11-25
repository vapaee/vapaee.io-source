import { NgModule } from '@angular/core';
import { VapaeeDEX } from './dex.service'
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';

@NgModule({
  imports: [],
  declarations: [],
  providers: [VapaeeDEX, CookieService, DatePipe],
  exports: []
})
export class VapaeeDexModule { }
