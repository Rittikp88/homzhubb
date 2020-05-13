import React, { ReactElement } from 'react';
import { Image as RNImage, ImageProps } from 'react-native';

interface IProps extends ImageProps {
  size: number;
}

const ImageRound = ({ source, size, style, ...props }: IProps): ReactElement<RNImage> => {
  return <RNImage style={[style, { height: size, width: size, borderRadius: size / 2 }]} source={source} {...props} />;
};

const ImageSquare = ({ source, size, style, ...props }: IProps): ReactElement<RNImage> => {
  return <RNImage style={[style, { height: size, width: size }]} source={source} {...props} />;
};

export { ImageRound, ImageSquare };
