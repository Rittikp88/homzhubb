import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { WithShadowView } from '@homzhub/common/src/components/atoms/WithShadowView';

export interface IBottomSheetProps {
  children: React.ReactElement;
  visible: boolean;
  headerTitle?: string;
  isShadowView?: boolean;
  renderHeader?: boolean;
  onCloseSheet?: () => void;
  sheetHeight?: number;
  sheetContainerStyle?: StyleProp<ViewStyle>;
}

export const BottomSheet = (props: IBottomSheetProps): React.ReactElement => {
  const rbSheet = useRef(null);
  const {
    children,
    sheetContainerStyle,
    sheetHeight,
    visible,
    onCloseSheet,
    isShadowView,
    headerTitle = '',
    renderHeader = true,
  } = props;

  useEffect(() => {
    if (visible && rbSheet.current) {
      // @ts-ignore
      rbSheet.current.open();
    }
    if (!visible && rbSheet.current) {
      // @ts-ignore
      rbSheet.current.close();
    }
  }, [visible]);

  const onCloseBottomSheet = (): void => {
    if (!rbSheet.current) {
      return;
    }
    // @ts-ignore
    rbSheet.current.close();
    if (onCloseSheet) {
      onCloseSheet();
    }
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
            {renderHeader && <WithShadowView isBottomShadow>{header()}</WithShadowView>}
            <View style={styles.contentContainer}>{children}</View>
          </>
        ) : (
          <>
            {renderHeader && header()}
            <View style={styles.contentContainer}>{children}</View>
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
  contentContainer: {
    flex: 1,
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
