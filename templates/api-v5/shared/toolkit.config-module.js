module.exports = {
    development: {
        host: '0.0.0.0',
        port: 8080,
    },
    output: {
        exposeModules: {
            './AppWrapper': './src/components/AppWrapper'
        },
    },
}
