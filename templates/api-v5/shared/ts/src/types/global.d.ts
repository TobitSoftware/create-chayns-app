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
    PUBLIC_BUILD_ENV: string;
    PUBLIC_BUILD_VERSION: string;

    /* add custom env variables here */
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
