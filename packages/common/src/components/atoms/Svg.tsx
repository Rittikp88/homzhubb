import React from 'react';
import Svg, { SvgUri } from 'react-native-svg';

interface IProps {
  uri: string;
  width?: string | number;
  height?: string | number;
  stroke?: string;
  strokeWidth?: number;
  viewBox?: string;
  preserveAspectRatio?: string;
}

const SVGUri = ({
  uri,
  width,
  height,
  viewBox,
  preserveAspectRatio,
  stroke,
  strokeWidth,
}: IProps): React.ReactElement<Svg> => {
  return (
    <SvgUri
      uri={uri}
      height={height}
      width={width}
      stroke={stroke}
      strokeWidth={strokeWidth}
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
    />
  );
};

export { SVGUri };
