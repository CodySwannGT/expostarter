/**
 * Allow side-effect imports of `.css` files (e.g. `import "@/global.css"` in
 * src/app/_layout.tsx). Required since TypeScript 6.0, which needs explicit
 * type declarations for side-effect imports of non-TS extensions. NativeWind v5
 * / react-native-css do not ship this declaration, and the generated
 * nativewind-env.d.ts must not be hand-edited, so it lives here.
 */
declare module "*.css" {}
