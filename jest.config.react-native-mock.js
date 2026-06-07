/**
 * Mock React Native native modules for testing.
 * Provides stubs for TurboModule modules that would otherwise cause
 * "Invariant Violation: TurboModuleRegistry.getEnforcing" errors
 * when tests import components that transitively load native code.
 *
 * @see https://reactnative.dev/docs/turbo-native-modules
 * @module jest.config.react-native-mock
 */
const fs = require("fs");
const path = require("path");

/**
 * Parses React Native version from package.json to provide accurate
 * PlatformConstants in the test environment.
 *
 * @returns Parsed version object with major, minor, and patch numbers
 */
const getReactNativeVersion = () => {
  try {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, "package.json"), "utf8")
    );
    const version = packageJson.dependencies["react-native"];
    const versionMatch = version.match(/(\d{1,5})\.(\d{1,5})\.(\d{1,5})/);
    if (versionMatch) {
      return {
        major: parseInt(versionMatch[1], 10),
        minor: parseInt(versionMatch[2], 10),
        patch: parseInt(versionMatch[3], 10),
      };
    }
  } catch (error) {
    console.warn(
      "Failed to parse React Native version from package.json:",
      error
    );
  }
  return { major: 0, minor: 81, patch: 4 };
};

module.exports = {
  NativeAnimatedModule: {
    startOperationBatch: () => {},
    finishOperationBatch: () => {},
    createAnimatedNode: () => {},
    updateAnimatedNodeConfig: () => {},
    getValue: (_tag, callback) => callback(0),
    startListeningToAnimatedNodeValue: () => {},
    stopListeningToAnimatedNodeValue: () => {},
    connectAnimatedNodes: () => {},
    disconnectAnimatedNodes: () => {},
    startAnimatingNode: () => {},
    stopAnimation: () => {},
    setAnimatedNodeValue: () => {},
    setAnimatedNodeOffset: () => {},
    flattenAnimatedNodeOffset: () => {},
    extractAnimatedNodeOffset: () => {},
    connectAnimatedNodeToView: () => {},
    disconnectAnimatedNodeFromView: () => {},
    restoreDefaultValues: () => {},
    dropAnimatedNode: () => {},
    addAnimatedEventToView: () => {},
    removeAnimatedEventFromView: () => {},
    addListener: () => {},
    removeListeners: () => {},
  },
  PlatformConstants: {
    getConstants: () => ({
      reactNativeVersion: getReactNativeVersion(),
      forceTouchAvailable: false,
      osVersion: "14.4",
      systemName: "iOS",
      interfaceIdiom: "phone",
    }),
  },
  SourceCode: {
    getConstants: () => ({
      scriptURL: "http://localhost:8081/index.bundle?platform=ios&dev=true",
    }),
  },
  AppState: {
    getConstants: () => ({ initialAppState: "active" }),
    getCurrentAppState: () => Promise.resolve({ app_state: "active" }),
    addListener: () => {},
    addEventListener: () => {},
    removeListeners: () => {},
    removeEventListener: () => {},
    currentState: "active",
  },
  Appearance: {
    getConstants: () => ({ initialColorScheme: "light" }),
    getColorScheme: () => "light",
    setColorScheme: () => {},
    addChangeListener: () => ({ remove: () => {} }),
    removeChangeListener: () => {},
    addListener: () => ({ remove: () => {} }),
    removeListeners: () => {},
  },
  DeviceInfo: {
    getConstants: () => ({
      Dimensions: {
        window: { width: 375, height: 667, scale: 2, fontScale: 1 },
        screen: { width: 375, height: 667, scale: 2, fontScale: 1 },
      },
    }),
  },
  UIManager: {
    getViewManagerConfig: () => ({}),
    hasViewManagerConfig: () => false,
    getConstants: () => ({}),
    getConstantsForViewManager: () => {},
    getDefaultEventTypes: () => [],
    lazilyLoadView: () => {},
    createView: () => {},
    updateView: () => {},
    manageChildren: () => {},
    setChildren: () => {},
    sendAccessibilityEvent: () => {},
    dispatchViewManagerCommand: () => {},
    measure: () => {},
    measureInWindow: () => {},
    measureLayout: () => {},
    measureLayoutRelativeToParent: () => {},
    focus: () => {},
    blur: () => {},
    findSubviewIn: () => {},
    setJSResponder: () => {},
    clearJSResponder: () => {},
  },
  ImageLoader: {
    getSize: (uri, success) => success(100, 100),
    getSizeWithHeaders: (uri, headers, success) => success(100, 100),
    prefetchImage: () => Promise.resolve(true),
    queryCache: () => Promise.resolve({}),
  },
  KeyboardObserver: {
    getConstants: () => ({}),
    addListener: () => ({ remove: () => {} }),
    removeListeners: () => {},
  },
  DevSettings: {
    addMenuItem: () => {},
    reload: () => {},
    onFastRefresh: () => {},
    addListener: () => {},
    removeListeners: () => {},
  },
  Networking: {
    addListener: () => {},
    removeListeners: () => {},
    sendRequest: () => {},
    abortRequest: () => {},
    clearCookies: () => {},
  },
  StatusBarManager: {
    getConstants: () => ({
      HEIGHT: 44,
      DEFAULT_BACKGROUND_COLOR: 0,
    }),
    getHeight: callback => callback({ height: 44 }),
    setStyle: () => {},
    setHidden: () => {},
    setNetworkActivityIndicatorVisible: () => {},
  },
  BlobModule: {
    getConstants: () => ({ BLOB_URI_SCHEME: "content", BLOB_URI_HOST: null }),
    addNetworkingHandler: () => {},
    addListener: () => {},
    removeListeners: () => {},
    createFromParts: () => {},
    sendBlob: () => {},
    release: () => {},
  },
  WebSocketModule: {
    connect: () => {},
    send: () => {},
    sendBinary: () => {},
    ping: () => {},
    close: () => {},
    addListener: () => {},
    removeListeners: () => {},
  },
  SettingsManager: {
    getConstants: () => ({ settings: {} }),
    setValues: () => {},
    deleteValues: () => {},
  },
  Timing: {
    createTimer: () => {},
    deleteTimer: () => {},
    setSendIdleEvents: () => {},
  },
  I18nManager: {
    getConstants: () => ({
      isRTL: false,
      doLeftAndRightSwapInRTL: false,
      localeIdentifier: "en_US",
    }),
    allowRTL: () => {},
    forceRTL: () => {},
    swapLeftAndRightInRTL: () => {},
  },
  AccessibilityManager: {
    getCurrentBoldTextState: onSuccess => onSuccess(false),
    getCurrentGrayscaleState: onSuccess => onSuccess(false),
    getCurrentInvertColorsState: onSuccess => onSuccess(false),
    getCurrentReduceMotionState: onSuccess => onSuccess(false),
    getCurrentDarkerSystemColorsState: onSuccess => onSuccess(false),
    getCurrentPrefersCrossFadeTransitionsState: onSuccess => onSuccess(false),
    getCurrentReduceTransparencyState: onSuccess => onSuccess(false),
    getCurrentVoiceOverState: onSuccess => onSuccess(false),
    setAccessibilityContentSizeMultipliers: () => {},
    setAccessibilityFocus: () => {},
    announceForAccessibility: () => {},
    announceForAccessibilityWithOptions: () => {},
    addListener: () => {},
    removeListeners: () => {},
    getConstants: () => ({}),
  },
  AccessibilityInfo: {
    getConstants: () => ({}),
    isScreenReaderEnabled: () => Promise.resolve(false),
    isReduceMotionEnabled: () => Promise.resolve(false),
    isReduceTransparencyEnabled: () => Promise.resolve(false),
    isInvertColorsEnabled: () => Promise.resolve(false),
    isAccessibilityServiceEnabled: () => Promise.resolve(false),
    isBoldTextEnabled: () => Promise.resolve(false),
    isGrayscaleEnabled: () => Promise.resolve(false),
    setAccessibilityFocus: () => {},
    announceForAccessibility: () => {},
    announceForAccessibilityWithOptions: () => {},
    addListener: () => {},
    removeListeners: () => {},
  },
  AlertManager: {
    alertWithArgs: () => {},
  },
  Clipboard: {
    getString: () => Promise.resolve(""),
    setString: () => {},
  },
  LinkingManager: {
    getConstants: () => ({ initialURL: null }),
    getInitialURL: () => Promise.resolve(null),
    canOpenURL: () => Promise.resolve(true),
    openURL: () => Promise.resolve(),
    openSettings: () => Promise.resolve(),
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListeners: () => {},
    sendIntent: () => {},
  },
};
