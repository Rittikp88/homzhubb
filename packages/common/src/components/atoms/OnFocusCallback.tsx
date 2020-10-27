import React, { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export const OnFocusCallback = ({ callback }: { callback: () => Promise<void> }): React.ReactElement => {
  useFocusEffect(
    useCallback(() => {
      callback().then();
    }, [callback])
  );
  return <></>;
};
