# Use Yarn Workspaces (Rescripts Plugin)
This plugin will allow to use CRA inside a Yarn Workspace configuration,
it will allow to transpile other code in the same workspace.

## How to use
1. Install the package by running:
```sh
  yarn add -D rescripts-use-yarn-workspaces
```

2. [On your rescripts configuration](https://github.com/harrysolovay/rescripts#advanced-usage)

```diff
"rescripts": [
+  "rescripts-use-yarn-workspaces"
]
```

3. Run your app, external code should be transpiled.

# Storybook Plugin.
Additionally, this could export helpers for storybook, to use it, on `.storybook/main.js` add the following:
```diff
module.exports = {
  addons: [
+   'rescripts-use-yarn-workspaces/storybook'
  ]
}
```