declare module '*.png' {
    const value: string;
    export = value;
}

declare module '*.png?url' {
    const value: string;
    export = value;
}

declare module '*.svg?url' {
    const value: string;
    export = value;
}

interface ImportMetaEnv {
    [key: string]: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
