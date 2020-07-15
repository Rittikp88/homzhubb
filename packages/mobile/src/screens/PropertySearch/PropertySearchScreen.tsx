import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { IPropertiesObject } from '@homzhub/common/src/domain/models/Search';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Label, ToggleButton } from '@homzhub/common/src/components';
import { PropertySearchMap } from '@homzhub/mobile/src/components/organisms/PropertySearchMap';
import PropertySearchList from '@homzhub/mobile/src/components/organisms/PropertySearchList';

interface IStateProps {
  properties: IPropertiesObject;
}

interface IPropertySearchScreenState {
  isMapView: boolean;
}

type Props = IStateProps;

class PropertySearchScreen extends Component<Props, IPropertySearchScreenState> {
  public state = {
    isMapView: true,
  };

  public render(): React.ReactNode {
    const { isMapView } = this.state;
    const { properties } = this.props;
    const containerStyle = isMapView ? styles.container : styles.listContainer;
    return (
      <SafeAreaView style={containerStyle}>
        {/* // TODO: Pass the properties to search map component for getting data */}
        {isMapView ? <PropertySearchMap /> : <PropertySearchList properties={properties} />}
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

const mapStateToProps = (state: IState): IStateProps => {
  const { getProperties } = SearchSelector;
  return {
    properties: getProperties(state),
  };
};

export default connect(mapStateToProps, null)(PropertySearchScreen);

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
