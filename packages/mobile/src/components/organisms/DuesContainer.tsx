import React, { useCallback } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { PaymentRepository } from '@homzhub/common/src/domain/repositories/PaymentRepository';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import DueCard from '@homzhub/common/src/components/molecules/DueCard';
import SectionContainer from '@homzhub/common/src/components/organisms/SectionContainer';
import { DueItem } from '@homzhub/common/src/domain/models/DueItem';
import { Payment } from '@homzhub/common/src/domain/models/Payment';
import { DuePaymentActions, IPaymentParams, IPaymentPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { IProcessPaymentPayload } from '@homzhub/common/src/modules/financials/interfaces';

const DuesContainer = (): React.ReactElement | null => {
  // HOOKS START
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const dues = useSelector(FinancialSelectors.getDues);
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
          dispatch(FinancialActions.getDues());
          dispatch(
            FinancialActions.getTransactions({
              offset: 0,
              limit: 10,
            })
          );
        }
      },
    };

    dispatch(FinancialActions.processPayment(payload));
  };

  const keyExtractor = (item: DueItem): string => item.id.toString();

  const renderItem = ({ item }: { item: DueItem }): React.ReactElement | null => {
    return (
      <DueCard
        due={item}
        onInitPayment={(): Promise<Payment> => onPressPayNow(item.id)}
        onOrderPlaced={onOrderPlaced}
      />
    );
  };

  const ItemSeparator = (): React.ReactElement => <Divider containerStyles={styles.divider} />;

  if (!dues || (dues && !dues.dueItems.length)) return null;

  const {
    total: { formattedAmount },
    dueItems,
  } = dues;

  // Sort array in desc order based on 'created_at'
  const sortedDuesDesc = DateUtils.descendingDateSort(dueItems, 'createdAt');

  return (
    <SectionContainer
      containerStyle={styles.container}
      sectionTitle={t('assetDashboard:dues')}
      sectionIcon={icons.wallet}
      rightText={formattedAmount}
      rightTextColor={theme.colors.error}
    >
      <FlatList
        // NOTE (Praharsh) : Slicing 5 items for now.
        data={sortedDuesDesc.slice(0, 5)}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        scrollEnabled={false}
        ItemSeparatorComponent={ItemSeparator}
      />
    </SectionContainer>
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
