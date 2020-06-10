import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { CommonService } from '@homzhub/common/src/services/CommonService';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { PropertyRepository } from '@homzhub/common/src/domain/repositories/PropertyRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { PropertyActions } from '@homzhub/common/src/modules/property/actions';
import { PropertySelector } from '@homzhub/common/src/modules/property/selectors';
import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import {
  IUpdateAssetDetails,
  SpaceAvailableTypes,
  ISpaceAvailable,
  ISpaceAvailablePayload,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { Button, WithShadowView } from '@homzhub/common/src/components';
import Header from '@homzhub/mobile/src/components/molecules/Header';
import { PropertyDetailsLocation } from '@homzhub/mobile/src/components/molecules/PropertyDetailsLocation';
import PropertyDetailsItems from '@homzhub/mobile/src/components/organisms/PropertyDetailItems';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IPropertyDetailsData, IPropertyTypes } from '@homzhub/common/src/domain/models/Property';
import { AppStackParamList } from '@homzhub/mobile/src/navigation/AppNavigator';

interface IDispatchProps {
  getPropertyDetails: () => void;
}

interface IStateProps {
  property: IPropertyDetailsData[] | null;
}

type libraryProps = WithTranslation & NavigationScreenProps<AppStackParamList, ScreensKeys.PropertyDetailsScreen>;
type Props = IDispatchProps & IStateProps & libraryProps;

interface IPropertyDetailsState {
  propertyGroupSelectedIndex: string | number;
  propertyGroupTypeSelectedIndex: string | number;
  areaUnits: IDropdownOption[];
  spaceAvailable: ISpaceAvailable;
  carpetAreaError: boolean;
}

class PropertyDetails extends React.PureComponent<Props, IPropertyDetailsState> {
  public state = {
    propertyGroupSelectedIndex: 0,
    propertyGroupTypeSelectedIndex: 0,
    areaUnits: [],
    spaceAvailable: {
      bedroom: 0,
      bathroom: 0,
      balcony: 0,
      floorNumber: 0,
      totalFloors: 0,
      carpetArea: '',
      areaUnit: 'SQ_FT',
    },
    carpetAreaError: false,
  };

  public componentDidMount(): void {
    const { getPropertyDetails } = this.props;
    getPropertyDetails();
  }

