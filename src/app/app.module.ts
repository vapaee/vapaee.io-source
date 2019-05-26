import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { CommonServicesModule } from './services/common/common.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';

import { DatePipe } from '@angular/common';
 
import { AppComponent } from './app.component';
import { EosioTokenMathService } from './services/eosio.token-math.service';
import { LoadingOverall } from './services/common/app.service';


import { ScatterService } from './services/scatter.service';
import { BGBoxService } from './services/bgbox.service';
import { CntService } from './services/cnt.service';
import { VapaeeService } from './services/vapaee.service';



import { VpeComponentsModule } from './components/vpe-components.module';

import { WPPage } from './pages/wp/wp.page';
import { RootPage } from './pages/root/root.page';
import { HomePage } from './pages/home/home.page';
import { TradePage } from './pages/trade/trade.page';
import { TokensPage } from './pages/tokens/tokens.page';
import { AccountPage } from './pages/account/account.page';
import { NotFoundPage } from './pages/not-found/not-found.page';


@NgModule({
    declarations: [
        RootPage,
        WPPage,
        HomePage,
        TradePage,
        TokensPage,
        AccountPage,
        NotFoundPage,
        AppComponent,
        LoadingOverall,
    ],
    entryComponents: [
        LoadingOverall
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        CommonServicesModule,
        VpeComponentsModule
    ],
    providers: [
        DatePipe,
        CookieService,
        ScatterService,
        BGBoxService,
        VapaeeService,
        CntService,
        HttpClient,
        EosioTokenMathService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
