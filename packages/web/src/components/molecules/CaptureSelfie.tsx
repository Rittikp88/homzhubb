import React, { FC, useRef, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Webcam from 'react-webcam';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';

interface ISelfieProps {
  onCapture: (data: string | null) => void;
}
const CaptureSelfie: FC<ISelfieProps> = (props: ISelfieProps) => {
  const webcamRef = useRef<Webcam>(null);
  const { onCapture } = props;
  const capture = useCallback(() => {
    if (webcamRef && webcamRef.current !== null) {
      const imageSrc = webcamRef.current.getScreenshot();
      onCapture(imageSrc);
    }
  }, [webcamRef]);
  
  return (
    <>
      <View style={Styles.icon}>
        <TouchableOpacity>
          <Icon name={icons.close} size={20} onPress={(): void => onCapture(null)} />
        </TouchableOpacity>
      </View>
      <View style={Styles.webCam}>
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" mirrored />
      </View>
      <View style={Styles.footer}>
        <Button
          type="secondaryOutline"
          icon={icons.camera}
          iconSize={40}
          iconColor={theme.colors.primaryColor}
          fontType="semiBold"
          textSize="small"
          onPress={capture}
        />
      </View>
    </>
  );
};

const Styles = StyleSheet.create({
  footer: {
    marginTop: 30,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    botton: 10,
  },
  webCam: {
    margin: 10,
    top: 30,
  },
  icon: {
    position: 'absolute',
    left: '95%',
    marginVertical: 10,
  },
});
export default CaptureSelfie;
