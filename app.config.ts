import { ConfigContext, ExpoConfig } from "expo/config";

// import firebaseWebDev from "./firebase-web-dev.json";
// import firebaseWebProduction from "./firebase-web-production.json";
// import firebaseWebStaging from "./firebase-web-staging.json";
import { version } from "./package.json";

// CHANGE THIS WHEN ADDING A NEW NATIVE MODULE. This will require a new build.
const runtimeVersion = "1.0.0";
const projectId = "TODO";
// Reverse-DNS app id. Each segment must be a valid Android package component
// (letters/digits/underscore, no hyphens) — replace per-fork.
const bundleIdentifier = "com.yourorg.yourproject";
const appName = "Your Project";

const stage = process.env.STAGE ?? "dev";
const addendum = stage === "production" ? "" : `-${stage}`;

// Parse version components (e.g., "7.0.1" -> [7, 0, 1])
const versionParts = version.split(".").map(part => parseInt(part, 10));

// Calculate build number: allocates 3 digits each for minor (0-999) and patch (0-999)
// Formula: major * 1000000 + minor * 1000 + patch
const buildNumber =
  versionParts[0] * 1000000 + versionParts[1] * 1000 + versionParts[2];

// const firebaseWebConfig = ["prod", "production"].includes(stage)
//   ? firebaseWebProduction
//   : ["dev", "development"].includes(stage)
//     ? firebaseWebDev
//     : firebaseWebStaging;

// Use the unified google-services files that include both analytics and push notifications
// TODO: Uncomment when Firebase config files are available
// const androidGoogleServicesFile = ["prod", "production"].includes(stage)
//   ? `./google-services-analytics-production.json`
//   : ["dev", "development"].includes(stage)
//     ? `./google-services-analytics-dev.json`
//     : `./google-services-analytics-staging.json`;

// const iosGoogleServicesFile = ["prod", "production"].includes(stage)
//   ? `./GoogleService-Info-production.plist`
//   : ["dev", "development"].includes(stage)
//     ? `./GoogleService-Info-dev.plist`
//     : `./GoogleService-Info-staging.plist`;

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    version,
    name: `${appName}${addendum}`,
    scheme: `${appName.toLowerCase().replace(/ /g, "-")}${addendum}`,
    runtimeVersion,
    android: {
      ...config.android,
      // googleServicesFile: androidGoogleServicesFile, // TODO: Uncomment when Firebase config files are available
      package: `${bundleIdentifier}${addendum.replace(/-/g, "_")}`,
      versionCode: buildNumber,
      softwareKeyboardLayoutMode: "resize",
    },
    web: {
      // firebase: firebaseWebConfig,
    },
    ios: {
      ...config.ios,
      bundleIdentifier: `${bundleIdentifier}${addendum}`,
      // googleServicesFile: iosGoogleServicesFile, // TODO: Uncomment when Firebase config files are available
      buildNumber: buildNumber.toString(),
    },
    updates: {
      ...config.updates,
      url: `https://u.expo.dev/${projectId}`,
    },
    extra: {
      eas: {
        projectId,
      },
    },
  } as ExpoConfig;
};
