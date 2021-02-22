import { colors } from '@homzhub/common/src/styles/colors';
import { layout } from '@homzhub/common/src/styles/layout';
import { constants } from '@homzhub/common/src/styles/constants';
import { viewport } from '@homzhub/common/src/styles/viewport';
import { form } from '@homzhub/common/src/styles/form';
// TODO : To be fixed --by Shikha

// export interface ITheme {
//   colors: Record<string, string>;
//   viewport: StyleProp<ViewStyle>;
//   form: Record<string, Record<string, string | number> | string>;
//   globalStyles: Record<string, Record<string, string | number>>;
//   layout: Record<string, string | number>;
//   circleCSS: (radius: number) => StyleProp<ViewStyle>;
//   randomHex: () => string;
//   DeviceDimensions: Record<string, Record<string, string | number>>;
// }

// TODO: Make this compact in consideration of dynamic theming, can font & from can be abstracted out?
export const theme = {
  colors,
  form,
  layout,
  viewport,
  ...constants,
};
