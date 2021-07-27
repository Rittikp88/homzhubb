import React, { useCallback, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { SvgProps } from 'react-native-svg';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { PaymentRepository } from '@homzhub/common/src/domain/repositories/PaymentRepository';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import Accounting from '@homzhub/common/src/assets/images/accounting.svg';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import DueCard from '@homzhub/common/src/components/molecules/DueCard';
import IconSheet, { ISheetData } from '@homzhub/mobile/src/components/molecules/IconSheet';
import SectionContainer from '@homzhub/common/src/components/organisms/SectionContainer';
import { DueItem } from '@homzhub/common/src/domain/models/DueItem';
import { Payment } from '@homzhub/common/src/domain/models/Payment';
import { DuePaymentActions, IPaymentParams, IPaymentPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { IProcessPaymentPayload } from '@homzhub/common/src/modules/financials/interfaces';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const DuesContainer = (): React.ReactElement | null => {
  // HOOKS START
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const dispatch = useDispatch();
  const dues = useSelector(FinancialSelectors.getDues);
  const [isSheetVisible, setSheetVisibility] = useState(false);
  // HOOKS END

  // Todo (Praharsh) : Try moving to onFocusCallback
  useFocusEffect(
    useCallback(() => {
      dispatch(FinancialActions.getDues());
    }, [])
  );

  const onPressPayNow = (id: number): Promise<Payment> => {
    return PaymentRepository.initiateDuePayment(id);
  };

  const keyExtractor = (item: DueItem): string => item.id.toString();

  const renderItem = ({ item }: { item: DueItem }): React.ReactElement | null => {
    const onOrderPlaced = (paymentParams: IPaymentParams): void => {
      const getBody = (): IPaymentPayload => {
        // Payment successful
        if (paymentParams.razorpay_payment_id) {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentParams;
          return {
            action: DuePaymentActions.PAYMENT_CAPTURED,
            payload: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
          };
        }
        // Payment cancelled
        const { razorpay_order_id } = paymentParams;
        return {
          action: DuePaymentActions.PAYMENT_CANCELLED,
          payload: { razorpay_order_id },
        };
      };

      const payload: IProcessPaymentPayload = {
        data: getBody(),
        onCallback: (status) => {
          if (status && paymentParams.razorpay_payment_id) {
            dispatch(FinancialActions.resetLedgerFilters());
            dispatch(FinancialActions.getLedgerMetrics());
            dispatch(FinancialActions.getLedgers());
            dispatch(FinancialActions.getDues());
            dispatch(
              FinancialActions.getTransactions({
                offset: 0,
                limit: 10,
              })
            );
            AlertHelper.success({ message: t('assetFinancial:paidSuccessfully', { amount: `${item.totalDue}` }) });
          }
        },
      };

      dispatch(FinancialActions.processPayment(payload));
    };

    return (
      <DueCard
        due={item}
        onInitPayment={(): Promise<Payment> => onPressPayNow(item.id)}
        onOrderPlaced={onOrderPlaced}
        onPressClose={(): void => setSheetVisibility(true)}
      />
    );
  };

  const ItemSeparator = (): React.ReactElement => <Divider containerStyles={styles.divider} />;

  const handleAlreadyPaid = (): void => {
    // TODO: (Praharsh) handle already paid navigation
  };

  const onSetReminder = (): void => {
    navigate(ScreensKeys.AddReminderScreen);
  };

  const getSheetData = (): ISheetData[] => {
    const iconSize = 40;
    const ImageHOC = (Image: React.FC<SvgProps>): React.ReactElement => <Image width={iconSize} height={iconSize} />;
    const IconHOC = (name: string): React.ReactElement => (
      <Icon name={name} size={iconSize + 3} color={theme.colors.error} />
    );
    return [
      {
        icon: ImageHOC(Accounting),
        label: t('assetFinancial:alreadyPaid'),
        onPress: handleAlreadyPaid,
      },
      {
        icon: IconHOC(icons.reminder),
        label: t('assetFinancial:setReminders'),
        onPress: onSetReminder,
      },
    ];
  };

  if (!dues || (dues && !dues.dueItems.length)) return null;

  const {
    total: { formattedAmount },
    dueItems,
  } = dues;

  // Sort array in desc order based on 'created_at'
  const sortedDuesDesc = DateUtils.descendingDateSort(dueItems, 'createdAt');

  return (
    <>
      <SectionContainer
        containerStyle={styles.container}
        sectionTitle={t('assetDashboard:dues')}
        sectionIcon={icons.wallet}
        rightText={formattedAmount}
        rightTextColor={theme.colors.error}
      >
        <FlatList
          data={sortedDuesDesc.slice(0, 3)}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          scrollEnabled={false}
          ItemSeparatorComponent={ItemSeparator}
        />
      </SectionContainer>
      <IconSheet
        isVisible={isSheetVisible}
        data={getSheetData()}
        sheetHeight={250}
        onCloseSheet={(): void => setSheetVisibility(false)}
      />
    </>
  );
};

export default DuesContainer;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: theme.colors.white,
  },
  divider: {
    borderWidth: 1,
    borderColor: theme.colors.background,
    marginHorizontal: 16,
  },
});
