/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = (serviceName) => ({
  mode: 'production',
  target: 'node',
  context: path.resolve(__dirname, `apps/${serviceName}`),
  stats: 'errors-only',
  entry: path.resolve(__dirname, `apps/${serviceName}/src/main.ts`),

  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, 'tsconfig.json'),
      }),
    ],
  },

  infrastructureLogging: {
    level: 'error',
  },

  output: {
    path: path.resolve(__dirname, `apps/${serviceName}/dist`),
    filename: 'main.js',
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.json'),
            transpileOnly: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.node$/,
        loader: 'node-loader',
      },
    ],
  },

  externals: {
    '@nestjs/websockets/socket-module': 'commonjs @nestjs/websockets/socket-module',
    kafkajs: 'commonjs kafkajs',
    mqtt: 'commonjs mqtt',
    nats: 'commonjs nats',
  },

  ignoreWarnings: [
    { message: /./ },
  ],
});
