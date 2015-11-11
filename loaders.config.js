module.exports = [
    {
        test: /\.jsx$/,
        loader: 'jsx-loader?insertPragma=React.DOM&harmony'
    },
    {
        test: /\.js$/,
        loader: 'jsx-loader?harmony'
    }
]