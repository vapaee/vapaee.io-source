export interface Locals {
    [localKey: string]: LocalString; // "es_ES": {map of strings}
}

export interface LocalString {
    [stringKey: string]: string;     // "text_var": "Texto variable"
}

export type LocalLang = {
    text: string,
    key: string
};

export type LocalList = LocalLang[];