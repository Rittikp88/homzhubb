import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

export interface IBottomSheetProps {
  children: React.ReactElement;
  visible: boolean;
  onCloseSheet: () => void;
  sheetHeight?: number;
  sheetContainerStyle?: StyleProp<ViewStyle>;
}

export const BottomSheet = (props: IBottomSheetProps): React.ReactElement => {
  const rbSheet = useRef();
  const { children, sheetContainerStyle, sheetHeight, visible, onCloseSheet } = props;

  useEffect(() => {
    if (visible) {
      // @ts-ignore
      rbSheet.current.open();
    } else {
      // @ts-ignore
      rbSheet.current.close();
    }
  });
  return (
    <RBSheet
      // @ts-ignore
      ref={rbSheet}
      animationType="slide"
      height={sheetHeight}
      closeOnDragDown
      dragFromTopOnly
      onClose={onCloseSheet}
    >
      <View style={[styles.sheetContainer, sheetContainerStyle]}>{children}</View>
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    flex: 1,
    marginHorizontal: 26,
    marginVertical: 20,
  },
});
