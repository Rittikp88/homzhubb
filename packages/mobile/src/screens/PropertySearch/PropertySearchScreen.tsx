import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import ToggleButton from '@homzhub/common/src/components/atoms/ToggleButton';

interface IState {
  isMapView: boolean;
}

// TODO: Dummy Screen for Tab Testing
class PropertySearchScreen extends Component<{}, IState> {
  public state = {
    isMapView: false,
  };

  public render(): React.ReactNode {
    const { isMapView } = this.state;
    return (
      <View style={styles.container}>
        <Text type="regular" textType="regular">
          Property Search Tab!
        </Text>
        <ToggleButton
          onToggle={this.handleToggle}
          title={isMapView ? 'Map' : 'List'}
          icon={isMapView ? icons.map : icons.list}
        />
      </View>
    );
  }

  private handleToggle = (): void => {
    const { isMapView } = this.state;
    this.setState({
      isMapView: !isMapView,
    });
  };
}

export default PropertySearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