  public render(): React.ReactNode {
    const {
      property,
      t,
      route: {
        params: { primaryAddress, secondaryAddress },
      },
    } = this.props;
    const {
      propertyGroupSelectedIndex,
      propertyGroupTypeSelectedIndex,
      areaUnits,
      spaceAvailable,
      carpetAreaError,
    } = this.state;
    if (!property) {
      return null;
    }
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={theme.colors.primaryColor}
          icon={icons.leftArrow}
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
            propertyName={primaryAddress ?? ''}
            propertyAddress={secondaryAddress ?? ''}
            onNavigate={this.onNavigateToMaps}
          />
          <PropertyDetailsItems
            data={property}
            areaUnits={areaUnits}
            spaceAvailable={spaceAvailable}
            propertyGroupSelectedIndex={propertyGroupSelectedIndex}
            propertyGroupTypeSelectedIndex={propertyGroupTypeSelectedIndex}
            carpetAreaError={carpetAreaError}
            onPropertyGroupChange={this.onPropertyGroupChange}
            onPropertyGroupTypeChange={this.onPropertyGroupTypeChange}
            onSpaceAvailableValueChange={this.onSpaceAvailableValueChange}
            onCommercialPropertyChange={this.updateSpaceAvailable}
          />
        </ScrollView>
        <WithShadowView outerViewStyle={styles.shadowView}>
          <Button
            type="primary"
            title={t('common:submit')}
            containerStyle={styles.buttonStyle}
            onPress={this.onSubmit}
          />
        </WithShadowView>
      </View>
    );
  }

  public onNavigateToMaps = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  public onPropertyGroupChange = async (index: string | number): Promise<void> => {
    const { spaceAvailable } = this.state;
    this.setState({
      propertyGroupSelectedIndex: index,
      propertyGroupTypeSelectedIndex: 0,
      spaceAvailable: {
        ...spaceAvailable,
        bathroom: 0,
      },
    });
    if (index === 1) {
      await this.getCarpetAreaUnits();
    }
  };

  public onPropertyGroupTypeChange = (index: string | number): void => {
    this.setState({
      propertyGroupTypeSelectedIndex: index,
    });
  };

  public onSpaceAvailableValueChange = (item: IPropertyTypes, index: string | number): void => {
    switch (item.name) {
      case SpaceAvailableTypes.BATHROOM:
        this.updateSpaceAvailable('bathroom', index);
        break;
      case SpaceAvailableTypes.BALCONY:
        this.updateSpaceAvailable('balcony', index);
        break;
      case SpaceAvailableTypes.TOTAL_FLOORS:
        this.updateSpaceAvailable('totalFloors', index);
        break;
      case SpaceAvailableTypes.FLOOR_NUMBER:
        this.updateSpaceAvailable('floorNumber', index);
        break;
      case SpaceAvailableTypes.BEDROOM:
        this.updateSpaceAvailable('bedroom', index);
        break;
      default:
        break;
    }
  };

  private onSubmit = async (): Promise<void> => {
    const {
      navigation,
      property,
      route: {
        params: { propertyId },
      },
    } = this.props;
    const {
      spaceAvailable: { carpetArea, areaUnit, floorNumber, totalFloors },
      propertyGroupSelectedIndex,
      propertyGroupTypeSelectedIndex,
    } = this.state;

    if (!property) {
      return;
    }
    const spaces = this.getSpacesForProperty();
    try {
      let requestPayload: IUpdateAssetDetails = {
        asset_type: Number(property[propertyGroupSelectedIndex].asset_types[propertyGroupTypeSelectedIndex].id),
        spaces,
      };
      if (propertyGroupSelectedIndex === 1) {
        requestPayload = {
          ...requestPayload,
          carpet_area: carpetArea.toString(),
          carpet_area_unit: areaUnit,
          floor_number: floorNumber,
          total_floors: totalFloors,
        };
        if (carpetArea) {
          await PropertyRepository.updateAsset(propertyId, requestPayload);
          navigation.navigate(ScreensKeys.RentServicesScreen);
        } else {
          this.setState({ carpetAreaError: true });
        }
      } else {
        await PropertyRepository.updateAsset(propertyId, requestPayload);
        navigation.navigate(ScreensKeys.RentServicesScreen);
      }
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };

  public getSpacesForProperty(): ISpaceAvailablePayload[] {
    const {
      spaceAvailable: { bathroom, bedroom, balcony },
      propertyGroupSelectedIndex,
    } = this.state;
    const { property } = this.props;
    const spaces: ISpaceAvailablePayload[] = [];
    const countOfSpace = (type: string): number => {
      switch (type) {
        case SpaceAvailableTypes.BATHROOM:
          return bathroom;
        case SpaceAvailableTypes.BEDROOM:
          return bedroom;
        case SpaceAvailableTypes.BALCONY:
          return balcony;
        default:
          return 0;
      }
    };
    property?.[propertyGroupSelectedIndex].space_types.forEach((spaceType) => {
      spaces.push({
        id: spaceType.id,
        count: countOfSpace(spaceType.name),
      });
    });
    return spaces;
  }

  public getCarpetAreaUnits = async (): Promise<void> => {
    const response = await CommonService.getCarpetAreaUnits();
    this.setState({
      areaUnits: response,
    });
  };

  public handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  public updateSpaceAvailable = (type: string, value: string | number): void => {
    const { spaceAvailable } = this.state;
    this.setState({
      spaceAvailable: {
        ...spaceAvailable,
        [type]: value,
      },
      carpetAreaError: false,
    });
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
