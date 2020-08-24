import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button, Label, Text } from '@homzhub/common/src/components';
import { PropertyAmenities, PropertyAddressCountry, ProgressBar } from '@homzhub/mobile/src/components';
import { PendingProperties } from '@homzhub/common/src/mocks/PendingProperties';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';

interface IState {
  currentPropertyIndex: number;
}

type Props = WithTranslation;

export class PendingPropertyListCard extends Component<Props, IState> {
  public state = {
    currentPropertyIndex: 0,
  };

  public render(): React.ReactNode {
    const { currentPropertyIndex } = this.state;
    const { t } = this.props;
    const currentProperty = PendingProperties[currentPropertyIndex];
    const total = PendingProperties.length;
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
            <TouchableOpacity style={styles.iconStyle}>
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

  // TODO: Add type once API integrate
  private renderCardItem = (item: any): React.ReactElement => {
    const { t } = this.props;
    const {
      spaces,
      asset_type: { name },
      project_name,
      status,
      address,
    } = item;
    const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
      spaces,
      0,
      item.asset_group.name,
      null,
      '',
      true
    );
    return (
      <View style={styles.cardContainer}>
        <Text type="small" style={styles.heading}>
          {name}
        </Text>
        <PropertyAddressCountry
          primaryAddress={project_name}
          subAddress={address}
          containerStyle={styles.addressStyle}
        />
        <PropertyAmenities data={amenitiesData} direction="row" containerStyle={styles.amenitiesContainer} />
        <ProgressBar progress={status} width={350} />
        <Button type="primary" title={t('completeDetails')} containerStyle={styles.buttonStyle} />
        <Label type="regular" style={styles.infoText}>
          {t('completeProperty')}
        </Label>
      </View>
    );
  };

  private handleNext = (): void => {
    const { currentPropertyIndex } = this.state;
    if (PendingProperties.length !== currentPropertyIndex + 1) {
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
    minHeight: 355,
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
  },
  label: {
    color: theme.colors.darkTint1,
    marginLeft: 10,
  },
  iconStyle: {
    width: 30,
    height: 30,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  cardContainer: {
    marginVertical: 12,
  },
  heading: {
    marginBottom: 10,
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
