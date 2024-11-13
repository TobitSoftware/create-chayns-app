module.exports = {
    development: {
        host: '0.0.0.0',
        port: 8080,
    },
    output: {
        entryPoints: {
            'index': {
                pathIndex: './src/index',
                pathHtml: './src/index.html',
            },
            // Add more entrypoints here
        }
    },
}
