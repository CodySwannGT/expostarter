/**
 * @file Box.test.tsx
 * @description Unit tests for the Box atom — testID forwarding and child
 * rendering. One render per test (css-interop teardown constraint).
 * @module components/atoms/Box/__tests__/Box.test
 */
import { render } from "@testing-library/react-native";
import React from "react";

import { Text } from "../../Text";
import { Box } from "..";

describe("Box", () => {
  it("forwards testID and renders children", () => {
    const { getByTestId, getByText } = render(
      <Box testID="box-under-test">
        <Text>Boxed content</Text>
      </Box>
    );
    expect(getByTestId("box-under-test")).toBeTruthy();
    expect(getByText("Boxed content")).toBeTruthy();
  });

  it("renders children without a testID (no data-testid emitted)", () => {
    const { getByText, queryByTestId } = render(
      <Box>
        <Text>Anonymous box</Text>
      </Box>
    );
    expect(getByText("Anonymous box")).toBeTruthy();
    expect(queryByTestId("box-under-test")).toBeNull();
  });
});
