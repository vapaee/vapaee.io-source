export = ecc;
declare var ecc: {
    randomKey: (cpuEntropyBits?: number) => Promise<string>;
    privateToPublic: (wif: string, ...args: any[]) => string;
}