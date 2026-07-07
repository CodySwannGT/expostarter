/**
 * Project-specific raw-palette color extensions.
 *
 * This module is spread into `theme.extend.colors` in tailwind.config.js and
 * is the sanctioned place for app-specific color FAMILIES that sit alongside
 * the CSS-variable-driven raw palette (primary/typography/background/…).
 *
 * Keep it small: colors added here are raw-palette tier (atom/ui-internal).
 * App code speaks the semantic tier (content/surface/accent/status/outline)
 * defined in tailwind.config.js — grow that tier only via a reviewed PR (the
 * design-system/semantic-token-budget lint rule enforces its closed bound).
 * @module config/colors
 */
const colors = {
  toast: {
    normal: "#032A3E",
    danger: "#A84A4A",
    success: "#032A3E",
    warning: "#032A3E",
    icon: "#FFFFFF",
    text: "#FFFFFF",
  },
};

export default colors;
