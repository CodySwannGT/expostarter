/**
 * Babel Configuration for Expo with NativeWind v5.
 *
 * NativeWind v5 (react-native-css) performs the className interop in the Metro
 * transformer (`withNativeWind` in metro.config.js), NOT via a Babel JSX
 * runtime — so the v4-era `jsxImportSource: "nativewind"` and the
 * `"nativewind/babel"` preset are gone (v5 ships no `nativewind/jsx-runtime`,
 * and keeping either breaks the build). `babel-preset-expo` already wires the
 * react-native-worklets/reanimated plugin under the New Architecture.
 *
 * @see https://www.nativewind.dev/getting-started/expo
 * @see https://docs.expo.dev/guides/customizing-babel/
 * @module babel.config
 */
module.exports = function (api) {
  api.cache(true);

  // Check if running in test environment
  const isTest = process.env.NODE_ENV === "test";

  return {
    presets: [
      [
        "babel-preset-expo",
        {
          // Disable experimentalImportSupport in tests to avoid import.meta issues
          experimentalImportSupport: isTest ? false : undefined,
        },
      ],
    ],
  };
};
