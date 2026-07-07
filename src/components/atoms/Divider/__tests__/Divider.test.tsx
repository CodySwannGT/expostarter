/**
 * @file Divider atom tests.
 * @description Verifies the structured Divider atom renders standalone.
 * @module components/atoms/Divider/__tests__/Divider.test
 */
import { render } from "@testing-library/react-native";

import { Divider } from "..";

describe("Divider atom", () => {
  it("renders with a testID", () => {
    const { getByTestId } = render(<Divider testID="divider-atom" />);
    expect(getByTestId("divider-atom")).toBeTruthy();
  });
});
