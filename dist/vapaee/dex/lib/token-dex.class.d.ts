import { Token } from '@vapaee/scatter';
import { AssetDEX } from "./asset-dex.class";
export declare class TokenDEX extends Token {
    appname: string;
    website: string;
    logo: string;
    logolg: string;
    verified: boolean;
    fake: boolean;
    offchain: boolean;
    scope: string;
    stat?: {
        supply: string;
        max_supply: string;
        issuer?: string;
        owner?: string;
        issuers?: string[];
    };
    summary?: {
        volume: AssetDEX;
        price: AssetDEX;
        price_24h_ago: AssetDEX;
        percent?: number;
        percent_str?: string;
    };
    constructor(obj?: any);
}
