import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EosioTokenMathService } from './eosio.token-math.service';
import { Feedback } from './feedback.service';

// scatter libraries
/*/
// eosjs2
import ScatterJS from '@scatterjs/core';
import ScatterEOS from '@scatterjs/eosjs2';
import ScatterLynx from '@scatterjs/lynx';
import {JsonRpc, Api} from 'eosjs';
/*/
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs'
import Eos from 'eosjs';
//*/

// declare var ScatterJS:any;

// eosjs2
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

/*
// eosjs2
export interface EOS {
    contracts: Function;
    cachedAbis: Function;
    rpc: Function;
    authorityProvider: Function;
    abiProvider: Function;
    signatureProvider: Function;
    chainId: Function;
    textEncoder: Function;
    textDecoder: Function;
    abiTypes: Function;
    transactionTypes: Function;
    rawAbiToJson: Function;
    getCachedAbi: Function;
    getAbi: Function;
    getTransactionAbis: Function;
    getContract: Function;
    serialize: Function;
    deserialize: Function;
    serializeTransaction: Function;
    deserializeTransaction: Function;
    serializeActions: Function;
    deserializeActions: Function;
    deserializeTransactionWithActions: Function;
    transact: Function;
    pushSignedTransaction: Function;
    hasRequiredTaposFields: Function;    
}
/*/
export interface EOS {
    getInfo:Function,
    getAccount:Function,
    getCode:Function,
    getCodeHash:Function,
    getAbi:Function,
    getRawCodeAndAbi:Function,
    abiJsonToBin:Function,
    abiBinToJson:Function,
    getRequiredKeys:Function,
    getBlock:Function,
    getBlockHeaderState:Function,
    getTableRows:Function,
    getCurrencyBalance:Function,
    getCurrencyStats:Function,
    getProducers:Function,
    getProducerSchedule:Function,
    getScheduledTransactions:Function,
    pushBlock:Function,
    pushTransaction:Function,
    pushTransactions:Function,
    getActions:Function,
    getTransaction:Function,
    getKeyAccounts:Function,
    getControlledAccounts:Function,
    createTransaction:Function,
    transaction:Function,
    nonce:Function,
    transfer:Function,
    create:Function,
    issue:Function,
    bidname:Function,
    newaccount:Function,
    setcode:Function,
    setabi:Function,
    updateauth:Function,
    deleteauth:Function,
    linkauth:Function,
    unlinkauth:Function,
    canceldelay:Function,
    onerror:Function,
    buyrambytes:Function,
    sellram:Function,
    buyram:Function,
    delegatebw:Function,
    undelegatebw:Function,
    refund:Function,
    regproducer:Function,
    unregprod:Function,
    setram:Function,
    regproxy:Function,
    voteproducer:Function,
    claimrewards:Function,
    setpriv:Function,
    rmvproducer:Function,
    setalimits:Function,
    setglimits:Function,
    setprods:Function,
    reqauth:Function,
    setparams:Function,
    contract:Function
}
//*/

export interface Scatter {
    identity: any,
    eosHook: Function;
    eos?:Function,
    network: any;
    // -----------------
    
    forgotten?:boolean, // was forgetIdentity executed?
    
    isExtension: boolean,
    // -----------------
    authenticate: Function,
    connect: Function,
    constructor: Function,
    createTransaction: Function,
    disconnect: Function,
    forgetIdentity: Function,
    getArbitrarySignature: Function,
    getIdentity: Function,
    getIdentityFromPermissions: Function,
    getPublicKey: Function,
    getVersion: Function,
    hasAccountFor: Function,
    isConnected: Function,
    isPaired: Function,
    linkAccount: Function,
    loadPlugin: Function,
    requestSignature: Function,
    requestTransfer: Function,
    suggestNetwork: Function
}

