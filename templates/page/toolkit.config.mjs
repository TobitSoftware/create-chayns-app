import { buildToolkitConfig } from 'chayns-toolkit';

export default buildToolkitConfig({
    development: {
        host: '0.0.0.0',
        port: +(process.env.PORT || 8080),
    },
    output: {
        entryPoints: {
            index: {
                pathIndex: './src/index',
                pathHtml: './src/index.html',
            },
            // Add more entrypoints here
        },
        cssVersion: '4.2',
    },
});
