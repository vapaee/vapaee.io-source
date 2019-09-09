import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { VapaeeGoogleChartsModule } from './vpe-panel-chart/google-chart-service/google-charts.module';

import { CookieService } from 'ngx-cookie-service';

// perfect scrollbar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

import { DatePipe } from '@angular/common';

import { VpeComponentsService } from './vpe-components.service';


import { VpeIdenticonComponent } from './vpe-identicon/vpe-identicon.component';
import { VpePanelComponent } from './vpe-panel/vpe-panel.component';
import { VpePanelOrdersComponent } from './vpe-panel-orders/vpe-panel-orders.component';
import { VpePanelUserOrdersComponent } from './vpe-panel-user-orders/vpe-panel-user-orders.component';
import { VpePanelTokensCardDeckComponent } from './vpe-panel-tokens-card-deck/vpe-panel-tokens-card-deck.component';
import { VpePanelMarketsCardDeckComponent } from './vpe-panel-markets-card-deck/vpe-panel-markets-card-deck.component';
import { VpePanelHistoryComponent } from './vpe-panel-history/vpe-panel-history.component';
import { VpePanelWalletComponent } from './vpe-panel-wallet/vpe-panel-wallet.component';
import { VpePanelBalanceBreakdawnComponent } from './vpe-panel-balance-breakdown/vpe-panel-balance-breakdown.component';
import { VpePanelAccountResourcesComponent } from './vpe-panel-account-resources/vpe-panel-account-resources.component';
import { VpePanelAccountHeaderComponent } from './vpe-panel-account-header/vpe-panel-account-header.component';
import { VpePanelChartComponent } from './vpe-panel-chart/vpe-panel-chart.component';
import { VpePanelTokensComponent } from './vpe-panel-tokens/vpe-panel-tokens.component';
import { VpePanelMarketsComponent } from './vpe-panel-markets/vpe-panel-markets.component';
import { VpePanelOrderEditorComponent } from './vpe-panel-order-editor/vpe-panel-order-editor.component';
import { VpeTokenInputComponent } from './vpe-token-input/vpe-token-input.component';
import { VpeOffChainComboboxComponent } from './vpe-offchain-combobox/vpe-offchain-combobox.component';
import { VpePanelActivityLogComponent } from './vpe-panel-activity-log/vpe-panel-activity-log.component';
import { VpePanelTokenSelectorComponent } from './vpe-panel-token-selector/vpe-panel-token-selector.component';
import { VpePanelTokensCardComponent } from './vpe-panel-tokens-card/vpe-panel-tokens-card.component';
import { VpePanelMarketsCardComponent } from './vpe-panel-markets-card/vpe-panel-markets-card.component';
import { VpeCheckboxComponent } from './vpe-checkbox/vpe-checkbox.component';



@NgModule({
    declarations: [
        VpeIdenticonComponent,
        VpePanelComponent,
        VpePanelOrdersComponent,
        VpePanelUserOrdersComponent,
        VpePanelTokensCardComponent,
        VpePanelTokensCardDeckComponent,
        VpePanelMarketsCardComponent,
        VpePanelMarketsCardDeckComponent,
        VpePanelHistoryComponent,
        VpePanelWalletComponent,
        VpePanelBalanceBreakdawnComponent,
        VpePanelAccountResourcesComponent,
        VpePanelAccountHeaderComponent,
        VpePanelChartComponent,
        VpePanelTokensComponent,
        VpePanelMarketsComponent,
        VpePanelOrderEditorComponent,
        VpeOffChainComboboxComponent,
        VpeTokenInputComponent,
        VpePanelActivityLogComponent,
        VpePanelTokenSelectorComponent,
        VpeCheckboxComponent
    ],
    imports: [
        BrowserModule,
        PerfectScrollbarModule,
        Ng2SearchPipeModule,
        VapaeeGoogleChartsModule,
        FormsModule
    ],
    providers: [
        DatePipe,
        CookieService,
        VpeComponentsService,
        { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    ],
    exports: [
        VpeIdenticonComponent,
        VpePanelComponent,
        VpePanelOrdersComponent,
        VpePanelUserOrdersComponent,
        VpePanelTokensCardComponent,
        VpePanelTokensCardDeckComponent,
        VpePanelMarketsCardComponent,
        VpePanelMarketsCardDeckComponent,
        VpePanelHistoryComponent,
        VpePanelWalletComponent,
        VpePanelBalanceBreakdawnComponent,
        VpePanelAccountResourcesComponent,
        VpePanelAccountHeaderComponent,
        VpePanelChartComponent,
        VpePanelTokensComponent,
        VpePanelMarketsComponent,
        VpePanelOrderEditorComponent,
        VpeOffChainComboboxComponent,
        VpeTokenInputComponent,
        VpePanelActivityLogComponent,
        VpePanelTokenSelectorComponent,
        VpeCheckboxComponent
    ]
})
export class VapaeeComponentsModule { }