export interface AccountData {
    dummie?: boolean,
    account_name?: string,
    head_block_num?: number,
    head_block_time?: string,
    privileged?: false,
    last_code_update?: string,
    created?: string,
    core_liquid_balance?: string,
    ram_quota?: number,
    net_weight?: number,
    cpu_weight?: number,
    total_balance: string,
    ram_limit?: {
        percentStr?: string,
        used?: number,
        available?: number,
        max?: number
    },
    net_limit?: {
        percentStr?: string,
        used?: number,
        available?: number,
        max?: number
    },
    cpu_limit?: {
        percentStr?: string,
        used?: number,
        available?: number,
        max?: number
    },
    ram_usage?: number,
    permissions?: {
        perm_name?: string,
        parent?: string,
        required_auth?: {
            threshold?: 1,
            keys?: {
                key?: string,
                weight?: 1
            }[],
            accounts?: any[],
            waits?: any[]
        }
    }[],
    total_resources?: {
        owner?: string,
        net_weight?: string,
        cpu_weight?: string,
        ram_bytes?: number
    },
    self_delegated_bandwidth?: {
        from?: string,
        to?: string,
        total?: string,
        net_weight?: string,
        cpu_weight?: string
    },
    refund_request?: {
        owner?: string,
        total?: string,
        request_time?: string,
        net_amount?: string,
        cpu_amount?: string
    },
    voter_info?: {
        owner?: string,
        proxy?: string,
        producers?: string[],
        staked?: number,
        last_vote_weight?: string,
        proxied_vote_weight?: string,
        is_proxy?: number
    },
    returnedFields?: null
}

export interface Account {
    authority?: string,
    blockchain?: string,
    name: string,
    publicKey?: string,
    data?: AccountData
}

export interface Endpoint {
    protocol:string,
    host:string,
    port:number
}

export interface Eosconf {
    blockchain:string,
    protocol:string,
    host:string,
    port:number,
    chainId:string
}

export interface Network {
    slug?: string,
    index?: number,
    eosconf?: Eosconf,
    explorer?: string,
    symbol: string,
    name: string,
    chainId:string,
    endpoints: Endpoint[]
}

export interface ScatterJSDef {
    plugins?:any,
    scatter?:any
}


@Injectable()
export class ScatterService {
    
    public error: string;
    private appTitle: string;
    private symbol: string;
    private _connected: boolean;
    private lib: Scatter;
    private rpc: RPC;
    public feed: Feedback;
    private ScatterJS: ScatterJSDef;
    private _network: Network;
    private _networks: {[key:string]:Network};
    private _networks_slugs: string[];
    private _account_queries: {[key:string]:Promise<AccountData>};
    private eos: EOS;
    public onNetworkChange:Subject<Network> = new Subject();
    public onLogggedStateChange:Subject<boolean> = new Subject();
    public _account: Account;
    private setReady: Function;
    public waitReady: Promise<any> = new Promise((resolve) => {
        this.setReady = resolve;
    });
    private setLogged: Function;
    public waitLogged: Promise<any> = new Promise((resolve) => {
        this.setLogged = resolve;
    });
    private setConnected: Function;
    public waitConnected: Promise<any> = new Promise((resolve) => {
        this.setConnected = resolve;
    });
    private setEosjs: Function;
    public waitEosjs: Promise<any> = new Promise((resolve) => {
        this.setEosjs = resolve;
    });
    private setEndpoints: Function;
    public waitEndpoints: Promise<any> = new Promise((resolve) => {
        this.setEndpoints = resolve;
    });    
    
    constructor(
        private http: HttpClient,
        public tokenMath: EosioTokenMathService
    ) {
        this.feed = new Feedback();
        this._networks_slugs = [];
        this._networks = {};
        this._network = {
            "name": "EOS MainNet",
            "symbol": "EOS",
            "explorer": "https://www.bloks.io",
            "chainId":"aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
            "endpoints": [{
                "protocol":"https",
                "host":"nodes.get-scatter.com",
                "port":443
            }]
        };
        
        this.symbol = "EOS";
        //this.waitReady.then(() => console.log("ScatterService.setReady()"));
        // console.error("scatter interrumpido --------------------------------");
        this.http.get<any>("assets/endpoints.json").toPromise().then((response) => {
            this._networks = response;
            for (var i in this._networks) {
                this._networks_slugs.push(i);
            }
            this.setEndpoints();
        });
        this._account_queries = {};
    }

