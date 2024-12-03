declare namespace NodeJS {
    interface ProcessEnv {
        PUBLIC_BUILD_ENV: string;
        PUBLIC_BUILD_VERSION: string;

        /* add custom env variables here */
        PUBLIC_YOUR_WEBAPI_URL: string;
    }
}
