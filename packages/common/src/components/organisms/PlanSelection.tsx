import React, { ReactElement } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { ListingService } from '@homzhub/common/src/services/Property/ListingService';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { AssetPlan, ISelectedAssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IDispatchProps {
  getAssetPlanList: () => void;
  setSelectedPlan: (payload: ISelectedAssetPlan) => void;
}

interface IStateProps {
  assetPlan: AssetPlan[];
  assetId: number;
}

interface IProps {
  carouselView: ReactElement;
  onSelectPlan: () => void;
  onSkip: () => void;
}

type OwnProps = WithTranslation;
type Props = OwnProps & IDispatchProps & IStateProps & IProps;

class PlanSelection extends React.PureComponent<Props> {
  public componentDidMount = (): void => {
    const { getAssetPlanList } = this.props;
    getAssetPlanList();
  };

  public render(): React.ReactElement {
    const { carouselView } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.planContainer}>{this.renderPlans()}</View>
        {carouselView}
      </View>
    );
  }

  public renderPlans = (): React.ReactElement => {
    const { assetPlan, t, onSkip } = this.props;
    return (
      <>
        <View style={styles.header}>
          <Text type="regular" textType="semiBold">
            {t('propertyPlanTitle')}
          </Text>
          <Text type="small" textType="semiBold" onPress={onSkip} style={styles.skip}>
            {t('common:skip')}
          </Text>
        </View>
        {assetPlan.map(this.renderItem)}
      </>
    );
  };

  public renderItem = (item: AssetPlan, index: number): React.ReactElement => {
    const { assetPlan } = this.props;

    const onPress = (): void => this.onPressPlan(item);
    const isLastIndex = assetPlan.length === index + 1;

    return (
      <View key={`${item.id}-${index}`}>
        <TouchableOpacity onPress={onPress} style={styles.assetPlanItem} key={index}>
          <View style={styles.flexRow}>
            <Icon name={item.icon} size={25} color={theme.colors.primaryColor} />
            <View style={styles.descriptionContainer}>
              <Text type="small" textType="semiBold" style={styles.planName}>
                {ListingService.getHeader(item.name)}
              </Text>
              <Label type="large" textType="regular" style={styles.description}>
                {item.description}
              </Label>
            </View>
          </View>
          <Icon name={icons.rightArrow} size={22} color={theme.colors.primaryColor} />
        </TouchableOpacity>
        {!isLastIndex && <Divider />}
      </View>
    );
  };

  private onPressPlan = (item: AssetPlan): void => {
    const { setSelectedPlan, onSelectPlan } = this.props;
    setSelectedPlan({ id: item.id, selectedPlan: item.name });
    onSelectPlan();
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getAssetPlans, getCurrentAssetId } = RecordAssetSelectors;
  return {
    assetPlan: getAssetPlans(state),
    assetId: getCurrentAssetId(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetPlanList, setSelectedPlan } = RecordAssetActions;
  return bindActionCreators(
    {
      getAssetPlanList,
      setSelectedPlan,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.property)(PlanSelection));

const styles = StyleSheet.create({
  container: {
    flexDirection: PlatformUtils.isWeb() ? 'row' : 'column',
    flex: 1,
    justifyContent: 'space-between',
  },
  planContainer: {
    backgroundColor: theme.colors.white,
    padding: theme.layout.screenPadding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skip: {
    flex: 0,
    borderWidth: 0,
    color: theme.colors.primaryColor,
  },
  assetPlanItem: {
    flexDirection: 'row',
    marginTop: 10,
    paddingVertical: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: {
    color: theme.colors.primaryColor,
  },
  description: {
    color: theme.colors.darkTint5,
    paddingTop: 10,
  },
  descriptionContainer: {
    marginStart: 20,
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
    width: PlatformUtils.isMobile() ? theme.viewport.width / 1.2 : undefined,
  },
});