    get account(): Account {
        if (!this._account || !this._account.name) {
            if (this.lib && this.lib.identity && this.lib.identity.accounts) {
                this._account = this.lib.identity.accounts.find(x => x.blockchain === "eos" || x.blockchain === "tlos");
            }            
        }        
        return this._account;
    }

    get default(): Account {
        return {
            name:'guest',
            data: {
                total_balance: "",
                cpu_limit: {},
                net_limit: {},
                ram_limit: {},
                refund_request: {},
                total_resources: {}
            }
        }
    }    

    setNetwork(name:string, index: number = 0) {
        console.log("ScatterService.setNetwork("+name+","+index+")");
        return this.waitEndpoints.then(() => {
            var n = this.getNetwork(name, index);
            if (n) {
                if (this._network.name != n.name) {
                    this._network = n;
                    this.resetIdentity();
                    this.initScatter();
                    this.onNetworkChange.next(this.getNetwork(name));
                }
            } else {
                console.error("ERROR: Scatter.setNetwork() unknown network name-index. Got ("
                    + name + ", " + index + "). Availables are:", this._networks);
                console.error("Falling back to eos mainnet");
                return this.setNetwork("eos");
            }    
        });
    }

    getNetwork(slug:string, index: number = 0): Network {
        if (this._networks[slug]) {
            if (this._networks[slug].endpoints.length > index && index >= 0) {
                var network: Network = this._networks[slug];
                var endpoint:Endpoint = network.endpoints[index];
                network.slug = slug;
                network.index = index;
                network.eosconf = {
                    blockchain: "eos",
                    chainId: network.chainId,
                    host: endpoint.host,
                    port: endpoint.port,
                    protocol: endpoint.protocol,
                }                
                return network;
            } else {
                console.error("ERROR: Scatter.getNetwork() index out of range. Got "
                    + index + " expected number between [0.."+this._networks[slug].endpoints.length+"]", );
            }            
        } else {
            console.error("ERROR: Scatter.getNetwork() unknown network slug. Got "
                + slug + " expected one of", this.networks);
        }
        return null;
    }

    get networks(){
        return this._networks_slugs;
    }

    get network(): Network {
        return this._network;
    }

    resetIdentity() {
        console.log("ScatterService.resetIdentity()");
        this.error = "";
        if (this.lib) {
            this.lib.identity = null;
            if (!this.lib.forgotten) {
                this.lib.forgotten = true;
                this.lib.forgetIdentity();
            }
        }
        this.onLogggedStateChange.next(true);
    }

    private resetPromises() {
        console.error("ScatterService.resetPromises()");
        this.waitEosjs.then(r => {
            this.waitEosjs = null;
            var p = new Promise((resolve) => {
                if (this.waitEosjs) return;
                this.waitEosjs = p;
                this.setEosjs = resolve;
                this.resetPromises();
            });
        });
        this.waitConnected.then(r => {
            this.waitConnected = null;
            var p = new Promise((resolve) => {
                if (this.waitConnected) return;
                this.waitConnected = p;
                this.setConnected = resolve;
                this.resetPromises();
            });
        });
        this.waitReady.then(r => {
            this.waitReady = null;
            var p = new Promise((resolve) => {
                if (this.waitReady) return;
                this.waitReady = p;
                this.setReady = resolve;
                this.resetPromises();
                //this.waitReady.then(() => console.log("ScatterService.setReady()"));                
            });
        });
        this.waitLogged.then(r => {
            this.waitLogged = null;
            var p = new Promise((resolve) => {
                if (this.waitLogged) return;
                this.waitLogged = p;
                this.setLogged = resolve;
                this.resetPromises();
            });
        });
    }

