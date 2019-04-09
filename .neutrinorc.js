module.exports = {
  use: [
    '@neutrinojs/standardjs',
    '@neutrinojs/node',
    '@neutrinojs/jest',
    (neutrino)=>{neutrino.config.resolve.modules.add(neutrino.options.source)}
    ],
  options:{
    mains: {
      // If not specified, defaults to options.source + index
      index: 'bin/index'
    }
  }
};

