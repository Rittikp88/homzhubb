import React, { FC, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import Webcam from 'react-webcam';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
interface ISelfieProps {
  onCapture: (data: string | null) => void;
}
const CaptureSelfie: FC<ISelfieProps> = (props: ISelfieProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const { onCapture } = props;
  const capture = useCallback(() => {
    if (webcamRef && webcamRef.current !== null) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
      onCapture(imgSrc);
    }
  }, [webcamRef, setImgSrc]);
  return (
    <>
      <View>
        <View style={Styles.icon}>
          <TouchableOpacity>
            <Icon name={icons.close} size={20} onPress={() => onCapture(imgSrc)} />
          </TouchableOpacity>
        </View>
        <View style={Styles.webCam}>
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" mirrored={true} />
        </View>
        <View style={Styles.footer}>
          <Button type="secondary" title={'Cpature'} fontType="semiBold" textSize="small" onPress={capture} />
        </View>
      </View>
    </>
  );
};

const Styles = StyleSheet.create({
  footer: {
    marginVertical: 30,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
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
