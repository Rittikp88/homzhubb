module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
  plugins: [['@babel/plugin-proposal-decorators', { legacy: true }], '@babel/plugin-proposal-class-properties'],
  env: {
    test: {
      plugins: [['@babel/plugin-proposal-decorators', { legacy: true }], '@babel/plugin-proposal-class-properties'],
      presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
      ignore: [/node_modules/],
    },
  },
};
