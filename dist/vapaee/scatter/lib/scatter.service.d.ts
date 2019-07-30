import { Subject } from 'rxjs';
import { Feedback } from '@vapaee/feedback';
import { Asset } from './asset.class';
import { SmartContract } from './contract.class';
import { ScatterUtils } from './utils.class';
export interface RPC {
    endpoint: string;
    fetchBuiltin: Function;
    fetch: Function;
    get_abi: Function;
    get_account: Function;
    get_block_header_state: Function;
    get_block: Function;
    get_code: Function;
    get_currency_balance: Function;
    get_currency_stats: Function;
    get_info: Function;
    get_producer_schedule: Function;
    get_producers: Function;
    get_raw_code_and_abi: Function;
    getRawAbi: Function;
    get_table_rows: Function;
    getRequiredKeys: Function;
    push_transaction: Function;
    db_size_get: Function;
    history_get_actions: Function;
    history_get_transaction: Function;
    history_get_key_accounts: Function;
    history_get_controlled_accounts: Function;
}
export interface EOS {
    getInfo: Function;
    getAccount: Function;
    getCode: Function;
    getCodeHash: Function;
    getAbi: Function;
    getRawCodeAndAbi: Function;
    abiJsonToBin: Function;
    abiBinToJson: Function;
    getRequiredKeys: Function;
    getBlock: Function;
    getBlockHeaderState: Function;
    getTableRows: Function;
    getCurrencyBalance: Function;
    getCurrencyStats: Function;
    getProducers: Function;
    getProducerSchedule: Function;
    getScheduledTransactions: Function;
    pushBlock: Function;
    pushTransaction: Function;
    pushTransactions: Function;
    getActions: Function;
    getTransaction: Function;
    getKeyAccounts: Function;
    getControlledAccounts: Function;
    createTransaction: Function;
    transaction: Function;
    nonce: Function;
    transfer: Function;
    create: Function;
    issue: Function;
    bidname: Function;
    newaccount: Function;
    setcode: Function;
    setabi: Function;
    updateauth: Function;
    deleteauth: Function;
    linkauth: Function;
    unlinkauth: Function;
    canceldelay: Function;
    onerror: Function;
    buyrambytes: Function;
    sellram: Function;
    buyram: Function;
    delegatebw: Function;
    undelegatebw: Function;
    refund: Function;
    regproducer: Function;
    unregprod: Function;
    setram: Function;
    regproxy: Function;
    voteproducer: Function;
    claimrewards: Function;
    setpriv: Function;
    rmvproducer: Function;
    setalimits: Function;
    setglimits: Function;
    setprods: Function;
    reqauth: Function;
    setparams: Function;
    contract: Function;
}
export interface Scatter {
    identity: any;
    eosHook: Function;
    eos?: Function;
    network: any;
    forgotten?: boolean;
    isExtension: boolean;
    authenticate: Function;
    connect: Function;
    constructor: Function;
    createTransaction: Function;
    disconnect: Function;
    forgetIdentity: Function;
    getArbitrarySignature: Function;
    getIdentity: Function;
    getIdentityFromPermissions: Function;
    getPublicKey: Function;
    getVersion: Function;
    hasAccountFor: Function;
    isConnected: Function;
    isPaired: Function;
    linkAccount: Function;
    loadPlugin: Function;
    requestSignature: Function;
    requestTransfer: Function;
    suggestNetwork: Function;
}
export interface AccountData {
    account_name?: string;
    head_block_num?: number;
    head_block_time?: string;
    privileged?: false;
    last_code_update?: string;
    created?: string;
    core_liquid_balance?: string;
    core_liquid_balance_asset?: Asset;
    ram_quota?: number;
    net_weight?: number;
    cpu_weight?: number;
    total_balance: string;
    total_balance_asset: Asset;
    ram_limit?: {
        percentStr?: string;
        used?: number;
        available?: number;
        max?: number;
    };
    net_limit?: {
        percentStr?: string;
        used?: number;
        available?: number;
        max?: number;
    };
    cpu_limit?: {
        percentStr?: string;
        used?: number;
        available?: number;
        max?: number;
    };
    ram_usage?: number;
    permissions?: {
        perm_name?: string;
        parent?: string;
        required_auth?: {
            threshold?: 1;
            keys?: {
                key?: string;
                weight?: 1;
            }[];
            accounts?: any[];
            waits?: any[];
        };
    }[];
    total_resources?: {
        owner?: string;
        net_weight?: string;
        net_weight_asset?: Asset;
        cpu_weight?: string;
        cpu_weight_asset?: Asset;
        ram_bytes?: number;
    };
    self_delegated_bandwidth?: {
        from?: string;
        to?: string;
        total?: string;
        total_asset?: Asset;
        net_weight?: string;
        net_weight_asset?: Asset;
        cpu_weight?: string;
        cpu_weight_asset?: Asset;
    };
    refund_request?: {
        owner?: string;
        request_time?: string;
        total?: string;
        total_asset?: Asset;
        net_amount?: string;
        net_amount_asset?: Asset;
        cpu_amount?: string;
        cpu_amount_asset?: Asset;
    };
    voter_info?: {
        owner?: string;
        proxy?: string;
        producers?: string[];
        staked?: number;
        last_vote_weight?: string;
        proxied_vote_weight?: string;
        is_proxy?: number;
    };
    returnedFields?: null;
}
export interface Account {
    authority?: string;
    blockchain?: string;
    name: string;
    publicKey?: string;
    data?: AccountData;
}
export interface Endpoint {
    protocol: string;
    host: string;
    port: number;
}
export interface Eosconf {
    blockchain: string;
    protocol: string;
    host: string;
    port: number;
    chainId: string;
}
export interface Network {
    slug?: string;
    index?: number;
    eosconf?: Eosconf;
    explorer?: string;
    symbol: string;
    name: string;
    chainId: string;
    endpoints: Endpoint[];
}
export interface NetworkMap {
    [key: string]: Network;
}
export interface ScatterJSDef {
    plugins?: any;
    scatter?: any;
}
export declare class VapaeeScatter {
    private scatterutils;
    error: string;
    private appTitle;
    private symbol;
    private _connected;
    private lib;
    private rpc;
    feed: Feedback;
    private ScatterJS;
    private _network;
    private _networks;
    private _networks_slugs;
    private _account_queries;
    private eos;
    onNetworkChange: Subject<Network>;
    onLogggedStateChange: Subject<boolean>;
    _account: Account;
    private setReady;
    waitReady: Promise<any>;
    private setLogged;
    waitLogged: Promise<any>;
    private setConnected;
    waitConnected: Promise<any>;
    private setEosjs;
    waitEosjs: Promise<any>;
    private setEndpointsReady;
    waitEndpoints: Promise<any>;
    constructor();
    readonly utils: ScatterUtils;
    readonly account: Account;
    readonly default: Account;
    resetIdentity(): void;
    private setIdentity(identity);
    setEndpoints(endpoints: NetworkMap): void;
    setNetwork(name: string, index?: number): any;
    getNetwork(slug: string, index?: number): Network;
    readonly networks: string[];
    readonly network: Network;
    private resetPromises();
    initScatter(): void;
    reconnectTimer: any;
    reconnectTime: number;
    retryConnectingApp(): void;
    connectApp(appTitle?: string): Promise<any>;
    calculateTotalBalance(account: any): Asset;
    calculateResourceLimit(limit: any): any;
    queryAccountData(name: string): Promise<AccountData>;
    getSmartContract(account_name: any): SmartContract;
    getContractWrapper(account_name: any): Promise<any>;
    login(): Promise<any>;
    logout(): Promise<any>;
    readonly logged: boolean;
    readonly username: string;
    readonly authorization: any;
    readonly connected: boolean;
    getTableRows(contract: any, scope: any, table: any, tkey: any, lowerb: any, upperb: any, limit: any, ktype: any, ipos: any): Promise<any>;
}
