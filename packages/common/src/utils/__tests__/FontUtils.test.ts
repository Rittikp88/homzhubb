import { FontUtils } from '@homzhub/common/src/utils/FontUtils';
import { theme } from '@homzhub/common/src/styles/theme';

describe('Font Utils', () => {
  it('should return font type', () => {
    const { light, regular, semiBold, bold, extraBold } = theme.font.fontStyle;
    expect(FontUtils.chooseFontStyle({ fontType: 'light' })).toStrictEqual(light);
    expect(FontUtils.chooseFontStyle({ fontType: 'regular' })).toStrictEqual(regular);
    expect(FontUtils.chooseFontStyle({ fontType: 'semiBold' })).toStrictEqual(semiBold);
    expect(FontUtils.chooseFontStyle({ fontType: 'bold' })).toStrictEqual(bold);
    expect(FontUtils.chooseFontStyle({ fontType: 'extraBold' })).toStrictEqual(extraBold);
    // @ts-ignore
    expect(FontUtils.chooseFontStyle({ fontType: 'default' })).toStrictEqual(regular);
  });
});