    initScatter() {
        console.log("ScatterService.initScatter()");
        /*/
        this.error = "";
        if ((<any>window).ScatterJS) {
            this.ScatterJS = (<any>window).ScatterJS;
            (<any>window).ScatterJS = null;
        }

        try {
            ScatterJS.plugins( new ScatterEOS() );
        } catch (e) {
            console.error("ERROR:", e.message, [e]);
            console.error("Falling back to normal ScatterEOS plugin");
            ScatterJS.plugins( new ScatterEOS() );
        }
         
        this.lib = ScatterJS.scatter;

        const network = ScatterJS.Network.fromJson(this.network.eosconf);
        this.rpc = new JsonRpc(network.fullhost());
        this.eos = this.lib.eos(network, Api, {rpc:this.rpc});

        this.setEosjs("eosjs");
        /*/
        console.log("ScatterService.initScatter()");
        this.error = "";
        if ((<any>window).ScatterJS) {
            this.ScatterJS = (<any>window).ScatterJS;
            this.ScatterJS.plugins( new ScatterEOS() );
            this.lib = this.ScatterJS.scatter;  
            (<any>window).ScatterJS = null;
        }
        console.log("EOSJS()",[this.network.eosconf]);
        this.eos = this.lib.eos(this.network.eosconf, Eos, { expireInSeconds:60 });
        this.setEosjs("eosjs");
        //*/
    }

    reconnectTimer;
    reconnectTime = 100;
    retryConnectingApp() {
        clearInterval(this.reconnectTimer);
        this.reconnectTimer = setInterval(_ => {
            // console.log("ScatterService.reconnectTimer()");
            if (this._connected) {
                // console.error("ScatterService.retryConnectingApp() limpio el intervalo");
                clearInterval(this.reconnectTimer);
            } else {
                if (this.account) {
                    // console.error("ScatterService.retryConnectingApp()  existe account pero no está conectado");
                    this.connectApp();
                }
            }
        },this.reconnectTime);
        this.reconnectTime += 1000*Math.random();
        if (this.reconnectTime > 4000) this.reconnectTime = 4000;
    }

    // connect_count: number = 0;
    connectApp(appTitle:string = "") {
        // this.connect_count++;
        // var resolve_num = this.connect_count;
        this.feed.setLoading("connect", true);
        if (appTitle != "") this.appTitle = appTitle;
        console.log(`ScatterService.connectApp(${this.appTitle})`);
        const connectionOptions = {initTimeout:1800}
        if (this._connected) return Promise.resolve(); // <---- avoids a loop
        var promise = new Promise<any>((resolve, reject) => {
            this.waitConnected.then(resolve);
            if (this._connected) return; // <---- avoids a loop
            this.waitEosjs.then(() => {
                console.log("ScatterService.waitEosjs() eos OK");
                this.lib.connect(this.appTitle, connectionOptions).then(connected => {
                    // si está logueado this.lib.identity se carga sólo y ya está disponible
                    console.log("ScatterService.lib.connect()", connected);
                    this._connected = connected;
                    if(!connected) {
                        this.feed.setError("connect", "ERROR: can not connect to Scatter. Is it up and running?");
                        console.error(this.feed.error("connect"));
                        reject(this.feed.error("connect"));
                        this.feed.setLoading("connect", false);
                        this.retryConnectingApp();
                        return false;
                    }
                    // Get a proxy reference to eosjs which you can use to sign transactions with a user's Scatter.
                    console.log("ScatterService.setConnected()");
                    this.setConnected("connected");
                    this.feed.setLoading("connect", false);
                    if (this.logged) {
                        this.login().then(() => {
                            console.log("ScatterService.setReady()");
                            this.setReady("ready");
                        }).catch(reject);
                    } else {
                        console.log("ScatterService.setReady()");
                        this.setReady("ready");
                    }
                }).catch(e => {
                    console.error(e);
                    this.feed.setLoading("connect", false);
                    throw e;
                });    
            });    
        });
        return promise;
    }

