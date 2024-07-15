import globals from 'globals'
import pluginJs from '@eslint/js'

export default [
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.mocha }
    },
    ignores: []
  },
  pluginJs.configs.recommended,
  {
    rules: {
      'no-console': 'warn',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  }
]
