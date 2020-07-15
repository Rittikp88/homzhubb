import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Label, ToggleButton } from '@homzhub/common/src/components';
import { PropertySearchMap } from '@homzhub/mobile/src/components/organisms/PropertySearchMap';
import PropertySearchList from '@homzhub/mobile/src/components/organisms/PropertySearchList';

interface IState {
  isMapView: boolean;
}

class PropertySearchScreen extends Component<{}, IState> {
  public state = {
    isMapView: true,
  };

  public render(): React.ReactNode {
    const { isMapView } = this.state;
    const containerStyle = isMapView ? styles.container : styles.listContainer;
    return (
      <SafeAreaView style={containerStyle}>
        {isMapView ? <PropertySearchMap /> : <PropertySearchList />}
        {this.renderBar()}
      </SafeAreaView>
    );
  }

  private renderBar = (): React.ReactNode => {
    const { isMapView } = this.state;
    return (
      <View style={styles.bar}>
        <View style={styles.propertiesFound}>
          <Label type="regular" textType="regular">
            102 Properties found
          </Label>
        </View>
        <ToggleButton
          onToggle={this.handleToggle}
          title={isMapView ? 'List' : 'Map'}
          icon={isMapView ? icons.list : icons.map}
        />
      </View>
    );
  };

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
  },
  bar: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: 50,
    width: theme.viewport.width,
    paddingHorizontal: theme.layout.screenPadding,
  },
  propertiesFound: {
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  listContainer: {
    flex: 1,
    margin: theme.layout.screenPadding,
  },
});
