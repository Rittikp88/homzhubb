import React, { useState, useEffect } from 'react';
import { View, PickerItemProps, StyleProp, ViewStyle, LayoutChangeEvent, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import VisitCard from '@homzhub/common/src/components/molecules/VisitCard';
import { AssetVisit, IVisitByKey } from '@homzhub/common/src/domain/models/AssetVisit';
// import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { Pillar } from '@homzhub/common/src/domain/models/Pillar';
import { IVisitActionParam } from '@homzhub/common/src/domain/repositories/interfaces';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

interface IProps {
  visitType: Tabs;
  visitData: IVisitByKey[];
  isLoading: boolean;
  dropdownValue: number;
  dropdownData: PickerItemProps[];
  handleAction: (param: IVisitActionParam) => void;
  handleReschedule: (asset: AssetVisit, userId?: number) => void;
  handleDropdown: (value: string | number, visitType: Tabs) => void;
  handleUserView: (id: number) => void;
  pillars?: Pillar[];
  resetData?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  // handleConfirmation?: (param: IVisitActionParam) => void;
  // isFromProperty?: boolean;
  // isUserView?: boolean;
  // reviewVisitId?: number;
  // isResponsiveHeightRequired?: boolean;
}

interface ICustomState {
  reportCategories: Unit[];
  height: number;
}

const PropertyVisitList: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation();
  const {
    visitType,
    visitData,
    dropdownData,
    dropdownValue,
    handleDropdown,
    isLoading,
    handleAction,
    handleReschedule,
    handleUserView,
    containerStyle,
  } = props;
  const [customState, setCustomState] = useState<ICustomState>({
    reportCategories: [],
    height: theme.viewport.height,
  });
  const getReportCategory = async (): Promise<void> => {
    try {
      const response = await AssetRepository.getReviewReportCategories();
      setCustomState((state) => {
        return {
          ...state,
          reportCategories: response,
        };
      });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  useEffect(() => {
    getReportCategory();
  }, []);

  const onLayout = (e: LayoutChangeEvent): void => {
    const { height } = customState;
    const { height: newHeight } = e.nativeEvent.layout;
    if (newHeight === height) {
      setCustomState((state) => {
        return {
          ...state,
          height: newHeight,
        };
      });
    }
  };
  const { height } = customState;
  const totalVisit = visitData[0] ? visitData[0].totalVisits : 0;

  const navigateToPropertyView = (listingId: number | null, id: number, isValidVisit: boolean): void => {
    if (isValidVisit) {
      // @ts-ignore
      //   navigation.navigate(ScreensKeys.PropertyAssetDescription, {
      //     propertyTermId: listingId,
      //     propertyId: id,
      //   }); // Navigate the user to Property Detail Search View onPress Address & SubAddress
    } else {
      AlertHelper.error({ message: t('property:inValidVisit') });
    }
  };

  const onPressReview = (item: AssetVisit): void => {
    const { review, isAssetOwner } = item;
    if (review) {
      getReview(review.id);
    }

    if (isAssetOwner) {
      //   this.setState({ replyReview: true });
    } else {
      //   this.setState({ reviewAsset: item, showReviewForm: true });
    }
  };

  const getReview = (id: number): void => {
    try {
      AssetRepository.getReview(id).then((response) => {
        // this.setState({ reviewData: response });
      });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  const mainContainerStyles: ViewStyle = {
    width: '320px',
  };

  const renderItem = (item: AssetVisit): React.ReactElement => {
    // const { handleConfirmation } = props;

    return (
      <VisitCard
        visit={item}
        visitType={visitType}
        isUserView={false}
        handleUserView={handleUserView}
        handleReschedule={handleReschedule}
        navigateToAssetDetails={navigateToPropertyView}
        handleAction={handleAction}
        // handleConfirmation={handleConfirmation}
        onPressReview={onPressReview}
        mainContainerStyles={mainContainerStyles}
      />
    );
  };

  return (
    <View onLayout={onLayout} style={[styles.mainView, containerStyle]}>
      {dropdownData && handleDropdown && visitType && (
        <View style={styles.headerView}>
          <Label type="regular" style={styles.count}>
            {t('property:totalVisit', { totalVisit })}
          </Label>
          <Dropdown
            isOutline
            data={dropdownData}
            value={dropdownValue ?? ''}
            icon={icons.downArrow}
            textStyle={{ color: theme.colors.blue }}
            iconColor={theme.colors.blue}
            onDonePress={(value: string | number): void => handleDropdown(value, visitType)}
            containerStyle={styles.dropdownStyle}
          />
        </View>
      )}
      {visitData.length > 0 ? (
        <View style={{ minHeight: height }}>
          {visitData.map((item) => {
            const results = item.results as AssetVisit[];
            return (
              <>
                {results.length > 0 && (
                  <View style={styles.dateView}>
                    <View style={styles.dividerView} />
                    <Text type="small" style={styles.horizontalStyle}>
                      {item.key}
                    </Text>
                    <View style={styles.dividerView} />
                  </View>
                )}
                <View style={styles.cardsRow}>
                  {results.map((asset: AssetVisit) => {
                    return renderItem(asset);
                  })}
                </View>
              </>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyView}>
          <EmptyState icon={icons.schedule} title={t('property:noVisits')} />
        </View>
      )}
      <Loader visible={isLoading ?? false} />
    </View>
  );
};

export default PropertyVisitList;

const styles = StyleSheet.create({
  mainView: {
    marginBottom: 75,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  count: {
    color: theme.colors.darkTint6,
  },
  dropdownStyle: {
    width: 150,
  },
  dividerView: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
    width: 100,
  },
  horizontalStyle: {
    marginHorizontal: 16,
  },
  dateView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  emptyView: {
    marginBottom: 20,
  },
  cardsRow: {
    flexDirection: 'row',
  },
});
