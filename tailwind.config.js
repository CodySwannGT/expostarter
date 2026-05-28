/**
 * Tailwind CSS Configuration with NativeWind v4 Preset
 *
 * This configuration file sets up Tailwind CSS v3 for use with NativeWind v4.
 * NativeWind transforms Tailwind classes into React Native StyleSheet objects.
 *
 * Key Configuration:
 * - Content paths include app/ and components/ directories for class scanning
 * - Uses NativeWind preset for React Native compatibility
 * - Theme can be extended with custom design tokens
 *
 * @remarks NativeWind v4 only supports Tailwind CSS v3, NOT v4.
 * @see https://www.nativewind.dev/v4/getting-started/expo-router
 * @see https://tailwindcss.com/docs/configuration
 * @type {import('tailwindcss').Config}
 * @module tailwind.config
 */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: { extend: {} },
  plugins: [],
};
