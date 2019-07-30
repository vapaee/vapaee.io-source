import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { TokenDEX } from './token-dex.class';
import { AssetDEX } from './asset-dex.class';
import { Feedback } from '@vapaee/feedback';
import { VapaeeScatter, Account, SmartContract } from '@vapaee/scatter';
export declare class VapaeeDEX {
    private scatter;
    private cookies;
    private datePipe;
    loginState: string;
    private _markets;
    private _reverse;
    zero_telos: AssetDEX;
    telos: TokenDEX;
    tokens: TokenDEX[];
    contract: SmartContract;
    feed: Feedback;
    current: Account;
    last_logged: string;
    contract_name: string;
    deposits: AssetDEX[];
    balances: AssetDEX[];
    userorders: UserOrdersMap;
    onLoggedAccountChange: Subject<string>;
    onCurrentAccountChange: Subject<string>;
    onHistoryChange: Subject<string>;
    onMarketSummary: Subject<MarketSummary>;
    onTokensReady: Subject<TokenDEX[]>;
    onMarketReady: Subject<TokenDEX[]>;
    onTradeUpdated: Subject<any>;
    vapaeetokens: string;
    activityPagesize: number;
    activity: {
        total: number;
        events: {
            [id: string]: EventLog;
        };
        list: EventLog[];
    };
    private setOrderSummary;
    waitOrderSummary: Promise<any>;
    private setTokenStats;
    waitTokenStats: Promise<any>;
    private setMarketSummary;
    waitMarketSummary: Promise<any>;
    private setTokenSummary;
    waitTokenSummary: Promise<any>;
    private setTokensLoaded;
    waitTokensLoaded: Promise<any>;
    constructor(scatter: VapaeeScatter, cookies: CookieService, datePipe: DatePipe);
    readonly default: Account;
    readonly logged: string;
    readonly account: Account;
    login(): Promise<void>;
    logout(): void;
    onLogout(): void;
    onLogin(name: string): void;
    onLoggedChange(): void;
    resetCurrentAccount(profile: string): Promise<void>;
    private updateLogState();
    private getAccountData(name);
    createOrder(type: string, amount: AssetDEX, price: AssetDEX): Promise<any>;
    cancelOrder(type: string, comodity: TokenDEX, currency: TokenDEX, orders: number[]): Promise<any>;
    deposit(quantity: AssetDEX): Promise<any>;
    withdraw(quantity: AssetDEX): Promise<any>;
    addOffChainToken(offchain: TokenDEX): void;
    hasScopes(): boolean;
    market(scope: string): Market;
    table(scope: string): Market;
    private reverse(scope);
    marketFor(comodity: TokenDEX, currency: TokenDEX): Market;
    tableFor(comodity: TokenDEX, currency: TokenDEX): Market;
    createReverseTableFor(scope: string): Market;
    getScopeFor(comodity: TokenDEX, currency: TokenDEX): string;
    inverseScope(scope: string): string;
    canonicalScope(scope: string): string;
    isCanonical(scope: string): boolean;
    getBalance(token: TokenDEX): AssetDEX;
    getSomeFreeFakeTokens(symbol?: string): Promise<string>;
    getTokenNow(sym: string): TokenDEX;
    getToken(sym: string): Promise<TokenDEX>;
    getDeposits(account?: string): Promise<any>;
    getBalances(account?: string): Promise<any>;
    getThisSellOrders(table: string, ids: number[]): Promise<any[]>;
    getUserOrders(account?: string): Promise<UserOrdersMap>;
    updateActivity(): Promise<void>;
    loadMoreActivity(): Promise<void>;
    updateTrade(comodity: TokenDEX, currency: TokenDEX, updateUser?: boolean): Promise<any>;
    updateCurrentUser(): Promise<any>;
    private getBlockHistoryTotalPagesFor(scope, pagesize);
    private getHistoryTotalPagesFor(scope, pagesize);
    private getActivityTotalPages(pagesize);
    getTransactionHistory(comodity: TokenDEX, currency: TokenDEX, page?: number, pagesize?: number, force?: boolean): Promise<any>;
    private auxHourToLabel(hour);
    getBlockHistory(comodity: TokenDEX, currency: TokenDEX, page?: number, pagesize?: number, force?: boolean): Promise<any>;
    getSellOrders(comodity: TokenDEX, currency: TokenDEX, force?: boolean): Promise<any>;
    getBuyOrders(comodity: TokenDEX, currency: TokenDEX, force?: boolean): Promise<any>;
    getOrderSummary(): Promise<any>;
    getTableSummary(comodity: TokenDEX, currency: TokenDEX, force?: boolean): Promise<MarketSummary>;
    getAllTablesSumaries(): Promise<any>;
    private auxProcessRowsToOrders(rows);
    private auxGetLabelForHour(hh);
    private auxAssertScope(scope);
    private fetchDeposits(account);
    private fetchBalances(account);
    private fetchOrders(params);
    private fetchOrderSummary();
    private fetchBlockHistory(scope, page?, pagesize?);
    private fetchHistory(scope, page?, pagesize?);
    private fetchActivity(page?, pagesize?);
    private fetchUserOrders(user);
    private fetchSummary(scope);
    private fetchTokenStats(token);
    private fetchTokensStats(extended?);
    private updateTokensSummary(times?);
    private fetchTokens(extended?);
    private resortTokens();
}
export interface MarketMap {
    [key: string]: Market;
}
export interface Market {
    scope: string;
    comodity: TokenDEX;
    currency: TokenDEX;
    deals: number;
    blocks: number;
    blocklevels: any[][][];
    blocklist: any[][];
    reverselevels: any[][][];
    reverseblocks: any[][];
    block: {
        [id: string]: HistoryBlock;
    };
    orders: TokenOrders;
    history: HistoryTx[];
    tx: {
        [id: string]: HistoryTx;
    };
    summary: MarketSummary;
    header: MarketHeader;
}
export interface MarketSummary {
    scope: string;
    price: AssetDEX;
    inverse: AssetDEX;
    price_24h_ago: AssetDEX;
    inverse_24h_ago: AssetDEX;
    min_price?: AssetDEX;
    max_price?: AssetDEX;
    min_inverse?: AssetDEX;
    max_inverse?: AssetDEX;
    volume: AssetDEX;
    amount?: AssetDEX;
    percent?: number;
    percent_str?: string;
    ipercent?: number;
    ipercent_str?: string;
    records?: any[];
}
export interface MarketHeader {
    sell: OrdersSummary;
    buy: OrdersSummary;
}
export interface OrdersSummary {
    total: AssetDEX;
    orders: number;
}
export interface TokenOrders {
    sell: OrderRow[];
    buy: OrderRow[];
}
export interface HistoryTx {
    id: number;
    str: string;
    price: AssetDEX;
    inverse: AssetDEX;
    amount: AssetDEX;
    payment: AssetDEX;
    buyfee: AssetDEX;
    sellfee: AssetDEX;
    buyer: string;
    seller: string;
    date: Date;
    isbuy: boolean;
}
export interface EventLog {
    id: number;
    user: string;
    event: string;
    params: string;
    date: Date;
    processed?: any;
}
export interface HistoryBlock {
    id: number;
    hour: number;
    str: string;
    price: AssetDEX;
    inverse: AssetDEX;
    entrance: AssetDEX;
    max: AssetDEX;
    min: AssetDEX;
    volume: AssetDEX;
    amount: AssetDEX;
    date: Date;
}
export interface Order {
    id: number;
    price: AssetDEX;
    inverse: AssetDEX;
    total: AssetDEX;
    deposit: AssetDEX;
    telos: AssetDEX;
    owner: string;
}
export interface UserOrdersMap {
    [key: string]: UserOrders;
}
export interface UserOrders {
    table: string;
    ids: number[];
    orders?: any[];
}
export interface OrderRow {
    str: string;
    price: AssetDEX;
    orders: Order[];
    inverse: AssetDEX;
    total: AssetDEX;
    sum: AssetDEX;
    sumtelos: AssetDEX;
    telos: AssetDEX;
    owners: {
        [key: string]: boolean;
    };
}
