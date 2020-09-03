import React, { ReactElement } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider, PricePerUnit, Text } from '@homzhub/common/src/components';

interface ITransaction {
  category: string;
  type: string;
  propertyName: string;
  transaction: string;
  notes: string;
}

interface IState {
  shouldExpand: boolean;
}

interface IProps extends WithTranslation {
  data?: ITransaction[];
}

export class TransactionCardsContainer extends React.PureComponent<IProps, IState> {
  public state = {
    shouldExpand: false,
  };

  public render(): ReactElement {
    const { t } = this.props;
    const { shouldExpand } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.transactionHeader}>
          <Icon style={styles.chequeIconStyle} name={icons.cheque} size={20} />
          <Text type="regular" textType="semiBold">
            {t('transactions')}
          </Text>
        </View>
        <Divider />
        {this.renderTransactionCard()}
        {shouldExpand && this.renderTransactionDetails()}
      </View>
    );
  }

  private renderTransactionCard = (): ReactElement => {
    const { shouldExpand } = this.state;

    return (
      <TouchableOpacity onPress={this.toggleAccordion} style={styles.transactionCardContainer}>
        <>
          <View style={styles.commonAlignStyle}>
            <View style={styles.dateStyle}>
              <Text type="regular" textType="bold">
                12
              </Text>
              <Text type="regular">May</Text>
            </View>
            <View>
              <Text type="small">Maintenance</Text>
              <Text type="regular" textType="bold">
                Rent
              </Text>
              <Text type="regular">Manor</Text>
            </View>
          </View>
          <View style={styles.commonAlignStyle}>
            <PricePerUnit priceTransformation={false} currency="INR" price={20000} />
            <Icon name={shouldExpand ? icons.upArrow : icons.downArrow} size={24} style={styles.iconStyle} />
          </View>
        </>
      </TouchableOpacity>
    );
  };

  private renderTransactionDetails = (): ReactElement => {
    const { t } = this.props;
    // Todo (Sriram- 2020.08.26)Do I need to refactor this?
    return (
      <View style={styles.transactionDetailContainer}>
        <View>
          <Text type="small">{t('paidToText')}</Text>
          <View style={styles.paidToStyles}>
            <Text type="regular">Wade Warren</Text>
            <Text type="regular">Owner</Text>
          </View>
        </View>
        <View style={styles.invoiceStyle}>
          <Text type="small">{t('invoice')}</Text>
          {/* Todo (Sriram- 2020.08.26) Shift this logic to a molecule */}
          <TouchableOpacity style={styles.commonAlignStyle}>
            <Text style={styles.attachmentStyles} type="regular">
              {t('attachmentName')}
            </Text>
            <Icon name={icons.downArrow} size={20} color={theme.colors.primaryColor} />
          </TouchableOpacity>
        </View>
        <View>
          <Text type="small">{t('notes')}</Text>
          <Text type="regular">Fixed on the right time</Text>
        </View>
      </View>
    );
  };

  private toggleAccordion = (): void => {
    this.setState((prev) => ({
      shouldExpand: !prev.shouldExpand,
    }));
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetFinancial)(TransactionCardsContainer);

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: theme.colors.white,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  transactionCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  commonAlignStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateStyle: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.shadow,
    borderRadius: 4,
    padding: 10,
    marginRight: 12,
  },
  iconStyle: {
    marginLeft: 10,
  },
  transactionDetailContainer: {
    padding: 16,
    backgroundColor: theme.colors.grey1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  paidToStyles: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  attachmentStyles: {
    color: theme.colors.primaryColor,
    marginRight: 6,
  },
  invoiceStyle: {
    marginVertical: 24,
  },
  chequeIconStyle: {
    marginRight: 10,
  },
});
