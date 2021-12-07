import React from 'react';
import { useDispatch } from 'react-redux';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';

// TODO: (Shikha) - Replace Dummy screen with proper UI

const MoreScreen = (): React.ReactElement => {
  const dispatch = useDispatch();

  const handleLogout = (): void => {
    dispatch(UserActions.logout());
  };

  return (
    <GradientScreen screenTitle="More" isUserHeader>
      <TouchableOpacity style={styles.container} onPress={handleLogout}>
        <Text textType="semiBold">LOGOUT</Text>
      </TouchableOpacity>
    </GradientScreen>
  );
};

export default MoreScreen;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
});
