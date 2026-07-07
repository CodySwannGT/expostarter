/**
 * @file Guards the @gluestack-ui/utils tailwind-merge patch.
 * @description The custom text-style tokens (tailwind.config.js fontSize:
 * micro, caption, body, the title tiers and the display tiers) must be
 * registered in tailwind-merge's font-size class group — otherwise twMerge
 * classifies them as text COLORS and a color class later in the merge
 * silently deletes the font size, shrinking headings app-wide. That
 * registration lives in patches/@gluestack-ui+utils+3.0.21.patch (cn AND
 * tva); this test fails if the patch stops applying (e.g. a dependency bump
 * without re-porting it).
 */
import { cn, tva } from "@gluestack-ui/utils/nativewind-utils";

const FONT_SIZE_TOKENS = [
  "micro",
  "caption",
  "body",
  "title-sm",
  "title",
  "title-lg",
  "display-sm",
  "display-md",
  "display-lg",
  "display-xl",
  "display-2xl",
] as const;

describe("custom fontSize tokens survive tailwind-merge", () => {
  it.each(FONT_SIZE_TOKENS)(
    "cn keeps text-%s when a color class follows",
    token => {
      expect(cn(`text-${token} text-typography-900`)).toContain(
        `text-${token}`
      );
    }
  );

  it("tva keeps the font-size token when a color class follows", () => {
    const style = tva({ base: "text-display-md text-typography-900" });
    expect(style({})).toContain("text-display-md");
  });

  it("still collapses size-vs-size conflicts (later size wins)", () => {
    expect(cn("text-body text-title-lg")).toBe("text-title-lg");
  });

  it("still collapses color-vs-color conflicts (later color wins)", () => {
    expect(cn("text-red-500 text-typography-900")).toBe("text-typography-900");
  });
});
