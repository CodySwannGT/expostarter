/**
 * @file Input.test.tsx
 * @description Unit tests for the Input atom — testID forwarding and the
 * field placeholder rendering through the data-driven `field` prop. One
 * render per test (css-interop teardown constraint).
 * @module components/atoms/Input/__tests__/Input.test
 */
import { render } from "@testing-library/react-native";
import { Search, X } from "lucide-react-native";
import React from "react";

import { Input } from "..";

describe("Input", () => {
  it("forwards testID and renders the field placeholder", () => {
    // getByPlaceholderText is unusable here: under RN 0.85 the text input
    // host component is named RCTSinglelineTextInputView, which RNTL's
    // placeholder query does not recognize as a TextInput. Match the
    // rendered placeholder prop directly instead.
    const { getByTestId, UNSAFE_getByProps } = render(
      <Input
        testID="input-under-test"
        field={{ placeholder: "Search players…" }}
      />
    );
    expect(getByTestId("input-under-test")).toBeTruthy();
    expect(UNSAFE_getByProps({ placeholder: "Search players…" })).toBeTruthy();
  });

  it("renders leading and trailing icon slots with explicit variant/size", () => {
    const { getByTestId, UNSAFE_getAllByType } = render(
      <Input
        testID="input-with-icons"
        variant="rounded"
        size="lg"
        leadingIcon={Search}
        trailingIcon={X}
        onTrailingIconPress={jest.fn()}
        field={{ placeholder: "Filter…" }}
      />
    );
    expect(getByTestId("input-with-icons")).toBeTruthy();
    expect(UNSAFE_getAllByType(Search).length).toBeGreaterThan(0);
    expect(UNSAFE_getAllByType(X).length).toBeGreaterThan(0);
  });
});
