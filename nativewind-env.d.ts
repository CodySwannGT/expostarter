/**
 * NativeWind TypeScript Type Definitions
 *
 * This file provides TypeScript type definitions for NativeWind.
 * It extends React Native component props to include the className prop
 * which is transformed by NativeWind into style objects.
 *
 * @remarks This file is referenced in tsconfig.json include array.
 * @see https://www.nativewind.dev/v4/getting-started/typescript
 */
/// <reference types="nativewind/types" />

/**
 * Allow side-effect imports of `.css` files (e.g. `import "@/global.css"`).
 * Required since TypeScript 6.0, which now requires explicit type declarations
 * for side-effect imports of non-TS extensions.
 */
declare module "*.css" {}
