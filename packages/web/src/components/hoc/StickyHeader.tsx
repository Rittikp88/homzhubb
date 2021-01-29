import React, { FC } from 'react';

interface IProps {
  children: React.ReactElement | React.ReactNode;
}

const containerStyle = {
  position: 'sticky' as 'sticky',
  top: 0,
  width: '100%',
  display: 'flex',
  zIndex: 1000,
};

export const StickyHeader: FC<IProps> = ({ children }: IProps) => {
  return <div style={containerStyle}>{children}</div>;
};
