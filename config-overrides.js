const path = require('path');
const { override, babelInclude, fixBabelImports, addLessLoader } = require(
  'customize-cra');

module.exports = (config, env, override = f => f) => {
  return Object.assign(
    config,
    override(
      fixBabelImports(
        'import',
        {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: 'css',
        },
      ),
      addLessLoader({
        javascriptEnabled: true,
        modifyVars: { '@primary-color': '#1DA57A' },
      }),
    )(config, env),
  );
  /*
   textProcessing.resolve.alias = {
   ...textProcessing.resolve.alias,
   '@': path.resolve(__dirname, './src/'),
   };

   return textProcessing;
   */
};
