const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: 'production',
  target: 'node',

  context: __dirname,

  stats: 'errors-only',

  entry: path.resolve(__dirname, 'src/main.ts'),

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
    path: path.resolve(__dirname, 'dist'),
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
    amqplib: 'commonjs amqplib',
    'amqp-connection-manager': 'commonjs amqp-connection-manager',
  },

  ignoreWarnings: [
    { message: /./ },
  ],
};
