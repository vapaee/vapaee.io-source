export declare class Token {
    private _str?;
    private _symbol;
    private _precision?;
    private _contract?;
    constructor(obj?: any);
    readonly symbol: string;
    readonly precision: number;
    readonly contract: string;
    readonly str: string;
    toString(): string;
}
