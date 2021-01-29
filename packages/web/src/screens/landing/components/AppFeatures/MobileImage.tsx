import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';

interface IMobileImageProps {
  relativeImage: string;
  isOwner: boolean;
}
const MobileImage: FC<IMobileImageProps> = (props: IMobileImageProps) => {
  const { relativeImage } = props;
  return <View style={styles.viewGif}>{relativeImage}</View>;
};
export default MobileImage;
const styles = StyleSheet.create({
  viewGif: {
    minWidth: 350,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
