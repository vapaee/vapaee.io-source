import BigNumber from "bignumber.js";
import { Token } from "./token.class";
export declare class Asset {
    amount: BigNumber;
    token: Token;
    constructor(a?: any, b?: any);
    plus(b: Asset): Asset;
    minus(b: Asset): Asset;
    clone(): Asset;
    parse(text: string): void;
    valueToString(decimals?: number, total?: boolean): string;
    toNumber(): number;
    readonly str: string;
    toString(decimals?: number): string;
    inverse(token: Token): Asset;
}