    private setIdentity(identity:any) {
        console.log("ScatterService.setIdentity()", [identity]);
        console.assert(!!this.lib, "ERROR: no instance of scatter found");
        this.error = "";
        this.lib.identity = identity;
        this.lib.forgotten = false;
        this._account = this.lib.identity.accounts.find(x => x.blockchain === "eos" || x.blockchain === "tlos");
        if (!this.account) {
            console.error("ScatterService.setIdentity()", [identity]);
        }
        // console.log("ScatterService.setIdentity() -> ScatterService.queryAccountData() : " , [this.account.name]);
        this.queryAccountData(this.account.name).then(account => {
            this.account.data = account;
            this.onLogggedStateChange.next(true);
        }).catch(_ => {
            this.account.data = this.default.data;
            this.onLogggedStateChange.next(true);
        });
    }

    // ----- account data (resources, staking, refunding) -------
    // extract the float part of an valid asset string representation like: "123.2424 EOS" -> returns 123.2424
    private extractNumber (balance) {
        if(typeof balance != "string") {
            // console.log("extractNumber() " , balance);
            return 0;
        }
        return parseFloat(balance.split(" ")[0]);
    }

    // add balance1 to balance2 and return de result
    private add(balance1:string, balance2:string) {
        // console.log("add(",balance1, balance2, ")");
        var symbol = balance1.split(" ")[1];
        var sym2 = balance2.split(" ")[1];
        console.assert(sym2 == symbol, "ERROR: adding two different Tokens", balance1, balance2);
        var v1 = this.extractNumber(balance1), v2 = this.extractNumber(balance2);
        var tot = (v1 + v2) + "";
        if (tot.indexOf(".") != -1) {
            tot  = (tot + "0000").substr(0, tot.length + 4 - tot.indexOf("."));
        } else {
            tot  += ".0000";
        }
        tot += " " + symbol;
        // console.log("add(",balance1, balance2, ") --> ", tot);
        return tot;
    }

    calculateTotalBalance(account) {
        return this.tokenMath.addAll([
            account.core_liquid_balance,
            account.refund_request.net_amount,
            account.refund_request.cpu_amount,
            account.self_delegated_bandwidth.cpu_weight,
            account.self_delegated_bandwidth.net_weight
        ]);
    }

    calculateResourceLimit(limit) {
        limit = Object.assign({
            max: 0, used: 0
        }, limit);
        
        if (limit.max != 0) {
            limit.percent = 1 - (Math.min(limit.used, limit.max) / limit.max);
        } else {
            limit.percent = 0;
        }
        limit.percentStr = Math.round(limit.percent*100) + "%";
        return limit;
    }

    // ----- account data (end) -------

