import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { AssetService, PropertyStatus } from '@homzhub/common/src/services/Property/AssetService';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button, Label, Text } from '@homzhub/common/src/components';
import { PropertyAmenities, PropertyAddressCountry, ProgressBar, ShieldGroup } from '@homzhub/mobile/src/components';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';

interface IState {
  currentPropertyIndex: number;
  data: Asset[];
}

type Props = WithTranslation;

export class PendingPropertyListCard extends Component<Props, IState> {
  public state = {
    currentPropertyIndex: 0,
    data: [],
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getPendingProperties();
  };

  public render(): React.ReactNode {
    const { currentPropertyIndex, data } = this.state;
    const { t } = this.props;
    const currentProperty = data[currentPropertyIndex];
    const total = data.length;
    return (
      <View style={styles.container}>
        <View style={styles.headingView}>
          <View style={styles.headingContent}>
            <Icon name={icons.warning} size={16} />
            <Text type="small" textType="semiBold" style={styles.label}>
              {t('pendingProperties', { total })}
            </Text>
          </View>
          <View style={styles.headingContent}>
            <TouchableOpacity style={styles.iconStyle}>
              <Icon
                name={icons.leftArrow}
                size={16}
                onPress={this.handlePrevious}
                color={currentPropertyIndex === 0 ? theme.colors.darkTint4 : theme.colors.primaryColor}
                testID="icnPrevious"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconStyle} disabled={currentPropertyIndex === total - 1}>
              <Icon
                name={icons.rightArrow}
                size={16}
                onPress={this.handleNext}
                color={currentPropertyIndex === total - 1 ? theme.colors.darkTint4 : theme.colors.primaryColor}
                testID="icnNext"
              />
            </TouchableOpacity>
          </View>
        </View>
        {currentProperty && this.renderCardItem(currentProperty)}
      </View>
    );
  }

  private renderCardItem = (item: Asset): React.ReactElement => {
    const { t } = this.props;
    const {
      spaces,
      assetType: { name },
      projectName,
      progressPercentage,
      unitNumber,
      carpetArea,
      carpetAreaUnit,
      floorNumber,
      blockNumber,
      verifications: { description },
    } = item;
    const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
      spaces,
      floorNumber,
      item.assetGroup.name,
      carpetArea,
      carpetAreaUnit,
      true
    );

    return (
      <View style={styles.cardContainer}>
        <ShieldGroup propertyType={name} propertyTypeStyle={styles.heading} text={description} isInfoRequired />
        <PropertyAddressCountry
          primaryAddress={projectName}
          subAddress={`${unitNumber ?? ''} ${blockNumber ?? ''}`}
          containerStyle={styles.addressStyle}
        />
        {amenitiesData.length > 0 && (
          <PropertyAmenities data={amenitiesData} direction="row" containerStyle={styles.amenitiesContainer} />
        )}
        <ProgressBar progress={progressPercentage} width={theme.viewport.width > 400 ? 350 : 310} />
        <Button type="primary" title={t('completeDetails')} containerStyle={styles.buttonStyle} />
        <Label type="regular" style={styles.infoText}>
          {t('completeProperty')}
        </Label>
      </View>
    );
  };

  private getPendingProperties = async (): Promise<void> => {
    const response: Asset[] = await AssetService.getPropertiesByStatus(PropertyStatus.PENDING);
    this.setState({ data: response });
  };

  private handleNext = (): void => {
    const { currentPropertyIndex, data } = this.state;
    if (data.length !== currentPropertyIndex + 1) {
      this.setState({ currentPropertyIndex: currentPropertyIndex + 1 });
    }
  };

  private handlePrevious = (): void => {
    const { currentPropertyIndex } = this.state;
    if (currentPropertyIndex !== 0) {
      this.setState({ currentPropertyIndex: currentPropertyIndex - 1 });
    }
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetDashboard)(PendingPropertyListCard);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    marginTop: 12,
    padding: 16,
  },
  headingView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  label: {
    color: theme.colors.darkTint1,
    marginLeft: 10,
  },
  iconStyle: {
    width: PlatformUtils.isIOS() ? 32 : 38,
    height: PlatformUtils.isIOS() ? 30 : 35,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  cardContainer: {
    marginVertical: 12,
  },
  heading: {
    color: theme.colors.darkTint3,
  },
  amenitiesContainer: {
    marginBottom: 20,
  },
  buttonStyle: {
    flex: 0,
    marginBottom: 5,
    marginTop: 18,
  },
  infoText: {
    color: theme.colors.darkTint7,
    textAlign: 'center',
  },
  addressStyle: {
    marginBottom: 6,
  },
});
