/**
 * Jest Pre-Setup - Project-Local Customizations
 *
 * Project-specific pre-framework globals. This file runs before
 * Jest loads any test modules. This file is create-only — Lisa will
 * never overwrite it.
 *
 * @module jest.setup.pre.local
 */

// Polyfill setImmediate/clearImmediate for jsdom — React Native's LogBox
// and other modules expect these Node.js-specific globals
if (typeof global.setImmediate === "undefined") {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
  global.clearImmediate = id => clearTimeout(id);
}

// Mock ErrorUtils — React Native global used by expo for error handling
global.ErrorUtils = {
  setGlobalHandler: () => {},
  getGlobalHandler: () => () => {},
  reportError: () => {},
  reportFatalError: () => {},
};

// Mock expo's import.meta registry
global.__ExpoImportMetaRegistry = new Map();

// Polyfill Web Streams API for expo winter runtime — jsdom doesn't provide
// TransformStream/ReadableStream/WritableStream which expo/src/winter needs
if (typeof global.TransformStream === "undefined") {
  const {
    TransformStream,
    ReadableStream,
    WritableStream,
  } = require("stream/web");
  global.TransformStream = TransformStream;
  global.ReadableStream = global.ReadableStream || ReadableStream;
  global.WritableStream = global.WritableStream || WritableStream;
}

// Install Expo global polyfill — provides globalThis.expo with EventEmitter,
// NativeModule, SharedObject classes needed by expo-modules-core
require("expo-modules-core/src/polyfill/dangerous-internal").installExpoGlobalPolyfill();
