import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import DueCard from '@homzhub/common/src/components/molecules/DueCard';
import SectionContainer from '@homzhub/common/src/components/organisms/SectionContainer';
import { DueItem } from '@homzhub/common/src/domain/models/DueItem';
import { Payment } from '@homzhub/common/src/domain/models/Payment';
import { Dues } from '@homzhub/common/src/domain/models/Dues';
import { IPaymentParams } from '@homzhub/common/src/domain/repositories/interfaces';

interface IProps {
  toggleLoading: (loading: boolean) => void;
}

const DuesContainer = (props: IProps): React.ReactElement | null => {
  const { toggleLoading } = props;
  const { t } = useTranslation();
  const [dues, setDues] = useState(new Dues());

  const getAllDues = async (): Promise<void> => {
    try {
      toggleLoading(true);
      const duesData = await LedgerRepository.getDues();
      setDues(duesData);
      toggleLoading(false);
    } catch (e) {
      toggleLoading(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  // Todo (Praharsh) : Try moving to onFocusCallback
  useFocusEffect(
    useCallback(() => {
      getAllDues().then();
    }, [])
  );

  const keyExtractor = (item: DueItem): string => item.id.toString();

  const renderItem = ({ item }: { item: DueItem }): React.ReactElement | null => {
    // Todo (Praharsh) : Handle API here
    const onPressItem = (): Promise<Payment> => {
      return Promise.resolve(new Payment());
    };
    return (
      <DueCard due={item} onInitPayment={onPressItem} onOrderPlaced={(paymentParams: IPaymentParams): void => {}} />
    );
  };

  const ItemSeparator = (): React.ReactElement => <Divider containerStyles={styles.divider} />;

  if (!dues.dueItems.length) return null;

  const {
    total: { formattedAmount },
    dueItems,
  } = dues;
  return (
    <SectionContainer
      containerStyle={styles.container}
      sectionTitle={t('assetDashboard:dues')}
      sectionIcon={icons.wallet}
      rightText={formattedAmount}
      rightTextColor={theme.colors.error}
    >
      <FlatList
        // NOTE (Praharsh) : Slicing 5 items for now as said by Vedant.
        data={dueItems.length > 5 ? dueItems.slice(0, 5) : dueItems}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
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