    queryAccountData(name:string): Promise<AccountData> {
        /*
        // get_table_rows
            code: "eosio"
            index_position: 1
            json: true
            key_type: "i64"
            limit: -1
            lower_bound: null
            scope: "gqydoobuhege"
            table: "delband"
            table_key: ""
        */
        console.log("ScatterService.queryAccountData("+name+") ");
        this._account_queries[name] = this._account_queries[name] || new Promise<AccountData>((resolve, reject) => {
            // console.log("PASO 1 ------", [this._account_queries])
            this.waitEosjs.then(() => {
                // console.log("PASO 2 (eosjs) ------");
                
                /*
                // eosjs2
                this.rpc.get_account(name).
                /*/
                this.eos.getAccount({account_name: name}).
                //*/
                
                then((response) => {
                    // console.log("PASO 3 (eosjs.getAccount) ------", response);
                    var accountdata: AccountData = <AccountData>response;

                    if (accountdata.core_liquid_balance) {
                        this.symbol = accountdata.core_liquid_balance.split(" ")[1];
                    } else {
                        accountdata.core_liquid_balance = "0.0000 " + this.symbol;
                    }
                    
                    // --
                    accountdata.refund_request = accountdata.refund_request || {
                        total: "0.0000 " + this.symbol,
                        net_amount: "0.0000 " + this.symbol,
                        cpu_amount: "0.0000 " + this.symbol,
                        request_time: "2018-11-18T18:09:53"
                    }
                    
                    accountdata.refund_request.total =
                        this.add(accountdata.refund_request.net_amount, accountdata.refund_request.cpu_amount);

                    // --
                    accountdata.self_delegated_bandwidth = accountdata.self_delegated_bandwidth || {
                        total: "0.0000 " + this.symbol,
                        net_weight: "0.0000 " + this.symbol,
                        cpu_weight: "0.0000 " + this.symbol
                    }
                    accountdata.self_delegated_bandwidth.total =
                        this.add(accountdata.self_delegated_bandwidth.net_weight, accountdata.self_delegated_bandwidth.cpu_weight);

                    // --
                    accountdata.total_resources = accountdata.total_resources || {
                        net_weight: "0.0000 " + this.symbol,
                        cpu_weight: "0.0000 " + this.symbol
                    }
                    
                    accountdata.total_balance = this.calculateTotalBalance(accountdata);
                    accountdata.cpu_limit = this.calculateResourceLimit(accountdata.cpu_limit);
                    accountdata.net_limit = this.calculateResourceLimit(accountdata.net_limit);
                    accountdata.ram_limit = this.calculateResourceLimit({
                        max: accountdata.ram_quota, used: accountdata.ram_usage
                    });

                    resolve(accountdata);
                }).catch((err) => {
                    reject(err);
                });
                
            }).catch((error) => {
                console.error(error);
                reject(error);
            });
        });

        var promise = this._account_queries[name];
        promise.then((r) => {
            setTimeout(() => {
                delete this._account_queries[r.account_name];
            });
        });
        
        return promise;
    }

    /*
    // eosjs2
    async executeTransaction(contract:string, action:string, data:any) {
        return new Promise((resolve, reject) => {
            this.login().then(_ => {
                this.waitReady.then(() => {
                    
                    this.eos.transact(
                        {
                            actions: [{
                                account: contract,
                                name: action,
                                data: data,
                                authorization: [{
                                    actor: this.account.name,
                                    permission: this.account.authority
                                }],                            
                            }]
                        },
                        {
                            blocksBehind: 3,
                            expireSeconds: 30
                        }                        
                    ).then(result => {
                        console.log("EXITO !!!!", result);
                        resolve(result);
                    }).catch((error) => {
                        console.error("ERROR !!!!", error);
                        reject(error);
                    }); 


                });
            }).catch((error) => {
                console.error(error);
                reject(error);
            });   
        }); 
    }
    */


    /*
    
    {
        actions: [{
            account: this.contractAccount,
            name: action,
            authorization: [{
                actor: this.account.name,
                permission: this.account.authority
            }],
            data: {
              ...data
            }
        }]
    },
    {
        blocksBehind: 3,
        expireSeconds: 30
    }    
    */

    
    getContract(account_name): Promise<any> {
        console.log(`ScatterService.getContract(${account_name})`);
        return new Promise((resolve, reject) => {
            this.login().then((a) => {
                console.log("this.login().then((a) => { -->", a );
                this.waitReady.then(() => {
                    
                    this.eos.contract(account_name).then(contract => {
                        console.log(`-- contract ${account_name} --`);
                        for (var i in contract) {
                            if(typeof contract[i] == "function") console.log("contract."+i+"()", [contract[i]]);
                        }
                        resolve(contract);
                    }).catch(error => {
                        console.error(error);
                    });
                    
                });
            }).catch((error) => {
                console.error(error);
                reject(error);
            });   
        }); 
    }
    

