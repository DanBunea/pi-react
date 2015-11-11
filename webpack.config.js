

module.exports = {
    entry: {
        todomvc_app : './src/samples/src/todomvc/todomvc_app.js'
    },
    output: {
        filename: './src/samples/build/[name].js'
    },
    module: {
        loaders: require('./loaders.config')
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }

}

