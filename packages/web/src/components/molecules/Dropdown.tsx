import React, { useState } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import { PopupProps } from 'reactjs-popup/dist/types';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import PopupMenuOptions, { IPopupOptions } from '@homzhub/web/src/components/molecules/PopupMenuOptions';

interface IProps {
  label: string;
  value: string;
}
export interface IDropdownProps {
  data: IProps[];
  valueChange: (changedValue: IPopupOptions) => void;
  dropdownVisible: boolean;
  content: React.ReactElement;
}

const DropDown = ({ data, valueChange, dropdownVisible, content }: IDropdownProps): React.ReactElement => {
  const defaultDropDownProps = (width: number): PopupProps => ({
    position: 'bottom right' as 'bottom right',
    on: ['click' as 'click'],
    arrow: false,
    contentStyle: { minWidth: width, marginTop: '4px', alignItems: 'stretch' },
    closeOnDocumentClick: true,
    children: undefined,
    open: dropdownVisible,
  });
  const [width, setWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent): void => {
    setWidth(e.nativeEvent.layout.width);
  };

  return (
    <Popover
      content={<PopupMenuOptions options={data} onMenuOptionPress={valueChange} />}
      popupProps={defaultDropDownProps(width)}
    >
      <View onLayout={onLayout}>{content}</View>
    </Popover>
  );
};

export default DropDown;
