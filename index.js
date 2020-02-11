const fs = require('fs')
const path = require('path')
const spawn = require('cross-spawn')
const root = require('find-yarn-workspace-root')()

const pgks = spawn.sync('yarn', ['workspaces', 'info', '--json'])
const output = JSON.parse(pgks.output[1].toString())
const packages = JSON.parse(output.data)

const ext = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

module.exports = config => {
  return {
    ...config,
    resolve: { ...config.resolve, extensions:ext.map(ext => `.${ext}`) },
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          include: Object.keys(packages).map(_ => path.join(root, packages[_].location)),
          exclude: /node_modules/,
          loader: require.resolve('babel-loader'),
          options: {
            customize: require.resolve(
              'babel-preset-react-app/webpack-overrides'
            ),
            // @remove-on-eject-begin
            babelrc: false,
            configFile: false,
            presets: [require.resolve('babel-preset-react-app')],
            plugins: [
              [
                require.resolve('babel-plugin-named-asset-import'),
                {
                  loaderMap: {
                    svg: {
                      ReactComponent:
                        '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                    },
                  },
                },
              ],
            ],
            // This is a feature of `babel-loader` for webpack (not Babel itself).
            // It enables caching results in ./node_modules/.cache/babel-loader/
            // directory for faster rebuilds.
            cacheDirectory: true,
            // See #6846 for context on why cacheCompression is disabled
            cacheCompression: false,
          },
        },
        {
          test: /\.(js|mjs)$/,
          include: Object.keys(packages).map(_ => path.join(root, packages[_].location)),
          exclude: [/@babel(?:\/|\\{1,2})runtime/, /node_modules/],
          loader: require.resolve('babel-loader'),
          options: {
            babelrc: false,
            configFile: false,
            compact: false,
            presets: [
              require.resolve('babel-preset-react-app'),
              [
                require.resolve('babel-preset-react-app/dependencies'),
                { helpers: true },
              ],
            ],
            cacheDirectory: true,
            // See #6846 for context on why cacheCompression is disabled
            cacheCompression: false,
            // Babel sourcemaps are needed for debugging into node_modules
            // code.  Without the options below, debuggers like VSCode
            // show incorrect code and set breakpoints on the wrong lines.
            sourceMaps: true,
            inputSourceMap: true,
          },
        },
      ]
    }
  }
}