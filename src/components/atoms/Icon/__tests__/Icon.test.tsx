/**
 * @file Icon.test.tsx
 * @description Unit tests for the Icon atom — testID forwarding when
 * rendering a Lucide icon via `as`. One render per test (css-interop
 * teardown constraint).
 * @module components/atoms/Icon/__tests__/Icon.test
 */
import { render } from "@testing-library/react-native";
import { Star } from "lucide-react-native";
import React from "react";

import { Icon } from "..";

describe("Icon", () => {
  it("forwards testID when rendering a Lucide icon", () => {
    // The Gluestack icon wrapper forwards testID onto both the wrapper and
    // the inner SVG node, so getByTestId throws on multiple matches.
    const { getAllByTestId } = render(
      <Icon testID="icon-under-test" as={Star} size="lg" />
    );
    expect(getAllByTestId("icon-under-test").length).toBeGreaterThan(0);
  });

  it("renders with the default md size when size is omitted", () => {
    const { getAllByTestId } = render(
      <Icon testID="icon-default-size" as={Star} />
    );
    expect(getAllByTestId("icon-default-size").length).toBeGreaterThan(0);
  });
});
