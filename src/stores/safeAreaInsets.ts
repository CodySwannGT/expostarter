/**
 * Global safe-area inset store.
 *
 * Portal-rendered overlays (actionsheets, drawers, modals) mount OUTSIDE the
 * `SafeAreaProvider` — the app's `PortalProvider` wraps `SafeAreaProvider` in
 * `app/_layout.tsx` — so `useSafeAreaInsets()` returns 0 inside them. We capture
 * the real bottom inset once at the app root (inside `SafeAreaProvider`, via
 * `SafeAreaInsetSync`) into this reactive var, and let sheet primitives read it
 * through `useBottomSheetInset` regardless of where they mount.
 *
 * The reactive var is hand-rolled (Apollo `makeVar`-compatible call signature
 * plus a `subscribe` method for `useSyncExternalStore`) instead of importing
 * `makeVar` from `@apollo/client`: that single import chained the entire
 * Apollo runtime + `graphql` (~470KB minified) into the web entry bundle,
 * which Metro cannot tree-shake. Data fetching code should still use Apollo —
 * this store just must not be the thing that drags it into every bundle.
 * @module stores/safeAreaInsets
 */

/** Listener invoked when the reactive var's value changes. */
type ReactiveVarListener = () => void;

/**
 * Minimal reactive var: call with no arguments to read, with one argument to
 * write. `subscribe` registers a change listener and returns an unsubscribe
 * function (the contract `useSyncExternalStore` expects).
 */
export interface ReactiveVar<T> {
  (): T;
  (newValue: T): T;
  /** Registers a change listener; returns the unsubscribe function. */
  readonly subscribe: (listener: ReactiveVarListener) => () => void;
}

/**
 * Creates a minimal reactive var (Apollo `makeVar`-compatible read/write call
 * signature) without the Apollo dependency.
 * @param initialValue - The value the var starts with.
 * @returns The reactive var function with a `subscribe` method.
 */
export function makeReactiveVar<T>(initialValue: T): ReactiveVar<T> {
  const value = { current: initialValue };
  const listeners = { current: [] as readonly ReactiveVarListener[] };

  /**
   * Reads (no arguments) or writes (one argument) the stored value.
   * @param args - Empty to read; `[newValue]` to write.
   * @returns The current value after any write.
   */
  const reactiveVar = (...args: readonly T[]): T => {
    if (args.length > 0 && args[0] !== value.current) {
      value.current = args[0] as T;
      listeners.current.forEach(listener => listener());
    }
    return value.current;
  };

  /**
   * Registers a change listener.
   * @param listener - Called after every value change.
   * @returns The unsubscribe function.
   */
  const subscribe = (listener: ReactiveVarListener): (() => void) => {
    listeners.current = [...listeners.current, listener];
    return () => {
      listeners.current = listeners.current.filter(l => l !== listener);
    };
  };

  return Object.assign(reactiveVar, { subscribe }) as ReactiveVar<T>;
}

/** Bottom safe-area inset (device px) captured at the app root. */
export const bottomSafeAreaInsetVar = makeReactiveVar<number>(0);
