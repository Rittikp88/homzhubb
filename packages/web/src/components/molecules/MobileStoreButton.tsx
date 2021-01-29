import React, { ReactElement } from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, TouchableOpacity } from 'react-native';
import { IWithMediaQuery, withMediaQuery } from '@homzhub/common/src/utils/MediaQueryUtils';
import { LinkingService } from '@homzhub/web/src/services/LinkingService';

export type imageType =
  | 'apple'
  | 'google'
  | 'appleLarge'
  | 'googleLarge'
  | 'instagram'
  | 'twitter'
  | 'youtube'
  | 'linkedin'
  | 'facebook';

export interface IStoreButtonProps {
  store: imageType;
  containerStyle: StyleProp<ImageStyle>;
  imageIconStyle: StyleProp<ImageStyle>;
  mobileImageIconStyle: StyleProp<ImageStyle>;
}

type IProps = IStoreButtonProps & IWithMediaQuery;

class MobileStoreButton extends React.PureComponent<IProps> {
  public render(): ReactElement {
    const { store, isMobile, containerStyle, imageIconStyle, mobileImageIconStyle = {} } = this.props;
    const clickHandler = (): void => {
      LinkingService.redirect(redirectUrl);
    };
    const url = LinkingService.getImage(store);
    const redirectUrl = LinkingService.getUrl(store);
    return (
      <TouchableOpacity style={[styles.storeStyle, containerStyle]} onPress={clickHandler}>
        <Image source={{ uri: url }} style={[imageIconStyle, isMobile && mobileImageIconStyle]} />
      </TouchableOpacity>
    );
  }
}

const StoreButton = withMediaQuery<IProps>(MobileStoreButton);

export default StoreButton;

const styles = StyleSheet.create({
  storeStyle: {
    flex: 1,
    width: 130,
    height: 50,
    alignItems: 'center',
  },
});
