import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider, Label, Text } from '@homzhub/common/src/components';
import { withTranslation, WithTranslation } from 'react-i18next';

export interface IDetailsInfo {
  icon: string;
  text?: string;
  helperText?: string;
  type?: 'TEXT' | 'EMAIL';
  emailVerified?: boolean;
}

interface IHeaderInfo {
  title: string;
  icon?: string;
  onPress?: () => void;
}

interface IOwnProps extends WithTranslation {
  details?: IDetailsInfo[];
  headerInfo?: IHeaderInfo;
  onVerifyPress?: () => void;
  showDivider?: boolean;
}

class DetailsCard extends React.PureComponent<IOwnProps, {}> {
  public render = (): React.ReactNode => {
    const { headerInfo, showDivider = false } = this.props;
    return (
      <>
        {headerInfo && this.renderSectionHeader()}

        {headerInfo?.icon ? this.renderDetails() : this.renderEmptyView()}
        {showDivider && <Divider containerStyles={styles.dividerStyles} />}
      </>
    );
  };

  private renderEmptyView = (): React.ReactNode => {
    const { t } = this.props;
    return (
      <View style={styles.marginTop}>
        <Label style={styles.moreInfo} type="large">
          {t('common:loremIpsum')}
        </Label>
        <TouchableOpacity style={styles.marginTop}>
          <Label style={styles.addContactBtn} type="large" textType="semiBold">
            {t('assetMore:addContactInfoText')}
          </Label>
        </TouchableOpacity>
      </View>
    );
  };

  private renderDetails = (): React.ReactNode => {
    const { details, onVerifyPress, t } = this.props;

    return (
      details &&
      details.map((item, index) => {
        const { text, type, icon, emailVerified, helperText } = item;

        return (
          <View style={styles.marginTop} key={index}>
            <View style={type === 'EMAIL' ? styles.rowStyle : undefined}>
              <View style={styles.subTitle}>
                <Icon size={20} name={icon} color={text ? theme.colors.darkTint4 : theme.colors.darkTint8} />
                <Label style={[styles.marginLeft, text ? {} : styles.helperTextColor]} type="large">
                  {text || helperText}
                </Label>
              </View>
              {type === 'EMAIL' &&
                (emailVerified ? (
                  <Icon size={20} name={icons.doubleCheck} color={theme.colors.completed} />
                ) : (
                  <Icon size={20} name={icons.filledWarning} color={theme.colors.error} />
                ))}
            </View>
            {type === 'EMAIL' && (
              <Label onPress={onVerifyPress} style={styles.verifyMail} type="large">
                {t('assetMore:verifyYourEmailText')}
              </Label>
            )}
          </View>
        );
      })
    );
  };

  private renderSectionHeader = (): React.ReactNode => {
    const { headerInfo } = this.props;

    if (!headerInfo) {
      return null;
    }

    return (
      <View style={styles.rowStyle}>
        <Text type="small" textType="semiBold">
          {headerInfo.title}
        </Text>
        {headerInfo.icon && (
          <Icon size={20} name={headerInfo.icon} color={theme.colors.primaryColor} onPress={headerInfo.onPress} />
        )}
      </View>
    );
  };
}

const detailsCard = withTranslation()(DetailsCard);
export { detailsCard as DetailsCard };

const styles = StyleSheet.create({
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subTitle: {
    flexDirection: 'row',
  },
  verifyMail: {
    marginLeft: 30,
    color: theme.colors.primaryColor,
  },
  marginLeft: {
    marginLeft: 10,
  },
  marginTop: {
    marginTop: 18,
  },
  dividerStyles: {
    marginVertical: 24,
  },
  helperTextColor: {
    color: theme.colors.darkTint8,
  },
  addContactBtn: {
    textAlign: 'center',
    color: theme.colors.primaryColor,
  },
  moreInfo: {
    textAlign: 'center',
    color: theme.colors.darkTint5,
  },
});
