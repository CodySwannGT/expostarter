/**
 * @file Text.test.tsx
 * @description Unit tests for the Text atom — testID forwarding and variant
 * prop acceptance. One render per test (css-interop teardown constraint).
 * @module components/atoms/Text/__tests__/Text.test
 */
import { render } from "@testing-library/react-native";
import React from "react";

import { Text } from "..";

describe("Text", () => {
  it("forwards testID and accepts a variant prop", () => {
    const { getByTestId, getByText } = render(
      <Text testID="text-under-test" variant="body-strong">
        Sample copy
      </Text>
    );
    expect(getByTestId("text-under-test")).toBeTruthy();
    expect(getByText("Sample copy")).toBeTruthy();
  });
});
