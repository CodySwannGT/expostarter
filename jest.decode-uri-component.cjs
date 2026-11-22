// Node loads the patched decoder's ESM export for Jest's CommonJS callers.
const { createRequire } = require("node:module");

module.exports = createRequire(__filename)("decode-uri-component");
