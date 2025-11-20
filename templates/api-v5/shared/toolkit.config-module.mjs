import { buildToolkitConfig } from 'chayns-toolkit';

export default buildToolkitConfig({
    development: {
        host: '0.0.0.0',
        port: +(process.env.PORT || 8080),
    },
    output: {
        exposeModules: {
            './AppWrapper': './src/components/AppWrapper',
        },
        cssVersion: '5.0',
        prefixCss: true,
    },
});
