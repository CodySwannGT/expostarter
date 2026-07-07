/**
 * @file Spinner.test.tsx
 * @description Unit tests for the Spinner atom — testID forwarding. One
 * render per test (css-interop teardown constraint).
 * @module components/atoms/Spinner/__tests__/Spinner.test
 */
import { render } from "@testing-library/react-native";
import React from "react";

import { Spinner } from "..";

describe("Spinner", () => {
  it("forwards testID", () => {
    const { getByTestId } = render(<Spinner testID="spinner-under-test" />);
    expect(getByTestId("spinner-under-test")).toBeTruthy();
  });
});
