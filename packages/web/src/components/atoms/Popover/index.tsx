import React, { FC } from 'react';
import Popup from 'reactjs-popup';
import { PopupActions, PopupProps } from 'reactjs-popup/dist/types';
import '@homzhub/web/src/components/atoms/Popover/popoverStyle.scss';

interface IProps {
  forwardedRef?: React.Ref<PopupActions>;
  content: React.ReactNode | React.ReactElement;
  children: JSX.Element;
  popupProps: PopupProps;
}

/**
 * this component can be used to create any dropdown menus or modals
 */
const Popover: FC<IProps> = (props: IProps) => {
  const { content, children, popupProps, forwardedRef } = props;

  return (
    <Popup ref={forwardedRef} trigger={<div>{children}</div>} {...popupProps}>
      {content}
    </Popup>
  );
};

export default Popover;
