import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingHomePage } from './pages/landing/home/home.page';
import { LandingRootPage } from './pages/landing/root/root.page';
import { DexHomePage } from './pages/dex/home/home.page';
import { DexTradePage } from './pages/dex/trade/trade.page';
import { DexTokensPage } from './pages/dex/tokens/tokens.page';
import { DexTokenPage } from './pages/dex/token/token.page';
import { DexMarketsPage } from './pages/dex/markets/markets.page';
import { DexRootPage } from './pages/dex/root/root.page';
import { DexAccountPage } from './pages/dex/account/account.page';
import { NotFoundPage } from './pages/base/not-found/not-found.page';
import { DexSwapPage } from './pages/dex/swap/swap.page';
import { ExRootPage } from './pages/ex/root/root.page';
import { ExHomePage } from './pages/ex/home/home.page';
import { ExAccountPage } from './pages/ex/account/account.page';

//*
export const routes: Routes = [
  { path: '',                            data: { state: "root" }, redirectTo: '/exchange/home', pathMatch: 'full' },
  { path: 'landing',                     data: { site:"landing", state: "landing" }, component: LandingRootPage,
    children: [
      { path: 'home',                    data: { site:"landing", state: "landing-home" }, component: LandingHomePage },
      { path: 'dex',                     data: { site:"landing", state: "landing-dex" }, component: LandingHomePage },
      { path: 'kw',                      data: { site:"landing", state: "landing-kw" }, component: LandingHomePage },
      { path: 'wd',                      data: { site:"landing", state: "landing-wd" }, component: LandingHomePage },
      { path: 'wp',                      data: { site:"landing", state: "landing-wp" }, component: LandingHomePage },
      { path: 'q2',                      data: { site:"landing", state: "landing-q2" }, component: LandingHomePage },
    ]
  },
    
  { path: 'dex',                         data: { site:"dex", state: "dex" }, component: DexRootPage,
    children: [
      { path: '',                        data: { site:"dex", state: "dex" }, redirectTo: '/dex/home', pathMatch: 'full' },
      { path: 'home',                    data: { site:"dex", state: "dex-home"    }, component: DexHomePage    },
      { path: 'trade',                   data: { site:"dex", state: "dex-trade"   }, component: DexTradePage   },
      { path: 'trade/:comm/:curr',       data: { site:"dex", state: "dex-trade"   }, component: DexTradePage   },
      { path: 'tokens',                  data: { site:"dex", state: "dex-tokens"  }, component: DexTokensPage  },
      { path: 'token/:symbol',           data: { site:"dex", state: "dex-token"   }, component: DexTokenPage   },
      { path: 'markets',                 data: { site:"dex", state: "dex-markets" }, component: DexMarketsPage },
      { path: 'account',                 data: { site:"dex", state: "dex-account" }, component: DexAccountPage },
      { path: 'account/:name',           data: { site:"dex", state: "dex-account" }, component: DexAccountPage },
      { path: 'swap',                    data: { site:"dex", state: "dex-swap"    }, component: DexSwapPage    },
      { path: 'swap/:comm/:curr',        data: { site:"dex", state: "dex-swap"    }, component: DexSwapPage    },
      { path: 'swap/:comm/:curr/:amount',data: { site:"dex", state: "dex-swap"    }, component: DexSwapPage    },
    ]
  },


  { path: 'exchange',                    data: { site:"ex", state: "ex" }, component: ExRootPage,
    children: [
      { path: '',                        data: { site:"ex", state: "ex" }, redirectTo: '/exchange/home', pathMatch: 'full' },
      { path: 'home',                    data: { site:"ex", state: "ex-home" }, component: ExHomePage },
      { path: 'account',                 data: { site:"ex", state: "ex-guest" }, component: ExAccountPage },
      { path: 'account/:name',           data: { site:"ex", state: "ex-account" }, component: ExAccountPage },
    ]
  },


  { path: '**',                          data: { state: "404" }, component: NotFoundPage }
];



/*
const routes: Routes = [
  { path: '',                            data: { state: "root" }, redirectTo: '/exchange/home', pathMatch: 'full' },
  { path: 'exchange',                    data: { state: "root" }, component: RootPage,
    children: [
      { path: '',                        data: { state: "root" }, redirectTo: '/exchange/home', pathMatch: 'full' },
      { path: 'wp',                      data: { state: "wp" }, component: ComingSoonPage },
      { path: 'home',                    data: { state: "home" }, component: ComingSoonPage },
      { path: 'trade/:table',            data: { state: "trade" }, component: ComingSoonPage },
      { path: 'tokens',                  data: { state: "tokens" }, component: ComingSoonPage },
      { path: 'token/:symbol',           data: { state: "token" }, component: ComingSoonPage },
      { path: 'markets',                 data: { state: "markets" }, component: ComingSoonPage},
      { path: 'account',                 data: { state: "guest" }, component: ComingSoonPage},
      { path: 'account/:name',           data: { state: "account" }, component: ComingSoonPage }
    ]
  },
  { path: '**',                          data: { state: "404" }, component: NotFoundPage }
];
*/
@NgModule({
    imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
