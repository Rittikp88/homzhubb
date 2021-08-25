import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import DetailCard, { ICardProp } from '@homzhub/common/src/components/molecules/DetailCard';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { BottomSheetListView } from '@homzhub/mobile/src/components';
import { BankAccountActions } from '@homzhub/common/src/domain/models/BankInfo';
import { IListItem } from '@homzhub/mobile/src/components/molecules/BottomSheetListView';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const BankDetails = (): React.ReactElement => {
  const { t } = useTranslation();
  const { goBack, navigate } = useNavigation();
  const dispatch = useDispatch();
  const bankDetails = useSelector(UserSelector.getBankInfo);
  const { bankInfo: bankInfoLoading } = useSelector(UserSelector.getUserLoaders);
  const currentBank = useSelector(UserSelector.getCurrentBankAccountSelected);

  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const setBottomSheet = (): void => setShowBottomSheet(true);

  const resetBottomSheet = (): void => setShowBottomSheet(false);

  const onPressPlusIcon = (): void => navigate(ScreensKeys.AddBankAccount);

  useFocusEffect(
    useCallback(() => {
      dispatch(UserActions.getBankInfo());
      dispatch(UserActions.setCurrentBankAccountId(-1));
    }, [])
  );

  const BankAccountsList = (): React.ReactElement => {
    const renderItem = ({ item }: { item: ICardProp }): React.ReactElement => {
      const onPressItemMenu = (): void => {
        dispatch(UserActions.setCurrentBankAccountId(item.id));
        setBottomSheet();
      };
      const renderMenuIcon = (): React.ReactElement => {
        return (
          <TouchableOpacity onPress={onPressItemMenu}>
            <Icon name={icons.verticalDots} size={18} color={theme.colors.darkTint3} />
          </TouchableOpacity>
        );
      };
      return (
        <DetailCard
          heading={item.heading}
          label={item.label}
          description={item.description}
          containerStyle={styles.accountItem}
          rightNode={renderMenuIcon()}
        />
      );
    };

    const EmptyComponent = (): React.ReactElement => (
      <EmptyState title={t('assetFinancial:noBankAccsAdded')} containerStyle={styles.centered} />
    );

    const keyExtractor = (item: ICardProp, index: number): string => index.toString();

    return (
      <FlatList
        ListEmptyComponent={EmptyComponent}
        keyExtractor={keyExtractor}
        data={bankDetails.map((i) => i.bankDetail)}
        renderItem={renderItem}
      />
    );
  };

  const OptionsSheet = (): React.ReactElement => {
    const options: IListItem[] = [
      {
        label: t('assetFinancial:editAccount'),
        value: BankAccountActions.EDIT,
      },
      {
        label: t('moreSettings:deactivateAccount'),
        value: BankAccountActions.DEACTIVATE,
      },
      {
        label: t('assetFinancial:deleteAccount'),
        value: BankAccountActions.DELETE,
        isNegative: true,
      },
    ];

    const onPressEdit = (): void => {
      if (currentBank) {
        if (!currentBank.canEdit) {
          AlertHelper.error({ message: t('assetFinancial:bankDetailsCantBeEdited') });
          return;
        }
        navigate(ScreensKeys.AddBankAccount, { isEdit: true });
      }
    };

    const handleBankAccountActions = (action: string): void => {
      resetBottomSheet();
      switch (action) {
        case BankAccountActions.EDIT:
          onPressEdit();
          return;
        default:
          FunctionUtils.noop();
      }
    };

    return (
      <BottomSheetListView
        selectedValue=""
        data={options}
        listTitle={t('assetFinancial:bankAccountOptions')}
        isBottomSheetVisible={showBottomSheet}
        onSelectItem={handleBankAccountActions}
        onCloseDropDown={resetBottomSheet}
        showDivider={false}
        listHeight={theme.viewport.height / 2.3}
        hasFullySpannedItems
      />
    );
  };

  return (
    <UserScreen
      title={t('assetMore:more')}
      pageTitle={t('assetMore:bankDetails')}
      onBackPress={goBack}
      loading={bankInfoLoading}
      contentContainerStyle={styles.content}
      onPlusIconClicked={onPressPlusIcon}
    >
      <BankAccountsList />
      <OptionsSheet />
    </UserScreen>
  );
};
export default React.memo(BankDetails);

const styles = StyleSheet.create({
  accountItem: {
    marginVertical: 20,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  centered: {
    paddingVertical: '50%',
  },
});
