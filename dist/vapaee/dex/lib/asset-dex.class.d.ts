import BigNumber from 'bignumber.js';
import { TokenDEX } from './token-dex.class';
import { Asset } from '@vapaee/scatter';
export interface IVapaeeDEX {
    getTokenNow(symbol: string): TokenDEX;
}
export declare class AssetDEX extends Asset {
    amount: BigNumber;
    token: TokenDEX;
    constructor(a?: any, b?: any);
    clone(): AssetDEX;
    plus(b: AssetDEX): AssetDEX;
    minus(b: AssetDEX): AssetDEX;
    parseDex(text: string, dex: IVapaeeDEX): void;
    toString(decimals?: number): string;
    inverse(token: TokenDEX): AssetDEX;
}
