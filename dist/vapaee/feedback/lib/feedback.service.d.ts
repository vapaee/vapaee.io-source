export interface Feed {
    msg?: string;
    msgtype?: string;
    loading?: boolean;
    start?: Date;
    marks?: {
        label: string;
        sec: number;
        millisec: number;
    }[];
}
export interface FeedMap {
    [key: string]: Feed;
}
export declare class Feedback {
    keys: string[];
    private scopes;
    constructor();
    static create(keys?: string[]): Feedback;
    private updateScopes();
    private addKey(key);
    startChrono(key: string): void;
    setMarck(key: string, label: string): void;
    printChrono(key: string, lastMark?: boolean): void;
    setLoading(key: string, value: boolean): void;
    loading(key: string): boolean;
    setError(key: string, err?: string): void;
    clearError(key: string): void;
    error(key: string): string;
    setMessage(key: string, msg: string, msgtype: string): void;
    message(key: string): string;
    msgType(key: string): string;
}
