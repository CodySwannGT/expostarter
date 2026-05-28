The following eslint rules need to be refactored to errors but until they are, they should update the warning level in eslint.base.mjs or eslint.config.mjs from "error" to "warn"

```
"sonarjs/no-nested-template-literals": "warn",
"sonarjs/prefer-immediate-return": "warn",
"sonarjs/prefer-single-boolean-return": "warn",
"sonarjs/no-collapsible-if": "warn",
"sonarjs/deprecation": "warn",
"sonarjs/prefer-read-only-props": "warn",
"sonarjs/no-duplicate-string": "warn",
"sonarjs/no-nested-functions": "warn",
"no-restricted-syntax": [
    "warn",
    {
      selector:
        "MemberExpression[object.name='process'][property.name='env']",
      message:
        "Direct process.env access is forbidden. Import { env } from '@/lib/env' instead for type-safe, validated environment variables.",
    },
  ],
"react-perf/jsx-no-new-object-as-prop": "warn",
"react-perf/jsx-no-new-array-as-prop": "warn",
"react-perf/jsx-no-new-function-as-prop": "warn",
```