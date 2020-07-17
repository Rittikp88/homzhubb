import React, { PureComponent } from 'react';
import { SafeAreaView, StyleSheet, View, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { IFilterDetails, IPropertiesObject } from '@homzhub/common/src/domain/models/Search';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button, ButtonType, Divider, FontWeightType, Label, ToggleButton } from '@homzhub/common/src/components';
import { RoomsFilter } from '@homzhub/mobile/src/components/molecules/RoomsFilter';
import { AssetTypeFilter } from '@homzhub/mobile/src/components/organisms/AssetTypeFilter';
import { PropertySearchMap } from '@homzhub/mobile/src/components/organisms/PropertySearchMap';
import PropertySearchList from '@homzhub/mobile/src/components/organisms/PropertySearchList';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

enum OnScreenFilters {
  TYPE = 'TYPE',
  PRICE = 'PRICE',
  ROOMS = 'ROOMS',
  MORE = 'MORE',
}

interface IStateProps {
  properties: IPropertiesObject;
  filterData: IFilterDetails | null;
}

interface IPropertySearchScreenState {
  isMapView: boolean;
  selectedOnScreenFilter: OnScreenFilters | string;
  isMenuTrayCollapsed: boolean;
}

type Props = WithTranslation & IStateProps;

class PropertySearchScreen extends PureComponent<Props, IPropertySearchScreenState> {
  public state = {
    isMapView: true,
    selectedOnScreenFilter: '',
    isMenuTrayCollapsed: false,
  };

  public render(): React.ReactNode {
    const { isMapView, isMenuTrayCollapsed } = this.state;
    const { properties } = this.props;
    return (
      <>
        <View style={styles.statusBar}>
          <StatusBar translucent backgroundColor={theme.colors.background} barStyle="dark-content" />
        </View>
        <SafeAreaView style={styles.container}>
          {this.renderFilterTray()}
          <Divider />
          {isMenuTrayCollapsed && <View style={styles.trayContainer}>{this.renderCollapsibleTray()}</View>}
          {isMapView ? (
            <PropertySearchMap />
          ) : (
            <PropertySearchList properties={properties} onFavorite={this.onFavoriteProperty} />
          )}
          {this.renderBar()}
        </SafeAreaView>
      </>
    );
  }

  private renderCollapsibleTray = (): React.ReactNode => {
    const { selectedOnScreenFilter } = this.state;
    const { filterData } = this.props;

    if (!filterData) {
      return null;
    }

    switch (selectedOnScreenFilter) {
      case OnScreenFilters.ROOMS:
        return (
          <RoomsFilter
            bedCount={[1, 2]}
            bathroomCount={[3]}
            onSelection={(type: string, value: number): void => console.log(type)}
          />
        );
      case OnScreenFilters.TYPE:
        return <AssetTypeFilter filterData={filterData} />;
      default:
        return null;
    }
  };

  private renderFilterTray = (): React.ReactNode => {
    const { t } = this.props;
    const { selectedOnScreenFilter, isMenuTrayCollapsed } = this.state;
    const onScreenFilters = [
      { type: OnScreenFilters.TYPE, label: t('type') },
      { type: OnScreenFilters.PRICE, label: t('price') },
      { type: OnScreenFilters.ROOMS, label: t('rooms') },
      { type: OnScreenFilters.MORE, label: icons.filter },
    ];
    return (
      <View style={styles.menuTrayContainer}>
        {onScreenFilters.map((item: { type: OnScreenFilters; label: string }, index: number) => {
          const { type, label } = item;
          let buttonType: ButtonType = 'secondary';
          let fontWeight: FontWeightType = 'regular';
          let iconColor = theme.colors.primaryColor;
          if (selectedOnScreenFilter === type) {
            buttonType = 'primary';
            fontWeight = 'semiBold';
            iconColor = theme.colors.secondaryColor;
          }

          const onPress = (): void =>
            this.setState({ selectedOnScreenFilter: type, isMenuTrayCollapsed: !isMenuTrayCollapsed });

          const navigateToFilters = (): void => console.log('Navigate to Filters');

          if (index === 3) {
            return (
              <Button
                key={type}
                type={buttonType}
                icon={label}
                iconColor={iconColor}
                iconSize={20}
                onPress={navigateToFilters}
                iconStyle={styles.menuButtonText}
                containerStyle={styles.filterButtons}
              />
            );
          }
          return (
            <Button
              key={type}
              title={label}
              type={buttonType}
              textType="label"
              textSize="regular"
              fontType={fontWeight}
              onPress={onPress}
              containerStyle={styles.filterButtons}
              titleStyle={styles.menuButtonText}
            />
          );
        })}
      </View>
    );
  };

  private renderBar = (): React.ReactNode => {
    const { isMapView, isMenuTrayCollapsed } = this.state;
    if (isMenuTrayCollapsed) {
      return null;
    }
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

  public onFavoriteProperty = (propertyId: number): void => {};

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
    filterData: SearchSelector.getFilterDetail(state),
  };
};

export default connect(
  mapStateToProps,
  null
)(withTranslation(LocaleConstants.namespacesKey.propertySearch)(PropertySearchScreen));

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: PlatformUtils.isIOS() ? 30 : StatusBar.currentHeight,
    backgroundColor: theme.colors.background,
  },
  bar: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: theme.viewport.height * 0.14,
    width: theme.viewport.width,
    paddingHorizontal: theme.layout.screenPadding,
  },
  trayContainer: {
    backgroundColor: theme.colors.white,
    padding: 16,
  },
  menuTrayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: 12,
  },
  filterButtons: {
    flex: 0,
  },
  menuButtonText: {
    marginVertical: 8,
    marginHorizontal: 24,
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
});
