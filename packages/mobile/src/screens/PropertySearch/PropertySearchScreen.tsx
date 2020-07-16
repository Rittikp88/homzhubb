import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { IPropertiesObject } from '@homzhub/common/src/domain/models/Search';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button, ButtonType, FontWeightType, Label, ToggleButton } from '@homzhub/common/src/components';
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
}

interface IPropertySearchScreenState {
  isMapView: boolean;
  selectedOnScreenFilter: OnScreenFilters | string;
}

type Props = WithTranslation & IStateProps;

class PropertySearchScreen extends PureComponent<Props, IPropertySearchScreenState> {
  public state = {
    isMapView: true,
    selectedOnScreenFilter: '',
  };

  public render(): React.ReactNode {
    const { isMapView } = this.state;
    const { properties } = this.props;
    const containerStyle = isMapView ? styles.container : styles.listContainer;
    return (
      <SafeAreaView style={containerStyle}>
        {this.renderFilterTray()}
        {/* // TODO: Pass the properties to search map component for getting data */}
        {isMapView ? <PropertySearchMap /> : <PropertySearchList properties={properties} />}
        {this.renderBar()}
      </SafeAreaView>
    );
  }

  private renderFilterTray = (): React.ReactNode => {
    const { t } = this.props;
    const { selectedOnScreenFilter } = this.state;
    const onScreenFilters = [
      { type: OnScreenFilters.TYPE, label: t('type') },
      { type: OnScreenFilters.ROOMS, label: t('rooms') },
      { type: OnScreenFilters.PRICE, label: t('price') },
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

          const onPress = () => this.setState({ selectedOnScreenFilter: type });

          if (index === 3) {
            return (
              <Button
                key={type}
                type={buttonType}
                icon={label}
                iconColor={iconColor}
                iconSize={20}
                onPress={onPress}
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

export default connect(
  mapStateToProps,
  null
)(withTranslation(LocaleConstants.namespacesKey.propertySearch)(PropertySearchScreen));

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  filterButtons: {
    flex: 0,
  },
  menuTrayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: 12,
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
  listContainer: {
    flex: 1,
    margin: theme.layout.screenPadding,
  },
});
