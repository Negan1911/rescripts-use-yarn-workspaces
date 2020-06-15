const path = require('path')
const spawn = require('cross-spawn')
const root = require('find-yarn-workspace-root')()
const { getPaths, edit } = require('@rescripts/utilities')

const rawOutput = spawn.sync('yarn', ['--json', 'workspaces', 'info'])
const output = JSON.parse(rawOutput.output[1].toString())
const packages = JSON.parse(output.data)

const include = Object.values(packages).map(p => path.join(root, p.location))
const exclude = /node_modules/

module.exports = config => {
  const babelLoaderPaths = getPaths(
    // Only use babel-loader instance with explicit includes
    p => p && p.loader && p.loader.includes('babel-loader') && !!p.include,
    config
  )

  return edit(
    loader => ({
      ...loader,
      include: include.concat(loader.include),
      exclude: loader.exclude ? [exclude].concat(loader.exclude) : exclude,
    }),
    babelLoaderPaths,
    config
  )
}
