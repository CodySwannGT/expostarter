/**
 * @file Heading.test.tsx
 * @description Unit tests for the Heading atom — testID forwarding and child
 * rendering. One render per test (css-interop teardown constraint).
 * @module components/atoms/Heading/__tests__/Heading.test
 */
import { render } from "@testing-library/react-native";
import React from "react";

import { Heading } from "..";

describe("Heading", () => {
  it("forwards testID and renders children", () => {
    const { getByTestId, getByText } = render(
      <Heading testID="heading-under-test" variant="title-lg">
        Section title
      </Heading>
    );
    expect(getByTestId("heading-under-test")).toBeTruthy();
    expect(getByText("Section title")).toBeTruthy();
  });

  it("renders the default title variant with a custom className and no testID", () => {
    const { getByText, queryByTestId } = render(
      <Heading className="text-content-secondary">Default heading</Heading>
    );
    expect(getByText("Default heading")).toBeTruthy();
    expect(queryByTestId("heading-under-test")).toBeNull();
  });
});
