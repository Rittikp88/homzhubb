import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider, Text } from '@homzhub/common/src/components';
import { OrderTotalSummary, OrderSummary as Summary } from '@homzhub/common/src/domain/models/OrderSummary';

interface IOwnProps {
  summary: Summary;
}

type Props = IOwnProps & WithTranslation;

export class OrderSummary extends PureComponent<Props> {
  public render(): React.ReactNode {
    const {
      t,
      summary: { summaryList, amountPayableText },
    } = this.props;
    return (
      <View style={styles.container}>
        <Text type="small" textType="semiBold" style={styles.heading}>
          {t('property:orderSummary')}
        </Text>
        <View style={styles.listContainer}>{summaryList?.map(this.renderList) ?? null}</View>
        {amountPayableText && this.renderTotalView(amountPayableText)}
      </View>
    );
  }

  private renderList = (item: OrderTotalSummary, index: number): React.ReactElement => {
    const { title, value, valueColor } = item;
    const {
      summary: { currency },
    } = this.props;
    const amount =
      valueColor === theme.colors.green ? `- ${currency.currencySymbol}${value}` : `${currency.currencySymbol}${value}`;

    return (
      <View style={styles.listItem} key={`${item.title}-${index}`}>
        <Text type="small" textType="semiBold" style={styles.listKey}>
          {title}
        </Text>
        <Text type="small" textType="semiBold" style={[styles.listValue, { color: valueColor }]}>
          {amount}
        </Text>
      </View>
    );
  };

  private renderTotalView = (total: OrderTotalSummary): React.ReactElement => {
    const {
      summary: { currency },
    } = this.props;
    const { title, value } = total;

    return (
      <View style={styles.totalView}>
        <Divider containerStyles={styles.divider} />
        <View style={styles.totalContent}>
          <Text type="small" textType="semiBold" style={styles.totalText}>
            {title}
          </Text>
          <Text type="small" textType="semiBold" style={styles.totalText}>
            {`${currency.currencySymbol}${value}`}
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
    marginVertical: 16,
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
