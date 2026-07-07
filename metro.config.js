const { getSentryExpoConfig } = require("@sentry/react-native/metro");
const { withNativeWind } = require("nativewind/metro");

const config = getSentryExpoConfig(__dirname, {
  annotateReactComponents: true,
  isCSSEnabled: true,
  // Session Replay is not used. Without this flag the web bundle statically
  // includes @sentry-internal/replay + replay-canvas (~135KB minified),
  // because Metro cannot tree-shake @sentry/browser's barrel exports.
  includeWebReplay: false,
});

/**
 * Limit workers for optimized graph builds.
 *
 * Note: maxWorkers is set to 1 to work around a Symbol serialization bug when
 * EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH is enabled (expo/expo#39431). This only
 * applies when the optimize graph env var is set, so dev builds retain normal
 * worker counts.
 *
 * @see https://docs.expo.dev/guides/tree-shaking/
 */
if (process.env.EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH) {
  config.maxWorkers = 1;
}

const originalGetTransformOptions = config.transformer?.getTransformOptions;

config.transformer = {
  ...config.transformer,
  getTransformOptions: async (...args) => {
    const originalOptions = originalGetTransformOptions
      ? await originalGetTransformOptions(...args)
      : {};

    return {
      ...originalOptions,
      transform: {
        ...originalOptions?.transform,
        experimentalImportSupport: true,
      },
    };
  },
};

module.exports = withNativeWind(config, {
  input: "./src/global.css",
  output: "./output.css",
});
