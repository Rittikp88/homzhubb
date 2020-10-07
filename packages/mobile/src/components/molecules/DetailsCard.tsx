import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';
import { Divider, Label, Text } from '@homzhub/common/src/components';

interface IDetailsInfo {
  icon: string;
  text: string;
  type?: 'TEXT' | 'EMAIL';
}

interface IHeaderInfo {
  title: string;
  icon: string;
  onPress?: () => void;
}

interface IOwnProps {
  details?: IDetailsInfo[];
  headerInfo?: IHeaderInfo;
  onVerifyPress?: () => void;
  showDivider?: boolean;
}

export class DetailsCard extends React.PureComponent<IOwnProps, {}> {
  public render = (): React.ReactNode => {
    const { details, headerInfo, showDivider = false, onVerifyPress } = this.props;
    return (
      <>
        {headerInfo && this.renderSectionHeader()}
        {details &&
          details.map((item, index) => {
            return (
              <View style={styles.marginTop} key={index}>
                <View style={item.type === 'EMAIL' ? styles.rowStyle : undefined}>
                  <View style={styles.subTitle}>
                    <Icon size={20} name={item.icon} color={theme.colors.primaryColor} />
                    <Label style={styles.marginLeft} type="large">
                      {item.text}
                    </Label>
                  </View>
                  {item.type === 'EMAIL' && (
                    <Icon size={20} name={item.icon} color={theme.colors.primaryColor} onPress={onVerifyPress} />
                  )}
                </View>
                {item.type === 'EMAIL' && (
                  <Label style={styles.verifyMail} type="large">
                    Verify your email
                  </Label>
                )}
              </View>
            );
          })}
        {showDivider && <Divider containerStyles={styles.dividerStyles} />}
      </>
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
        <Icon size={20} name={headerInfo.icon} color={theme.colors.primaryColor} onPress={headerInfo.onPress} />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});
