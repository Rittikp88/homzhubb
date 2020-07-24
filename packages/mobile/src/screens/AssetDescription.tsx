import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Collapsible from 'react-native-collapsible';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { Divider, Text } from '@homzhub/common/src/components';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { StatusBarComponent } from '@homzhub/mobile/src/components/atoms/StatusBar';
import { AssetRatings } from '@homzhub/mobile/src/components/molecules/AssetRatings';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IStateProps {
  reviews: AssetReview[];
}

interface IDispatchProps {
  getAssetReviews: (id: number) => void;
}

interface IOwnState {
  isRatingCollapsed: boolean;
}

type Props = IStateProps & IDispatchProps & WithTranslation;
class AssetDescription extends React.PureComponent<Props, IOwnState> {
  public state = {
    isRatingCollapsed: false,
  };

  public componentDidMount = (): void => {
    const { getAssetReviews } = this.props;
    // getAssetReviews(1);
  };

  public render = (): React.ReactNode => {
    return (
      <>
        <StatusBarComponent backgroundColor={theme.colors.white} isTranslucent={false} />
        <View style={styles.screen}>{this.renderReviews()}</View>
      </>
    );
  };

  private renderReviews = (): React.ReactNode => {
    const { t, reviews } = this.props;
    const { isRatingCollapsed } = this.state;
    return (
      <>
        <TouchableOpacity style={styles.ratingsHeading} onPress={this.onReviewsToggle}>
          <Text type="small" textType="semiBold" style={styles.sectionHeading}>
            {t('reviewsRatings')}
          </Text>
          <Icon name={isRatingCollapsed ? icons.plus : icons.minus} size={20} color={theme.colors.darkTint4} />
        </TouchableOpacity>
        <Collapsible collapsed={isRatingCollapsed}>
          <AssetRatings reviews={reviews} />
        </Collapsible>
        <Divider containerStyles={styles.divider} />
      </>
    );
  };

  private onReviewsToggle = (): void => {
    const { isRatingCollapsed } = this.state;
    this.setState({ isRatingCollapsed: !isRatingCollapsed });
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    reviews: AssetSelectors.getAssetReviews(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetReviews } = AssetActions;
  return bindActionCreators({ getAssetReviews }, dispatch);
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.layout.screenPadding,
  },
  ratingsHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionHeading: {
    color: theme.colors.darkTint4,
  },
  divider: {
    marginTop: 24,
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.assetDescription)(AssetDescription));
