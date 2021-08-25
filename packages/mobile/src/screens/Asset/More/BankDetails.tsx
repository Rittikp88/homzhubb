import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import ConfirmationSheet from '@homzhub/mobile/src/components/molecules/ConfirmationSheet';
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
  const currentBankId = useSelector(UserSelector.getCurrentBankId);
  const { id: userId } = useSelector(UserSelector.getUserProfile);

  const [showOptionsSheet, setShowOptionsSheet] = useState(false);
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);
  const [localLoader, setLocalLoader] = useState(false);

  const setOptionsSheet = (): void => setShowOptionsSheet(true);

  const resetOptionsSheet = (): void => setShowOptionsSheet(false);

  const setDeleteSheet = (): void => setShowDeleteSheet(true);

  const resetDeleteSheet = (): void => setShowDeleteSheet(false);

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
        setOptionsSheet();
      };
      const renderMenuIcon = (): React.ReactElement => {
        return (
          <TouchableOpacity onPress={onPressItemMenu}>
            <Icon name={icons.verticalDots} size={18} color={theme.colors.darkTint3} />
          </TouchableOpacity>
        );
      };

      const hasGrayBackground = (showOptionsSheet || showDeleteSheet) && item.id === currentBankId;

      return (
        <DetailCard
          heading={item.heading}
          label={item.label}
          description={item.description}
          containerStyle={styles.accountItem}
          rightNode={renderMenuIcon()}
          outerContainerStyle={[styles.detailCard, hasGrayBackground && styles.detailCardContainer]}
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
      resetOptionsSheet();
      switch (action) {
        case BankAccountActions.EDIT:
          onPressEdit();
          return;
        case BankAccountActions.DELETE:
          setDeleteSheet();
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
        isBottomSheetVisible={showOptionsSheet}
        onSelectItem={handleBankAccountActions}
        onCloseDropDown={resetOptionsSheet}
        showDivider={false}
        listHeight={theme.viewport.height / 2.3}
        hasFullySpannedItems
      />
    );
  };

  const DeleteConfirmation = (): React.ReactElement => {
    const onConfirmDelete = async (): Promise<void> => {
      try {
        setLocalLoader(true);
        await UserRepository.deleteBankDetails(userId, currentBankId);
        dispatch(UserActions.getBankInfo());
        dispatch(UserActions.setCurrentBankAccountId(-1));
        setLocalLoader(false);
        AlertHelper.success({ message: t('assetFinancial:bankAccountDeletedSuccessfully') });
      } catch (e) {
        setLocalLoader(false);
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details.message), statusCode: e.details.statusCode });
      }
    };
    const onPressDelete = async (): Promise<void> => {
      resetDeleteSheet();
      if (currentBank) {
        if (currentBank.canDelete) {
          await onConfirmDelete();
          return;
        }
        AlertHelper.error({ message: t('assetFinancial:bankAccountCantBeDeleted') });
      }
    };
    return (
      <ConfirmationSheet
        message={t('assetFinancial:youCanDeactivate')}
        isVisible={showDeleteSheet}
        onCloseSheet={resetDeleteSheet}
        onPressDelete={onPressDelete}
        sheetHeight={theme.viewport.height / 2.5}
      />
    );
  };

  return (
    <UserScreen
      title={t('assetMore:more')}
      pageTitle={t('assetMore:bankDetails')}
      onBackPress={goBack}
      loading={bankInfoLoading || localLoader}
      contentContainerStyle={styles.content}
      onPlusIconClicked={onPressPlusIcon}
    >
      <BankAccountsList />
      <OptionsSheet />
      <DeleteConfirmation />
    </UserScreen>
  );
};
export default React.memo(BankDetails);

const styles = StyleSheet.create({
  accountItem: {
    marginVertical: 20,
  },
  content: {
    paddingBottom: 30,
  },
  centered: {
    paddingVertical: '50%',
  },
  detailCardContainer: {
    backgroundColor: theme.colors.darkTint10,
  },
  detailCard: {
    paddingHorizontal: 16,
  },
});
