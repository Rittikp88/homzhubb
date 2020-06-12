import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { WithShadowView } from '@homzhub/common/src/components/atoms/WithShadowView';

export interface IBottomSheetProps {
  children: React.ReactElement;
  visible: boolean;
  headerTitle?: string;
  isShadowView?: boolean;
  onCloseSheet: () => void;
  sheetHeight?: number;
  sheetContainerStyle?: StyleProp<ViewStyle>;
}

export const BottomSheet = (props: IBottomSheetProps): React.ReactElement => {
  const rbSheet = useRef();
  const { children, sheetContainerStyle, sheetHeight, visible, onCloseSheet, isShadowView, headerTitle = '' } = props;

  useEffect(() => {
    if (visible) {
      // @ts-ignore
      rbSheet.current.open();
    } else {
      // @ts-ignore
      rbSheet.current.close();
    }
  }, [visible]);
  const onCloseBottomSheet = (): void => {
    // @ts-ignore
    rbSheet.current.close();
    onCloseSheet();
  };

  const header = (): React.ReactElement => {
    return (
      <View style={styles.bottomSheetHeader}>
        <Icon name={icons.close} size={22} color={theme.colors.darkTint3} onPress={onCloseBottomSheet} />
        <Label type="large" textType="semiBold" style={styles.headerTitle}>
          {headerTitle}
        </Label>
      </View>
    );
  };

  return (
    <RBSheet
      // @ts-ignore
      ref={rbSheet}
      animationType="slide"
      height={sheetHeight}
      closeOnDragDown
      dragFromTopOnly
      onClose={onCloseSheet}
      customStyles={{
        container: {
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        },
      }}
    >
      <View style={[styles.sheetContainer, sheetContainerStyle]}>
        {isShadowView ? (
          <>
            <WithShadowView>{header()}</WithShadowView>
            {children}
          </>
        ) : (
          <>
            {header()}
            {children}
          </>
        )}
      </View>
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    flex: 1,
    marginTop: 18,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    alignContent: 'center',
    paddingBottom: 20,
    marginHorizontal: 24,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
});
