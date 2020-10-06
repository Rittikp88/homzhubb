import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button, Label, Text } from '@homzhub/common/src/components';
import { PropertyAmenities, PropertyAddressCountry, ProgressBar, ShieldGroup } from '@homzhub/mobile/src/components';
import { PropertyReviewCard } from '@homzhub/mobile/src/components/molecules/PropertyReviewCard';
import { Asset, LastVisitedStep, PropertyStatus } from '@homzhub/common/src/domain/models/Asset';
import { IActions, TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';

const actionButtons: IActions[] = [
  { id: 1, title: 'Invite Tenant', type: TypeOfPlan.MANAGE },
  { id: 2, title: 'Rent', type: TypeOfPlan.RENT },
  { id: 3, title: 'Sell', type: TypeOfPlan.SELL },
];

interface IProps {
  onPressComplete: (assetId: number) => void;
  onSelectAction: (payload: IActions, assetId: number) => void;
}

interface IState {
  currentPropertyIndex: number;
  data: Asset[];
  isActionsVisible: boolean;
}

type Props = IProps & WithTranslation;

export class PendingPropertyListCard extends Component<Props, IState> {
  public state = {
    currentPropertyIndex: 0,
    data: [],
    isActionsVisible: false,
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
    const {
      id,
      spaces,
      assetType: { name },
      projectName,
      unitNumber,
      carpetArea,
      carpetAreaUnit,
      floorNumber,
      blockNumber,
      address,
      lastVisitedStep,
      verifications: { description },
    } = item;
    const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
      spaces,
      floorNumber,
      item.assetGroup.name,
      carpetArea,
      carpetAreaUnit?.title ?? '',
      true
    );

    return (
      <View style={styles.cardContainer}>
        <ShieldGroup propertyType={name} propertyTypeStyle={styles.heading} text={description} isInfoRequired />
        <PropertyAddressCountry
          primaryAddress={projectName}
          subAddress={address ?? `${unitNumber ?? ''} ${blockNumber ?? ''}`}
          containerStyle={styles.addressStyle}
        />
        {amenitiesData.length > 0 && (
          <PropertyAmenities data={amenitiesData} direction="row" containerStyle={styles.amenitiesContainer} />
        )}
        {this.renderButtonsView(id, lastVisitedStep)}
      </View>
    );
  };

  private renderButtonsView = (id: number, lastVisitedStep: LastVisitedStep): React.ReactElement => {
    const { t, onPressComplete, onSelectAction } = this.props;
    const { isActionsVisible } = this.state;
    const {
      assetCreation: { percentage },
      listing: { type },
      isVerificationRequired,
      isListingRequired,
      isPropertyReady,
    } = lastVisitedStep;
    const plan = actionButtons.find((item) => item.type === type);
    let onVerifyProperty;
    if (plan) {
      onVerifyProperty = (): void => onSelectAction(plan, id);
    }
    return (
      <>
        {percentage < 100 && (
          <>
            <ProgressBar progress={percentage} width={theme.viewport.width > 400 ? 350 : 310} />
            <Button
              type="primary"
              title={t('completeDetails')}
              containerStyle={styles.buttonStyle}
              onPress={(): void => onPressComplete(id)}
            />
          </>
        )}
        {isListingRequired && (
          <Button
            type="primary"
            title={t('takeActions')}
            iconSize={24}
            iconColor={theme.colors.blue}
            icon={isActionsVisible ? icons.upArrow : icons.downArrow}
            containerStyle={styles.actionButton}
            titleStyle={styles.actionButtonTitle}
            onPress={this.handleActions}
          />
        )}
        {isListingRequired && isActionsVisible && (
          <>
            {actionButtons.map((item) => {
              return (
                <Button
                  key={item.id}
                  type="secondary"
                  title={item.title}
                  containerStyle={styles.buttonStyle}
                  onPress={(): void => onSelectAction(item, id)}
                />
              );
            })}
          </>
        )}
        {isVerificationRequired && (
          <Button
            type="primary"
            title={t('completeVerification')}
            containerStyle={styles.buttonStyle}
            onPress={onVerifyProperty}
          />
        )}
        {isPropertyReady && <PropertyReviewCard />}
        {percentage < 100 && (
          <Label type="regular" style={styles.infoText}>
            {t('completeProperty')}
          </Label>
        )}
      </>
    );
  };

  private getPendingProperties = async (): Promise<void> => {
    try {
      const response: Asset[] = await AssetRepository.getPropertiesByStatus(PropertyStatus.PENDING);
      this.setState({ data: response });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
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

  private handleActions = (): void => {
    this.setState((prevState) => {
      return {
        isActionsVisible: !prevState.isActionsVisible,
      };
    });
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
  actionButton: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 18,
    backgroundColor: theme.colors.blueOpacity,
  },
  actionButtonTitle: {
    color: theme.colors.blue,
    marginHorizontal: 6,
  },
  infoText: {
    color: theme.colors.darkTint7,
    textAlign: 'center',
  },
  addressStyle: {
    marginBottom: 6,
  },
});
