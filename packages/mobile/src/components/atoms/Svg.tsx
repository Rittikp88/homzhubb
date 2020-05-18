import React from 'react';
import Svg, { SvgUri } from 'react-native-svg';

interface IProps {
  uri: string;
  width: string;
  height: string;
}

const SVGUri = ({ uri, width, height }: IProps): React.ReactElement<Svg> => {
  return <SvgUri uri={uri} height={height} width={width} />;
};

export { SVGUri };
