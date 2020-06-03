import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { theme } from '@homzhub/common/src/styles/theme';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { PropertyActions } from '@homzhub/common/src/modules/property/actions';
import { PropertySelector } from '@homzhub/common/src/modules/property/selectors';
import { IPropertyDetailsData, IPropertyTypes } from '@homzhub/common/src/domain/models/Property';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { Button, WithShadowView } from '@homzhub/common/src/components';
import Header from '@homzhub/mobile/src/components/molecules/Header';
import { PropertyDetailsLocation } from '@homzhub/mobile/src/components/molecules/PropertyDetailsLocation';
import PropertyDetailsItems from '@homzhub/mobile/src/components/organisms/PropertyDetailItems';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AppStackParamList } from '@homzhub/mobile/src/navigation/AppNavigator';

interface IDispatchProps {
  getPropertyDetails: () => void;
}

interface IStateProps {
  property: IPropertyDetailsData[] | null;
}

type libraryProps = WithTranslation & NavigationScreenProps<AppStackParamList, ScreensKeys.PropertyDetailsScreen>;
type Props = IDispatchProps & IStateProps & libraryProps;

interface ISpaceAvailable {
  bedroom?: number;
  bathroom?: number;
  balcony?: number;
  floorNumber?: number;
  totalFloors?: number;
  carpetArea?: number;
  areaUnit?: string;
}

interface IPropertyDetailsState {
  propertyGroupSelectedIndex: string | number;
  propertyGroupTypeSelectedIndex: string | number;
  isSelected: boolean;
  propertyGroup: IPropertyTypes | IPropertyDetailsData | null;
  propertyGroupType: IPropertyTypes | null;
  spaceAvailable: ISpaceAvailable;
}

class PropertyDetails extends React.PureComponent<Props, IPropertyDetailsState> {
  public state = {
    propertyGroupSelectedIndex: 0,
    propertyGroupTypeSelectedIndex: 0,
    isSelected: false,
    propertyGroup: null,
    propertyGroupType: null,
    spaceAvailable: {
      bedroom: 0,
      bathroom: 0,
      balcony: 0,
      floorNumber: 0,
      totalFloors: 0,
      carpetArea: 0,
      areaUnit: '',
    },
  };

  public componentDidMount(): void {
    const { getPropertyDetails } = this.props;
    getPropertyDetails();
  }

  public render(): React.ReactNode {
    const { property, t } = this.props;
    const { propertyGroupSelectedIndex, propertyGroupTypeSelectedIndex, isSelected } = this.state;
    if (!property) {
      return null;
    }
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={theme.colors.primaryColor}
          icon="left-arrow"
          iconColor="white"
          onIconPress={this.handleIconPress}
          isHeadingVisible
          title={t('propertyDetails:headerTitle')}
          titleType="small"
          titleFontType="semiBold"
          titleStyle={styles.headerTitle}
        />
        <ScrollView style={styles.scrollContainer}>
          <PropertyDetailsLocation
            propertyName="Kalapataru Splendour"
            propertyAddress="Shankar Kalat Nagar, Maharashtra 411057"
            onNavigate={this.onNavigateToMaps}
          />
          <PropertyDetailsItems
            data={property}
            propertyGroupSelectedIndex={propertyGroupSelectedIndex}
            propertyGroupTypeSelectedIndex={propertyGroupTypeSelectedIndex}
            onPropertyGroupChange={this.onPropertyGroupChange}
            onPropertyGroupTypeChange={this.onPropertyGroupTypeChange}
          />
        </ScrollView>
        <WithShadowView outerViewStyle={styles.shadowView}>
          <Button
            type="primary"
            title={t('common:submit')}
            disabled={!isSelected}
            containerStyle={styles.buttonStyle}
            onPress={this.onSubmit}
          />
        </WithShadowView>
      </View>
    );
  }

  public onNavigateToMaps = (): void => {};

  public onPropertyGroupChange = (item: IPropertyTypes | IPropertyDetailsData, index: string | number): void => {
    this.setState({
      propertyGroupSelectedIndex: index,
      propertyGroupTypeSelectedIndex: 0,
      propertyGroup: item,
    });
  };

  public onPropertyGroupTypeChange = (item: IPropertyTypes, index: string | number): void => {
    this.setState({
      propertyGroupTypeSelectedIndex: index,
      propertyGroupType: item,
    });
  };

  private onSubmit = (): void => {
    const { propertyGroup, propertyGroupType, spaceAvailable } = this.state;
    console.log(propertyGroup, propertyGroupType, spaceAvailable);
  };

  public handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    property: PropertySelector.getPropertyDetails(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getPropertyDetails } = PropertyActions;
  return bindActionCreators(
    {
      getPropertyDetails,
    },
    dispatch
  );
};

export default connect<IStateProps, IDispatchProps, WithTranslation, IState>(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(PropertyDetails));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollContainer: {
    flex: 1,
  },
  headerTitle: {
    color: theme.colors.white,
  },
  shadowView: {
    paddingTop: 10,
    marginBottom: PlatformUtils.isIOS() ? 20 : 0,
    paddingBottom: 0,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
});
