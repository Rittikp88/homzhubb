import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Avatar, Badge, Button, Divider, Image, Label } from '@homzhub/common/src/components';
import { PropertyAddressCountry, LeaseProgress, RentAndMaintenance } from '@homzhub/mobile/src/components';
import { IAssetData } from '@homzhub/common/src/mocks/AssetData';

interface IListProps {
  assetData: IAssetData;
  isDetailView?: boolean;
}

interface IListState {
  isExpanded: boolean;
}

export class AssetCard extends Component<IListProps, IListState> {
  public state = {
    isExpanded: false,
  };

  public render(): React.ReactNode {
    const { assetData, isDetailView } = this.props;
    const { isExpanded } = this.state;
    const { property_name, color, type, address, images } = assetData;
    return (
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          {!isDetailView && (
            <View style={[styles.topView, isExpanded && styles.expandedView]}>
              <View style={styles.topLeftView}>
                <Badge title={type} badgeColor={color} badgeStyle={styles.badgeStyle} />
                <Icon name={icons.roundFilled} color={theme.colors.darkTint7} size={8} style={styles.dotStyle} />
                <Icon name={icons.bell} color={theme.colors.blue} size={18} style={styles.iconStyle} />
                <Label type="large" style={styles.count}>
                  10
                </Label>
                <Icon name={icons.roundFilled} color={theme.colors.darkTint7} size={8} style={styles.dotStyle} />
                <Icon name={icons.headPhone} color={theme.colors.blue} size={18} style={styles.iconStyle} />
                <Label type="large" style={styles.count}>
                  10
                </Label>
              </View>
              <Icon
                name={isExpanded ? icons.upArrow : icons.downArrow}
                color={theme.colors.blue}
                size={20}
                onPress={this.onPressArrow}
              />
            </View>
          )}
          {(isExpanded || isDetailView) && <Image source={images[0].link} style={styles.image} height={200} />}
          {isDetailView && <Badge title={type} badgeColor={color} badgeStyle={styles.badgeStyle} />}
          <PropertyAddressCountry
            primaryAddress={property_name}
            subAddress={address}
            containerStyle={styles.addressStyle}
          />
          {(isExpanded || isDetailView) && this.renderExpandedView()}
        </View>
        {isExpanded && (
          <Button
            type="secondary"
            title="View Property"
            textSize="small"
            containerStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitle}
          />
        )}
      </View>
    );
  }

  private renderExpandedView = (): React.ReactElement => {
    const { isDetailView, assetData } = this.props;
    const { contacts, isPropertyCompleted } = assetData;
    return (
      <>
        {contacts && (
          <>
            <Divider containerStyles={styles.divider} />
            <Avatar fullName={contacts.full_name} designation="Tenant" />
          </>
        )}
        {!isDetailView && isPropertyCompleted && (
          <>
            <Divider containerStyles={styles.divider} />
            <RentAndMaintenance />
          </>
        )}
        <Divider containerStyles={styles.divider} />
        <LeaseProgress
          progress={80}
          width={theme.viewport.width > 400 ? 320 : 280}
          isPropertyCompleted={isPropertyCompleted}
        />
      </>
    );
  };

  private onPressArrow = (): void => {
    const { isExpanded } = this.state;
    this.setState({ isExpanded: !isExpanded });
  };
}

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: 14,
  },
  container: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.white,
    borderWidth: 0.5,
    borderRadius: 4,
    padding: 16,
    marginBottom: 2,
  },
  topView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  expandedView: {
    marginBottom: 18,
  },
  topLeftView: {
    flexDirection: 'row',
  },
  badgeStyle: {
    minWidth: 70,
    paddingHorizontal: 8,
    paddingVertical: 1,
    alignSelf: 'flex-start',
  },
  dotStyle: {
    marginTop: 8,
    marginHorizontal: 12,
  },
  count: {
    color: theme.colors.primaryColor,
    marginLeft: 6,
  },
  iconStyle: {
    marginTop: 2,
  },
  addressStyle: {
    marginTop: 14,
  },
  divider: {
    marginVertical: 12,
    borderColor: theme.colors.background,
    borderWidth: 1,
  },
  buttonStyle: {
    borderWidth: 0,
  },
  buttonTitle: {
    marginVertical: 14,
  },
  image: {
    minWidth: theme.viewport.width > 400 ? 350 : 300,
  },
});
