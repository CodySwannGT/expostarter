/**
 * Babel Configuration for Expo with NativeWind v4
 *
 * This configuration file sets up Babel for the Expo project with NativeWind support.
 * NativeWind enables Tailwind CSS styling in React Native applications.
 *
 * @see https://www.nativewind.dev/v4/getting-started/expo-router
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
          jsxImportSource: "nativewind",
          // Disable experimentalImportSupport in tests to avoid import.meta issues
          experimentalImportSupport: isTest ? false : undefined,
        },
      ],
      "nativewind/babel",
    ],
  };
};
