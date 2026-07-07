import { tva } from '@gluestack-ui/utils/nativewind-utils';
import { isWeb } from '@gluestack-ui/utils/nativewind-utils';

// `shrink-0` matches react-native(-web) View semantics (flex-shrink: 0).
// Without it the web div defaults to shrink:1, so View→Box swaps let
// containers collapse below content height in tight columns and their
// overflow intercepts pointer events on siblings (caught by the contracts
// mobile e2e at 320×568). Native Box (RN View) always had shrink:0.
const baseStyle = isWeb
  ? 'flex flex-col relative z-0 box-border border-0 list-none min-w-0 min-h-0 shrink-0 bg-transparent items-stretch m-0 p-0 text-decoration-none'
  : '';

export const boxStyle = tva({
  base: baseStyle,
});
