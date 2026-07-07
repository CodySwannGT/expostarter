/**
 * @file Pressable.test.tsx
 * @description Unit tests for the Pressable atom — testID forwarding and
 * onPress firing. One render per test (css-interop teardown constraint).
 * @module components/atoms/Pressable/__tests__/Pressable.test
 */
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

import { Text } from "../../Text";
import { Pressable } from "..";

describe("Pressable", () => {
  it("forwards testID and renders children", () => {
    const onPress = jest.fn();
    const { getByTestId, getByText } = render(
      <Pressable testID="pressable-under-test" onPress={onPress}>
        <Text>Tap me</Text>
      </Pressable>
    );
    expect(getByTestId("pressable-under-test")).toBeTruthy();
    expect(getByText("Tap me")).toBeTruthy();
  });

  it("fires onPress when pressed", () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Pressable testID="pressable-under-test" onPress={onPress}>
        <Text>Tap me</Text>
      </Pressable>
    );
    fireEvent.press(getByTestId("pressable-under-test"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
