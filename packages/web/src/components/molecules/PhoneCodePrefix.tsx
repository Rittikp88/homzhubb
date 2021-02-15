import React, { FC } from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';
import { PopupProps } from 'reactjs-popup/dist/types';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import PopupMenuOptions from '@homzhub/web/src/components/molecules/PopupMenuOptions';
import { IWebProps } from '@homzhub/common/src/components/molecules/FormTextInput';

type Props = IWebProps;
const PhoneCodePrefix: FC<Props> = (props: Props) => {
  console.log('props => ', props);
  const { phoneCodes, fetchFlag, fetchPhoneCodes, inputPrefixText, isBottomSheetVisible, onCloseDropDownWeb } = props;
  const defaultDropDownProps = (isOpen: boolean, width: string): PopupProps => ({
    position: 'bottom right' as 'bottom right',
    on: ['click' as 'click'],
    open: isOpen,
    arrow: false,
    contentStyle: { minWidth: width, marginTop: '4px', alignItems: 'stretch' },
    closeOnDocumentClick: true,
    children: undefined,
  });
  return (
    <View style={styles.dropDownWeb}>
      <Popover
        content={<PopupMenuOptions options={phoneCodes} onMenuOptionPress={onCloseDropDownWeb} />}
        popupProps={defaultDropDownProps(isBottomSheetVisible, 'fit-content')}
      >
        <TouchableOpacity style={styles.inputGroupPrefix} onPress={fetchPhoneCodes}>
          <Image source={{ uri: fetchFlag() }} style={styles.flagStyle} />
          <Label type="regular" style={styles.inputPrefixText}>
            {inputPrefixText}
          </Label>
          <Icon name={icons.downArrowFilled} color={theme.colors.darkTint7} size={12} style={styles.iconStyle} />
        </TouchableOpacity>
      </Popover>
    </View>
  );
};

export default PhoneCodePrefix;

const styles = StyleSheet.create({
  inputGroupPrefix: {
    position: 'absolute',
    left: 1,
    marginTop: 2,
    right: 5,
    width: 90,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: theme.colors.disabled,
  },
  inputPrefixText: {
    color: theme.colors.darkTint4,
  },
  flagStyle: {
    borderRadius: 2,
    width: 24,
    height: 24,
    marginEnd: 6,
  },
  iconStyle: {
    marginStart: 6,
  },
  dropDownWeb: {
    position: 'relative',
    top: '-48px',
  },
});
