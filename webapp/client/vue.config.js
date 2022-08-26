const path = require('path');

module.exports = {
  outputDir: path.resolve(__dirname, '../dist'),
  devServer: {
    proxy: {
      '/api/v1': {
        target: 'http://localhost:4000',
      },
    },
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            'sass-loader',
            {
              loader: 'sass-loader',
              options: {
                /* eslint-disable global-require */
                implementation: require('sass'),
                /* eslint-enable global-require */
                sassOptions: {
                  fiber: false,
                },
              },
            },
          ],
        },
      ],
    },
  },
};