    /*
    transfer(from:string, to:string, amount:string, memo:string) {
        console.log("ScatterService.transfer()", from, to, amount, memo);
        return new Promise((resolve, reject) => {
            this.waitEosjs.then(() => {
                console.log("Scatter.transfer():", from, to, amount, memo, this.authorization);
                
                this.eos.transfer(from, to, amount, memo, this.authorization).then(trx => {
                    // That's it!
                    console.log(`Transaction ID: ${trx.transaction_id}`, trx);
                    // en Notas está el json que describe el objeto trx
                    resolve(trx);
                }).catch(error => {
                    console.error(error);
                });
                
            }).catch((error) => {
                console.error(error);
                reject(error);
            });   
        });
    }
    */

    // loginTimer;
    login() {
        console.log("ScatterService.login()");
        this.feed.setLoading("login", true);
        return new Promise<any>((resolve, reject) => {
            if (this.lib.identity) {
                this.setIdentity(this.lib.identity);
                resolve(this.lib.identity);
            } else {
                var loginTimer = setTimeout( _ => {
                    this.feed.setLoading("login", false);
                    reject("connection timeout");
                }, 5000);
                this.connectApp().then(() => {
                    this.lib.getIdentity({"accounts":[this.network.eosconf]})
                        .then( (identity)  => {
                            clearTimeout(loginTimer);
                            this.setIdentity(identity);
                            this.setLogged();
                            this.feed.setLoading("login", false);
                            resolve(identity);                            
                        })
                        .catch(reject);
                }).catch(reject);    
            }
        });
    }

    logout() {
        console.log("ScatterService.logout()");
        this.feed.setLoading("login", false);
        return new Promise<any>((resolve, reject) => {
            this.connectApp().then(() => {
                this.lib.forgotten = true;
                this.lib.forgetIdentity()
                    .then( (err)  => {
                        console.log("disconnect", err);
                        this.resetIdentity();
                        this.feed.setLoading("login", false);
                        resolve("logout");
                    })
                    .catch(reject);
            }).catch(reject);    
        });
    }

    get logged(): boolean {
        if (!this.lib) return false;
        return !!this.lib.identity;
    }

    get username(): string {
        if (!this.lib) return "";
        return this.lib.identity ? this.lib.identity.name : "";
    }

    get authorization(): any {
        if (!this.account)  {
            console.error("ScatterService.authorization()");
            return { authorization:["unknown@unknown"] }
        }
        return {
            authorization:[`${this.account.name}@${this.account.authority}`]
        };
    }

    get connected(): boolean {
        return this._connected;
    }

    getTableRows(contract, scope, table, tkey, lowerb, upperb, limit, ktype, ipos): Promise<any> {
        /*
        // console.log("ScatterService.getTableRows()");
        // https://github.com/EOSIO/eosjs-api/blob/master/docs/api.md#eos.getTableRows
        return new Promise<any>((resolve, reject) => {
            this.waitEosjs.then(() => {
                var json = {
                    code: contract,
                    index_position: ipos,
                    json: true,
                    key_type: ktype,
                    limit: limit,
                    lower_bound: lowerb,
                    scope: scope,
                    table: table,
                    table_key: tkey,
                    upper_bound: upperb
                }
                
                this.rpc.get_table_rows(json).then(_data => {
                    resolve(_data);
                }).catch(error => {
                    console.error(error);
                });

                
            }).catch((error) => {
                console.error(error);
                reject(error);
            });   
        });
        /*/
        // console.log("ScatterService.getTableRows()");
        // https://github.com/EOSIO/eosjs-api/blob/master/docs/api.md#eos.getTableRows
        return new Promise<any>((resolve, reject) => {
            this.waitEosjs.then(() => {
                this.eos.getTableRows(true, contract, scope, table, tkey, lowerb, upperb, limit, ktype, ipos).then(function (_data) {
                    resolve(_data);
                }).catch(error => {
                    console.error(error);
                });
            }).catch((error) => {
                console.error(error);
                reject(error);
            });   
        });
        //*/

    }

}
