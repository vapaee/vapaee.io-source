import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { CommonServicesModule } from './services/common/common.module';
import { HttpClient, HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';

import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

import { SidebarModule } from 'ng-sidebar';
// import { CookieService } from 'ngx-cookie-service';

import { DatePipe } from '@angular/common';
 
import { AppComponent } from './app.component';
import { LoadingOverall } from './services/common/app.service';

import { CoingeckoService } from './services/coingecko.service';
import { DropdownService } from './services/dropdown.service';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { TimezoneService } from './services/timezone.service';

import { FormsModule } from '@angular/forms';
import { DirectivesModule } from './directives/directives.module';

import { NgxSmartModalModule } from 'ngx-smart-modal';

import { VapaeeComponentsModule } from './components/vpe-components.module';
import { LandingHomePage } from './pages/landing/home/home.page';
import { LandingRootPage } from './pages/landing/root/root.page';
import { DexRootPage } from './pages/dex/root/root.page';
import { DexHomePage } from './pages/dex/home/home.page';
import { DexTradePage } from './pages/dex/trade/trade.page';
import { DexSwapPage } from './pages/dex/swap/swap.page';
import { DexTokensPage } from './pages/dex/tokens/tokens.page';
import { DexTokenPage } from './pages/dex/token/token.page';
import { DexMarketsPage } from './pages/dex/markets/markets.page';
import { DexAccountPage } from './pages/dex/account/account.page';
import { NotFoundPage } from './pages/base/not-found/not-found.page';

// @vapaee libs---------
import { VapaeeWalletModule } from '@vapaee/wallet';
import { VapaeeDexModule } from '@vapaee/dex';
import { VapaeeRexModule } from '@vapaee/rex';
import { ExRootPage } from './pages/ex/root/root.page';
import { ExHomePage } from './pages/ex/home/home.page';
import { ExAccountPage } from './pages/ex/account/account.page';





@NgModule({
    declarations: [
        NotFoundPage,
        AppComponent,
        LoadingOverall,
        // ------------
        LandingHomePage,
        LandingRootPage,
        // ------------
        DexRootPage,
        DexHomePage,
        DexTradePage,
        DexSwapPage,
        DexTokensPage,
        DexTokenPage,
        DexMarketsPage,
        DexAccountPage,
        // ------------
        ExRootPage,
        ExHomePage,
        ExAccountPage
    ],
    entryComponents: [
        LoadingOverall
    ],
    imports: [
        NgbModule,
        NgbDropdownModule, // work arround for imcompatibility with ng-bootstrap and Angular 11
        // https://www.reddit.com/r/angularjs/comments/kczk5g/why_ngbootstrap_isnt_being_processed_correctly/
        // ------------
        CommonModule,
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        HttpClientJsonpModule,
        CommonServicesModule,
        VapaeeComponentsModule,
        VapaeeWalletModule,
        VapaeeDexModule,
        VapaeeRexModule,
        ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
        SidebarModule.forRoot(),

        FormsModule,
        MarkdownModule.forRoot(),
        DirectivesModule,
        NgxSmartModalModule.forRoot()
    ],
    providers: [
        DatePipe,
        // CookieService,
        HttpClient,
        CoingeckoService,
        DropdownService,
        TimezoneService        
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

if ('serviceWorker' in navigator && environment.production) {
    navigator.serviceWorker.register('/ngsw-worker.js');
}