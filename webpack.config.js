

module.exports = {
    entry: {
        todomvc_app : './src/src/todomvc/todomvc_app.js'
    },
    output: {
        filename: './src/build/[name].js'
    },
    module: {
        loaders: require('./loaders.config')
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }

}

