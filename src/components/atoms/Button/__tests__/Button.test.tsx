/**
 * @file Button.test.tsx
 * @description Unit tests for the Button atom — testID forwarding, label
 * rendering, onPress firing, and isLoading disabling the button. One render
 * per test (css-interop teardown constraint).
 * @module components/atoms/Button/__tests__/Button.test
 */
import { fireEvent, render } from "@testing-library/react-native";
import { Star } from "lucide-react-native";
import React from "react";

import { Button } from "..";

describe("Button", () => {
  it("forwards testID and renders the label", () => {
    const { getByTestId, getByText } = render(
      <Button testID="button-under-test" label="Add player" />
    );
    expect(getByTestId("button-under-test")).toBeTruthy();
    expect(getByText("Add player")).toBeTruthy();
  });

  it("fires onPress when pressed", () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Button testID="button-under-test" label="Save" onPress={onPress} />
    );
    fireEvent.press(getByTestId("button-under-test"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("disables the button while isLoading", () => {
    const { getByTestId } = render(
      <Button testID="button-under-test" label="Saving" isLoading />
    );
    expect(getByTestId("button-under-test")).toBeDisabled();
  });

  it("renders a leading icon beside the label with explicit tone/variant/size", () => {
    const { getByTestId, getByText, UNSAFE_getAllByType } = render(
      <Button
        testID="button-leading-icon"
        label="Favorite"
        icon={Star}
        tone="danger"
        variant="outline"
        size="lg"
      />
    );
    expect(getByTestId("button-leading-icon")).toBeTruthy();
    expect(getByText("Favorite")).toBeTruthy();
    expect(UNSAFE_getAllByType(Star).length).toBeGreaterThan(0);
  });

  it("renders a trailing icon when iconPosition is trailing", () => {
    const { getByText, UNSAFE_getAllByType } = render(
      <Button
        testID="button-trailing-icon"
        label="Next"
        icon={Star}
        iconPosition="trailing"
        tone="secondary"
      />
    );
    expect(getByText("Next")).toBeTruthy();
    expect(UNSAFE_getAllByType(Star).length).toBeGreaterThan(0);
  });

  it("hides the leading icon while isLoading", () => {
    const { getByTestId, UNSAFE_queryAllByType } = render(
      <Button
        testID="button-loading-leading"
        label="Saving"
        icon={Star}
        isLoading
        tone="positive"
      />
    );
    expect(getByTestId("button-loading-leading")).toBeDisabled();
    expect(UNSAFE_queryAllByType(Star)).toHaveLength(0);
  });

  it("hides the trailing icon while isLoading", () => {
    const { getByTestId, UNSAFE_queryAllByType } = render(
      <Button
        testID="button-loading-trailing"
        label="Sending"
        icon={Star}
        iconPosition="trailing"
        isLoading
      />
    );
    expect(getByTestId("button-loading-trailing")).toBeDisabled();
    expect(UNSAFE_queryAllByType(Star)).toHaveLength(0);
  });

  it("renders icon-only with an accessibilityLabel and no visible text", () => {
    const { getByTestId, queryByText, UNSAFE_getAllByType } = render(
      <Button
        testID="button-icon-only"
        accessibilityLabel="Favorite player"
        icon={Star}
        variant="link"
        size="xs"
      />
    );
    expect(getByTestId("button-icon-only")).toBeTruthy();
    expect(queryByText("Favorite player")).toBeNull();
    expect(UNSAFE_getAllByType(Star).length).toBeGreaterThan(0);
  });

  it("disables the button when isDisabled is set without isLoading", () => {
    const { getByTestId } = render(
      <Button testID="button-disabled" label="Blocked" isDisabled />
    );
    expect(getByTestId("button-disabled")).toBeDisabled();
  });
});
