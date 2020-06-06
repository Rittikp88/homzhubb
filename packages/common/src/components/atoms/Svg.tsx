import React from 'react';
import Svg, { SvgUri } from 'react-native-svg';

interface IProps {
  uri: string;
  width?: string | number;
  height?: string | number;
  viewBox?: string;
  preserveAspectRatio?: string;
}

const SVGUri = ({ uri, width, height, viewBox, preserveAspectRatio }: IProps): React.ReactElement<Svg> => {
  return <SvgUri uri={uri} height={height} width={width} viewBox={viewBox} preserveAspectRatio={preserveAspectRatio} />;
};

export { SVGUri };
