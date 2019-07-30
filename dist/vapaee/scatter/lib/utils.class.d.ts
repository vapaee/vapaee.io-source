import BigNumber from "bignumber.js";
export interface SlugId {
    low?: string;
    str?: string;
    top?: string;
}
export interface Work {
    items: any[];
    containers: any[];
}
export interface Profile {
    id?: string;
    slugid: SlugId;
    account: string;
    containers?: any[];
    work?: Work;
}
export declare class ScatterUtils {
    code_0: number;
    code_1: number;
    code_4: number;
    code_9: number;
    code_a: number;
    code_f: number;
    code_z: number;
    constructor();
    decodeNibble(nib: number): number[];
    encodeNibble(index: number, bits: number[]): string;
    decodeUint64(_num: string): number[];
    encodeUnit64(bits: number[]): SlugId;
    extractLength(bits: number[]): number;
    insertLength(bits: number[], length: number): void;
    valueToChar(v: number): string;
    charToValue(c: string): number;
    extractChar(c: number, bits: number[]): string;
    insertChar(value: number, j: number, bits: number[]): void;
    decodeSlug(sluig: SlugId): SlugId;
    encodeSlug(name: string): SlugId;
    slugTo128bits(slug: SlugId): string;
    charmap: string;
    charidx: (ch: any) => number;
    oldEosjsEncodeName(name: any, littleEndian?: boolean): any;
    encodeName(name: string): BigNumber;
}
