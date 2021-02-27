import React, { useRef } from 'react';
import { View } from 'react-native';
import { PopupActions } from 'reactjs-popup/dist/types';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import CaptureSelfie from '@homzhub/web/src/components/molecules/CaptureSelfie';

interface IProps {
  onCaptureSelfie: (data: string | null) => void;
  takeSelfie: boolean;
}

const CaptureSelfiePopover: React.FC<IProps> = (props: IProps) => {
  const { onCaptureSelfie, takeSelfie } = props;
  const selfiePopoverRef = useRef<PopupActions>(null);
  const onClosePopover = (): void => {
    if (selfiePopoverRef && selfiePopoverRef.current) {
      selfiePopoverRef.current.close();
    }
  };

  return (
    <View>
      <Popover
        content={<CaptureSelfie onCapture={onCaptureSelfie} />}
        popupProps={{
          open: takeSelfie,
          closeOnDocumentClick: false,
          arrow: false,
          contentStyle: { marginTop: '4px', alignItems: 'stretch' },
          children: undefined,
          modal: true,
          onClose: onClosePopover,
        }}
        forwardedRef={selfiePopoverRef}
      />
    </View>
  );
};

export default CaptureSelfiePopover;
