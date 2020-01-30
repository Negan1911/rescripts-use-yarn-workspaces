const fs = require('fs')
const path = require('path')
const spawn = require('cross-spawn')
const root = require('find-yarn-workspace-root')()

const pgks = spawn.sync('yarn', ['workspaces', 'info', '--json'])
const output = JSON.parse(pgks.output[1].toString())
const packages = JSON.parse(output.data)

const extensions = [
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
    resolve: {
      ...config.resolve,
      extensions
    }
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          include: Object.keys(packages).map(_ => path.join(root, packages[_].location)),
          loader: require.resolve('babel-loader'),
          options: {
            customize: require.resolve(
              'babel-preset-react-app/webpack-overrides'
            ),
            presets: [require.resolve('babel-preset-react-app')],
            plugins: [
              ["babel-plugin-named-asset-import", {
                loaderMap: {
                  svg: { ReactComponent: "@svgr/webpack?-svgo,+ref![path]" }
                }
              }]
          ]
          }
        }
      ]
    }
  }
}