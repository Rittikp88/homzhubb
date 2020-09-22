import React, { PureComponent } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider, Text } from '@homzhub/common/src/components';

interface ISummaryItem {
  key: string;
  value: string;
  isDiscount?: boolean;
}

// TODO: (Shikha) - Remove after API integration
const data: ISummaryItem[] = [
  {
    key: 'Order Total',
    value: '3000',
  },
  {
    key: 'Coin Discount',
    value: '₹128',
    isDiscount: true,
  },
  {
    key: 'Discount (0%)',
    value: '0',
    isDiscount: true,
  },
  {
    key: 'Sub Total',
    value: '₹2872',
  },
  {
    key: 'GST (18%)',
    value: '₹720',
  },
];

type Props = WithTranslation;

export class OrderSummary extends PureComponent<Props> {
  public render(): React.ReactNode {
    const { t } = this.props;
    return (
      <View style={styles.container}>
        <Text type="small" textType="semiBold" style={styles.heading}>
          {t('property:orderSummary')}
        </Text>
        <FlatList data={data} renderItem={this.renderList} contentContainerStyle={styles.listContainer} />
        {this.renderTotalView('₹3592')}
      </View>
    );
  }

  private renderList = ({ item }: { item: ISummaryItem }): React.ReactElement => {
    const { key, value, isDiscount } = item;
    const amount = isDiscount ? `- ${value}` : value;
    return (
      <View style={styles.listItem}>
        <Text type="small" textType="semiBold" style={styles.listKey}>
          {key}
        </Text>
        <Text type="small" textType="semiBold" style={isDiscount ? styles.discountValue : styles.listValue}>
          {amount}
        </Text>
      </View>
    );
  };

  private renderTotalView = (total: string): React.ReactElement => {
    const { t } = this.props;
    return (
      <View style={styles.totalView}>
        <Divider containerStyles={styles.divider} />
        <View style={styles.totalContent}>
          <Text type="small" textType="semiBold" style={styles.totalText}>
            {t('property:youPay')}
          </Text>
          <Text type="small" textType="semiBold" style={styles.totalText}>
            {total}
          </Text>
        </View>
        <Divider containerStyles={styles.divider} />
      </View>
    );
  };
}

export default withTranslation()(OrderSummary);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  heading: {
    color: theme.colors.darkTint4,
  },
  listContainer: {
    paddingVertical: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  listKey: {
    color: theme.colors.darkTint5,
  },
  listValue: {
    color: theme.colors.darkTint3,
  },
  discountValue: {
    color: theme.colors.green,
  },
  totalView: {
    marginBottom: 16,
  },
  totalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  divider: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.darkTint7,
  },
  totalText: {
    color: theme.colors.darkTint2,
  },
});
