/**
 * @file safeAreaInsets.test.ts
 * @description Unit tests for the hand-rolled reactive var backing the
 * safe-area inset store — read/write call signature (Apollo makeVar
 * compatible), change notification, unsubscribe, and the no-op write path.
 * @module stores/__tests__/safeAreaInsets.test
 */
import { bottomSafeAreaInsetVar, makeReactiveVar } from "../safeAreaInsets";

describe("makeReactiveVar", () => {
  it("returns the initial value when called with no arguments", () => {
    const rv = makeReactiveVar(7);

    expect(rv()).toBe(7);
  });

  it("writes and returns the new value when called with one argument", () => {
    const rv = makeReactiveVar(0);

    expect(rv(42)).toBe(42);
    expect(rv()).toBe(42);
  });

  it("notifies subscribers on change", () => {
    const rv = makeReactiveVar(0);
    const listener = jest.fn();
    rv.subscribe(listener);

    rv(5);

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("does not notify subscribers when the value is unchanged", () => {
    const rv = makeReactiveVar(5);
    const listener = jest.fn();
    rv.subscribe(listener);

    rv(5);

    expect(listener).not.toHaveBeenCalled();
  });

  it("stops notifying after unsubscribe", () => {
    const rv = makeReactiveVar(0);
    const listener = jest.fn();
    const unsubscribe = rv.subscribe(listener);

    unsubscribe();
    rv(9);

    expect(listener).not.toHaveBeenCalled();
  });

  it("keeps other subscribers when one unsubscribes", () => {
    const rv = makeReactiveVar(0);
    const removed = jest.fn();
    const kept = jest.fn();
    const unsubscribe = rv.subscribe(removed);
    rv.subscribe(kept);

    unsubscribe();
    rv(3);

    expect(removed).not.toHaveBeenCalled();
    expect(kept).toHaveBeenCalledTimes(1);
  });
});

describe("bottomSafeAreaInsetVar", () => {
  afterEach(() => {
    bottomSafeAreaInsetVar(0);
  });

  it("starts at 0 and stores written insets", () => {
    expect(bottomSafeAreaInsetVar()).toBe(0);

    bottomSafeAreaInsetVar(34);

    expect(bottomSafeAreaInsetVar()).toBe(34);
  });
});
