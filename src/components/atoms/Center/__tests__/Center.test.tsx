/**
 * @file Center atom tests — render smoke test.
 * @description Leaf container: a single render() per it() (css-interop
 * teardown constraint) asserting the container mounts with its content.
 */
import { render } from "@testing-library/react-native";

import { Center } from "..";
import { Text } from "../../Text";

describe("Center atom", () => {
  it("renders the centering container with its content", () => {
    const { getByText } = render(
      <Center>
        <Text variant="body">Centered</Text>
      </Center>
    );

    expect(getByText("Centered")).toBeTruthy();
  });
});
