import React, { FC, CSSProperties } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import MobilePanel from '@homzhub/common/src/assets/images/mobilePanel.svg';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IMobileImageProps {
  relativeImage: string;
  isOwner: boolean;
}
const MobileImage: FC<IMobileImageProps> = (props: IMobileImageProps) => {
  const { relativeImage, isOwner } = props;
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const styles = imageStyles(isMobile, isTablet);

  const styleGifs: CSSProperties = {
    width: isMobile ? 98.94 : 157,
    height: isMobile ? 176.44 : 280.15,
    position: 'absolute',
    left: isMobile ? '40.1%' : '40%',
    top: isMobile ? '26.2%' : '19.7%',
  };
  return (
    <View style={[styles.viewGif, !isOwner && !isMobile && !isTablet && styles.tenantViewGif]}>
      <MobilePanel width={isMobile ? 310 : 492.24} height={isMobile ? 400 : 500} />
      {relativeImage !== '' && <img src={relativeImage} style={styleGifs} alt="" />}
    </View>
  );
};
export default MobileImage;

interface IMobileContainer {
  viewGif: ViewStyle;
  tenantViewGif: ViewStyle;
}
const imageStyles = (isMobile: boolean, isTablet: boolean): StyleSheet.NamedStyles<IMobileContainer> =>
  StyleSheet.create<IMobileContainer>({
    viewGif: {
      justifyContent: 'center',
      alignItems: 'center',
      left: !isMobile ? (isTablet ? '0%' : '2%') : '0%',
    },
    tenantViewGif: {
      left: '0%',
    },
  });